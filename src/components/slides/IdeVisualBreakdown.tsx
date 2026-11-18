"use client";

import React, { useState } from "react";
import {
  Bug,
  CheckCircle2,
  Code2,
  FileCode2,
  FolderOpen,
  Play,
  Terminal,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { highlightPythonLine } from "@/lib/py-highlight";
import { cn } from "@/lib/utils";

type IdeZoneId = "files" | "editor" | "terminal" | "debugger";

interface IdeZoneInfo {
  id: IdeZoneId;
  num: string;
  title: string;
  badge: string;
  explain: string;
  proTip: string;
  accent: string;
  ring: string;
}

const IDE_ZONES: IdeZoneInfo[] = [
  {
    id: "files",
    num: "1",
    title: "Explorer (.py Files)",
    badge: "main.py • utils.py",
    explain:
      "Lists all project folders and Python files (ending in .py) so multi-file apps stay organized.",
    proTip: "Use lowercase filenames without spaces, like my_app.py.",
    accent: "bg-blue-600 text-white",
    ring: "ring-2 ring-blue-500 border-blue-500/70 bg-blue-500/10",
  },
  {
    id: "editor",
    num: "2",
    title: "Smart Code Editor",
    badge: "Colors • Auto-Indent",
    explain:
      "Where you write Python. Adds line numbers, syntax colors, autocomplete, and 4-space auto-indentation after ':'",
    proTip: "If text stays all green, check for a missing closing quote!",
    accent: "bg-violet-600 text-white",
    ring: "ring-2 ring-violet-500 border-violet-500/70 bg-violet-500/10",
  },
  {
    id: "terminal",
    num: "3",
    title: "Terminal / Console",
    badge: "Output • Tracebacks",
    explain:
      "Shows your program's print() results, asks input() questions, and reports exact error line numbers (tracebacks).",
    proTip: "Read red traceback errors from the bottom line up!",
    accent: "bg-emerald-600 text-white",
    ring: "ring-2 ring-emerald-500 border-emerald-500/70 bg-emerald-500/10",
  },
  {
    id: "debugger",
    num: "4",
    title: "Run & Debugger",
    badge: "▶ Run • Breakpoints",
    explain:
      "Runs your code in one click, or pauses on a red breakpoint dot so you can inspect variables line by line.",
    proTip: "Click next to a line number in any IDE to set a red breakpoint.",
    accent: "bg-amber-500 text-slate-950",
    ring: "ring-2 ring-amber-400 border-amber-400/80 bg-amber-500/15",
  },
];

const SAMPLE_LINES = [
  'name = "Dara"',
  "score = 92",
  "if score >= 80:",
  '    print(f"Pass: {name}")',
];

export function IdeVisualBreakdown() {
  const [activeZone, setActiveZone] = useState<IdeZoneId>("editor");
  const current = IDE_ZONES.find((z) => z.id === activeZone) ?? IDE_ZONES[1];

  return (
    <div className="flex flex-col gap-4">
      {/* Notepad vs IDE Quick Comparison */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Card className="flex-row items-start gap-3 border-border/80 bg-muted/35 p-3">
          <XCircle className="mt-0.5 size-4 shrink-0 text-rose-500" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold text-foreground">
              Plain Notepad:
            </span>{" "}
            <span className="text-muted-foreground">
              Just plain black-and-white text — no color clues, no Run button, and no bug helpers.
            </span>
          </div>
        </Card>
        <Card className="flex-row items-start gap-3 border-emerald-500/30 bg-emerald-500/8 p-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold text-foreground">
              An IDE (Coding Studio):
            </span>{" "}
            <span className="text-muted-foreground">
              Combines <strong>Files + Smart Editor + Terminal + Debugger</strong> together in one window.
            </span>
          </div>
        </Card>
      </div>

      {/* Left Explanations + Right Interactive Visual IDE Window */}
      <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
        {/* Left: Clickable 4 Parts */}
        <div className="flex flex-col justify-between gap-2 lg:col-span-5">
          {IDE_ZONES.map((zone) => {
            const selected = zone.id === activeZone;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZone(zone.id)}
                className={cn(
                  "flex flex-col gap-1 rounded-xl border p-3 text-left transition-all cursor-pointer",
                  selected
                    ? "border-primary/60 bg-primary/8 shadow-xs ring-1 ring-primary/25"
                    : "border-border/80 bg-card hover:bg-muted/40"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        zone.accent
                      )}
                    >
                      {zone.num}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {zone.title}
                    </span>
                  </div>
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                    {zone.badge}
                  </span>
                </div>
                <p className="pl-7 text-xs leading-relaxed text-muted-foreground">
                  {zone.explain}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Annotated Mini IDE Window */}
        <div className="flex flex-col justify-between gap-2.5 lg:col-span-7">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
            {/* Top IDE Bar + Zone 4 (Run & Debugger) */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/90 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-rose-400/85" />
                  <span className="size-2.5 rounded-full bg-amber-400/85" />
                  <span className="size-2.5 rounded-full bg-emerald-400/85" />
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  my-python-project — IDE
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveZone("debugger")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-100 transition-all cursor-pointer hover:border-amber-400/60",
                  activeZone === "debugger" &&
                    "ring-2 ring-amber-400 border-amber-400 bg-amber-500/20"
                )}
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                  4
                </span>
                <Play className="size-3 fill-emerald-400 text-emerald-400" />
                <span>Run</span>
                <span className="text-slate-600">|</span>
                <Bug className="size-3 text-amber-300" />
                <span>Debug</span>
              </button>
            </div>

            {/* Middle Split: Explorer (Zone 1) + Code Editor (Zone 2) */}
            <div className="grid flex-1 sm:grid-cols-12">
              {/* Zone 1: Files Explorer */}
              <button
                type="button"
                onClick={() => setActiveZone("files")}
                className={cn(
                  "sm:col-span-4 flex flex-col gap-2 border-b sm:border-b-0 sm:border-r border-slate-800 bg-slate-900/50 p-3 text-left transition-all cursor-pointer hover:bg-slate-900",
                  activeZone === "files" &&
                    "ring-2 ring-inset ring-blue-500 bg-blue-500/12"
                )}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    1
                  </span>
                  Explorer
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <FolderOpen className="size-3.5 text-blue-400" />
                    <span>my-project</span>
                  </div>
                  <div className="ml-3 flex items-center gap-1.5 rounded bg-slate-800/90 px-2 py-1 text-blue-300 font-semibold">
                    <FileCode2 className="size-3.5 text-sky-400" />
                    <span>main.py</span>
                  </div>
                  <div className="ml-3 flex items-center gap-1.5 px-2 py-0.5 text-slate-400">
                    <FileCode2 className="size-3.5 text-slate-500" />
                    <span>utils.py</span>
                  </div>
                </div>
              </button>

              {/* Zone 2: Code Editor */}
              <button
                type="button"
                onClick={() => setActiveZone("editor")}
                className={cn(
                  "sm:col-span-8 flex flex-col bg-slate-950 text-left transition-all cursor-pointer",
                  activeZone === "editor" &&
                    "ring-2 ring-inset ring-violet-500 bg-violet-500/[0.06]"
                )}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 px-3 py-1.5 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="flex size-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                      2
                    </span>
                    <Code2 className="size-3.5 text-violet-400" />
                    <span>main.py</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Colors • 4-Space Indent
                  </span>
                </div>

                <div className="flex-1 space-y-0.5 py-2.5 font-mono text-xs leading-6">
                  {SAMPLE_LINES.map((line, i) => {
                    const lineNum = i + 1;
                    const isBreakpoint = lineNum === 3;
                    return (
                      <div
                        key={lineNum}
                        className={cn(
                          "flex items-center px-3",
                          isBreakpoint &&
                            activeZone === "debugger" &&
                            "bg-amber-500/15"
                        )}
                      >
                        <span className="flex w-7 shrink-0 items-center gap-1 select-none text-slate-500">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              isBreakpoint ? "bg-rose-500" : "bg-transparent"
                            )}
                            title={isBreakpoint ? "Breakpoint" : undefined}
                          />
                          {lineNum}
                        </span>
                        <span className="text-slate-100 whitespace-pre">
                          {lineNum === 4 ? (
                            <>
                              <span className="text-slate-600 select-none">
                                ····
                              </span>
                              {highlightPythonLine(line.trimStart())}
                            </>
                          ) : (
                            highlightPythonLine(line)
                          )}
                        </span>
                        {isBreakpoint && activeZone === "debugger" && (
                          <span className="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
                            score = 92
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </button>
            </div>

            {/* Bottom Zone 3: Terminal / Console */}
            <button
              type="button"
              onClick={() => setActiveZone("terminal")}
              className={cn(
                "flex flex-col gap-1.5 border-t border-slate-800 bg-slate-900/80 p-3 text-left transition-all cursor-pointer hover:bg-slate-900",
                activeZone === "terminal" &&
                  "ring-2 ring-inset ring-emerald-500 bg-emerald-500/10"
              )}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                    3
                  </span>
                  <Terminal className="size-3 text-emerald-400" />
                  Terminal / Console
                </span>
                <span className="normal-case text-slate-500">
                  Output & Error Tracebacks
                </span>
              </div>
              <div className="font-mono text-xs leading-5">
                <div className="text-slate-400">$ python3 main.py</div>
                <div className="text-emerald-300 font-semibold">Pass: Dara</div>
              </div>
            </button>
          </div>

          {/* Focused Tip for Selected Part */}
          <div className="flex items-center gap-2 rounded-lg border bg-muted/35 px-3 py-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                current.accent
              )}
            >
              {current.num}
            </span>
            <span>
              <strong className="text-foreground">{current.title} Tip:</strong>{" "}
              {current.proTip}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
