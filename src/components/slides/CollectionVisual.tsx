"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Brackets, Braces } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CollectionVisualConfig } from "@/data/slides";
import { cn } from "@/lib/utils";

interface CollectionVisualProps {
  visual: CollectionVisualConfig;
}

export function CollectionVisual({ visual }: CollectionVisualProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  if (visual.kind === "list") {
    const selected = visual.items[selectedIdx] || visual.items[0];
    return (
      <Card className="gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Brackets className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono text-sm font-semibold">{visual.varName}</span>
            <Badge variant="secondary" className="text-[11px]">
              list • {visual.items.length} items
            </Badge>
          </div>
          {selected && (
            <div className="rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-xs text-emerald-700 dark:text-emerald-300">
              {visual.varName}[{selected.pos}] == {visual.varName}[{selected.neg}] == {selected.value}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {visual.items.map((item, idx) => {
            const active = selectedIdx === idx;
            return (
              <motion.button
                key={item.pos}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  "flex flex-col items-center rounded-xl border p-3 text-center transition-colors cursor-pointer",
                  active
                    ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                    : "border-border bg-muted/30 hover:bg-muted/60"
                )}
              >
                <span className="rounded bg-blue-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                  index {item.pos}
                </span>
                <span className="my-2 font-mono text-sm font-bold text-foreground">
                  {item.value}
                </span>
                <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-700 dark:text-amber-300">
                  neg {item.neg}
                </span>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">{visual.caption}</p>
      </Card>
    );
  }

  const selectedPair = visual.pairs[selectedIdx] || visual.pairs[0];
  return (
    <Card className="gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Braces className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-mono text-sm font-semibold">{visual.varName}</span>
          <Badge variant="secondary" className="text-[11px]">
            dict • {visual.pairs.length} keys
          </Badge>
        </div>
        {selectedPair && (
          <div className="rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-xs text-emerald-700 dark:text-emerald-300">
            {visual.varName}[{selectedPair.key}] → {selectedPair.value}
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {visual.pairs.map((pair, idx) => {
          const active = selectedIdx === idx;
          return (
            <motion.button
              key={pair.key}
              type="button"
              whileHover={{ x: 2 }}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer",
                active
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border bg-muted/30 hover:bg-muted/60"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="rounded bg-blue-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {pair.key}
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-mono text-sm font-bold text-foreground">
                  {pair.value}
                </span>
              </div>
              <Badge variant="outline" className="ml-2 shrink-0 font-mono text-[10px]">
                {pair.type}
              </Badge>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">{visual.caption}</p>
    </Card>
  );
}
