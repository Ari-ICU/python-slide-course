"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Check,
  Copy,
  Keyboard,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { highlightPythonLine } from "@/lib/py-highlight";
import { runPython, type PyRunResult } from "@/lib/py-runner";
import { cn } from "@/lib/utils";

interface CodePlaygroundProps {
  title: string;
  initialCode: string;
  presetInputs?: string[];
  autoRun?: boolean;
  compact?: boolean;
  className?: string;
}

export function CodePlayground({
  title,
  initialCode,
  presetInputs,
  autoRun = false,
  compact = false,
  className,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [inputsRaw, setInputsRaw] = useState((presetInputs || []).join(", "));
  const [result, setResult] = useState<PyRunResult | null>(() =>
    autoRun ? runPython(initialCode, { inputs: presetInputs }) : null
  );
  const [copied, setCopied] = useState(false);

  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = code.split("\n");
  const hasInputCall = /\binput\s*\(/.test(code);

  const handleRun = () => {
    const parsedInputs = inputsRaw.trim()
      ? inputsRaw.split(",").map((s) => s.trim())
      : [];
    const res = runPython(code, { inputs: parsedInputs });
    setResult(res);
  };

  const handleReset = () => {
    setCode(initialCode);
    setInputsRaw((presetInputs || []).join(", "));
    setResult(autoRun ? runPython(initialCode, { inputs: presetInputs }) : null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = target.scrollTop;
      preRef.current.scrollLeft = target.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = target.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
  };

  const editorHeightClass = compact
    ? "min-h-[140px] max-h-[240px]"
    : "min-h-[190px] max-h-[300px]";

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border border-border/80 bg-card py-0 shadow-sm",
        className
      )}
    >
      {/* Top Window Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/50 px-3.5 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rose-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="truncate text-xs font-semibold text-foreground/85">
            {title}
          </span>
          <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-mono">
            editable .py
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? (
              <Check className="text-emerald-500" />
            ) : (
              <Copy />
            )}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleReset}
            title="Reset code to original"
          >
            <RotateCcw />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            type="button"
            size="xs"
            onClick={handleRun}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Play className="fill-current" />
            Run Code
          </Button>
        </div>
      </div>

      {/* Optional Sample Inputs Bar for input() examples */}
      {hasInputCall && (
        <div className="flex flex-wrap items-center gap-2 border-b bg-sky-50/70 px-3.5 py-1.5 text-xs dark:bg-sky-950/30">
          <span className="inline-flex items-center gap-1 font-medium text-sky-700 dark:text-sky-300">
            <Keyboard className="size-3.5" />
            Test input() values:
          </span>
          <input
            type="text"
            value={inputsRaw}
            onChange={(e) => setInputsRaw(e.target.value)}
            placeholder="Comma-separated e.g. Ada, 2004 (or leave empty for prompt)"
            aria-label="Test values for Python input()"
            className="flex-1 min-w-[160px] rounded-md border border-sky-200 bg-background px-2 py-0.5 font-mono text-xs text-foreground outline-none focus:border-blue-500 dark:border-sky-800"
          />
        </div>
      )}

      {/* Synchronized Highlighted + Editable Code Area */}
      <div
        className={cn(
          "relative flex bg-slate-50/90 transition-colors focus-within:bg-background dark:bg-slate-950/75 dark:focus-within:bg-slate-950/90",
          editorHeightClass
        )}
      >
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none overflow-hidden border-r border-border/60 bg-muted/30 py-3.5 pr-2.5 pl-3 text-right font-mono text-[13px] leading-6 text-muted-foreground/60"
        >
          {lines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Highlighted <pre> + Transparent <textarea> */}
        <div className="relative flex-1 overflow-hidden">
          <pre
            ref={preRef}
            aria-hidden="true"
            className="pointer-events-none h-full w-full overflow-hidden py-3.5 px-4 font-mono text-[13px] sm:text-[13.5px] leading-6 whitespace-pre"
          >
            {lines.map((line, idx) => (
              <div key={idx}>{highlightPythonLine(line)}</div>
            ))}
          </pre>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            aria-label={`${title} Python code editor`}
            className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent py-3.5 px-4 font-mono text-[13px] sm:text-[13.5px] leading-6 whitespace-pre text-transparent caret-blue-600 outline-none selection:bg-blue-500/20 dark:caret-sky-400"
          />
        </div>
      </div>

      {/* Animated Terminal Output */}
      <AnimatePresence initial={false}>
        {result && (
          <motion.div
            key="output"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t bg-slate-950 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-3.5 py-1.5 text-[11px] font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Terminal className="size-3.5 text-emerald-400" />
                Console Output
              </span>
              <span className={result.ok ? "text-emerald-400" : "text-rose-400"}>
                {result.ok ? "Exited cleanly" : "Error detected"}
              </span>
            </div>

            <div className="max-h-40 overflow-auto px-4 py-2.5 font-mono text-[13px] leading-5">
              {result.output ? (
                <pre className="whitespace-pre-wrap text-emerald-300">{result.output}</pre>
              ) : result.ok ? (
                <span className="italic text-slate-500">(Program finished with no printed output)</span>
              ) : null}

              {result.error && (
                <div className="mt-1.5 flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-950/50 px-2.5 py-1.5 text-rose-300">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-400" />
                  <span>{result.error}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
