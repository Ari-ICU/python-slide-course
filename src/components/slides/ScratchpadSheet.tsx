"use client";

import React, { useState } from "react";
import { Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CodePlayground } from "@/components/slides/CodePlayground";

const PRESETS: Array<{ label: string; code: string }> = [
  {
    label: "Variables & f-strings",
    code: `name = "Student"
hours = 3
print(f"Hello {name}! Practicing {hours * 60} mins today.")`,
  },
  {
    label: "Loop + Filter",
    code: `nums = [4, 11, 8, 15, 22]
evens = [n for n in nums if n % 2 == 0]
print("Even numbers:", evens)`,
  },
  {
    label: "Dict + Function",
    code: `def badge(user):
    return f"{user['name']} ({user.get('role', 'Learner')})"

print(badge({"name": "Dara", "role": "Python Starter"}))`,
  },
];

interface ScratchpadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScratchpadSheet({ open, onOpenChange }: ScratchpadSheetProps) {
  const [presetCode, setPresetCode] = useState(PRESETS[0].code);
  const [version, setVersion] = useState(0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Code2 className="size-4 text-blue-600 dark:text-blue-400" />
            Live Python Scratchpad
          </SheetTitle>
          <SheetDescription>
            Answer student &ldquo;What if...&rdquo; questions live from any slide without losing your place.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground mr-1">
              <Sparkles className="size-3.5 text-amber-500" /> Quick Presets:
            </span>
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="outline"
                size="xs"
                onClick={() => {
                  setPresetCode(p.code);
                  setVersion((v) => v + 1);
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>

          <CodePlayground
            key={`scratch-${version}`}
            title="scratchpad.py"
            initialCode={presetCode}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
