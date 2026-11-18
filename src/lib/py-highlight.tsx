import React from "react";

const KEYWORDS = new Set([
  "class", "def", "return", "if", "elif", "else", "for", "in", "while", "break",
  "continue", "try", "except", "finally", "import", "from", "as", "and",
  "or", "not", "is", "True", "False", "None", "pass", "raise",
]);

const BUILTINS = new Set([
  "print", "input", "len", "type", "int", "float", "str", "bool",
  "list", "dict", "tuple", "set", "range", "sum", "min", "max", "abs",
  "round", "sorted", "enumerate", "zip", "isinstance", "super", "ValueError",
  "TypeError", "ZeroDivisionError",
]);

/**
 * Tokenize a single line of Python into styled React spans.
 * Safe, deterministic, and supports dark & light themes via CSS classes.
 */
export function highlightPythonLine(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const push = (text: string, cls?: string) => {
    if (!text) return;
    nodes.push(
      cls ? (
        <span key={key++} className={cls}>
          {text}
        </span>
      ) : (
        <React.Fragment key={key++}>{text}</React.Fragment>
      )
    );
  };

  while (i < line.length) {
    const ch = line[i];

    // Comment
    if (ch === "#") {
      push(line.slice(i), "text-slate-500 dark:text-slate-400 italic");
      break;
    }

    // String or f-string
    const isF = (ch === "f" || ch === "F") && (line[i + 1] === '"' || line[i + 1] === "'");
    if (isF || ch === '"' || ch === "'") {
      const start = i;
      if (isF) i++;
      const quote = line[i++];
      while (i < line.length) {
        if (line[i] === "\\" && i + 1 < line.length) {
          i += 2;
          continue;
        }
        if (line[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      push(line.slice(start, i), "text-emerald-700 dark:text-emerald-400");
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < line.length && /[0-9._]/.test(line[i])) i++;
      push(line.slice(start, i), "text-amber-700 dark:text-amber-300");
      continue;
    }

    // Identifiers, keywords, builtins, calls
    if (/[a-zA-Z_]/.test(ch)) {
      const start = i;
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) i++;
      const word = line.slice(start, i);

      if (KEYWORDS.has(word)) {
        if (word === "True" || word === "False" || word === "None") {
          push(word, "text-amber-700 dark:text-amber-300 font-semibold");
        } else {
          push(word, "text-violet-700 dark:text-violet-400 font-semibold");
        }
      } else if (word === "self") {
        push(word, "text-rose-600 dark:text-rose-400 italic font-medium");
      } else if (BUILTINS.has(word)) {
        push(word, "text-sky-700 dark:text-sky-300 font-semibold");
      } else if (line[i] === "(") {
        push(word, "text-blue-700 dark:text-blue-300 font-semibold");
      } else {
        push(word, "text-slate-900 dark:text-slate-100");
      }
      continue;
    }

    // Operators / punctuation
    if ("=+-*/%<>!:()[]{},.".includes(ch)) {
      push(ch, "text-slate-600 dark:text-slate-400");
      i++;
      continue;
    }

    // Whitespace or other characters
    const start = i;
    while (i < line.length && !/[#"'0-9a-zA-Z_=+\-*/%<>!:()[\]{},.]/.test(line[i])) i++;
    push(line.slice(start, i));
  }

  return nodes.length ? nodes : [<React.Fragment key={0}>&nbsp;</React.Fragment>];
}
