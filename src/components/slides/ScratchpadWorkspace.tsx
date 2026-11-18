"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Eraser,
  Moon,
  Sparkles,
  Sun,
  Terminal,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodePlayground } from "@/components/slides/CodePlayground";
import {
  readLastSlideNumber,
  readScratchpadDraft,
  readStoredTheme,
  saveScratchpadDraft,
  saveThemePreference,
} from "@/lib/course-storage";
import { cn } from "@/lib/utils";

interface ScratchpadPreset {
  id: string;
  label: string;
  summary: string;
  code: string;
  inputs?: string[];
}

export const SCRATCHPAD_PRESETS: ScratchpadPreset[] = [
  {
    id: "variables",
    label: "Variables & f-strings",
    summary: "Store values, compute expressions, and format text output.",
    code: `name = "Student"
hours = 3
minutes = hours * 60
print(f"Hello {name}! Practicing {minutes} mins today.")`,
  },
  {
    id: "conditions",
    label: "If / Elif / Else",
    summary: "Branch program logic cleanly based on conditions.",
    code: `score = 84

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "Needs Practice"

print(f"Score {score} -> Grade {grade}")`,
  },
  {
    id: "loops",
    label: "Loop + Comprehension",
    summary: "Filter even numbers and transform items in one clean pass.",
    code: `nums = [4, 11, 8, 15, 22, 7]
evens = [n for n in nums if n % 2 == 0]
doubled = [n * 2 for n in evens]

print("Even numbers:", evens)
print("Doubled:", doubled)`,
  },
  {
    id: "dicts",
    label: "Dicts & Functions",
    summary: "Define reusable helpers that process a list of dictionaries.",
    code: `students = [
    {"name": "Dara", "score": 88},
    {"name": "Sokha", "score": 95},
    {"name": "Vanna", "score": 76},
]

def honor_label(student):
    if student["score"] >= 85:
        status = "Honor"
    else:
        status = "Pass"
    return f"{student['name']}: {student['score']} ({status})"

for s in students:
    print(honor_label(s))`,
  },
  {
    id: "exceptions",
    label: "Function + Try / Except",
    summary: "Handle runtime errors gracefully instead of crashing.",
    code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero!"

print("10 / 2 =", safe_divide(10, 2))
print("10 / 0 =", safe_divide(10, 0))`,
  },
  {
    id: "oop",
    label: "OOP Class & Inheritance",
    summary: "Create classes with __init__, inheritance, and super().",
    code: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return f"{self.name} ({self.breed}) says Woof!"

pet = Dog("Milo", "Corgi")
print(pet.speak())
print("Is Animal?", isinstance(pet, Animal))`,
  },
  {
    id: "input",
    label: "Interactive input()",
    summary: "Simulate user prompts using comma-separated test inputs.",
    inputs: ["Dara", "20"],
    code: `name = input("Your name: ")
age = int(input("Your age: "))
print(f"Welcome {name}! Next year you will be {age + 1}.")`,
  },
  {
    id: "blank",
    label: "Blank Canvas",
    summary: "Start from an empty Python file.",
    code: `# Write any Python code below and click Run (or press Cmd/Ctrl + Enter)
print("Ready to experiment!")`,
  },
];

const SUPPORTED_ITEMS = [
  "print() & input()",
  "f-strings",
  "if / elif / else",
  "for & while",
  "list & dict comprehensions",
  "def & return",
  "try / except",
  "class / __init__ / super()",
  "len / range / sum / min / max",
  "sorted / enumerate / zip / isinstance",
];

