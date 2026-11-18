import React from "react";

interface RichTextProps {
  text: string;
  className?: string;
}

/**
 * Renders prose with inline `code` chips and **bold** emphasis spans
 * so explanations, tasks, hints, and teacher notes read clearly.
 */
export function RichText({ text, className }: RichTextProps) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={idx}
              className="mx-0.5 inline-block rounded-md border border-border/70 bg-muted/80 px-1.5 py-0.5 font-mono text-[0.86em] font-semibold text-blue-700 dark:text-sky-300"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={idx} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
}
