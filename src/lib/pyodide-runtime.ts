"use client";

import type { IdeFile } from "@/lib/course-storage";
import { runPython } from "@/lib/py-runner";

const PYODIDE_BASE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/";
const PYODIDE_SCRIPT_URL = `${PYODIDE_BASE_URL}pyodide.js`;
const PYODIDE_LOAD_TIMEOUT_MS = 20_000;

export type IdeEngineStatus = "idle" | "loading" | "ready" | "fallback";

export interface IdeVariable {
  name: string;
  typeName: string;
  value: string;
}

export interface IdeRunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  errorLine: number | null;
  durationMs: number;
  engine: "pyodide" | "fallback";
  pythonVersion: string;
  variables: IdeVariable[];
}

interface PyodideFs {
  writeFile(path: string, data: string, opts?: { encoding?: string }): void;
  unlink(path: string): void;
  analyzePath(path: string): { exists: boolean };
}

interface PyodideGlobals {
  set(name: string, value: unknown): void;
  delete(name: string): void;
}

interface PyodideInstance {
  FS: PyodideFs;
  globals: PyodideGlobals;
  runPythonAsync(code: string): Promise<unknown>;
  setStdout(opts: { write?: (buffer: Uint8Array) => number; batched?: (text: string) => void }): void;
  setStderr(opts: { write?: (buffer: Uint8Array) => number; batched?: (text: string) => void }): void;
  setStdin(opts: { stdin?: () => string | null | undefined; autoEOF?: boolean; isatty?: boolean }): void;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

let pyodideSingleton: PyodideInstance | null = null;
let pyodideLoadPromise: Promise<PyodideInstance> | null = null;
let cachedPythonVersion = "3.12";
const syncedFilePaths = new Set<string>();

function loadScriptOnce(src: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Pyodide can only run in a browser."));
  }
  if (window.loadPyodide) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-pyodide-src="${src}"]`
    );
    if (existing) {
      if (window.loadPyodide) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Pyodide script.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.pyodideSrc = src;

    const timer = window.setTimeout(() => {
      script.remove();
      reject(new Error("Timed out loading Pyodide CDN."));
    }, PYODIDE_LOAD_TIMEOUT_MS);

    script.addEventListener(
      "load",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => {
        window.clearTimeout(timer);
        script.remove();
        reject(new Error("Unable to reach Pyodide CDN."));
      },
      { once: true }
    );
    document.head.appendChild(script);
  });
}

export async function ensurePyodideLoaded(): Promise<{
  pyodide: PyodideInstance;
  pythonVersion: string;
}> {
  if (pyodideSingleton) {
    return { pyodide: pyodideSingleton, pythonVersion: cachedPythonVersion };
  }

  if (!pyodideLoadPromise) {
    pyodideLoadPromise = (async () => {
      await loadScriptOnce(PYODIDE_SCRIPT_URL);
      if (!window.loadPyodide) {
        throw new Error("Pyodide loader did not expose window.loadPyodide.");
      }
      const instance = await window.loadPyodide({ indexURL: PYODIDE_BASE_URL });
      try {
        const ver = await instance.runPythonAsync(
          "import sys; sys.version.split()[0]"
        );
        if (typeof ver === "string" && ver.trim()) {
          cachedPythonVersion = ver.trim();
        }
      } catch {
        // Keep default version string
      }
      pyodideSingleton = instance;
      return instance;
    })().catch((err) => {
      pyodideLoadPromise = null;
      throw err;
    });
  }

  const pyodide = await pyodideLoadPromise;
  return { pyodide, pythonVersion: cachedPythonVersion };
}

export function isPyodideReady(): boolean {
  return pyodideSingleton !== null;
}

const PY_EXEC_HARNESS = `
import importlib
import json
import linecache
import os
import sys
import traceback

__ide_payload = json.loads(__ide_payload_json)
__ide_entry = __ide_payload["entry"]
__ide_code = __ide_payload["code"]
__ide_module_names = __ide_payload["moduleNames"]
__ide_files_map = __ide_payload["filesMap"]

__ide_work_dir = "/home/pyodide"
if os.path.isdir(__ide_work_dir):
    os.chdir(__ide_work_dir)
    if __ide_work_dir not in sys.path:
        sys.path.insert(0, __ide_work_dir)