export function ScratchpadWorkspace() {
  const [selectedPresetId, setSelectedPresetId] = useState(
    SCRATCHPAD_PRESETS[0].id
  );
  const [initialCode, setInitialCode] = useState(SCRATCHPAD_PRESETS[0].code);
  const [presetInputs, setPresetInputs] = useState<string[] | undefined>(
    SCRATCHPAD_PRESETS[0].inputs
  );
  const [editorVersion, setEditorVersion] = useState(0);
  const [isCustomDraft, setIsCustomDraft] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [lastSlide, setLastSlide] = useState<number | null>(null);

  // Sync theme, remembered slide number, and any saved custom draft cleanly after hydration
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const storedTheme = readStoredTheme();
      const dark =
        storedTheme !== null
          ? storedTheme === "dark"
          : document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);

      const savedSlide = readLastSlideNumber();
      if (savedSlide) {
        setLastSlide(savedSlide);
      }

      const savedDraft = readScratchpadDraft();
      if (savedDraft !== null && savedDraft !== SCRATCHPAD_PRESETS[0].code) {
        setSelectedPresetId("custom");
        setInitialCode(savedDraft);
        setPresetInputs(undefined);
        setIsCustomDraft(true);
        setEditorVersion((v) => v + 1);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      saveThemePreference(next);
      return next;
    });
  }, []);

  // Keyboard shortcut: T toggles theme outside text inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (isEditing) return;

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const loadPreset = (preset: ScratchpadPreset) => {
    setSelectedPresetId(preset.id);
    setInitialCode(preset.code);
    setPresetInputs(preset.inputs);
    setIsCustomDraft(false);
    saveScratchpadDraft(null);
    setEditorVersion((v) => v + 1);
  };

  const handleCodeChange = (nextCode: string) => {
    if (nextCode === initialCode) return;
    setIsCustomDraft(true);
    saveScratchpadDraft(nextCode);
  };

  const backHref = lastSlide ? `/#slide-${lastSlide}` : "/";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Clean Navigation Header matching SlideDeck */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-13 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={backHref}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/80 transition-colors"
              title="Back to Course Slides"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Terminal className="size-3.5" />
              </div>
              <span className="font-semibold tracking-tight text-sm hidden sm:inline">
                Python Course
              </span>
            </Link>

            <span className="text-muted-foreground/40 text-sm select-none">
              /
            </span>

            <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Code2 className="size-3.5 shrink-0" />
              <span className="truncate">Live Python Scratchpad</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={backHref}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <ArrowLeft />
              <span>
                {lastSlide ? `Back to Slide ${lastSlide}` : "Back to Slides"}
              </span>
            </Link>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleTheme}
                    aria-label="Toggle light and dark theme"
                  />
                }
              >
                {isDark ? <Sun /> : <Moon />}
              </TooltipTrigger>
              <TooltipContent>Toggle Theme (T)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Main Dedicated Scratchpad Stage */}
      <main className="bg-dot-stage flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Intro */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Live Python Scratchpad
                </h1>
                {isCustomDraft && (
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    Draft Saved
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Answer &ldquo;What if...&rdquo; questions live, explore course
                examples side-by-side, or test Python snippets right in your
                browser.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  loadPreset(SCRATCHPAD_PRESETS[SCRATCHPAD_PRESETS.length - 1])
                }
              >
                <Eraser />
                Clear / Blank File
              </Button>
            </div>
          </div>

          {/* Two-Column Workspace Grid */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Primary Code Editor & Console */}
            <div className="lg:col-span-8 space-y-3">
              <CodePlayground
                key={`scratchpad-page-${editorVersion}`}
                title="scratchpad.py"
                initialCode={initialCode}
                presetInputs={presetInputs}
                autoRun={selectedPresetId !== "blank" && !isCustomDraft}
                size="workspace"
                onCodeChange={handleCodeChange}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
                <span>
                  Tip: Press{" "}
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    Ctrl / ⌘ + Enter
                  </kbd>{" "}
                  to run, or{" "}
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    Tab
                  </kbd>{" "}
                  to indent 4 spaces.
                </span>
                <span>Your edits auto-save locally in this browser.</span>
              </div>
            </div>

            {/* Sidebar: Starter Templates & Quick Reference */}
            <aside className="lg:col-span-4 space-y-4">
              <Card className="gap-3 p-4 shadow-xs border-border/80">
                <div className="flex items-center gap-2 border-b pb-2.5">
                  <Sparkles className="size-4 text-amber-500" />
                  <h2 className="text-sm font-semibold">Starter Templates</h2>
                </div>

                <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                  {SCRATCHPAD_PRESETS.map((preset) => {
                    const active =
                      !isCustomDraft && selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => loadPreset(preset)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer",
                          active
                            ? "border-primary/50 bg-primary/8 text-foreground"
                            : "border-transparent bg-muted/40 hover:bg-muted text-foreground/90"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold">
                            {preset.label}
                          </span>
                          {active && (
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                          {preset.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card className="gap-3 p-4 shadow-xs border-border/80">
                <div className="flex items-center gap-2 border-b pb-2.5">
                  <BookOpen className="size-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-semibold">
                    Supported Python Syntax
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_ITEMS.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="font-mono text-[11px] font-normal"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
