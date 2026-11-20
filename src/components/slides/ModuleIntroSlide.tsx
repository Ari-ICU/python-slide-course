"use client";

import React from "react";
import { ArrowRight, BookMarked, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/slides/RichText";
import type { AccentTone, ModuleIntroConfig } from "@/data/slides";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<
  AccentTone,
  { border: string; bg: string; pill: string; hint: string }
> = {
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/[0.05]",
    pill: "bg-blue-600 text-white",
    hint: "text-blue-700 dark:text-blue-300",
  },
  amber: {
    border: "border-amber-500/35",
    bg: "bg-amber-500/[0.06]",
    pill: "bg-amber-500 text-slate-950",
    hint: "text-amber-800 dark:text-amber-300",
  },
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/[0.05]",
    pill: "bg-emerald-600 text-white",
    hint: "text-emerald-700 dark:text-emerald-300",
  },
  purple: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/[0.05]",
    pill: "bg-violet-600 text-white",
    hint: "text-violet-700 dark:text-violet-300",
  },
  red: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/[0.05]",
    pill: "bg-rose-600 text-white",
    hint: "text-rose-700 dark:text-rose-300",
  },
};

interface ModuleIntroSlideProps {
  intro: ModuleIntroConfig;
  onStartModule?: () => void;
}

export function ModuleIntroSlide({
  intro,
  onStartModule,
}: ModuleIntroSlideProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Module Goal & Why It Matters */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="gap-1 border-blue-500/25 bg-blue-500/[0.05] px-4 py-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <Compass className="size-3.5 shrink-0" />
            Module Goal
          </div>
          <p className="text-[13px] leading-relaxed text-foreground">
            <RichText text={intro.goal} />
          </p>
        </Card>

        <Card className="gap-1 border-emerald-500/25 bg-emerald-500/[0.05] px-4 py-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <Sparkles className="size-3.5 shrink-0" />
            Why It Matters
          </div>
          <p className="text-[13px] leading-relaxed text-foreground">
            <RichText text={intro.whyItMatters} />
          </p>
        </Card>
      </div>

      {/* Key Definitions Grid */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <BookMarked className="size-3.5 text-primary" />
          Key Definitions to Know First
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {intro.definitions.map((def) => {
            const st = TONE_CLASSES[def.tone];
            return (
              <Card
                key={def.term}
                className={cn("gap-1.5 px-4 py-3", st.border, st.bg)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {def.term}
                  </span>
                  {def.badge && (
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold",
                        st.pill
                      )}
                    >
                      {def.badge}
                    </span>
                  )}
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  <RichText text={def.meaning} />
                </p>
                {def.exampleHint && (
                  <div className={cn("text-xs font-medium", st.hint)}>
                    <RichText text={def.exampleHint} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Module Lesson Roadmap + Continue CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/35 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Inside this module:
          </span>
          {intro.lessons.map((lesson) => (
            <Badge
              key={lesson.part}
              variant="secondary"
              className="gap-1 font-normal text-[11px]"
            >
              <span className="font-mono font-bold text-primary">
                {lesson.part}
              </span>
              <span>{lesson.title}</span>
            </Badge>
          ))}
        </div>

        {onStartModule && (
          <Button
            type="button"
            size="sm"
            onClick={onStartModule}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Start Real-World Cases
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
