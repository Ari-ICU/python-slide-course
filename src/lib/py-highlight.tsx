import React from "react";

const KEYWORDS = new Set([
  "class", "def", "return", "if", "elif", "else", "for", "in", "while", "break",
  "continue", "try", "except", "finally", "import", "from", "as", "and",
  "or", "not", "is", "True", "False", "None", "pass", "raise", "with",
  "yield", "lambda", "async", "await", "global", "nonlocal", "assert",
  "del", "match", "case",
]);

const BUILTINS = new Set([
  "print", "input", "len", "type", "int", "float", "str", "bool",
  "list", "dict", "tuple", "set", "range", "sum", "min", "max", "abs",
  "round", "sorted", "enumerate", "zip", "isinstance", "issubclass", "super",
  "map", "filter", "any", "all", "chr", "ord", "open", "pow", "divmod",
  "id", "hex", "bin", "dir", "vars", "repr", "format", "object",
  "Exception", "ValueError", "TypeError", "ZeroDivisionError",
  "KeyError", "IndexError", "AttributeError", "FileNotFoundError", "RuntimeError",
]);

const STRING_CLS = "text-emerald-700 dark:text-emerald-400";

interface LineHighlightResult {
  nodes: React.ReactNode[];
  nextTripleQuote: '"""' | "'''" | null;
}

function tokenizeLineWithState(
  line: string,
  inTripleQuote: '"""' | "'''" | null
): LineHighlightResult {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  let activeTriple = inTripleQuote;

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

  if (activeTriple) {
    const endIdx = line.indexOf(activeTriple);
    if (endIdx === -1) {
      push(line, STRING_CLS);
      return {
        nodes: nodes.length ? nodes : [<React.Fragment key={0}>&nbsp;</React.Fragment>],
        nextTripleQuote: activeTriple,
      };
    }
    push(line.slice(0, endIdx + 3), STRING_CLS);
    i = endIdx + 3;
    activeTriple = null;
  }

  while (i < line.length) {
    const ch = line[i];

    // Comment
    if (ch === "#") {
      push(line.slice(i), "text-slate-500 dark:text-slate-400 italic");
      break;
    }

    // Decorator (@name)
    if (ch === "@" && i + 1 < line.length && /[a-zA-Z_]/.test(line[i + 1])) {
      const start = i;
      i++;
      while (i < line.length && /[a-zA-Z0-9_.]/.test(line[i])) i++;
      push(line.slice(start, i), "text-amber-600 dark:text-amber-300 font-medium");
      continue;
    }

    // String prefix (f, r, b, u and 2-char combos like fr, rf) + quotes
    let prefixLen = 0;
    if (/[fFrRbBuU]/.test(ch)) {
      if (line[i + 1] === '"' || line[i + 1] === "'") {
        prefixLen = 1;
      } else if (
        /[fFrRbBuU]/.test(line[i + 1] ?? "") &&
        (line[i + 2] === '"' || line[i + 2] === "'")
      ) {
        prefixLen = 2;
      }
    }

    const qPos = i + prefixLen;
    if (line[qPos] === '"' || line[qPos] === "'") {
      const quote = line[qPos];
      const triple = quote + quote + quote;
      if (line.slice(qPos, qPos + 3) === triple) {
        const start = i;
        const closeIdx = line.indexOf(triple, qPos + 3);
        if (closeIdx === -1) {
          push(line.slice(start), STRING_CLS);
          activeTriple = triple as '"""' | "'''";
          break;
        } else {
          push(line.slice(start, closeIdx + 3), STRING_CLS);
          i = closeIdx + 3;
          continue;
        }
      }

      const start = i;
      i = qPos + 1;
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
      push(line.slice(start, i), STRING_CLS);
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < line.length && /[0-9._xXbBoOeEjJ]/.test(line[i])) i++;
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
      } else if (word === "self" || word === "cls") {
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
    if ("=+-*/%<>!:()[]{},.@~^&|".includes(ch)) {
      push(ch, "text-slate-600 dark:text-slate-400");
      i++;
      continue;
    }

    // Whitespace or other characters
    const start = i;
    while (
      i < line.length &&
      !/[#"'0-9a-zA-Z_=+\-*/%<>!:()[\]{},.@~^&|]/.test(line[i])
    ) {
      i++;
    }
    push(line.slice(start, i));
  }

  return {
    nodes: nodes.length ? nodes : [<React.Fragment key={0}>&nbsp;</React.Fragment>],
    nextTripleQuote: activeTriple,
  };
}

/**
 * Tokenize a single line of Python into styled React spans.
 * Safe, deterministic, and supports dark & light themes via CSS classes.
 */
export function highlightPythonLine(line: string): React.ReactNode[] {
  return tokenizeLineWithState(line, null).nodes;
}

/**
 * Tokenize multi-line Python source into per-line React spans,
 * preserving triple-quoted string state across lines.
 */
export function highlightPythonCode(source: string): React.ReactNode[][] {
  const lines = source.split("\n");
  const rendered: React.ReactNode[][] = [];
  let tripleQuote: '"""' | "'''" | null = null;

  for (const line of lines) {
    const res = tokenizeLineWithState(line, tripleQuote);
    rendered.push(res.nodes);
    tripleQuote = res.nextTripleQuote;
  }

  return rendered;
}
