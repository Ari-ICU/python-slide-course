"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MODULES, SLIDES } from "@/data/slides";
import { cn } from "@/lib/utils";

interface OverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIdx: number;
  onSelectSlide: (idx: number) => void;
}

export function OverviewDialog({
  open,
  onOpenChange,
  currentIdx,
  onSelectSlide,
}: OverviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <LayoutGrid className="size-4 text-blue-600 dark:text-blue-400" />
            Course Slide Overview ({SLIDES.length} Slides)
          </DialogTitle>
          <DialogDescription>
            Click any slide card below to jump directly to that topic.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[68vh] px-6 py-4">
          <div className="space-y-6 pb-2">
            {MODULES.map((mod) => {
              const modSlides = SLIDES.map((s, idx) => ({ slide: s, idx })).filter(
                (x) => x.slide.moduleId === mod.id
              );
              return (
                <div key={mod.id} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: mod.color }}
                    />
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      MODULE {mod.number}
                    </span>
                    <span className="text-sm font-semibold">{mod.title}</span>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {modSlides.map(({ slide, idx }) => {
                      const active = idx === currentIdx;
                      return (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => {
                            onSelectSlide(idx);
                            onOpenChange(false);
                          }}
                          className={cn(
                            "flex flex-col justify-between rounded-xl border p-3 text-left transition-all cursor-pointer hover:border-blue-500/60 hover:bg-muted/40",
                            active
                              ? "border-blue-600 bg-blue-500/8 ring-2 ring-blue-500/20"
                              : "border-border bg-card"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] font-bold text-muted-foreground">
                              #{String(idx + 1).padStart(2, "0")}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {slide.layout}
                            </Badge>
                          </div>
                          <div className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
                            {slide.title}
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {slide.notes.duration} • {slide.badge}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
