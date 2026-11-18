"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { highlightPythonLine } from "@/lib/py-highlight";
import { runPython } from "@/lib/py-runner";
import { cn } from "@/lib/utils";

interface StepTracerProps {
  title: string;
  code: string;
}

export function StepTracer({ title, code }: StepTracerProps) {
  const result = useMemo(() => runPython(code, { collectTrace: true }), [code]);
  const trace = result.trace;
  const lines = useMemo(() => code.split("\n"), [code]);

  const [stepIdx, setStepIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const isPlaying = autoPlay && stepIdx < trace.length - 1;

  useEffect(() => {
    if (!isPlaying) return;
    const id = setTimeout(() => {
      setStepIdx((prev) => {
        const next = Math.min(prev + 1, trace.length - 1);
        if (next >= trace.length - 1) setAutoPlay(false);
        return next;
      });
    }, 1050);
    return () => clearTimeout(id);
  }, [isPlaying, stepIdx, trace.length]);

  const currentStep = trace[stepIdx] || {
    line: 1,
    vars: {},
    outputSoFar: "",
    note: "",
  };
  const prevVars = stepIdx > 0 ? trace[stepIdx - 1]?.vars || {} : {};
  const varEntries = Object.entries(currentStep.vars);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Left: Code with Active Execution Highlight */}
      <Card className="gap-0 overflow-hidden py-0 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{title}</span>
            <Badge variant="secondary" className="font-mono text-[11px]">
              Step {trace.length ? stepIdx + 1 : 0} / {trace.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                setAutoPlay(false);
                setStepIdx((s) => Math.max(0, s - 1));
              }}
              disabled={stepIdx <= 0}
            >
              <ChevronLeft />
              Prev
            </Button>
            <Button
              type="button"
              size="xs"
              onClick={() => {
                setAutoPlay(false);
                setStepIdx((s) => Math.min(trace.length - 1, s + 1));
              }}
              disabled={stepIdx >= trace.length - 1}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Next Step
              <ChevronRight />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                if (stepIdx >= trace.length - 1) setStepIdx(0);
                setAutoPlay((p) => !p);
              }}
              title={autoPlay ? "Pause auto-step" : "Auto-step through code"}
              aria-label={autoPlay ? "Pause auto-step" : "Auto-step through code"}
            >
              {autoPlay ? <Pause /> : <Play />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                setAutoPlay(false);
                setStepIdx(0);
              }}
              title="Restart trace"
              aria-label="Restart trace"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>

        <div className="bg-slate-50/90 py-3 font-mono text-[13px] sm:text-sm leading-7 dark:bg-slate-950/75">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isActive = currentStep.line === lineNum;
            return (
              <div
                key={lineNum}
                className={cn(
                  "relative flex items-center px-3 transition-colors duration-150",
                  isActive
                    ? "bg-amber-500/15 dark:bg-amber-400/15"
                    : "hover:bg-muted/30"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId={`tracer-bar-${title}`}
                    className="absolute inset-y-0 left-0 w-1 bg-amber-500"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span
                  className={cn(
                    "w-7 shrink-0 select-none text-right pr-3 text-xs",
                    isActive
                      ? "font-bold text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground/60"
                  )}
                >
                  {lineNum}
                </span>
                <span className="w-4 shrink-0 select-none text-xs font-bold text-amber-500">
                  {isActive ? "▶" : ""}
                </span>
                <code className="whitespace-pre">{highlightPythonLine(line)}</code>
              </div>
            );
          })}
        </div>

        {currentStep.note && (
          <div className="border-t bg-amber-50/60 px-4 py-2 text-xs font-medium text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            <span className="mr-1.5 font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Line {currentStep.line}:
            </span>
            {currentStep.note}
          </div>
        )}
      </Card>

      {/* Right: Live Memory Boxes & Output */}
      <div className="flex flex-col gap-3 lg:col-span-5">
        <Card className="flex-1 gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Box className="size-3.5 text-blue-500" />
              Memory Boxes (Variables)
            </span>
            <span className="text-[11px] text-muted-foreground">
              {varEntries.length} active
            </span>
          </div>

          {varEntries.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-6 text-xs text-muted-foreground">
              No variables stored yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <AnimatePresence>
                {varEntries.map(([name, val]) => {
                  const changed = prevVars[name] !== val;
                  return (
                    <motion.div
                      key={name}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className={cn(
                        "rounded-lg border p-2.5 transition-colors",
                        changed
                          ? "border-amber-400 bg-amber-50/70 shadow-xs dark:border-amber-500/60 dark:bg-amber-950/30"
                          : "border-border bg-muted/30"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {name}
                        </span>
                        {changed && (
                          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                            updated
                          </span>
                        )}
                      </div>
                      <div className="mt-1 truncate font-mono text-sm font-bold text-foreground">
                        {val}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>

        <Card className="gap-0 overflow-hidden bg-slate-950 py-0 text-slate-100">
          <div className="flex items-center gap-1.5 border-b border-slate-800 px-3.5 py-2 text-[11px] font-medium text-slate-400">
            <Terminal className="size-3.5 text-emerald-400" />
            Screen Output So Far
          </div>
          <div className="min-h-[68px] px-3.5 py-2.5 font-mono text-xs leading-5">
            {currentStep.outputSoFar ? (
              <pre className="whitespace-pre-wrap text-emerald-300">
                {currentStep.outputSoFar}
              </pre>
            ) : (
              <span className="italic text-slate-500">Nothing printed yet...</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
