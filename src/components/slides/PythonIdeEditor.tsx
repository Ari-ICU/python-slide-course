"use client";

import React, { useMemo, useRef } from "react";
import { highlightPythonCode } from "@/lib/py-highlight";
import { cn } from "@/lib/utils";

interface PythonIdeEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  onRun: () => void;
  onCursorChange?: (pos: { line: number; col: number }) => void;
  errorLine?: number | null;
  activeLine?: number;
  placeholder?: string;
  className?: string;
}

const PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
};

const CLOSING_CHARS = new Set([")", "]", "}", '"', "'"]);

function getLineCol(text: string, offset: number): { line: number; col: number } {
  const before = text.slice(0, offset);
  const lines = before.split("\n");
  return {
    line: lines.length,
    col: lines[lines.length - 1].length + 1,
  };
}

function getSelectedLineBounds(
  text: string,
  selStart: number,
  selEnd: number
): { blockStart: number; blockEnd: number } {
  const blockStart = text.lastIndexOf("\n", Math.max(0, selStart - 1)) + 1;
  let adjustedEnd = selEnd;
  if (selEnd > selStart && text[selEnd - 1] === "\n") {
    adjustedEnd = selEnd - 1;
  }
  const nextNl = text.indexOf("\n", adjustedEnd);
  const blockEnd = nextNl === -1 ? text.length : nextNl;
  return { blockStart, blockEnd };
}

