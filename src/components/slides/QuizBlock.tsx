"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "@/data/slides";
import { RichText } from "@/components/slides/RichText";
import { highlightPythonLine } from "@/lib/py-highlight";
import { runPython, type PyRunResult } from "@/lib/py-runner";
import { cn } from "@/lib/utils";

interface QuizBlockProps {
  questions: QuizQuestion[];
}

export function QuizBlock({ questions }: QuizBlockProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [attempts, setAttempts] = useState<Record<number, number[]>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [runResults, setRunResults] = useState<Record<number, PyRunResult>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (questions.length === 0) return null;

  const safeIdx = Math.min(Math.max(activeIdx, 0), questions.length - 1);
  const activeQuestion = questions[safeIdx];
  const isMultiQuestion = questions.length > 1;

  const isQuestionSolved = (qIdx: number) =>
    (attempts[qIdx] || []).includes(questions[qIdx].answerIndex);

  const isQuestionDone = (qIdx: number) =>
    isQuestionSolved(qIdx) || Boolean(revealed[qIdx]);

  const completedCount = questions.reduce(
    (acc, _, idx) => (isQuestionDone(idx) ? acc + 1 : acc),
    0
  );
  const correctCount = questions.reduce(
    (acc, _, idx) => (isQuestionSolved(idx) ? acc + 1 : acc),
    0
  );
  const hasAnyInteraction =
    Object.keys(attempts).length > 0 ||
    Object.keys(revealed).length > 0 ||
    Object.keys(runResults).length > 0;
  const progressPct = Math.round((completedCount / questions.length) * 100);
  const allSolvedPerfectly =
    completedCount === questions.length && correctCount === questions.length;

  const goToQuestion = (nextIdx: number) => {
    const bounded = Math.min(Math.max(nextIdx, 0), questions.length - 1);
    if (bounded === safeIdx) return;
    setDirection(bounded > safeIdx ? 1 : -1);
    setActiveIdx(bounded);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isQuestionDone(qIdx)) return;
    setAttempts((prev) => {
      const current = prev[qIdx] || [];
      if (current.includes(optIdx)) return prev;
      return { ...prev, [qIdx]: [...current, optIdx] };
    });
  };

  const handleReveal = (qIdx: number) => {
    setRevealed((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleRunSnippet = (qIdx: number, code: string) => {
    const res = runPython(code);
    setRunResults((prev) => ({ ...prev, [qIdx]: res }));
  };

  const handleCopySnippet = async (qIdx: number, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIdx(qIdx);
      setTimeout(() => {
        setCopiedIdx((prev) => (prev === qIdx ? null : prev));
      }, 1500);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  const handleReset = () => {
    setAttempts({});
    setRevealed({});
    setRunResults({});
    setCopiedIdx(null);
    if (safeIdx !== 0) {
      setDirection(-1);
      setActiveIdx(0);
    }
  };

  const tried = attempts[safeIdx] || [];
  const isSolved = isQuestionSolved(safeIdx);
  const isRevealed = Boolean(revealed[safeIdx]);
  const isDone = isSolved || isRevealed;
  const hasWrongAttempt = tried.some((idx) => idx !== activeQuestion.answerIndex);
  const runResult = runResults[safeIdx];
  const codeLines = activeQuestion.code.split("\n");
  const isCopied = copiedIdx === safeIdx;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Score & Question Stepper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-muted/35 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge
            variant="secondary"
            className={cn(
              "gap-1.5 px-2.5 py-1 text-xs font-semibold",
              allSolvedPerfectly &&
                "border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            )}
          >
            <Sparkles
              className={cn(
                "size-3.5",
                allSolvedPerfectly ? "text-emerald-500" : "text-amber-500"
              )}
            />
            Score: {correctCount} / {questions.length}
          </Badge>

          {isMultiQuestion && (
            <div className="flex flex-wrap items-center gap-1.5" aria-label="Jump to question">
              {questions.map((_, idx) => {
                const solved = isQuestionSolved(idx);
                const shown = Boolean(revealed[idx]);
                const wrongTried =
                  (attempts[idx] || []).length > 0 && !solved && !shown;
                const isActive = idx === safeIdx;
                const pillLabel =
                  questions.length <= 4 ? `Question ${idx + 1}` : `Q${idx + 1}`;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToQuestion(idx)}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer",
                      isActive
                        ? "border-blue-500 bg-blue-600 text-white shadow-2xs dark:bg-blue-500"
                        : solved
                          ? "border-emerald-500/40 bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                          : shown
                            ? "border-amber-500/40 bg-amber-500/12 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300"
                            : wrongTried
                              ? "border-rose-500/40 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300"
                              : "border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                    )}
                  >
                    {solved && <Check className="size-3" />}
                    {shown && !solved && <Eye className="size-3" />}
                    <span className="sm:hidden">Q{idx + 1}</span>
                    <span className="hidden sm:inline">{pillLabel}</span>
                  </button>
                );
              })}
            </div>
          )}

          <span className="text-xs text-muted-foreground">
            {completedCount === questions.length
              ? allSolvedPerfectly
                ? "Perfect score! Ready for the next module."
                : "All checked — review any question or reset."
              : `${completedCount} of ${questions.length} completed`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isMultiQuestion && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28">
                <Progress value={progressPct} />
              </div>
              <span className="font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
                {progressPct}%
              </span>
            </div>
          )}
          {hasAnyInteraction && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleReset}
            >
              <RotateCcw />
              Reset Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Focused Single-Question Slide */}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={safeIdx}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Card
            className={cn(
              "p-4 sm:p-6 transition-colors",
              isSolved
                ? "border-emerald-500/45 bg-emerald-500/[0.02] shadow-xs"
                : isRevealed
                  ? "border-amber-500/40 bg-amber-500/[0.02] shadow-xs"
                  : "border-border/80"
            )}
          >
            <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
              {/* Left Column: Spacious Python Code Panel */}
              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-xl border border-border/80 bg-slate-50/95 shadow-2xs dark:bg-slate-950/85">
                  <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-muted/50 px-3.5 py-2">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <span className="size-2 rounded-full bg-blue-500/80" />
                      python
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopySnippet(safeIdx, activeQuestion.code)}
                        title="Copy code"
                      >
                        {isCopied ? (
                          <Check className="text-emerald-500" />
                        ) : (
                          <Copy />
                        )}
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                      </Button>

                      <Button
                        type="button"
                        size="xs"
                        disabled={!isDone}
                        onClick={() => handleRunSnippet(safeIdx, activeQuestion.code)}
                        title={
                          isDone
                            ? "Run this Python snippet"
                            : "Answer or reveal first to run code"
                        }
                        className={cn(
                          isDone
                            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            : "bg-muted text-muted-foreground opacity-65"
                        )}
                      >
                        <Play className="fill-current" />
                        Run Code
                      </Button>
                    </div>
                  </div>

                  <div className="flex overflow-x-auto py-3.5 font-mono text-[13.5px] leading-6">
                    <div
                      aria-hidden="true"
                      className="select-none border-r border-border/60 pr-3 pl-3.5 text-right text-xs text-muted-foreground/50"
                    >
                      {codeLines.map((_, lineIdx) => (
                        <div key={lineIdx}>{lineIdx + 1}</div>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      {codeLines.map((line, lineIdx) => (
                        <div key={lineIdx} className="whitespace-pre">
                          {highlightPythonLine(line)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {runResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs leading-5 text-slate-100"
                      >
                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Terminal className="size-3.5 text-emerald-400" />
                            Console Output
                          </span>
                          <span
                            className={
                              runResult.ok ? "text-emerald-400" : "text-rose-400"
                            }
                          >
                            {runResult.ok ? "Ran cleanly" : "Error detected"}
                          </span>
                        </div>
                        {runResult.output ? (
                          <pre className="whitespace-pre-wrap text-emerald-300">
                            {runResult.output}
                          </pre>
                        ) : runResult.ok ? (
                          <span className="italic text-slate-400">
                            (Program finished with no printed output)
                          </span>
                        ) : null}
                        {runResult.error && (
                          <div className="mt-1 flex items-start gap-2 text-rose-300">
                            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-400" />
                            <span>{runResult.error}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Prompt, Options, Feedback & Navigation */}
              <div className="flex flex-col justify-between gap-4 lg:col-span-6">
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-xs font-semibold">
                      {isMultiQuestion
                        ? `Question ${safeIdx + 1} of ${questions.length}`
                        : "Checkpoint Question"}
                    </Badge>

                    {isSolved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="size-3.5" />
                        {tried.length === 1 ? "First try!" : "Correct!"}
                      </span>
                    ) : isRevealed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                        <Eye className="size-3.5" />
                        Answer shown
                      </span>
                    ) : hasWrongAttempt ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        <XCircle className="size-3.5" />
                        Try again
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        Pick 1 option
                      </span>
                    )}
                  </div>

                  {/* Prompt */}
                  <h3 className="text-base sm:text-[17px] font-semibold leading-snug text-foreground">
                    <RichText text={activeQuestion.prompt} />
                  </h3>

                  {/* Roomy Option Buttons */}
                  <div className="space-y-2.5">
                    {activeQuestion.options.map((opt, optIdx) => {
                      const wasTried = tried.includes(optIdx);
                      const isRightAnswer = optIdx === activeQuestion.answerIndex;
                      const wasTriedWrong = wasTried && !isRightAnswer;
                      const showAsCorrect = isDone && isRightAnswer;
                      const letter = String.fromCharCode(65 + optIdx);

                      let buttonClass =
                        "border-border bg-background hover:border-blue-500/45 hover:bg-blue-500/[0.04] text-foreground cursor-pointer active:scale-[0.995]";
                      let badgeClass =
                        "border-border bg-muted/40 text-muted-foreground";

                      if (showAsCorrect) {
                        buttonClass =
                          "border-emerald-500 bg-emerald-500/12 text-emerald-950 dark:text-emerald-100 font-medium shadow-2xs";
                        badgeClass =
                          "border-emerald-500/50 bg-emerald-500 text-white";
                      } else if (wasTriedWrong) {
                        buttonClass =
                          "border-rose-500/60 bg-rose-500/10 text-rose-900 dark:text-rose-200";
                        badgeClass =
                          "border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300";
                      } else if (isDone) {
                        buttonClass =
                          "border-border/50 bg-muted/20 text-muted-foreground opacity-65";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isDone || wasTriedWrong}
                          onClick={() => handleSelectOption(safeIdx, optIdx)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-xs sm:text-[13px] transition-all",
                            buttonClass
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-6.5 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-bold transition-colors",
                              badgeClass
                            )}
                          >
                            {letter}
                          </span>
                          <span className="flex-1 font-mono leading-snug break-words">
                            {opt}
                          </span>
                          {showAsCorrect && (
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          )}
                          {wasTriedWrong && (
                            <XCircle className="size-4 shrink-0 text-rose-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Non-spoiling Nudge / Explanation */}
                  <AnimatePresence mode="wait">
                    {!isDone && hasWrongAttempt && (
                      <motion.div
                        key="nudge"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center justify-between gap-2 rounded-xl border border-rose-500/25 bg-rose-500/8 px-3.5 py-2.5 text-xs text-rose-900 dark:text-rose-200"
                      >
                        <span>Not quite — try another option.</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleReveal(safeIdx)}
                          className="h-6 shrink-0 px-2 text-[11px] font-semibold text-foreground hover:bg-background/70"
                        >
                          <Eye className="size-3" />
                          Show Answer
                        </Button>
                      </motion.div>
                    )}

                    {isDone && (
                      <motion.div
                        key="explanation"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "rounded-xl border px-3.5 py-3 text-[13px] leading-relaxed",
                          isSolved
                            ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-950 dark:text-emerald-200"
                            : "border-amber-500/35 bg-amber-500/10 text-amber-950 dark:text-amber-200"
                        )}
                      >
                        <RichText text={activeQuestion.explanation} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Per-Question Prev / Next Footer */}
                {isMultiQuestion && (
                  <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={safeIdx === 0}
                      onClick={() => goToQuestion(safeIdx - 1)}
                    >
                      <ChevronLeft />
                      Prev Question
                    </Button>

                    <span className="font-mono text-xs font-medium text-muted-foreground tabular-nums">
                      {safeIdx + 1} / {questions.length}
                    </span>

                    <Button
                      type="button"
                      variant={
                        isDone && safeIdx < questions.length - 1
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      disabled={safeIdx === questions.length - 1}
                      onClick={() => goToQuestion(safeIdx + 1)}
                      className={cn(
                        isDone &&
                          safeIdx < questions.length - 1 &&
                          "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      )}
                    >
                      Next Question
                      <ChevronRight />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
