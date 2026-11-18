"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Eraser,
  FileCode2,
  Loader2,
  Moon,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  Variable,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PythonIdeEditor } from "@/components/slides/PythonIdeEditor";
import {
  createEmptyWorkspace,
  readIdeWorkspace,
  readLastSlideNumber,
  readStoredTheme,
  saveIdeWorkspace,
  saveThemePreference,
  type IdeFile,
  type IdeWorkspaceState,
} from "@/lib/course-storage";
import {
  ensurePyodideLoaded,
  isPyodideReady,
  runIdePython,
  type IdeEngineStatus,
  type IdeRunResult,
} from "@/lib/pyodide-runtime";
import { cn } from "@/lib/utils";

interface IdeExample {
  id: string;
  label: string;
  description: string;
  files: IdeFile[];
  stdin?: string;
}

const OPTIONAL_EXAMPLES: IdeExample[] = [
  {
    id: "stdlib",
    label: "Standard Library (math, json, datetime)",
    description: "Real Python 3 modules & f-string formatting",
    files: [
      {
        name: "main.py",
        content: `import json
import math
from datetime import date

payload = {
    "course": "Python 3",
    "date": date.today().isoformat(),
    "circle_area": round(math.pi * (5 ** 2), 2),
}

print(json.dumps(payload, indent=2))`,
      },
    ],
  },
  {
    id: "multifile",
    label: "Multi-File Project (main.py + utils.py)",
    description: "Import functions across tabs",
    files: [
      {
        name: "main.py",
        content: `from utils import summarize_scores

scores = [92, 85, 78, 96, 88]
report = summarize_scores("Class A", scores)
print(report)`,
      },
      {
        name: "utils.py",
        content: `def summarize_scores(group: str, nums: list[int]) -> dict:
    avg = sum(nums) / len(nums)
    return {
        "group": group,
        "count": len(nums),
        "average": round(avg, 2),
        "highest": max(nums),
    }`,
      },
    ],
  },
  {
    id: "dataclass-oop",
    label: "OOP + @dataclass & Inheritance",
    description: "Python 3.12 classes, type hints, and methods",
    files: [
      {
        name: "main.py",
        content: `from dataclasses import dataclass

@dataclass
class Course:
    title: str
    lessons: int

class InteractiveCourse(Course):
    def summary(self) -> str:
        return f"{self.title} ({self.lessons} lessons interactive)"

course = InteractiveCourse("Python Fundamentals", 33)
print(course.summary())`,
      },
    ],
  },
  {
    id: "input-demo",
    label: "Interactive input() + Loop",
    description: "Uses Stdin tab or browser prompt",
    stdin: "Dara\n3",
    files: [
      {
        name: "main.py",
        content: `name = input("Enter your name: ")
times = int(input("How many cheers? "))

for i in range(1, times + 1):
    print(f"#{i}: Keep coding, {name}!")`,
      },
    ],
  },
];

type OutputTab = "console" | "stdin" | "variables";