for __mod_name in __ide_module_names:
    __existing_mod = sys.modules.get(__mod_name)
    __mod_file = getattr(__existing_mod, "__file__", "") or ""
    if __existing_mod is not None and __mod_file.startswith(__ide_work_dir):
        del sys.modules[__mod_name]

importlib.invalidate_caches()

__ide_result = {"ok": True, "error": "", "error_line": None, "vars": []}
__ide_ns = {"__name__": "__main__", "__file__": __ide_entry}

for __f_name, __f_code in __ide_files_map.items():
    linecache.cache[__f_name] = (
        len(__f_code),
        None,
        __f_code.splitlines(True),
        __f_name,
    )

try:
    __code_obj = compile(__ide_code, __ide_entry, "exec")
    exec(__code_obj, __ide_ns, __ide_ns)
except BaseException as __exc:
    __ide_result["ok"] = False
    __tb_lines = traceback.format_exception(type(__exc), __exc, __exc.__traceback__)
    __filtered = []
    __found_user = False
    for __line in __tb_lines:
        if f'File "{__ide_entry}"' in __line:
            __found_user = True
        if __found_user or not __line.lstrip().startswith("File "):
            __filtered.append(__line)
    __ide_result["error"] = "".join(__filtered if __found_user else __tb_lines).rstrip()
    if isinstance(__exc, SyntaxError) and __exc.lineno:
        __ide_result["error_line"] = int(__exc.lineno)
    else:
        __tb = __exc.__traceback__
        while __tb is not None:
            if __tb.tb_frame.f_code.co_filename == __ide_entry:
                __ide_result["error_line"] = int(__tb.tb_lineno)
            __tb = __tb.tb_next
finally:
    try:
        sys.stdout.flush()
    except Exception:
        pass
    try:
        sys.stderr.flush()
    except Exception:
        pass
    for __k, __v in list(__ide_ns.items()):
        if __k.startswith("__"):
            continue
        try:
            __r = repr(__v)
            if len(__r) > 120:
                __r = __r[:117] + "..."
            __ide_result["vars"].append({
                "name": str(__k),
                "typeName": type(__v).__name__,
                "value": __r,
            })
        except Exception:
            __ide_result["vars"].append({
                "name": str(__k),
                "typeName": type(__v).__name__,
                "value": "<unrepresentable>",
            })

