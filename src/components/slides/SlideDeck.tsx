"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Moon,
  MoreHorizontal,
  Printer,
  Sun,
  Terminal,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OverviewDialog } from "@/components/slides/OverviewDialog";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import {
  readLastSlideNumber,
  readStoredTheme,
  saveLastSlideNumber,
  saveThemePreference,
} from "@/lib/course-storage";
import { cn } from "@/lib/utils";
import { MODULES, SLIDES } from "@/data/slides";

export function SlideDeck() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const hasRestoredRef = useRef(false);

  const slide = SLIDES[currentIdx] || SLIDES[0];
  const currentModule = MODULES.find((m) => m.id === slide.moduleId) || MODULES[0];
  const progressPct = Math.round(((currentIdx + 1) / SLIDES.length) * 100);

  const goToSlide = useCallback((nextIdx: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, nextIdx));
    setCurrentIdx((prev) => {
      if (clamped === prev) return prev;
      setDirection(clamped > prev ? 1 : -1);
      return clamped;
    });
  }, []);

  const jumpToModule = useCallback(
    (moduleId: string) => {
      const idx = SLIDES.findIndex((s) => s.moduleId === moduleId);
      if (idx !== -1) goToSlide(idx);
    },
    [goToSlide]
  );

  // Sync URL hash, remembered slide, and theme on initial load
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      hasRestoredRef.current = true;
      let targetIdx = 0;

      const match = window.location.hash.match(/^#slide-(\d+)$/);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        if (idx >= 0 && idx < SLIDES.length) {
          targetIdx = idx;
        }
      } else {
        const savedSlide = readLastSlideNumber();
        if (savedSlide && savedSlide >= 1 && savedSlide <= SLIDES.length) {
          targetIdx = savedSlide - 1;
        }
      }

      if (targetIdx > 0) {
        setCurrentIdx(targetIdx);
      } else {
        saveLastSlideNumber(1);
        if (window.location.hash !== "#slide-1") {
          window.history.replaceState(null, "", "#slide-1");
        }
      }

      const storedTheme = readStoredTheme();
      const dark =
        storedTheme !== null
          ? storedTheme === "dark"
          : document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Update URL hash and remembered slide when slide changes
  useEffect(() => {
    if (!hasRestoredRef.current) return;
    const slideNumber = currentIdx + 1;
    saveLastSlideNumber(slideNumber);
    const targetHash = `#slide-${slideNumber}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, "", targetHash);
    }
  }, [currentIdx]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      saveThemePreference(next);
      return next;
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be blocked in embedded previews
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isEditing || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        if (overviewOpen) return;
        e.preventDefault();
        goToSlide(currentIdx + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (overviewOpen) return;
        e.preventDefault();
        goToSlide(currentIdx - 1);
      } else if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        setOverviewOpen((o) => !o);
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        saveLastSlideNumber(currentIdx + 1);
        router.push("/scratchpad");
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentIdx,
    goToSlide,
    overviewOpen,
    router,
    toggleTheme,
    toggleFullscreen,
  ]);

  return (
    <>
      <div className="no-print flex min-h-screen flex-col bg-background text-foreground">
        {/* Clean, Minimal Top Navigation Bar */}
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex h-13 max-w-7xl items-center justify-between gap-4 px-4">
            {/* Left: Brand + Single Module Switcher */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => goToSlide(0)}
                className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/80 transition-colors cursor-pointer"
                title="Back to Welcome Slide"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <Terminal className="size-3.5" />
                </div>
                <span className="font-semibold tracking-tight text-sm hidden sm:inline">
                  Python Course
                </span>
              </button>

              <span className="text-muted-foreground/40 text-sm select-none hidden sm:inline">/</span>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2 px-2.5 font-medium text-foreground/90"
                    />
                  }
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: currentModule.color }}
                  />
                  <span className="truncate max-w-[180px] sm:max-w-none">
                    <span className="font-mono text-xs text-muted-foreground mr-1.5">
                      {currentModule.number}
                    </span>
                    {currentModule.title}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Jump to Module</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {MODULES.map((mod) => {
                      const active = mod.id === currentModule.id;
                      return (
                        <DropdownMenuItem
                          key={mod.id}
                          onClick={() => jumpToModule(mod.id)}
                          className="justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: mod.color }}
                            />
                            <span className="font-mono text-xs text-muted-foreground">
                              {mod.number}
                            </span>
                            <span>{mod.title}</span>
                          </span>
                          {active && <Check className="size-3.5 text-primary" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setOverviewOpen(true)}
                    className="cursor-pointer font-medium"
                  >
                    <LayoutGrid className="size-4" />
                    All {SLIDES.length} Slides Grid (O)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right: Quiet Action Controls */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      href="/scratchpad"
                      onClick={() => saveLastSlideNumber(currentIdx + 1)}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" })
                      )}
                    />
                  }
                >
                  <Code2 />
                  <span className="hidden sm:inline">Scratchpad</span>
                </TooltipTrigger>
                <TooltipContent>Open Live Python Scratchpad (P)</TooltipContent>
              </Tooltip>

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

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="More presentation tools"
                    />
                  }
                >
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setOverviewOpen(true)}
                    className="cursor-pointer"
                  >
                    <LayoutGrid />
                    Slides Overview (O)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.print()}
                    className="cursor-pointer"
                  >
                    <Printer />
                    Print / Export PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={toggleFullscreen}
                    className="cursor-pointer"
                  >
                    {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen (F)"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Progress
            value={progressPct}
            className="rounded-none [&_[data-slot=progress-track]]:h-[2px] [&_[data-slot=progress-track]]:rounded-none [&_[data-slot=progress-indicator]]:bg-primary"
          />
        </header>

        {/* Main Slide Stage */}
        <main
          className="bg-dot-stage flex-1 flex items-center justify-center px-3 py-5 sm:px-6 sm:py-7"
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) > 55) {
              if (dx < 0) goToSlide(currentIdx + 1);
              else goToSlide(currentIdx - 1);
            }
          }}
        >
          <div className="w-full max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-[0_8px_30px_rgb(15_23_42_/_0.05)] dark:shadow-[0_10px_32px_rgb(0_0_0_/_0.35)] sm:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 transition-colors duration-300"
                style={{ backgroundColor: currentModule.color }}
              />
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 26 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -26 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <SlideRenderer
                    slide={slide}
                    onStartCourse={() => goToSlide(1)}
                    onJumpModule={jumpToModule}
                    onNextSlide={() => goToSlide(currentIdx + 1)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Bottom Presentation Footer */}
        <footer className="sticky bottom-0 z-20 border-t bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToSlide(currentIdx - 1)}
              disabled={currentIdx === 0}
            >
              <ChevronLeft />
              Previous
            </Button>

            {/* Clean Slide Counter */}
            <button
              type="button"
              onClick={() => setOverviewOpen(true)}
              title="Open slides overview (O)"
              className="rounded-md px-2.5 py-1 font-mono text-xs font-semibold tabular-nums text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              {String(currentIdx + 1).padStart(2, "0")} / {SLIDES.length}
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">← →</kbd>
                Slide
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => goToSlide(currentIdx + 1)}
                disabled={currentIdx === SLIDES.length - 1}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Next
                <ChevronRight />
              </Button>
            </div>
          </div>
        </footer>

        {/* Drawers & Dialogs */}
        <OverviewDialog
          open={overviewOpen}
          onOpenChange={setOverviewOpen}
          currentIdx={currentIdx}
          onSelectSlide={goToSlide}
        />
      </div>

      {/* Print / Export PDF View (hidden on screen, 1 slide per page when printing) */}
      <div className="hidden print-only-deck space-y-6 bg-white text-slate-900 p-4">
        {SLIDES.map((s, idx) => (
          <section
            key={s.id}
            className="print-slide-page rounded-xl border border-slate-200 p-6"
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2 text-xs text-slate-500">
              <span>Python Programming — Short Course</span>
              <span className="font-mono">
                Slide {idx + 1} / {SLIDES.length}
              </span>
            </div>
            <SlideRenderer slide={s} isPrint />
          </section>
        ))}
      </div>
    </>
  );
}
