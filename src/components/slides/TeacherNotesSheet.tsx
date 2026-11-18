"use client";

import React from "react";
import {
  AlertCircle,
  BookOpen,
  Clock,
  HelpCircle,
  MessageSquareText,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RichText } from "@/components/slides/RichText";
import type { SlideData } from "@/data/slides";

interface TeacherNotesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: SlideData;
  slideNumber: number;
  totalSlides: number;
}

export function TeacherNotesSheet({
  open,
  onOpenChange,
  slide,
  slideNumber,
  totalSlides,
}: TeacherNotesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="size-3" />
              Teacher Presenter Notes
            </Badge>
            <Badge variant="outline" className="gap-1 font-mono">
              <Clock className="size-3" />
              {slide.notes.duration}
            </Badge>
          </div>
          <SheetTitle className="pt-1 text-base leading-snug">
            {slideNumber}/{totalSlides} • {slide.title}
          </SheetTitle>
          <SheetDescription>
            Instructor talking points, pacing cues, and student check-in prompts.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <Card className="gap-1.5 p-3.5 border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Target className="size-3.5" />
              Learning Goal
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              <RichText text={slide.notes.goal} />
            </p>
          </Card>

          <Card className="gap-1.5 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <MessageSquareText className="size-3.5" />
              What to Explain
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              <RichText text={slide.notes.say} />
            </p>
          </Card>

          <Card className="gap-1.5 p-3.5 border-violet-500/30 bg-violet-500/5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <HelpCircle className="size-3.5" />
              Question to Ask Students
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              <RichText text={slide.notes.ask} />
            </p>
          </Card>

          <Separator />

          <Card className="gap-1.5 p-3.5 border-amber-500/40 bg-amber-500/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <AlertCircle className="size-3.5" />
              Common Pitfall Watch-Out
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              <RichText text={slide.notes.watchOut} />
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