export function PythonIdeEditor({
  value,
  onChange,
  onRun,
  onCursorChange,
  errorLine = null,
  activeLine = 1,
  placeholder = "# Write any Python 3 code here... (Ctrl/Cmd + Enter or F5 to run)",
  className,
}: PythonIdeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const highlightedLines = useMemo(() => highlightPythonCode(value), [value]);

  const applyEdit = (
    nextValue: string,
    nextSelStart: number,
    nextSelEnd: number = nextSelStart
  ) => {
    onChange(nextValue);
    onCursorChange?.(getLineCol(nextValue, nextSelStart));
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.selectionStart = nextSelStart;
      el.selectionEnd = nextSelEnd;
    });
  };

  const syncCursor = (el: HTMLTextAreaElement) => {
    onCursorChange?.(getLineCol(el.value, el.selectionStart));
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = target.scrollTop;
      preRef.current.scrollLeft = target.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = target.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const selStart = el.selectionStart;
    const selEnd = el.selectionEnd;

    // Run shortcut: Cmd/Ctrl + Enter or F5
    if (((e.metaKey || e.ctrlKey) && e.key === "Enter") || e.key === "F5") {
      e.preventDefault();
      onRun();
      return;
    }

    // Comment toggle: Cmd/Ctrl + /
    if ((e.metaKey || e.ctrlKey) && e.key === "/") {
      e.preventDefault();
      const { blockStart, blockEnd } = getSelectedLineBounds(
        value,
        selStart,
        selEnd
      );
      const block = value.slice(blockStart, blockEnd);
      const lines = block.split("\n");
      const nonEmpty = lines.filter((l) => l.trim().length > 0);
      const allCommented =
        nonEmpty.length > 0 && nonEmpty.every((l) => /^\s*#/.test(l));

      const updatedLines = lines.map((l) => {
        if (allCommented) {
          return l.replace(/^(\s*)#\s?/, "$1");
        }
        if (l.trim().length === 0) return l;
        const indentMatch = l.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : "";
        return `${indent}# ${l.slice(indent.length)}`;
      });

      const nextBlock = updatedLines.join("\n");
      const nextValue =
        value.slice(0, blockStart) + nextBlock + value.slice(blockEnd);
      const delta = nextBlock.length - block.length;
      if (selStart === selEnd) {
        const nextPos = Math.max(blockStart, selStart + delta);
        applyEdit(nextValue, nextPos, nextPos);
      } else {
        applyEdit(nextValue, blockStart, blockStart + nextBlock.length);
      }
      return;
    }

    // Tab & Shift+Tab indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const hasMultilineSelection =
        selStart !== selEnd && value.slice(selStart, selEnd).includes("\n");

      if (e.shiftKey || hasMultilineSelection) {
        const { blockStart, blockEnd } = getSelectedLineBounds(
          value,
          selStart,
          selEnd
        );
        const block = value.slice(blockStart, blockEnd);
        const lines = block.split("\n");

        if (e.shiftKey) {
          let firstLineRemoved = 0;
          let totalRemoved = 0;
          const updatedLines = lines.map((l, idx) => {
            const match = l.match(/^ {1,4}/);
            const removed = match ? match[0].length : 0;
            if (idx === 0) firstLineRemoved = removed;
            totalRemoved += removed;
            return l.slice(removed);
          });
          const nextBlock = updatedLines.join("\n");
          const nextValue =
            value.slice(0, blockStart) + nextBlock + value.slice(blockEnd);
          const nextStart = Math.max(blockStart, selStart - firstLineRemoved);
          const nextEnd = Math.max(nextStart, selEnd - totalRemoved);
          applyEdit(nextValue, nextStart, nextEnd);
        } else {
          const updatedLines = lines.map((l) => `    ${l}`);
          const nextBlock = updatedLines.join("\n");
          const nextValue =
            value.slice(0, blockStart) + nextBlock + value.slice(blockEnd);
          applyEdit(
            nextValue,
            selStart + 4,
            selEnd + lines.length * 4
          );
        }
        return;
      }

      const nextValue = value.slice(0, selStart) + "    " + value.slice(selEnd);
      applyEdit(nextValue, selStart + 4);
      return;
    }

    // Smart Enter: Python colon auto-indent + bracket expansion
    if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", selStart - 1) + 1;
      const lineToCursor = value.slice(lineStart, selStart);
      const indentMatch = lineToCursor.match(/^[ \t]*/);
      const baseIndent = indentMatch ? indentMatch[0] : "";

      const prevChar = value[selStart - 1] ?? "";
      const nextChar = value[selEnd] ?? "";
      if (
        selStart === selEnd &&
        ((prevChar === "{" && nextChar === "}") ||
          (prevChar === "[" && nextChar === "]") ||
          (prevChar === "(" && nextChar === ")"))
      ) {
        const inner = `${baseIndent}    `;
        const inserted = `\n${inner}\n${baseIndent}`;
        const nextValue =
          value.slice(0, selStart) + inserted + value.slice(selEnd);
        applyEdit(nextValue, selStart + 1 + inner.length);
        return;
      }

      // Strip trailing comment when detecting Python block header ':'
      const codeOnly = lineToCursor.replace(/#.*$/, "").trimEnd();
      const extraIndent = codeOnly.endsWith(":") ? "    " : "";
      const nextIndent = baseIndent + extraIndent;
      const nextValue =
        value.slice(0, selStart) + "\n" + nextIndent + value.slice(selEnd);
      applyEdit(nextValue, selStart + 1 + nextIndent.length);
      return;
    }

    // Smart Backspace: delete empty auto-pair or step back 4-space tab stop
    if (
      e.key === "Backspace" &&
      selStart === selEnd &&
      selStart > 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey
    ) {
      const prevChar = value[selStart - 1];
      const nextChar = value[selStart];
      if (PAIRS[prevChar] === nextChar) {
        e.preventDefault();
        const nextValue =
          value.slice(0, selStart - 1) + value.slice(selStart + 1);
        applyEdit(nextValue, selStart - 1);
        return;
      }

      const lineStart = value.lastIndexOf("\n", selStart - 1) + 1;
      const beforeOnLine = value.slice(lineStart, selStart);
      if (/^ +$/.test(beforeOnLine)) {
        e.preventDefault();
        const removeCount = ((beforeOnLine.length - 1) % 4) + 1;
        const nextValue =
          value.slice(0, selStart - removeCount) + value.slice(selStart);
        applyEdit(nextValue, selStart - removeCount);
        return;
      }
    }

    // Auto-pair brackets & quotes cleanly
    if (!e.metaKey && !e.ctrlKey && !e.altKey) {
      const char = e.key;
      const nextChar = value[selEnd] ?? "";

      // Skip over closing bracket/quote if already typed ahead
      if (selStart === selEnd && CLOSING_CHARS.has(char) && nextChar === char) {
        e.preventDefault();
        applyEdit(value, selStart + 1);
        return;
      }

      if (PAIRS[char]) {
        const closer = PAIRS[char];
        if (selStart !== selEnd) {
          e.preventDefault();
          const selected = value.slice(selStart, selEnd);
          const nextValue =
            value.slice(0, selStart) +
            char +
            selected +
            closer +
            value.slice(selEnd);
          applyEdit(nextValue, selStart + 1, selEnd + 1);
          return;
        }

        const isQuote = char === '"' || char === "'";
        const prevChar = value[selStart - 1] ?? "";
        const canAutoPairQuote =
          !isQuote ||
          ((!/[a-zA-Z0-9_"']/.test(prevChar) ||
            /^[fFrRbBuU]$/.test(prevChar)) &&
            (!nextChar || /[\s)\]}:,]/.test(nextChar)));

        if (canAutoPairQuote) {
          e.preventDefault();
          const nextValue =
            value.slice(0, selStart) + char + closer + value.slice(selEnd);
          applyEdit(nextValue, selStart + 1);
          return;
        }
      }
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-1 min-h-0 overflow-hidden bg-slate-50/90 dark:bg-slate-950/85",
        className
      )}
    >
      {/* Line Numbers Gutter */}
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden border-r border-border/70 bg-muted/35 py-3.5 text-right font-mono text-[13px] leading-6 text-muted-foreground/60 min-w-[3.1rem]"
      >
        {highlightedLines.map((_, idx) => {
          const lineNum = idx + 1;
          const isError = errorLine === lineNum;
          const isCurrent = activeLine === lineNum;
          return (
            <div
              key={lineNum}
              className={cn(
                "relative h-6 px-3",
                isError &&
                  "bg-rose-500/15 font-semibold text-rose-600 dark:text-rose-400",
                !isError && isCurrent && "font-semibold text-foreground/90"
              )}
            >
              {isError && (
                <span
                  className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-rose-500"
                  aria-hidden="true"
                />
              )}
              {lineNum}
            </div>
          );
        })}
      </div>

      {/* Highlighted Code Layer + Transparent Editable Textarea */}
      <div className="relative flex-1 min-w-0 overflow-hidden">
        <pre
          ref={preRef}
          aria-hidden="true"
          className="pointer-events-none h-full w-full overflow-hidden py-3.5 font-mono text-[13px] sm:text-[13.5px] leading-6 whitespace-pre"
        >
          <div className="min-w-full w-max">
            {highlightedLines.map((nodes, idx) => {
              const lineNum = idx + 1;
              const isError = errorLine === lineNum;
              const isCurrent = activeLine === lineNum;
              return (
                <div
                  key={lineNum}
                  className={cn(
                    "h-6 px-4",
                    isError &&
                      "bg-rose-500/12 border-l-2 border-rose-500 pl-[14px]",
                    !isError &&
                      isCurrent &&
                      "bg-blue-500/[0.06] dark:bg-sky-400/[0.07]"
                  )}
                >
                  {nodes}
                </div>
              );
            })}
          </div>
        </pre>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            const normalized = e.target.value.replace(/\r\n?/g, "\n");
            onChange(normalized);
            onCursorChange?.(getLineCol(normalized, e.currentTarget.selectionStart));
          }}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onClick={(e) => syncCursor(e.currentTarget)}
          onKeyUp={(e) => syncCursor(e.currentTarget)}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label="Python IDE code editor"
          className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent py-3.5 px-4 font-mono text-[13px] sm:text-[13.5px] leading-6 whitespace-pre text-transparent placeholder:text-muted-foreground/45 caret-blue-600 outline-none selection:bg-blue-500/20 dark:caret-sky-400"
        />
      </div>
    </div>
  );
}
