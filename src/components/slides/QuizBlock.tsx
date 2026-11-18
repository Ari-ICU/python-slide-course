"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "@/data/slides";
import { RichText } from "@/components/slides/RichText";
import { highlightPythonLine } from "@/lib/py-highlight";
import { cn } from "@/lib/utils";

interface QuizBlockProps {
  questions: QuizQuestion[];
}

export function QuizBlock({ questions }: QuizBlockProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce(
    (acc, q, idx) => (answers[idx] === q.answerIndex ? acc + 1 : acc),
    0
  );
  const progressPct = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="size-3 text-amber-500" />
            Score: {correctCount} / {questions.length}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {answeredCount === questions.length
              ? correctCount === questions.length
                ? "Perfect score! Ready for the next module."
                : "Great effort — review any red hints below."
              : `Answered ${answeredCount} of ${questions.length}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 hidden sm:block">
            <Progress value={progressPct} />
          </div>
          {answeredCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setAnswers({})}
            >
              <RotateCcw />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-3.5 md:grid-cols-3">
        {questions.map((q, qIdx) => {
          const picked = answers[qIdx];
          const hasPicked = picked !== undefined;
          const isCorrect = picked === q.answerIndex;

          return (
            <Card key={qIdx} className="flex flex-col justify-between gap-3 p-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-[11px]">
                    Q{qIdx + 1}
                  </Badge>
                  {hasPicked && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold",
                        isCorrect
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="size-3.5" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5" /> Try reviewing
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold leading-snug">
                  <RichText text={q.prompt} />
                </h3>

                <pre className="overflow-x-auto rounded-lg border bg-slate-50/90 px-3 py-2 font-mono text-xs leading-5 dark:bg-slate-950/75">
                  {q.code.split("\n").map((line, i) => (
                    <div key={i}>{highlightPythonLine(line)}</div>
                  ))}
                </pre>

                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isThisPicked = picked === optIdx;
                    const isRightAnswer = optIdx === q.answerIndex;
                    const letter = String.fromCharCode(65 + optIdx);

                    let stateClass =
                      "border-border bg-background hover:bg-muted/60 text-foreground";
                    if (hasPicked) {
                      if (isRightAnswer) {
                        stateClass =
                          "border-emerald-500 bg-emerald-500/12 text-emerald-900 dark:text-emerald-200 font-medium";
                      } else if (isThisPicked) {
                        stateClass =
                          "border-rose-500 bg-rose-500/12 text-rose-900 dark:text-rose-200";
                      } else {
                        stateClass = "border-border/60 bg-muted/20 text-muted-foreground opacity-75";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                        }
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition-all cursor-pointer",
                          stateClass
                        )}
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded border border-current/25 font-mono text-[10px] font-bold">
                          {letter}
                        </span>
                        <span className="font-mono leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {hasPicked && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs leading-relaxed",
                      isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-900 dark:text-emerald-200"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200"
                    )}
                  >
                    <RichText text={q.explanation} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