json.dumps(__ide_result)
`;

function sanitizeWorkspaceFileName(name: string): string {
  return name.replace(/^\/+/, "").replace(/\.\./g, "_");
}

function runWithFallbackEngine(
  files: IdeFile[],
  entryFile: string,
  stdinLines: string[],
  startTime: number
): IdeRunResult {
  const target = files.find((f) => f.name === entryFile) ?? files[0];
  const res = runPython(target?.content ?? "", {
    inputs: stdinLines,
    onInput: (promptText) => {
      if (typeof window !== "undefined") {
        return window.prompt(promptText || "Python input():");
      }
      return "";
    },
  });

  const variables: IdeVariable[] = Object.entries(res.vars).map(
    ([name, value]) => ({
      name,
      typeName: "var",
      value,
    })
  );

  return {
    ok: res.ok,
    stdout: res.output,
    stderr: res.error ?? "",
    errorLine: res.errorLine ?? null,
    durationMs: Math.max(1, Math.round(performance.now() - startTime)),
    engine: "fallback",
    pythonVersion: "Fallback Subset",
    variables,
  };
}

export async function runIdePython(options: {
  files: IdeFile[];
  entryFile: string;
  stdinText: string;
  onPrompt?: (promptLabel: string) => string | null;
}): Promise<IdeRunResult> {
  const startTime = performance.now();
  const stdinLines = options.stdinText
    ? options.stdinText.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n")
    : [];

  let pyodide: PyodideInstance;
  let pythonVersion: string;
  try {
    const loaded = await ensurePyodideLoaded();
    pyodide = loaded.pyodide;
    pythonVersion = loaded.pythonVersion;
  } catch {
    return runWithFallbackEngine(
      options.files,
      options.entryFile,
      stdinLines,
      startTime
    );
  }

  let stdout = "";
  let stderr = "";
  try {
    const safeFiles = options.files.map((f) => ({
      name: sanitizeWorkspaceFileName(f.name),
      content: f.content,
    }));
    const safeEntry = sanitizeWorkspaceFileName(options.entryFile);
    const entryObj = safeFiles.find((f) => f.name === safeEntry) ?? safeFiles[0];

    // Sync workspace files to Pyodide virtual filesystem (/home/pyodide/)
    const nextPaths = new Set<string>();
    const moduleNames: string[] = [];
    const filesMapObj: Record<string, string> = {};

    for (const file of safeFiles) {
      const fsPath = `/home/pyodide/${file.name}`;
      nextPaths.add(fsPath);
      filesMapObj[file.name] = file.content;
      if (file.name.endsWith(".py")) {
        moduleNames.push(file.name.slice(0, -3));
      }
      pyodide.FS.writeFile(fsPath, file.content, { encoding: "utf8" });
    }

    for (const prevPath of Array.from(syncedFilePaths)) {
      if (!nextPaths.has(prevPath)) {
        try {
          if (pyodide.FS.analyzePath(prevPath).exists) {
            pyodide.FS.unlink(prevPath);
          }
        } catch {
          // Ignore cleanup issues
        }
      }
    }
    syncedFilePaths.clear();
    for (const p of nextPaths) {
      syncedFilePaths.add(p);
    }

    const stdoutDecoder = new TextDecoder("utf-8", { fatal: false });
    const stderrDecoder = new TextDecoder("utf-8", { fatal: false });
    const inputQueue = [...stdinLines];

    pyodide.setStdout({
      write: (buffer) => {
        stdout += stdoutDecoder.decode(new Uint8Array(buffer), { stream: true });
        return buffer.length;
      },
    });

    pyodide.setStderr({
      write: (buffer) => {
        stderr += stderrDecoder.decode(new Uint8Array(buffer), { stream: true });
        return buffer.length;
      },
    });

    pyodide.setStdin({
      stdin: () => {
        if (inputQueue.length > 0) {
          const nextLine = inputQueue.shift() ?? "";
          stdout += `${nextLine}\n`;
          return nextLine;
        }
        const trailingPrompt = stdout.split("\n").pop()?.trim() || "";
        const promptMsg = trailingPrompt || "Python input():";
        const response = options.onPrompt
          ? options.onPrompt(promptMsg)
          : typeof window !== "undefined"
            ? window.prompt(promptMsg)
            : "";
        if (response === null) {
          return null;
        }
        stdout += `${response}\n`;
        return response;
      },
      autoEOF: true,
      isatty: false,
    });

    pyodide.globals.set(
      "__ide_payload_json",
      JSON.stringify({
        entry: entryObj?.name ?? "main.py",
        code: entryObj?.content ?? "",
        moduleNames,
        filesMap: filesMapObj,
      })
    );

    const rawJson = await pyodide.runPythonAsync(PY_EXEC_HARNESS);
    stdout += stdoutDecoder.decode();
    stderr += stderrDecoder.decode();

    const parsed = JSON.parse(String(rawJson)) as {
      ok: boolean;
      error: string;
      error_line: number | null;
      vars: IdeVariable[];
    };

    const combinedStderr = [stderr.trim(), parsed.error.trim()]
      .filter(Boolean)
      .join("\n");

    return {
      ok: parsed.ok,
      stdout,
      stderr: combinedStderr,
      errorLine: parsed.error_line,
      durationMs: Math.max(1, Math.round(performance.now() - startTime)),
      engine: "pyodide",
      pythonVersion,
      variables: parsed.vars ?? [],
    };
  } catch (err) {
    return {
      ok: false,
      stdout,
      stderr: err instanceof Error ? err.message : String(err),
      errorLine: null,
      durationMs: Math.max(1, Math.round(performance.now() - startTime)),
      engine: "pyodide",
      pythonVersion,
      variables: [],
    };
  } finally {
    for (const tmp of [
      "__ide_payload_json",
      "__ide_payload",
      "__ide_entry",
      "__ide_code",
      "__ide_module_names",
      "__ide_files_map",
      "__ide_result",
      "__ide_ns",
      "__ide_work_dir",
      "__code_obj",
      "__mod_name",
      "__existing_mod",
      "__mod_file",
      "__f_name",
      "__f_code",
      "__k",
      "__v",
      "__r",
      "__exc",
      "__tb",
      "__tb_lines",
      "__filtered",
      "__found_user",
      "__line",
    ]) {
      try {
        pyodide.globals.delete(tmp);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
