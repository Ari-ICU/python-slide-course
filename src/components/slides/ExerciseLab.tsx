"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  Target,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodePlayground } from "@/components/slides/CodePlayground";
import { RichText } from "@/components/slides/RichText";
import { highlightPythonLine } from "@/lib/py-highlight";

interface ExerciseLabProps {
  task: string;
  expectedOutput: string;
  starterCode: string;
  hint: string;
  solutionCode: string;
}

export function ExerciseLab({
  task,
  expectedOutput,
  starterCode,
  hint,
  solutionCode,
}: ExerciseLabProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [loadedVersion, setLoadedVersion] = useState(0);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Left: Task Prompt, Expected Output, Hint & Solution */}
      <div className="flex flex-col gap-3 lg:col-span-5">
        <Card className="gap-3 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Target className="size-4" />
            Your Mission
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={task} />
          </p>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Target Output
            </div>
            <pre className="overflow-x-auto rounded-lg border bg-slate-950 px-3 py-2.5 font-mono text-xs leading-5 text-emerald-300">
              {expectedOutput}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowHint((h) => !h)}
            >
              <Lightbulb className="text-amber-500" />
              {showHint ? "Hide Hint" : "Need a Hint?"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSolution((s) => !s)}
            >
              {showSolution ? <EyeOff /> : <Eye />}
              {showSolution ? "Hide Solution" : "View Solution"}
            </Button>
          </div>
        </Card>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              <Card className="gap-1.5 border-amber-500/40 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
                <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-300">
                  <Lightbulb className="size-3.5" /> Hint
                </div>
                <p>
                  <RichText text={hint} />
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              <Card className="gap-2.5 border-emerald-500/40 bg-emerald-500/5 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="size-3.5" />
                    Sample Solution
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    variant="secondary"
                    onClick={() => setLoadedVersion((v) => v + 1)}
                  >
                    <Wand2 />
                    Load into Editor
                  </Button>
                </div>
                <pre className="max-h-44 overflow-auto rounded-lg border bg-background/80 p-2.5 font-mono text-[11.5px] leading-5">
                  {solutionCode.split("\n").map((line, i) => (
                    <div key={i}>{highlightPythonLine(line)}</div>
                  ))}
                </pre>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Interactive Code Editor */}
      <div className="lg:col-span-7">
        <CodePlayground
          key={`lab-${loadedVersion}`}
          title="Practice Lab Editor"
          initialCode={loadedVersion > 0 ? solutionCode : starterCode}
        />
      </div>
    </div>
  );
}
