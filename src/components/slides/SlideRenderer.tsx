"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers,
  Lightbulb,
  Play,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodePlayground } from "@/components/slides/CodePlayground";
import { CollectionVisual } from "@/components/slides/CollectionVisual";
import { ExerciseLab } from "@/components/slides/ExerciseLab";
import { QuizBlock } from "@/components/slides/QuizBlock";
import { RichText } from "@/components/slides/RichText";
import { StepTracer } from "@/components/slides/StepTracer";
import { SyntaxAnatomy } from "@/components/slides/SyntaxAnatomy";
import type { AccentTone, SlideData } from "@/data/slides";
import { highlightPythonLine } from "@/lib/py-highlight";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<
  AccentTone,
  { border: string; bg: string; badge: string; text: string }
> = {
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/8",
    badge: "bg-blue-600 text-white",
    text: "text-blue-700 dark:text-blue-300",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500 text-slate-950",
    text: "text-amber-700 dark:text-amber-300",
  },
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/8",
    badge: "bg-emerald-600 text-white",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  purple: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/8",
    badge: "bg-violet-600 text-white",
    text: "text-violet-700 dark:text-violet-300",
  },
  red: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/8",
    badge: "bg-rose-600 text-white",
    text: "text-rose-700 dark:text-rose-300",
  },
};

const MODULE_MAP: Record<string, string> = {
  "01": "basics",
  "02": "logic",
  "03": "loops",
  "04": "collections",
  "05": "functions",
  "06": "oop",
};

interface SlideRendererProps {
  slide: SlideData;
  onStartCourse?: () => void;
  onJumpModule?: (moduleId: string) => void;
  isPrint?: boolean;
}