export function ScratchpadWorkspace() {
  const [workspace, setWorkspace] = useState<IdeWorkspaceState>(() =>
    createEmptyWorkspace()
  );
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [engineStatus, setEngineStatus] = useState<IdeEngineStatus>("loading");
  const [pythonVersion, setPythonVersion] = useState("3.12");
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<IdeRunResult | null>(null);
  const [outputTab, setOutputTab] = useState<OutputTab>("console");
  const [copied, setCopied] = useState(false);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [lastSlide, setLastSlide] = useState<number | null>(null);

  const activeFileObj =
    workspace.files.find((f) => f.name === workspace.activeFile) ??
    workspace.files[0];

  const loadPyodideEngine = useCallback(() => {
    setEngineStatus("loading");
    ensurePyodideLoaded()
      .then(({ pythonVersion: ver }) => {
        setPythonVersion(ver);
        setEngineStatus("ready");
      })
      .catch(() => {
        setEngineStatus("fallback");
      });
  }, []);

  // Hydrate theme, remembered slide, saved workspace, and warm up Pyodide
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const storedTheme = readStoredTheme();
      const dark =
        storedTheme !== null
          ? storedTheme === "dark"
          : document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);

      const savedSlide = readLastSlideNumber();
      if (savedSlide) {
        setLastSlide(savedSlide);
      }

      const savedWorkspace = readIdeWorkspace();
      if (savedWorkspace) {
        setWorkspace(savedWorkspace);
      }

      if (isPyodideReady()) {
        setEngineStatus("ready");
      } else {
        ensurePyodideLoaded()
          .then(({ pythonVersion: ver }) => {
            setPythonVersion(ver);
            setEngineStatus("ready");
          })
          .catch(() => {
            setEngineStatus("fallback");
          });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const updateWorkspace = useCallback(
    (updater: (prev: IdeWorkspaceState) => IdeWorkspaceState) => {
      setWorkspace((prev) => {
        const next = updater(prev);
        saveIdeWorkspace(next);
        return next;
      });
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      saveThemePreference(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (isEditing) return;

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutputTab("console");
    try {
      const res = await runIdePython({
        files: workspace.files,
        entryFile: activeFileObj.name,
        stdinText: workspace.stdin,
      });
      setRunResult(res);
      if (res.engine === "pyodide") {
        setPythonVersion(res.pythonVersion);
        setEngineStatus("ready");
      } else {
        setEngineStatus("fallback");
      }
    } catch (err) {
      setRunResult({
        ok: false,
        stdout: "",
        stderr: err instanceof Error ? err.message : String(err),
        errorLine: null,
        durationMs: 1,
        engine: engineStatus === "fallback" ? "fallback" : "pyodide",
        pythonVersion,
        variables: [],
      });
    } finally {
      setIsRunning(false);
    }
  }, [
    isRunning,
    workspace.files,
    workspace.stdin,
    activeFileObj.name,
    engineStatus,
    pythonVersion,
  ]);

  const handleCreateFile = () => {
    const trimmed = newFileName.trim().replace(/[\\/\s]+/g, "_");
    if (!trimmed) {
      setIsAddingFile(false);
      setNewFileName("");
      return;
    }
    const normalized = trimmed.endsWith(".py") ? trimmed : `${trimmed}.py`;
    if (workspace.files.some((f) => f.name === normalized)) {
      updateWorkspace((prev) => ({ ...prev, activeFile: normalized }));
      setIsAddingFile(false);
      setNewFileName("");
      return;
    }
    updateWorkspace((prev) => ({
      ...prev,
      files: [...prev.files, { name: normalized, content: "" }],
      activeFile: normalized,
    }));
    setCursor({ line: 1, col: 1 });
    setRunResult(null);
    setIsAddingFile(false);
    setNewFileName("");
  };

  const handleDeleteFile = (name: string) => {
    if (workspace.files.length <= 1) return;
    updateWorkspace((prev) => {
      const remaining = prev.files.filter((f) => f.name !== name);
      const nextActive =
        prev.activeFile === name ? remaining[0].name : prev.activeFile;
      return {
        ...prev,
        files: remaining,
        activeFile: nextActive,
      };
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFileObj.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore restricted clipboard environments
    }
  };

  const handleDownload = () => {
    const blob = new Blob([activeFileObj.content], {
      type: "text/x-python;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFileObj.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleClearFile = () => {
    updateWorkspace((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.name === activeFileObj.name ? { ...f, content: "" } : f
      ),
    }));
    setCursor({ line: 1, col: 1 });
    setRunResult(null);
  };

  const handleResetWorkspace = () => {
    const empty = createEmptyWorkspace();
    setWorkspace(empty);
    saveIdeWorkspace(null);
    setCursor({ line: 1, col: 1 });
    setRunResult(null);
  };

  const handleLoadExample = (example: IdeExample) => {
    updateWorkspace(() => ({
      files: example.files.map((f) => ({ ...f })),
      activeFile: example.files[0].name,
      stdin: example.stdin ?? "",
    }));
    setCursor({ line: 1, col: 1 });
    setRunResult(null);
    setOutputTab("console");
  };

  const backHref = lastSlide ? `/#slide-${lastSlide}` : "/";
  const stdinLineCount = workspace.stdin.trim()
    ? workspace.stdin.replace(/\r\n/g, "\n").split("\n").length
    : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Minimal Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-13 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={backHref}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/80 transition-colors"
              title="Back to Course Slides"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Terminal className="size-3.5" />
              </div>
              <span className="font-semibold tracking-tight text-sm hidden sm:inline">
                Python Course
              </span>
            </Link>

            <span className="text-muted-foreground/40 text-sm select-none">
              /
            </span>

            <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Code2 className="size-3.5 shrink-0" />
              <span className="truncate">Python IDE Scratchpad</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={backHref}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <ArrowLeft />
              <span>
                {lastSlide ? `Back to Slide ${lastSlide}` : "Back to Slides"}
              </span>
            </Link>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleTheme}
                    aria-label="Toggle light and dark theme"
                  />
                }
              >
                {isDark ? <Sun /> : <Moon />}
              </TooltipTrigger>
              <TooltipContent>Toggle Theme (T)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Full IDE Workbench Container */}
      <main className="bg-dot-stage flex-1 flex flex-col p-3 sm:p-4 lg:p-5">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
          {/* File Tabs & Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/45 px-2.5 py-2">
            {/* Multi-file Tabs */}
            <div className="flex flex-wrap items-center gap-1 min-w-0">
              {workspace.files.map((file) => {
                const isActive = file.name === activeFileObj.name;
                return (
                  <div
                    key={file.name}
                    className={cn(
                      "group flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors",
                      isActive
                        ? "border-border bg-background font-semibold text-foreground shadow-2xs"
                        : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        updateWorkspace((prev) => ({
                          ...prev,
                          activeFile: file.name,
                        }));
                        setCursor({ line: 1, col: 1 });
                      }}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCode2
                        className={cn(
                          "size-3.5 shrink-0",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-muted-foreground"
                        )}
                      />
                      <span>{file.name}</span>
                    </button>
                    {workspace.files.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(file.name)}
                        aria-label={`Close ${file.name}`}
                        className="rounded p-0.5 text-muted-foreground/70 hover:bg-muted hover:text-foreground cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              {isAddingFile ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateFile();
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    autoFocus
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onBlur={handleCreateFile}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsAddingFile(false);
                        setNewFileName("");
                      }
                    }}
                    placeholder="module.py"
                    aria-label="New Python file name"
                    className="h-7 w-28 rounded-md border border-primary/50 bg-background px-2 font-mono text-xs outline-none"
                  />
                </form>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setIsAddingFile(true)}
                  title="Create another .py file (can be imported)"
                >
                  <Plus />
                  <span>New File</span>
                </Button>
              )}
            </div>

            {/* Right Toolbar Actions */}
            <div className="flex flex-wrap items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button type="button" variant="outline" size="xs" />
                  }
                >
                  <Sparkles className="text-amber-500" />
                  <span>Examples</span>
                  <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Insert Optional Example</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {OPTIONAL_EXAMPLES.map((ex) => (
                      <DropdownMenuItem
                        key={ex.id}
                        onClick={() => handleLoadExample(ex)}
                        className="flex-col items-start gap-0.5 cursor-pointer"
                      >
                        <span className="font-medium text-xs">{ex.label}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {ex.description}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleCopy}
                title="Copy current file"
              >
                {copied ? <Check className="text-emerald-500" /> : <Copy />}
                <span className="hidden sm:inline">
                  {copied ? "Copied" : "Copy"}
                </span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleDownload}
                title={`Download ${activeFileObj.name}`}
              >
                <Download />
                <span className="hidden md:inline">Save .py</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleClearFile}
                title="Clear current file"
              >
                <Eraser />
                <span className="hidden sm:inline">Clear</span>
              </Button>

              {workspace.files.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={handleResetWorkspace}
                  title="Reset workspace to empty main.py"
                >
                  <RotateCcw />
                </Button>
              )}

              <Button
                type="button"
                size="xs"
                onClick={handleRun}
                disabled={isRunning}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isRunning ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Play className="fill-current" />
                )}
                <span>
                  {isRunning ? "Running..." : `Run ${activeFileObj.name}`}
                </span>
              </Button>
            </div>
          </div>

          {/* Split IDE Editor + Integrated Console/Stdin/Variables */}
          <div className="flex flex-1 flex-col lg:flex-row min-h-[540px]">
            {/* Left: Python Code Editor */}
            <div className="flex flex-1 flex-col min-h-[340px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border">
              <PythonIdeEditor
                value={activeFileObj.content}
                onChange={(nextContent) => {
                  updateWorkspace((prev) => ({
                    ...prev,
                    files: prev.files.map((f) =>
                      f.name === activeFileObj.name
                        ? { ...f, content: nextContent }
                        : f
                    ),
                  }));
                }}
                onRun={handleRun}
                onCursorChange={setCursor}
                activeLine={cursor.line}
                errorLine={runResult?.errorLine ?? null}
              />
            </div>

            {/* Right: Integrated Output / Stdin / Variables Inspector */}
            <div className="flex w-full lg:w-[42%] flex-col min-h-[260px] lg:min-h-0 bg-muted/15">
              {/* Panel Tabs Bar */}
              <div className="flex items-center justify-between gap-2 border-b bg-muted/35 px-3 py-1.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setOutputTab("console")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      outputTab === "console"
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Terminal className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Console</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputTab("stdin")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      outputTab === "stdin"
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>Stdin</span>
                    {stdinLineCount > 0 && (
                      <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                        {stdinLineCount}
                      </Badge>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputTab("variables")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      outputTab === "variables"
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Variable className="size-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Variables</span>
                    {runResult && runResult.variables.length > 0 && (
                      <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                        {runResult.variables.length}
                      </Badge>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  {runResult && (
                    <>
                      <span className="font-mono text-muted-foreground">
                        {runResult.durationMs} ms
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          runResult.ok
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {runResult.ok ? "Exited 0" : "Error"}
                      </span>
                    </>
                  )}
                  {outputTab === "console" && runResult && (
                    <button
                      type="button"
                      onClick={() => setRunResult(null)}
                      title="Clear console output"
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Panel Body */}
              {outputTab === "console" && (
                <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-[13px] leading-5 text-slate-100">
                  {!runResult ? (
                    <div className="space-y-2 text-slate-400 text-xs leading-relaxed">
                      <p className="text-slate-300 font-medium">
                        Ready to run your Python code.
                      </p>
                      <p>
                        Write any Python 3 code in{" "}
                        <code className="rounded bg-slate-800 px-1 py-0.5 text-slate-200">
                          {activeFileObj.name}
                        </code>{" "}
                        and press{" "}
                        <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-200">
                          Ctrl / ⌘ + Enter
                        </kbd>{" "}
                        or{" "}
                        <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-200">
                          F5
                        </kbd>
                        .
                      </p>
                      <p>
                        Supports full standard library imports, multi-file tabs,
                        classes, lambdas, comprehensions, and{" "}
                        <code className="rounded bg-slate-800 px-1 py-0.5 text-slate-200">
                          input()
                        </code>
                        .
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {runResult.stdout ? (
                        <pre className="whitespace-pre-wrap break-words text-emerald-300">
                          {runResult.stdout}
                        </pre>
                      ) : runResult.ok ? (
                        <span className="italic text-slate-500">
                          (Program finished with no printed output)
                        </span>
                      ) : null}

                      {runResult.stderr && (
                        <div className="rounded-lg border border-rose-500/35 bg-rose-950/60 p-3 text-rose-200">
                          <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-rose-300">
                            <span className="inline-flex items-center gap-1.5">
                              <AlertTriangle className="size-3.5 text-rose-400" />
                              Traceback / Error
                            </span>
                            {runResult.errorLine && (
                              <span className="rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-[11px]">
                                Line {runResult.errorLine}
                              </span>
                            )}
                          </div>
                          <pre className="whitespace-pre-wrap break-words text-xs leading-5">
                            {runResult.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {outputTab === "stdin" && (
                <div className="flex flex-1 flex-col gap-2.5 p-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Optional pre-filled answers for{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                      input()
                    </code>{" "}
                    (one line per prompt). Leave empty to answer{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                      input()
                    </code>{" "}
                    interactively via a browser prompt when running.
                  </p>
                  <textarea
                    value={workspace.stdin}
                    onChange={(e) => {
                      const nextStdin = e.target.value;
                      updateWorkspace((prev) => ({ ...prev, stdin: nextStdin }));
                    }}
                    placeholder={"Example:\nAda Lovelace\n42"}
                    spellCheck={false}
                    aria-label="Standard input lines for Python input()"
                    className="flex-1 min-h-[160px] w-full resize-none rounded-lg border bg-background p-3 font-mono text-xs leading-5 outline-none focus:border-primary"
                  />
                </div>
              )}

              {outputTab === "variables" && (
                <div className="flex-1 overflow-auto p-3">
                  {!runResult ? (
                    <p className="p-2 text-xs text-muted-foreground">
                      Run your code to inspect global variables and types.
                    </p>
                  ) : runResult.variables.length === 0 ? (
                    <p className="p-2 text-xs text-muted-foreground">
                      No top-level variables defined in the last run.
                    </p>
                  ) : (
                    <div className="overflow-hidden rounded-lg border bg-background">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b bg-muted/50 text-[11px] font-semibold text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y font-mono text-[12px]">
                          {runResult.variables.map((v) => (
                            <tr key={v.name} className="hover:bg-muted/30">
                              <td className="px-3 py-1.5 font-semibold text-foreground">
                                {v.name}
                              </td>
                              <td className="px-3 py-1.5 text-sky-700 dark:text-sky-300">
                                {v.typeName}
                              </td>
                              <td className="px-3 py-1.5 break-all text-muted-foreground">
                                {v.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* IDE Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/45 px-3 py-1.5 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-3">
              {engineStatus === "ready" && (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Python {pythonVersion} (CPython Wasm)
                </span>
              )}
              {engineStatus === "loading" && (
                <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                  <Loader2 className="size-3 animate-spin" />
                  Loading Python 3.12 runtime...
                </span>
              )}
              {engineStatus === "fallback" && (
                <span className="inline-flex items-center gap-2 text-sky-700 dark:text-sky-300">
                  <span className="size-2 rounded-full bg-sky-500" />
                  <span>Offline Fallback Engine</span>
                  <button
                    type="button"
                    onClick={loadPyodideEngine}
                    className="underline hover:text-foreground cursor-pointer"
                  >
                    Retry Wasm
                  </button>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span>{activeFileObj.name}</span>
              <span>
                Ln {cursor.line}, Col {cursor.col}
              </span>
              <span className="hidden sm:inline">Spaces: 4</span>
              <span className="hidden md:inline">Ctrl/⌘+/ Comment</span>
              <span className="hidden sm:inline">Ctrl/⌘+Enter Run</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
