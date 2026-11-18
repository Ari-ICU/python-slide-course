"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ScanSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/slides/RichText";
import type { AccentTone, SyntaxPart } from "@/data/slides";
import { cn } from "@/lib/utils";

const CHIP_TONES: Record<AccentTone, { chip: string; active: string; num: string }> = {
  blue: {
    chip: "border-blue-500/35 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    active: "ring-2 ring-blue-500/40 bg-blue-500/20",
    num: "bg-blue-600 text-white",
  },
  amber: {
    chip: "border-amber-500/35 bg-amber-500/12 text-amber-800 dark:text-amber-300",
    active: "ring-2 ring-amber-500/40 bg-amber-500/22",
    num: "bg-amber-500 text-slate-950",
  },
  emerald: {
    chip: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    active: "ring-2 ring-emerald-500/40 bg-emerald-500/20",
    num: "bg-emerald-600 text-white",
  },
  purple: {
    chip: "border-violet-500/35 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    active: "ring-2 ring-violet-500/40 bg-violet-500/20",
    num: "bg-violet-600 text-white",
  },
  red: {
    chip: "border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    active: "ring-2 ring-rose-500/40 bg-rose-500/20",
    num: "bg-rose-600 text-white",
  },
};

interface SyntaxAnatomyProps {
  title?: string;
  parts: SyntaxPart[];
}

export function SyntaxAnatomy({
  title = "Part-by-Part Breakdown",
  parts,
}: SyntaxAnatomyProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <Card className="gap-3 p-4 border-border/80 bg-muted/25">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <ScanSearch className="size-3.5 text-blue-500" />
          {title}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Click any part to inspect
        </span>
      </div>

      {/* Interactive Token Strip */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border bg-slate-50/95 px-3.5 py-2.5 font-mono text-sm dark:bg-slate-950/80">
        {parts.map((p, idx) => {
          const style = CHIP_TONES[p.tone];
          const isActive = activeIdx === idx;
          return (
            <motion.button
              key={`${p.token}-${idx}`}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[13px] font-semibold transition-all cursor-pointer",
                style.chip,
                isActive && style.active
              )}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full font-sans text-[10px] font-bold",
                  style.num
                )}
              >
                {idx + 1}
              </span>
              <span className="whitespace-pre">{p.token}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Numbered Explanation Grid */}
      <div
        className={cn(
          "grid gap-2",
          parts.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {parts.map((p, idx) => {
          const style = CHIP_TONES[p.tone];
          const isActive = activeIdx === idx;
          return (
            <button
              key={`${p.label}-${idx}`}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "flex flex-col gap-1 rounded-xl border p-2.5 text-left transition-all cursor-pointer",
                isActive
                  ? "border-primary/50 bg-card shadow-xs ring-1 ring-primary/20"
                  : "border-border/70 bg-card/70 hover:bg-card"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    style.num
                  )}
                >
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-foreground">{p.label}</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <RichText text={p.explain} />
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