export function SlideRenderer({
  slide,
  onStartCourse,
  onJumpModule,
  isPrint = false,
}: SlideRendererProps) {
  if (slide.layout === "hero") {
    return (
      <div className="flex flex-col gap-6 py-2">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-7">
            <Badge
              variant="secondary"
              className="gap-1.5 border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300"
            >
              <Sparkles className="size-3.5" />
              {slide.badge}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl leading-[1.12]">
              {slide.title}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {slide.subtitle}
            </p>

            {!isPrint && onStartCourse && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  type="button"
                  size="lg"
                  onClick={onStartCourse}
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-5"
                >
                  Start Course
                  <ArrowRight />
                </Button>
                <Link
                  href="/scratchpad"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "px-4"
                  )}
                >
                  <Code2 />
                  Open Python IDE
                </Link>
                <span className="text-xs text-muted-foreground">
                  Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px]">→</kbd> or{" "}
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px]">Space</kbd> to advance
                </span>
              </div>
            )}
          </div>

          {/* 3 Feature Highlights */}
          <div className="grid gap-3 lg:col-span-5">
            {slide.highlights?.map((item, idx) => {
              const Icon =
                item.icon === "play" ? Play : item.icon === "layers" ? Layers : CheckCircle2;
              return (
                <motion.div
                  key={item.label}
                  initial={isPrint ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * idx, duration: 0.25 }}
                >
                  <Card className="flex-row items-center gap-3.5 p-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.detail}</div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 6-Module Course Roadmap */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Code2 className="size-3.5 text-blue-500" />
            Course Roadmap — Click any module to jump
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {slide.roadmap?.map((mod, idx) => (
              <motion.button
                key={mod.num}
                type="button"
                initial={isPrint ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx, duration: 0.22 }}
                onClick={() => {
                  const modId = MODULE_MAP[mod.num];
                  if (modId && onJumpModule) onJumpModule(modId);
                }}
                className="group flex items-start gap-3 rounded-xl border bg-card p-3.5 text-left transition-all cursor-pointer hover:border-blue-500/50 hover:shadow-xs"
              >
                <span className="rounded-lg bg-muted px-2 py-1 font-mono text-xs font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors dark:text-blue-400">
                  {mod.num}
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{mod.title}</div>
                  <div className="text-xs text-muted-foreground">{mod.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Unified Slide Header */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[11px] font-semibold">
            {slide.badge}
          </Badge>
          <span className="text-xs text-muted-foreground">~{slide.notes.duration}</span>
        </div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-balance text-foreground sm:text-[2rem] leading-tight">
          {slide.title}
        </h2>
        {slide.lead && (
          <p className="max-w-3xl text-[15px] leading-relaxed text-foreground/75 sm:text-base">
            <RichText text={slide.lead} />
          </p>
        )}
      </div>

      {slide.syntaxAnatomy && (
        <SyntaxAnatomy
          title={slide.syntaxAnatomy.title}
          parts={slide.syntaxAnatomy.parts}
        />
      )}

      {/* Layout: concept-flow */}
      {slide.layout === "concept-flow" && (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-3.5 lg:col-span-6">
            {slide.analogy && (
              <Card className="gap-1.5 border-amber-500/35 bg-amber-500/8 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <Lightbulb className="size-4" />
                  {slide.analogy.title}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  <RichText text={slide.analogy.text} />
                </p>
              </Card>
            )}

            <div className="grid gap-2.5">
              {slide.bullets?.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={isPrint ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Card className="flex-row items-start gap-3 p-3.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <div>
                      <div className="text-sm font-semibold">{b.title}</div>
                      <div className="text-xs text-muted-foreground">
                        <RichText text={b.desc} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-6">
            {/* 3-Step Horizontal Flow Diagram */}
            <div className="grid gap-2.5 sm:grid-cols-3">
              {slide.flowSteps?.map((step, i) => {
                const st = TONE_STYLES[step.tone];
                return (
                  <Card
                    key={step.title}
                    className={cn("relative gap-1.5 p-3.5", st.border, st.bg)}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 font-mono text-[11px] font-bold",
                          st.badge
                        )}
                      >
                        {step.step}
                      </span>
                      {i < (slide.flowSteps?.length || 0) - 1 && (
                        <ArrowRight className="hidden size-3.5 text-muted-foreground sm:block" />
                      )}
                    </div>
                    <div className="mt-1 text-sm font-semibold">{step.title}</div>
                    <div className="text-xs leading-snug text-muted-foreground">
                      <RichText text={step.desc} />
                    </div>
                  </Card>
                );
              })}
            </div>

            {slide.codeBlock && (
              <CodePlayground
                title={slide.codeBlock.title}
                initialCode={slide.codeBlock.code}
                presetInputs={slide.codeBlock.presetInputs}
                compact
              />
            )}
          </div>
        </div>
      )}

      {/* Layout: split-code */}
      {slide.layout === "split-code" && (
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-3 lg:col-span-5">
            {slide.points?.map((pt, i) => (
              <motion.div
                key={pt.tag}
                initial={isPrint ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="gap-1.5 p-4">
                  <Badge variant="secondary" className="w-fit font-mono text-xs text-blue-700 dark:text-blue-300">
                    {pt.tag}
                  </Badge>
                  <div className="text-sm font-semibold text-foreground">{pt.title}</div>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    <RichText text={pt.desc} />
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {slide.codeBlock && (
            <div className="lg:col-span-7">
              <CodePlayground
                title={slide.codeBlock.title}
                initialCode={slide.codeBlock.code}
                presetInputs={slide.codeBlock.presetInputs}
              />
            </div>
          )}
        </div>
      )}

      {/* Layout: step-tracer */}
      {slide.layout === "step-tracer" && (
        <div className="flex flex-col gap-4">
          {slide.rules && (
            <div className="grid gap-2.5 sm:grid-cols-3">
              {slide.rules.map((r) => (
                <Card key={r.label} className="gap-1 p-3 bg-muted/30">
                  <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {r.label}
                  </div>
                  <div className="text-[13px] leading-relaxed text-muted-foreground">
                    <RichText text={r.text} />
                  </div>
                </Card>
              ))}
            </div>
          )}
          {slide.tracer && <StepTracer title={slide.tracer.title} code={slide.tracer.code} />}
        </div>
      )}

      {/* Layout: type-cards */}
      {slide.layout === "type-cards" && (
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "grid gap-3",
              (slide.cards?.length || 0) === 6
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "sm:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {slide.cards?.map((card, i) => {
              const st = TONE_STYLES[card.accent];
              return (
                <motion.div
                  key={card.pill}
                  initial={isPrint ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Card className={cn("h-full justify-between gap-2.5 p-4", st.border)}>
                    <div className="space-y-2">
                      <span
                        className={cn(
                          "inline-block rounded-md px-2.5 py-1 font-mono text-xs font-bold",
                          st.badge
                        )}
                      >
                        {card.pill}
                      </span>
                      <div className="rounded-lg border bg-muted/40 px-2.5 py-1.5 font-mono text-xs font-semibold text-foreground">
                        {card.example}
                      </div>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">
                        <RichText text={card.desc} />
                      </p>
                    </div>
                    <div className={cn("flex items-start gap-1.5 text-xs font-medium", st.text)}>
                      <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
                      <span>
                        <RichText text={card.tip} />
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {slide.codeBlock && (
            <CodePlayground
              title={slide.codeBlock.title}
              initialCode={slide.codeBlock.code}
              compact
            />
          )}
        </div>
      )}

      {/* Layout: compare */}
      {slide.layout === "compare" && (
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "grid gap-3.5",
              (slide.columns?.length || 0) === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            )}
          >
            {slide.columns?.map((col, i) => {
              const st = TONE_STYLES[col.tone];
              return (
                <motion.div
                  key={col.title}
                  initial={isPrint ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Card className={cn("h-full gap-2.5 p-4", st.border, st.bg)}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground">{col.title}</span>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 font-mono text-[10px] font-bold",
                          st.badge
                        )}
                      >
                        {col.rule}
                      </span>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border bg-background/90 px-3 py-2 font-mono text-xs leading-5">
                      {col.example.split("\n").map((line, lIdx) => (
                        <div key={lIdx}>{highlightPythonLine(line)}</div>
                      ))}
                    </pre>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      <RichText text={col.desc} />
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {slide.codeBlock && (
            <CodePlayground
              title={slide.codeBlock.title}
              initialCode={slide.codeBlock.code}
              compact
            />
          )}
        </div>
      )}

      {/* Layout: visual-collection */}
      {slide.layout === "visual-collection" && (
        <div className="flex flex-col gap-4">
          {slide.collectionVisual && <CollectionVisual visual={slide.collectionVisual} />}
          {slide.codeBlock && (
            <CodePlayground
              title={slide.codeBlock.title}
              initialCode={slide.codeBlock.code}
              compact
            />
          )}
        </div>
      )}

      {/* Layout: quiz */}
      {slide.layout === "quiz" && slide.questions && <QuizBlock questions={slide.questions} />}

      {/* Layout: exercise */}
      {slide.layout === "exercise" &&
        slide.task &&
        slide.expectedOutput &&
        slide.starterCode &&
        slide.hint &&
        slide.solutionCode && (
          <ExerciseLab
            task={slide.task}
            expectedOutput={slide.expectedOutput}
            starterCode={slide.starterCode}
            hint={slide.hint}
            solutionCode={slide.solutionCode}
          />
        )}
    </div>
  );
}
