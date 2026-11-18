/**
 * Lightweight, zero-dependency in-browser Python 3 runner for interactive teaching slides.
 * Supports authentic Python types (int, float, str, bool, list, dict, tuple, set, None),
 * f-strings, control flow, loops, functions, slicing, comprehensions, try/except,
 * step-by-step trace snapshots, and infinite-loop protection.
 */

export interface PyTraceStep {
  line: number;
  vars: Record<string, string>;
  outputSoFar: string;
  note?: string;
}

export interface PyRunResult {
  ok: boolean;
  output: string;
  error: string | null;
  errorLine?: number | null;
  trace: PyTraceStep[];
  vars: Record<string, string>;
}

export interface PyRunOptions {
  maxSteps?: number;
  inputs?: string[];
  onInput?: (promptText: string) => string | null | undefined;
  collectTrace?: boolean;
}

type PyCallable = {
  __pyFunc: true;
  __pyBuiltin?: boolean;
  __pyTypeObj?: string;
  name: string;
  fn?: (args: PyValue[], kwargs?: Record<string, PyValue>) => PyValue;
  params?: Array<{ name: string; defaultExpr: ExprNode | null }>;
  body?: StmtNode[];
  closure?: Env;
  boundSelf?: PyInstance;
  ownerClass?: PyClass;
};

type PyModule = {
  __pyModule: true;
  name: string;
  attrs: Record<string, PyValue>;
};

type PyTypeObject = {
  __pyTypeObj: string;
};

type PyValue =
  | null
  | boolean
  | number
  | string
  | PyFloat
  | PyTuple
  | PyDict
  | PySet
  | PyClass
  | PyInstance
  | PySuper
  | PyValue[]
  | PyCallable
  | PyModule
  | PyTypeObject
  | PyException;

class PyClass {
  name: string;
  base: PyClass | null;
  attrs: Map<string, PyValue>;
  methods: Map<string, PyCallable>;
  constructor(name: string, base: PyClass | null = null) {
    this.name = name;
    this.base = base;
    this.attrs = new Map();
    this.methods = new Map();
  }
  lookupAttr(attr: string): PyValue | undefined {
    if (this.attrs.has(attr)) return this.attrs.get(attr);
    if (this.methods.has(attr)) return this.methods.get(attr);
    if (this.base) return this.base.lookupAttr(attr);
    return undefined;
  }
  lookupMethod(attr: string): { fn: PyCallable; owner: PyClass } | null {
    if (this.methods.has(attr)) return { fn: this.methods.get(attr)!, owner: this };
    if (this.base) return this.base.lookupMethod(attr);
    return null;
  }
}

class PyInstance {
  cls: PyClass;
  attrs: Map<string, PyValue>;
  constructor(cls: PyClass) {
    this.cls = cls;
    this.attrs = new Map();
  }
}

class PySuper {
  instance: PyInstance;
  startCls: PyClass;
  constructor(instance: PyInstance, startCls: PyClass) {
    this.instance = instance;
    this.startCls = startCls;
  }
}

class PyFloat {
  value: number;
  constructor(value: number) {
    this.value = Number(value);
  }
}

class PyTuple {
  items: PyValue[];
  constructor(items: PyValue[]) {
    this.items = items;
  }
}

class PyDict {
  entries: Map<string, { key: PyValue; value: PyValue }>;
  constructor(entries: Array<[PyValue, PyValue]> = []) {
    this.entries = new Map();
    for (const [k, v] of entries) {
      this.set(k, v);
    }
  }
  _keyId(k: PyValue): string {
    if (k === null) return "none:null";
    if (typeof k === "boolean") return `int:${k ? 1 : 0}`;
    if (typeof k === "number") return `int:${k}`;
    if (k instanceof PyFloat) {
      return Number.isInteger(k.value) ? `int:${k.value}` : `float:${k.value}`;
    }
    if (typeof k === "string") return `str:${k}`;
    if (k instanceof PyTuple) {
      return `tuple:[${k.items.map((x) => this._keyId(x)).join(",")}]`;
    }
    throw new PyException("TypeError", `unhashable type: '${pyTypeName(k)}'`);
  }
  has(k: PyValue): boolean {
    return this.entries.has(this._keyId(k));
  }
  get(k: PyValue, fallback: PyValue = null): PyValue {
    const id = this._keyId(k);
    const entry = this.entries.get(id);
    return entry ? entry.value : fallback;
  }
  set(k: PyValue, v: PyValue): void {
    const id = this._keyId(k);
    const existing = this.entries.get(id);
    if (existing) {
      existing.value = v;
    } else {
      this.entries.set(id, { key: k, value: v });
    }
  }
  delete(k: PyValue): boolean {
    return this.entries.delete(this._keyId(k));
  }
  keys(): PyValue[] {
    return Array.from(this.entries.values()).map((e) => e.key);
  }
  values(): PyValue[] {
    return Array.from(this.entries.values()).map((e) => e.value);
  }
  items(): PyTuple[] {
    return Array.from(this.entries.values()).map((e) => new PyTuple([e.key, e.value]));
  }
  get size(): number {
    return this.entries.size;
  }
}

class PySet {
  map: PyDict;
  constructor(items: PyValue[] = []) {
    this.map = new PyDict();
    for (const item of items) this.add(item);
  }
  add(item: PyValue): void {
    this.map.set(item, true);
  }
  has(item: PyValue): boolean {
    return this.map.has(item);
  }
  delete(item: PyValue): boolean {
    return this.map.delete(item);
  }
  values(): PyValue[] {
    return this.map.keys();
  }
  get size(): number {
    return this.map.size;
  }
}

class PyException extends Error {
  pyType: string;
  pyMessage: string;
  line: number | null;
  constructor(pyType: string, message: string, line: number | null = null) {
    super(`${pyType}: ${message}`);
    this.pyType = pyType;
    this.pyMessage = message;
    this.line = line;
  }
}

class BreakSignal {}
class ContinueSignal {}
class ReturnSignal {
  value: PyValue;
  constructor(value: PyValue) {
    this.value = value;
  }
}

function isPyFunc(v: PyValue): v is PyCallable {
  return typeof v === "object" && v !== null && "__pyFunc" in v && v.__pyFunc === true;
}

function isPyModule(v: PyValue): v is PyModule {
  return typeof v === "object" && v !== null && "__pyModule" in v && v.__pyModule === true;
}

function isPyTypeObj(v: PyValue): v is PyTypeObject {
  return typeof v === "object" && v !== null && "__pyTypeObj" in v && typeof v.__pyTypeObj === "string";
}

function isFloat(v: PyValue): v is PyFloat {
  return v instanceof PyFloat;
}

function isInt(v: PyValue): v is number {
  return typeof v === "number";
}

function isBool(v: PyValue): v is boolean {
  return typeof v === "boolean";
}

function isNumeric(v: PyValue): v is number | boolean | PyFloat {
  return typeof v === "number" || typeof v === "boolean" || v instanceof PyFloat;
}

function toNumber(v: PyValue): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v instanceof PyFloat) return v.value;
  throw new PyException("TypeError", `expected a number, got '${pyTypeName(v)}'`);
}

function pyTypeName(v: PyValue): string {
  if (v === null) return "NoneType";
  if (typeof v === "boolean") return "bool";
  if (typeof v === "number") return "int";
  if (v instanceof PyFloat) return "float";
  if (typeof v === "string") return "str";
  if (Array.isArray(v)) return "list";
  if (v instanceof PyTuple) return "tuple";
  if (v instanceof PyDict) return "dict";
  if (v instanceof PySet) return "set";
  if (v instanceof PyClass) return "type";
  if (v instanceof PyInstance) return v.cls.name;
  if (isPyFunc(v)) return "function";
  if (isPyModule(v)) return "module";
  return "object";
}

function pyTruthy(v: PyValue): boolean {
  if (v === null || v === false) return false;
  if (v === true) return true;
  if (typeof v === "number") return v !== 0;
  if (v instanceof PyFloat) return v.value !== 0;
  if (typeof v === "string") return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof PyTuple) return v.items.length > 0;
  if (v instanceof PyDict || v instanceof PySet) return v.size > 0;
  return true;
}

function formatFloat(n: number): string {
  if (Number.isNaN(n)) return "nan";
  if (!Number.isFinite(n)) return n > 0 ? "inf" : "-inf";
  if (Object.is(n, -0)) return "-0.0";
  const s = String(n);
  return s.includes(".") || s.includes("e") ? s : `${s}.0`;
}

export function pyRepr(v: PyValue, seen: Set<object> = new Set()): string {
  if (v === null) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (typeof v === "number") return String(v);
  if (v instanceof PyFloat) return formatFloat(v.value);
  if (typeof v === "string") {
    if (!v.includes("'")) {
      return `'${v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t")}'`;
    }
    return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t")}"`;
  }
  if (Array.isArray(v)) {
    if (seen.has(v)) return "[...]";
    seen.add(v);
    const out = `[${v.map((x) => pyRepr(x, seen)).join(", ")}]`;
    seen.delete(v);
    return out;
  }
  if (v instanceof PyTuple) {
    if (v.items.length === 0) return "()";
    if (v.items.length === 1) return `(${pyRepr(v.items[0], seen)},)`;
    return `(${v.items.map((x) => pyRepr(x, seen)).join(", ")})`;
  }
  if (v instanceof PyDict) {
    if (seen.has(v)) return "{...}";
    seen.add(v);
    const parts: string[] = [];
    for (const { key, value } of v.entries.values()) {
      parts.push(`${pyRepr(key, seen)}: ${pyRepr(value, seen)}`);
    }
    seen.delete(v);
    return `{${parts.join(", ")}}`;
  }
  if (v instanceof PySet) {
    const vals = v.values();
    if (vals.length === 0) return "set()";
    return `{${vals.map((x) => pyRepr(x, seen)).join(", ")}}`;
  }
  if (v instanceof PyClass) return `<class '${v.name}'>`;
  if (v instanceof PyInstance) return `<${v.cls.name} object>`;
  if (isPyFunc(v)) return `<function ${v.name}>`;
  if (isPyModule(v)) return `<module '${v.name}'>`;
  if (isPyTypeObj(v)) return `<class '${v.__pyTypeObj}'>`;
  return String(v);
}

export function pyStr(v: PyValue): string {
  if (typeof v === "string") return v;
  if (isPyTypeObj(v)) return `<class '${v.__pyTypeObj}'>`;
  if (v instanceof PyClass) return `<class '${v.name}'>`;
  return pyRepr(v);
}

function pyEquals(a: PyValue, b: PyValue): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (isNumeric(a) && isNumeric(b)) return toNumber(a) === toNumber(b);
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, idx) => pyEquals(item, b[idx]));
  }
  if (a instanceof PyTuple && b instanceof PyTuple) {
    return (
      a.items.length === b.items.length &&
      a.items.every((item, idx) => pyEquals(item, b.items[idx]))
    );
  }
  if (a instanceof PyDict && b instanceof PyDict) {
    if (a.size !== b.size) return false;
    for (const { key, value } of a.entries.values()) {
      if (!b.has(key) || !pyEquals(value, b.get(key))) return false;
    }
    return true;
  }
  if (a instanceof PySet && b instanceof PySet) {
    if (a.size !== b.size) return false;
    return a.values().every((x) => b.has(x));
  }
  return false;
}

function pyCompare(a: PyValue, b: PyValue): number {
  if (isNumeric(a) && isNumeric(b)) {
    const na = toNumber(a);
    const nb = toNumber(b);
    return na < nb ? -1 : na > nb ? 1 : 0;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const cmp = pyCompare(a[i], b[i]);
      if (cmp !== 0) return cmp;
    }
    return a.length - b.length;
  }
  if (a instanceof PyTuple && b instanceof PyTuple) {
    const len = Math.min(a.items.length, b.items.length);
    for (let i = 0; i < len; i++) {
      const cmp = pyCompare(a.items[i], b.items[i]);
      if (cmp !== 0) return cmp;
    }
    return a.items.length - b.items.length;
  }
  throw new PyException(
    "TypeError",
    `comparison not supported between instances of '${pyTypeName(a)}' and '${pyTypeName(b)}'`
  );
}

function toIterable(v: PyValue): PyValue[] {
  if (Array.isArray(v)) return v.slice();
  if (v instanceof PyTuple) return v.items.slice();
  if (typeof v === "string") return Array.from(v);
  if (v instanceof PyDict) return v.keys();
  if (v instanceof PySet) return v.values();
  throw new PyException("TypeError", `'${pyTypeName(v)}' object is not iterable`);
}

/* -------------------- Tokenizer -------------------- */

type TokenType =
  | "INDENT"
  | "DEDENT"
  | "NEWLINE"
  | "EOF"
  | "INT"
  | "FLOAT"
  | "STRING"
  | "FSTRING"
  | "KEYWORD"
  | "IDENT"
  | "OP"
  | "PUNCT";

interface Token {
  type: TokenType;
  value: string | number | null;
  line: number;
}

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "break", "class", "continue", "def",
  "elif", "else", "except", "finally", "for", "from", "if", "import",
  "in", "is", "not", "or", "pass", "raise", "return", "try", "while",
]);

const MULTI_OPS = [
  "//=", "**=", "==", "!=", "<=", ">=", "//", "**", "+=", "-=", "*=", "/=", "%=", "->",
];

function parseEscape(ch: string): string {
  switch (ch) {
    case "n": return "\n";
    case "t": return "\t";
    case "r": return "\r";
    case "\\": return "\\";
    case "'": return "'";
    case '"': return '"';
    default: return "\\" + ch;
  }
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const indentStack = [0];
  let bracketDepth = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    let rawLine = lines[lineIdx];
    const lineNum = lineIdx + 1;

    let pos = 0;
    if (bracketDepth === 0) {
      let indent = 0;
      while (pos < rawLine.length && (rawLine[pos] === " " || rawLine[pos] === "\t")) {
        indent += rawLine[pos] === "\t" ? 4 : 1;
        pos++;
      }
      if (pos >= rawLine.length || rawLine[pos] === "#") {
        continue;
      }
      const currentIndent = indentStack[indentStack.length - 1];
      if (indent > currentIndent) {
        indentStack.push(indent);
        tokens.push({ type: "INDENT", value: indent, line: lineNum });
      } else if (indent < currentIndent) {
        while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
          indentStack.pop();
          tokens.push({ type: "DEDENT", value: indent, line: lineNum });
        }
        if (indent !== indentStack[indentStack.length - 1]) {
          throw new PyException(
            "IndentationError",
            "unindent does not match any outer indentation level",
            lineNum
          );
        }
      }
    }

    while (pos < rawLine.length) {
      const ch = rawLine[pos];

      if (ch === " " || ch === "\t") {
        pos++;
        continue;
      }
      if (ch === "#") {
        break;
      }

      const isFString =
        (ch === "f" || ch === "F") &&
        pos + 1 < rawLine.length &&
        (rawLine[pos + 1] === '"' || rawLine[pos + 1] === "'");

      if (isFString || ch === '"' || ch === "'") {
        let prefixF = false;
        if (isFString) {
          prefixF = true;
          pos++;
        }
        const quote = rawLine[pos];
        const isTriple = rawLine.slice(pos, pos + 3) === quote.repeat(3);

        if (isTriple) {
          pos += 3;
          let buf = "";
          let closed = false;
          while (!closed) {
            while (pos < lines[lineIdx].length) {
              if (lines[lineIdx].slice(pos, pos + 3) === quote.repeat(3)) {
                pos += 3;
                closed = true;
                break;
              }
              if (lines[lineIdx][pos] === "\\" && pos + 1 < lines[lineIdx].length) {
                buf += parseEscape(lines[lineIdx][pos + 1]);
                pos += 2;
              } else {
                buf += lines[lineIdx][pos];
                pos++;
              }
            }
            if (!closed) {
              buf += "\n";
              lineIdx++;
              if (lineIdx >= lines.length) {
                throw new PyException("SyntaxError", "unterminated triple-quoted string literal", lineNum);
              }
              pos = 0;
            }
          }
          tokens.push({ type: prefixF ? "FSTRING" : "STRING", value: buf, line: lineNum });
          rawLine = lines[lineIdx];
          continue;
        } else {
          pos++;
          let buf = "";
          let closed = false;
          while (pos < rawLine.length) {
            const c = rawLine[pos];
            if (c === quote) {
              pos++;
              closed = true;
              break;
            }
            if (c === "\\") {
              if (pos + 1 >= rawLine.length) {
                throw new PyException("SyntaxError", "unterminated string literal", lineNum);
              }
              buf += parseEscape(rawLine[pos + 1]);
              pos += 2;
            } else {
              buf += c;
              pos++;
            }
          }
          if (!closed) {
            throw new PyException("SyntaxError", "unterminated string literal", lineNum);
          }
          tokens.push({ type: prefixF ? "FSTRING" : "STRING", value: buf, line: lineNum });
          continue;
        }
      }

      if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(rawLine[pos + 1] || ""))) {
        let numStr = "";
        let isFloatLit = false;
        while (pos < rawLine.length && /[0-9_]/.test(rawLine[pos])) {
          if (rawLine[pos] !== "_") numStr += rawLine[pos];
          pos++;
        }
        if (rawLine[pos] === "." && /[0-9]/.test(rawLine[pos + 1] || "")) {
          isFloatLit = true;
          numStr += ".";
          pos++;
          while (pos < rawLine.length && /[0-9_]/.test(rawLine[pos])) {
            if (rawLine[pos] !== "_") numStr += rawLine[pos];
            pos++;
          }
        } else if (rawLine[pos] === "." && !/[a-zA-Z_]/.test(rawLine[pos + 1] || "")) {
          isFloatLit = true;
          numStr += ".";
          pos++;
        }
        if ((rawLine[pos] === "e" || rawLine[pos] === "E") && /[0-9+\-]/.test(rawLine[pos + 1] || "")) {
          isFloatLit = true;
          numStr += rawLine[pos++];
          if (rawLine[pos] === "+" || rawLine[pos] === "-") numStr += rawLine[pos++];
          while (pos < rawLine.length && /[0-9]/.test(rawLine[pos])) numStr += rawLine[pos++];
        }
        tokens.push({
          type: isFloatLit ? "FLOAT" : "INT",
          value: isFloatLit ? Number(numStr) : parseInt(numStr, 10),
          line: lineNum,
        });
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        let ident = "";
        while (pos < rawLine.length && /[a-zA-Z0-9_]/.test(rawLine[pos])) {
          ident += rawLine[pos++];
        }
        tokens.push({
          type: KEYWORDS.has(ident) ? "KEYWORD" : "IDENT",
          value: ident,
          line: lineNum,
        });
        continue;
      }

      let matchedOp: string | null = null;
      for (const op of MULTI_OPS) {
        if (rawLine.startsWith(op, pos)) {
          matchedOp = op;
          break;
        }
      }
      if (matchedOp) {
        tokens.push({ type: "OP", value: matchedOp, line: lineNum });
        pos += matchedOp.length;
        continue;
      }

      if ("()[]{}".includes(ch)) {
        if ("([{".includes(ch)) bracketDepth++;
        else bracketDepth = Math.max(0, bracketDepth - 1);
        tokens.push({ type: "PUNCT", value: ch, line: lineNum });
        pos++;
        continue;
      }
      if (",:.;@".includes(ch)) {
        tokens.push({ type: "PUNCT", value: ch, line: lineNum });
        pos++;
        continue;
      }
      if ("+-*/%<>=!&|^~".includes(ch)) {
        tokens.push({ type: "OP", value: ch, line: lineNum });
        pos++;
        continue;
      }

      throw new PyException("SyntaxError", `unexpected character '${ch}'`, lineNum);
    }

    if (bracketDepth === 0 && tokens.length > 0 && tokens[tokens.length - 1].type !== "NEWLINE") {
      tokens.push({ type: "NEWLINE", value: "\n", line: lineNum });
    }
  }

  if (tokens.length > 0 && tokens[tokens.length - 1].type !== "NEWLINE") {
    tokens.push({ type: "NEWLINE", value: "\n", line: lines.length });
  }
  while (indentStack.length > 1) {
    indentStack.pop();
    tokens.push({ type: "DEDENT", value: 0, line: lines.length });
  }
  tokens.push({ type: "EOF", value: null, line: lines.length });
  return tokens;
}

/* -------------------- AST & Parser -------------------- */

type ExprNode =
  | { type: "Lit"; value: PyValue; line: number }
  | { type: "FString"; raw: string; line: number }
  | { type: "Ident"; name: string; line: number }
  | { type: "TupleLit"; items: ExprNode[]; line: number }
  | { type: "ListLit"; items: ExprNode[]; line: number }
  | { type: "SetLit"; items: ExprNode[]; line: number }
  | { type: "DictLit"; pairs: Array<[ExprNode, ExprNode]>; line: number }
  | { type: "ListComp"; expr: ExprNode; targets: string[]; iter: ExprNode; cond: ExprNode | null; line: number }
  | { type: "Ternary"; body: ExprNode; test: ExprNode; orelse: ExprNode; line: number }
  | { type: "BoolOp"; op: "and" | "or"; left: ExprNode; right: ExprNode; line: number }
  | { type: "Unary"; op: string; arg: ExprNode; line: number }
  | { type: "BinOp"; op: string; left: ExprNode; right: ExprNode; line: number }
  | { type: "Compare"; left: ExprNode; ops: string[]; comparators: ExprNode[]; line: number }
  | { type: "Attr"; target: ExprNode; attr: string; line: number }
  | { type: "Call"; callee: ExprNode; args: ExprNode[]; kwargs: Array<{ name: string; value: ExprNode }>; line: number }
  | { type: "Subscript"; target: ExprNode; index: ExprNode; line: number }
  | { type: "Slice"; target: ExprNode; start: ExprNode | null; stop: ExprNode | null; step: ExprNode | null; line: number };

type StmtNode =
  | { type: "Pass"; line: number }
  | { type: "Break"; line: number }
  | { type: "Continue"; line: number }
  | { type: "Return"; value: ExprNode | null; line: number }
  | { type: "Raise"; expr: ExprNode | null; line: number }
  | { type: "Import"; module: string; alias: string; line: number }
  | { type: "FromImport"; module: string; names: Array<{ name: string; alias: string }>; line: number }
  | { type: "ExprStmt"; expr: ExprNode; line: number }
  | { type: "Assign"; targets: ExprNode[]; value: ExprNode; line: number }
  | { type: "AugAssign"; target: ExprNode; op: string; value: ExprNode; line: number }
  | { type: "If"; test: ExprNode; body: StmtNode[]; elifs: Array<{ test: ExprNode; body: StmtNode[]; line: number }>; orelse: StmtNode[]; line: number }
  | { type: "While"; test: ExprNode; body: StmtNode[]; line: number }
  | { type: "For"; targets: string[]; iter: ExprNode; body: StmtNode[]; line: number }
  | { type: "Def"; name: string; params: Array<{ name: string; defaultExpr: ExprNode | null }>; body: StmtNode[]; line: number }
  | { type: "Class"; name: string; baseName: string | null; body: StmtNode[]; line: number }
  | { type: "Try"; body: StmtNode[]; handlers: Array<{ excType: string | null; excAlias: string | null; body: StmtNode[] }>; finallyBody: StmtNode[]; line: number };

function parse(tokens: Token[]): { type: "Program"; body: StmtNode[] } {
  let idx = 0;

  function peek(offset = 0): Token {
    return tokens[Math.min(idx + offset, tokens.length - 1)];
  }

  function advance(): Token {
    const tok = tokens[idx];
    if (tok.type !== "EOF") idx++;
    return tok;
  }

  function match(type: TokenType, value: string | null = null): boolean {
    const t = peek();
    if (t.type !== type) return false;
    if (value !== null && t.value !== value) return false;
    advance();
    return true;
  }

  function expect(type: TokenType, value: string | null = null, msg: string | null = null): Token {
    const t = peek();
    if (t.type !== type || (value !== null && t.value !== value)) {
      throw new PyException(
        "SyntaxError",
        msg || `expected ${value || type}, got '${t.value || t.type}'`,
        t.line
      );
    }
    return advance();
  }

  function skipNewlines(): void {
    while (peek().type === "NEWLINE") advance();
  }

  function parseProgram(): { type: "Program"; body: StmtNode[] } {
    const body: StmtNode[] = [];
    skipNewlines();
    while (peek().type !== "EOF") {
      body.push(parseStatement());
      skipNewlines();
    }
    return { type: "Program", body };
  }

  function parseBlock(): StmtNode[] {
    expect("PUNCT", ":", "expected ':' before block");
    if (peek().type !== "NEWLINE") {
      return [parseSimpleStatement()];
    }
    expect("NEWLINE");
    expect("INDENT", null, "expected an indented block");
    const stmts: StmtNode[] = [];
    while (peek().type !== "DEDENT" && peek().type !== "EOF") {
      skipNewlines();
      if (peek().type === "DEDENT" || peek().type === "EOF") break;
      stmts.push(parseStatement());
      skipNewlines();
    }
    expect("DEDENT");
    return stmts;
  }

  function parseStatement(): StmtNode {
    const t = peek();
    if (t.type === "KEYWORD") {
      if (t.value === "if") return parseIf();
      if (t.value === "while") return parseWhile();
      if (t.value === "for") return parseFor();
      if (t.value === "def") return parseDef();
      if (t.value === "class") return parseClass();
      if (t.value === "try") return parseTry();
    }
    return parseSimpleStatement();
  }

  function parseSimpleStatement(): StmtNode {
    const t = peek();
    let stmt: StmtNode | null = null;
    if (t.type === "KEYWORD") {
      if (t.value === "pass") {
        advance();
        stmt = { type: "Pass", line: t.line };
      } else if (t.value === "break") {
        advance();
        stmt = { type: "Break", line: t.line };
      } else if (t.value === "continue") {
        advance();
        stmt = { type: "Continue", line: t.line };
      } else if (t.value === "return") {
        advance();
        let value: ExprNode | null = null;
        if (peek().type !== "NEWLINE" && peek().type !== "EOF" && peek().type !== "DEDENT") {
          value = parseTupleOrExpr();
        }
        stmt = { type: "Return", value, line: t.line };
      } else if (t.value === "raise") {
        advance();
        let expr: ExprNode | null = null;
        if (peek().type !== "NEWLINE" && peek().type !== "EOF" && peek().type !== "DEDENT") {
          expr = parseExpr();
        }
        stmt = { type: "Raise", expr, line: t.line };
      } else if (t.value === "import") {
        advance();
        const modName = String(expect("IDENT", null, "expected module name").value);
        let alias = modName;
        if (match("KEYWORD", "as")) {
          alias = String(expect("IDENT", null, "expected alias name").value);
        }
        stmt = { type: "Import", module: modName, alias, line: t.line };
      } else if (t.value === "from") {
        advance();
        const modName = String(expect("IDENT", null, "expected module name").value);
        expect("KEYWORD", "import");
        const names: Array<{ name: string; alias: string }> = [];
        do {
          const name = String(expect("IDENT").value);
          let alias = name;
          if (match("KEYWORD", "as")) alias = String(expect("IDENT").value);
          names.push({ name, alias });
        } while (match("PUNCT", ","));
        stmt = { type: "FromImport", module: modName, names, line: t.line };
      }
    }

    if (!stmt) {
      stmt = parseAssignOrExpr();
    }
    if (peek().type === "NEWLINE") advance();
    return stmt;
  }

  function parseAssignOrExpr(): StmtNode {
    const startLine = peek().line;
    const first = parseTupleOrExpr();

    const next = peek();
    if (next.type === "OP" && ["+=", "-=", "*=", "/=", "//=", "%="].includes(String(next.value))) {
      const op = String(advance().value);
      const rhs = parseTupleOrExpr();
      return { type: "AugAssign", target: first, op, value: rhs, line: startLine };
    }

    if (next.type === "OP" && next.value === "=") {
      const targets = [first];
      while (match("OP", "=")) {
        targets.push(parseTupleOrExpr());
      }
      const value = targets.pop()!;
      return { type: "Assign", targets, value, line: startLine };
    }

    return { type: "ExprStmt", expr: first, line: startLine };
  }

  function parseIf(): StmtNode {
    const line = advance().line;
    const test = parseExpr();
    const body = parseBlock();
    const elifs: Array<{ test: ExprNode; body: StmtNode[]; line: number }> = [];
    let orelse: StmtNode[] = [];
    skipNewlines();
    while (peek().type === "KEYWORD" && peek().value === "elif") {
      const eLine = advance().line;
      const eTest = parseExpr();
      const eBody = parseBlock();
      elifs.push({ test: eTest, body: eBody, line: eLine });
      skipNewlines();
    }
    if (peek().type === "KEYWORD" && peek().value === "else") {
      advance();
      orelse = parseBlock();
    }
    return { type: "If", test, body, elifs, orelse, line };
  }

  function parseWhile(): StmtNode {
    const line = advance().line;
    const test = parseExpr();
    const body = parseBlock();
    return { type: "While", test, body, line };
  }

  function parseFor(): StmtNode {
    const line = advance().line;
    const targets = [String(expect("IDENT", null, "expected loop variable").value)];
    while (match("PUNCT", ",")) {
      targets.push(String(expect("IDENT", null, "expected loop variable").value));
    }
    expect("KEYWORD", "in");
    const iter = parseTupleOrExpr();
    const body = parseBlock();
    return { type: "For", targets, iter, body, line };
  }

  function parseDef(): StmtNode {
    const line = advance().line;
    const name = String(expect("IDENT", null, "expected function name").value);
    expect("PUNCT", "(");
    const params: Array<{ name: string; defaultExpr: ExprNode | null }> = [];
    while (peek().type !== "PUNCT" || peek().value !== ")") {
      const pName = String(expect("IDENT", null, "expected parameter name").value);
      let defaultExpr: ExprNode | null = null;
      if (match("OP", "=")) {
        defaultExpr = parseExpr();
      }
      params.push({ name: pName, defaultExpr });
      if (!match("PUNCT", ",")) break;
    }
    expect("PUNCT", ")");
    const body = parseBlock();
    return { type: "Def", name, params, body, line };
  }

  function parseClass(): StmtNode {
    const line = advance().line;
    const name = String(expect("IDENT", null, "expected class name").value);
    let baseName: string | null = null;
    if (match("PUNCT", "(")) {
      if (peek().type !== "PUNCT" || peek().value !== ")") {
        baseName = String(expect("IDENT", null, "expected base class name").value);
      }
      expect("PUNCT", ")");
    }
    const body = parseBlock();
    return { type: "Class", name, baseName, body, line };
  }

  function parseTry(): StmtNode {
    const line = advance().line;
    const body = parseBlock();
    const handlers: Array<{ excType: string | null; excAlias: string | null; body: StmtNode[] }> = [];
    let finallyBody: StmtNode[] = [];
    skipNewlines();
    while (peek().type === "KEYWORD" && peek().value === "except") {
      advance();
      let excType: string | null = null;
      let excAlias: string | null = null;
      if (peek().type !== "PUNCT" || peek().value !== ":") {
        excType = String(expect("IDENT").value);
        if (match("KEYWORD", "as")) {
          excAlias = String(expect("IDENT").value);
        }
      }
      const hBody = parseBlock();
      handlers.push({ excType, excAlias, body: hBody });
      skipNewlines();
    }
    if (peek().type === "KEYWORD" && peek().value === "finally") {
      advance();
      finallyBody = parseBlock();
    }
    return { type: "Try", body, handlers, finallyBody, line };
  }

  function parseTupleOrExpr(): ExprNode {
    const first = parseExpr();
    if (!match("PUNCT", ",")) return first;
    const items = [first];
    while (
      peek().type !== "NEWLINE" &&
      peek().type !== "EOF" &&
      peek().type !== "DEDENT" &&
      !(peek().type === "OP" && ["=", "+=", "-=", "*=", "/=", "//=", "%="].includes(String(peek().value))) &&
      !(peek().type === "KEYWORD" && peek().value === "in")
    ) {
      items.push(parseExpr());
      if (!match("PUNCT", ",")) break;
    }
    return { type: "TupleLit", items, line: first.line };
  }

  function parseExpr(): ExprNode {
    const expr = parseOr();
    if (peek().type === "KEYWORD" && peek().value === "if") {
      advance();
      const test = parseOr();
      expect("KEYWORD", "else");
      const orelse = parseExpr();
      return { type: "Ternary", body: expr, test, orelse, line: expr.line };
    }
    return expr;
  }

  function parseOr(): ExprNode {
    let left = parseAnd();
    while (match("KEYWORD", "or")) {
      const right = parseAnd();
      left = { type: "BoolOp", op: "or", left, right, line: left.line };
    }
    return left;
  }

  function parseAnd(): ExprNode {
    let left = parseNot();
    while (match("KEYWORD", "and")) {
      const right = parseNot();
      left = { type: "BoolOp", op: "and", left, right, line: left.line };
    }
    return left;
  }

  function parseNot(): ExprNode {
    if (peek().type === "KEYWORD" && peek().value === "not") {
      const line = advance().line;
      return { type: "Unary", op: "not", arg: parseNot(), line };
    }
    return parseComparison();
  }

  function parseComparison(): ExprNode {
    const left = parseAddSub();
    const ops: string[] = [];
    const comparators: ExprNode[] = [];

    while (true) {
      const t = peek();
      if (t.type === "OP" && ["==", "!=", "<", "<=", ">", ">="].includes(String(t.value))) {
        ops.push(String(advance().value));
        comparators.push(parseAddSub());
      } else if (t.type === "KEYWORD" && t.value === "in") {
        advance();
        ops.push("in");
        comparators.push(parseAddSub());
      } else if (t.type === "KEYWORD" && t.value === "not" && peek(1).type === "KEYWORD" && peek(1).value === "in") {
        advance();
        advance();
        ops.push("not in");
        comparators.push(parseAddSub());
      } else if (t.type === "KEYWORD" && t.value === "is") {
        advance();
        ops.push(match("KEYWORD", "not") ? "is not" : "is");
        comparators.push(parseAddSub());
      } else {
        break;
      }
    }

    if (ops.length === 0) return left;
    return { type: "Compare", left, ops, comparators, line: left.line };
  }

  function parseAddSub(): ExprNode {
    let left = parseMulDiv();
    while (peek().type === "OP" && (peek().value === "+" || peek().value === "-")) {
      const op = String(advance().value);
      const right = parseMulDiv();
      left = { type: "BinOp", op, left, right, line: left.line };
    }
    return left;
  }

  function parseMulDiv(): ExprNode {
    let left = parseUnary();
    while (peek().type === "OP" && ["*", "/", "//", "%"].includes(String(peek().value))) {
      const op = String(advance().value);
      const right = parseUnary();
      left = { type: "BinOp", op, left, right, line: left.line };
    }
    return left;
  }

  function parseUnary(): ExprNode {
    if (peek().type === "OP" && (peek().value === "-" || peek().value === "+")) {
      const tok = advance();
      return { type: "Unary", op: String(tok.value), arg: parseUnary(), line: tok.line };
    }
    return parsePower();
  }

  function parsePower(): ExprNode {
    const base = parsePostfix();
    if (match("OP", "**")) {
      const exp = parseUnary();
      return { type: "BinOp", op: "**", left: base, right: exp, line: base.line };
    }
    return base;
  }

  function parsePostfix(): ExprNode {
    let expr = parsePrimary();
    while (true) {
      if (match("PUNCT", "(")) {
        const args: ExprNode[] = [];
        const kwargs: Array<{ name: string; value: ExprNode }> = [];
        while (!(peek().type === "PUNCT" && peek().value === ")")) {
          if (peek().type === "IDENT" && peek(1).type === "OP" && peek(1).value === "=") {
            const kwName = String(advance().value);
            advance();
            kwargs.push({ name: kwName, value: parseExpr() });
          } else {
            args.push(parseExpr());
          }
          if (!match("PUNCT", ",")) break;
        }
        expect("PUNCT", ")");
        expr = { type: "Call", callee: expr, args, kwargs, line: expr.line };
      } else if (match("PUNCT", "[")) {
        let start: ExprNode | null = null;
        let stop: ExprNode | null = null;
        let step: ExprNode | null = null;
        let isSlice = false;

        if (!(peek().type === "PUNCT" && peek().value === ":")) {
          start = parseExpr();
        }
        if (match("PUNCT", ":")) {
          isSlice = true;
          if (!(peek().type === "PUNCT" && (peek().value === ":" || peek().value === "]"))) {
            stop = parseExpr();
          }
          if (match("PUNCT", ":")) {
            if (!(peek().type === "PUNCT" && peek().value === "]")) {
              step = parseExpr();
            }
          }
        }
        expect("PUNCT", "]");
        if (isSlice) {
          expr = { type: "Slice", target: expr, start, stop, step, line: expr.line };
        } else {
          expr = { type: "Subscript", target: expr, index: start!, line: expr.line };
        }
      } else if (match("PUNCT", ".")) {
        const attr = String(expect("IDENT", null, "expected attribute name").value);
        expr = { type: "Attr", target: expr, attr, line: expr.line };
      } else {
        break;
      }
    }
    return expr;
  }

  function parsePrimary(): ExprNode {
    const t = peek();
    if (t.type === "INT") {
      advance();
      return { type: "Lit", value: Number(t.value), line: t.line };
    }
    if (t.type === "FLOAT") {
      advance();
      return { type: "Lit", value: new PyFloat(Number(t.value)), line: t.line };
    }
    if (t.type === "STRING") {
      advance();
      return { type: "Lit", value: String(t.value), line: t.line };
    }
    if (t.type === "FSTRING") {
      advance();
      return { type: "FString", raw: String(t.value), line: t.line };
    }
    if (t.type === "KEYWORD") {
      if (t.value === "True") { advance(); return { type: "Lit", value: true, line: t.line }; }
      if (t.value === "False") { advance(); return { type: "Lit", value: false, line: t.line }; }
      if (t.value === "None") { advance(); return { type: "Lit", value: null, line: t.line }; }
    }
    if (t.type === "IDENT") {
      advance();
      return { type: "Ident", name: String(t.value), line: t.line };
    }

    if (match("PUNCT", "(")) {
      if (match("PUNCT", ")")) return { type: "TupleLit", items: [], line: t.line };
      const first = parseExpr();
      if (match("PUNCT", ",")) {
        const items = [first];
        while (!(peek().type === "PUNCT" && peek().value === ")")) {
          items.push(parseExpr());
          if (!match("PUNCT", ",")) break;
        }
        expect("PUNCT", ")");
        return { type: "TupleLit", items, line: t.line };
      }
      expect("PUNCT", ")");
      return first;
    }

    if (match("PUNCT", "[")) {
      if (match("PUNCT", "]")) return { type: "ListLit", items: [], line: t.line };
      const first = parseExpr();
      if (match("KEYWORD", "for")) {
        const targets = [String(expect("IDENT").value)];
        while (match("PUNCT", ",")) targets.push(String(expect("IDENT").value));
        expect("KEYWORD", "in");
        const iter = parseOr();
        let cond: ExprNode | null = null;
        if (match("KEYWORD", "if")) {
          cond = parseExpr();
        }
        expect("PUNCT", "]");
        return { type: "ListComp", expr: first, targets, iter, cond, line: t.line };
      }
      const items = [first];
      while (match("PUNCT", ",")) {
        if (peek().type === "PUNCT" && peek().value === "]") break;
        items.push(parseExpr());
      }
      expect("PUNCT", "]");
      return { type: "ListLit", items, line: t.line };
    }

    if (match("PUNCT", "{")) {
      if (match("PUNCT", "}")) return { type: "DictLit", pairs: [], line: t.line };
      const first = parseExpr();
      if (match("PUNCT", ":")) {
        const firstVal = parseExpr();
        const pairs: Array<[ExprNode, ExprNode]> = [[first, firstVal]];
        while (match("PUNCT", ",")) {
          if (peek().type === "PUNCT" && peek().value === "}") break;
          const k = parseExpr();
          expect("PUNCT", ":");
          const v = parseExpr();
          pairs.push([k, v]);
        }
        expect("PUNCT", "}");
        return { type: "DictLit", pairs, line: t.line };
      } else {
        const items = [first];
        while (match("PUNCT", ",")) {
          if (peek().type === "PUNCT" && peek().value === "}") break;
          items.push(parseExpr());
        }
        expect("PUNCT", "}");
        return { type: "SetLit", items, line: t.line };
      }
    }

    throw new PyException("SyntaxError", `unexpected token '${t.value || t.type}'`, t.line);
  }

  return parseProgram();
}

/* -------------------- Interpreter -------------------- */

class Env {
  vars: Map<string, PyValue>;
  parent: Env | null;
  constructor(parent: Env | null = null) {
    this.vars = new Map();
    this.parent = parent;
  }
  get(name: string): PyValue {
    if (this.vars.has(name)) return this.vars.get(name)!;
    if (this.parent) return this.parent.get(name);
    throw new PyException("NameError", `name '${name}' is not defined`);
  }
  set(name: string, val: PyValue): void {
    this.vars.set(name, val);
  }
  snapshot(): Record<string, string> {
    const out: Record<string, string> = this.parent ? this.parent.snapshot() : {};
    for (const [k, v] of this.vars.entries()) {
      if (isPyFunc(v) || isPyModule(v) || isPyTypeObj(v) || v instanceof PyClass) continue;
      if (v instanceof PyInstance) {
        const fields = Array.from(v.attrs.entries())
          .map(([fk, fv]) => `${fk}=${pyRepr(fv)}`)
          .join(", ");
        out[k] = `${v.cls.name}(${fields})`;
      } else {
        out[k] = pyRepr(v);
      }
    }
    return out;
  }
}

function mkBuiltin(
  name: string,
  fn: (args: PyValue[], kwargs?: Record<string, PyValue>) => PyValue,
  typeObjName: string | null = null
): PyCallable {
  const obj: PyCallable = { __pyFunc: true, __pyBuiltin: true, name, fn };
  if (typeObjName) obj.__pyTypeObj = typeObjName;
  return obj;
}

function createModules(): Record<string, PyModule> {
  const mathMod: PyModule = {
    __pyModule: true,
    name: "math",
    attrs: {
      pi: new PyFloat(Math.PI),
      e: new PyFloat(Math.E),
      sqrt: mkBuiltin("sqrt", ([x]) => new PyFloat(Math.sqrt(toNumber(x)))),
      floor: mkBuiltin("floor", ([x]) => Math.floor(toNumber(x))),
      ceil: mkBuiltin("ceil", ([x]) => Math.ceil(toNumber(x))),
      pow: mkBuiltin("pow", ([a, b]) => new PyFloat(Math.pow(toNumber(a), toNumber(b)))),
      fabs: mkBuiltin("fabs", ([x]) => new PyFloat(Math.abs(toNumber(x)))),
    },
  };
  const randomMod: PyModule = {
    __pyModule: true,
    name: "random",
    attrs: {
      randint: mkBuiltin("randint", ([a, b]) => {
        const lo = Math.trunc(toNumber(a));
        const hi = Math.trunc(toNumber(b));
        return Math.floor(Math.random() * (hi - lo + 1)) + lo;
      }),
      random: mkBuiltin("random", () => new PyFloat(Math.random())),
      choice: mkBuiltin("choice", ([seq]) => {
        const arr = toIterable(seq);
        if (arr.length === 0) throw new PyException("IndexError", "cannot choose from an empty sequence");
        return arr[Math.floor(Math.random() * arr.length)];
      }),
    },
  };
  return { math: mathMod, random: randomMod };
}

function formatSpec(val: PyValue, spec: string): string {
  if (!spec) return pyStr(val);
  const m = spec.match(/^([<>^])?(\d+)?(?:\.(\d+))?([fds%])?$/);
  if (!m) return pyStr(val);
  const [, align, widthStr, precStr, kind] = m;
  let out: string;
  if (kind === "f") {
    const prec = precStr !== undefined ? parseInt(precStr, 10) : 6;
    out = toNumber(val).toFixed(prec);
  } else if (kind === "%") {
    const prec = precStr !== undefined ? parseInt(precStr, 10) : 6;
    out = `${(toNumber(val) * 100).toFixed(prec)}%`;
  } else if (kind === "d") {
    out = String(Math.trunc(toNumber(val)));
  } else {
    out = pyStr(val);
  }
  if (widthStr) {
    const w = parseInt(widthStr, 10);
    if (out.length < w) {
      const pad = " ".repeat(w - out.length);
      if (align === "<") out = out + pad;
      else if (align === "^") {
        const left = Math.floor(pad.length / 2);
        out = " ".repeat(left) + out + " ".repeat(pad.length - left);
      } else {
        out = pad + out;
      }
    }
  }
  return out;
}

export function runPython(source: string, options: PyRunOptions = {}): PyRunResult {
  const output: string[] = [];
  const trace: PyTraceStep[] = [];
  const maxSteps = options.maxSteps || 10000;
  const presetInputs = Array.isArray(options.inputs) ? options.inputs.slice() : [];
  const onInput = options.onInput || null;
  const modules = createModules();
  const methodStack: Array<{ selfInstance: PyInstance; ownerClass: PyClass }> = [];
  let steps = 0;

  const globalEnv = new Env(null);

  function formatValueStr(v: PyValue): string {
    if (v instanceof PyInstance) {
      const dunder = v.cls.lookupMethod("__str__");
      if (dunder) {
        const res = invokeCallable(
          { ...dunder.fn, boundSelf: v, ownerClass: dunder.owner },
          [],
          {}
        );
        return pyStr(res);
      }
    }
    return pyStr(v);
  }

  const builtins: Record<string, PyValue> = {
    print: mkBuiltin("print", (args, kwargs) => {
      const sep = kwargs && kwargs.sep !== undefined ? formatValueStr(kwargs.sep) : " ";
      const end = kwargs && kwargs.end !== undefined ? formatValueStr(kwargs.end) : "\n";
      output.push(args.map((a) => formatValueStr(a)).join(sep) + end);
      return null;
    }),
    input: mkBuiltin("input", (args) => {
      const promptText = args.length > 0 ? pyStr(args[0]) : "";
      if (presetInputs.length > 0) {
        const nextVal = String(presetInputs.shift());
        if (promptText) output.push(`${promptText}${nextVal}\n`);
        return nextVal;
      }
      if (onInput) {
        const res = onInput(promptText);
        const strRes = res === null || res === undefined ? "" : String(res);
        if (promptText) output.push(`${promptText}${strRes}\n`);
        return strRes;
      }
      if (typeof window !== "undefined" && typeof window.prompt === "function") {
        const res = window.prompt(promptText || "Python input():") || "";
        if (promptText) output.push(`${promptText}${res}\n`);
        return res;
      }
      return "";
    }),
    len: mkBuiltin("len", ([obj]) => {
      if (typeof obj === "string" || Array.isArray(obj)) return obj.length;
      if (obj instanceof PyTuple) return obj.items.length;
      if (obj instanceof PyDict || obj instanceof PySet) return obj.size;
      throw new PyException("TypeError", `object of type '${pyTypeName(obj)}' has no len()`);
    }),
    type: mkBuiltin("type", ([obj]) => ({ __pyTypeObj: pyTypeName(obj) })),
    int: mkBuiltin(
      "int",
      ([obj = 0]) => {
        if (typeof obj === "number") return obj;
        if (typeof obj === "boolean") return obj ? 1 : 0;
        if (obj instanceof PyFloat) return Math.trunc(obj.value);
        if (typeof obj === "string") {
          const trimmed = obj.trim();
          if (!/^[+-]?\d+$/.test(trimmed)) {
            throw new PyException("ValueError", `invalid literal for int() with base 10: ${pyRepr(obj)}`);
          }
          return parseInt(trimmed, 10);
        }
        throw new PyException("TypeError", `int() argument must be a string or a number, not '${pyTypeName(obj)}'`);
      },
      "int"
    ),
    float: mkBuiltin(
      "float",
      ([obj = 0]) => {
        if (isNumeric(obj)) return new PyFloat(toNumber(obj));
        if (typeof obj === "string") {
          const n = Number(obj.trim());
          if (obj.trim() === "" || Number.isNaN(n)) {
            throw new PyException("ValueError", `could not convert string to float: ${pyRepr(obj)}`);
          }
          return new PyFloat(n);
        }
        throw new PyException("TypeError", "float() argument must be a string or a number");
      },
      "float"
    ),
    str: mkBuiltin("str", ([obj = ""]) => formatValueStr(obj), "str"),
    bool: mkBuiltin("bool", ([obj = false]) => pyTruthy(obj), "bool"),
    list: mkBuiltin("list", ([obj]) => (obj === undefined ? [] : toIterable(obj)), "list"),
    tuple: mkBuiltin("tuple", ([obj]) => new PyTuple(obj === undefined ? [] : toIterable(obj)), "tuple"),
    set: mkBuiltin("set", ([obj]) => new PySet(obj === undefined ? [] : toIterable(obj)), "set"),
    dict: mkBuiltin("dict", () => new PyDict(), "dict"),
    range: mkBuiltin("range", (args) => {
      let start = 0;
      let stop = 0;
      let step = 1;
      if (args.length === 1) stop = Math.trunc(toNumber(args[0]));
      else if (args.length === 2) {
        start = Math.trunc(toNumber(args[0]));
        stop = Math.trunc(toNumber(args[1]));
      } else if (args.length === 3) {
        start = Math.trunc(toNumber(args[0]));
        stop = Math.trunc(toNumber(args[1]));
        step = Math.trunc(toNumber(args[2]));
        if (step === 0) throw new PyException("ValueError", "range() arg 3 must not be zero");
      } else {
        throw new PyException("TypeError", `range expected at most 3 arguments, got ${args.length}`);
      }
      const res: number[] = [];
      if (step > 0) {
        for (let i = start; i < stop; i += step) {
          res.push(i);
          if (res.length > 5000) throw new PyException("MemoryError", "range() limit exceeded (5000)");
        }
      } else {
        for (let i = start; i > stop; i += step) {
          res.push(i);
          if (res.length > 5000) throw new PyException("MemoryError", "range() limit exceeded (5000)");
        }
      }
      return res;
    }),
    sum: mkBuiltin("sum", ([iter, start = 0]) => {
      const items = toIterable(iter);
      let acc = toNumber(start);
      let sawFloat = isFloat(start);
      for (const it of items) {
        if (isFloat(it)) sawFloat = true;
        acc += toNumber(it);
      }
      return sawFloat ? new PyFloat(acc) : acc;
    }),
    min: mkBuiltin("min", (args) => {
      const items = args.length === 1 ? toIterable(args[0]) : args;
      if (items.length === 0) throw new PyException("ValueError", "min() arg is an empty sequence");
      return items.reduce((best, cur) => (pyCompare(cur, best) < 0 ? cur : best));
    }),
    max: mkBuiltin("max", (args) => {
      const items = args.length === 1 ? toIterable(args[0]) : args;
      if (items.length === 0) throw new PyException("ValueError", "max() arg is an empty sequence");
      return items.reduce((best, cur) => (pyCompare(cur, best) > 0 ? cur : best));
    }),
    abs: mkBuiltin("abs", ([v]) => (isFloat(v) ? new PyFloat(Math.abs(v.value)) : Math.abs(toNumber(v)))),
    round: mkBuiltin("round", ([v, ndigits], kwargs) => {
      const n = toNumber(v);
      const digits = kwargs && kwargs.ndigits !== undefined ? kwargs.ndigits : ndigits;
      if (digits === undefined) return Math.round(n);
      const factor = Math.pow(10, Math.trunc(toNumber(digits)));
      return new PyFloat(Math.round(n * factor) / factor);
    }),
    sorted: mkBuiltin("sorted", ([iter], kwargs) => {
      const arr = toIterable(iter);
      const rev = kwargs && pyTruthy(kwargs.reverse);
      arr.sort((a, b) => pyCompare(a, b));
      if (rev) arr.reverse();
      return arr;
    }),
    enumerate: mkBuiltin("enumerate", ([iter, start = 0], kwargs) => {
      const items = toIterable(iter);
      const startVal = kwargs && kwargs.start !== undefined ? kwargs.start : start;
      const base = Math.trunc(toNumber(startVal));
      return items.map((val, idx) => new PyTuple([base + idx, val]));
    }),
    zip: mkBuiltin("zip", (args) => {
      const lists = args.map((a) => toIterable(a));
      if (lists.length === 0) return [];
      const minLen = Math.min(...lists.map((l) => l.length));
      const res: PyTuple[] = [];
      for (let i = 0; i < minLen; i++) {
        res.push(new PyTuple(lists.map((l) => l[i])));
      }
      return res;
    }),
    isinstance: mkBuiltin("isinstance", ([obj, typ]) => {
      if (obj instanceof PyInstance && typ instanceof PyClass) {
        let cur: PyClass | null = obj.cls;
        while (cur) {
          if (cur === typ) return true;
          cur = cur.base;
        }
        return false;
      }
      if (!isPyTypeObj(typ)) return false;
      const actual = pyTypeName(obj);
      if (actual === typ.__pyTypeObj) return true;
      if (typ.__pyTypeObj === "int" && actual === "bool") return true;
      return false;
    }),
    super: mkBuiltin("super", () => {
      const frame = methodStack[methodStack.length - 1];
      if (!frame || !frame.ownerClass.base) {
        throw new PyException("RuntimeError", "super(): no base class context available");
      }
      return new PySuper(frame.selfInstance, frame.ownerClass.base);
    }),
    ValueError: mkBuiltin("ValueError", ([m = ""]) => new PyException("ValueError", pyStr(m)), "ValueError"),
    TypeError: mkBuiltin("TypeError", ([m = ""]) => new PyException("TypeError", pyStr(m)), "TypeError"),
    ZeroDivisionError: mkBuiltin("ZeroDivisionError", ([m = ""]) => new PyException("ZeroDivisionError", pyStr(m)), "ZeroDivisionError"),
  };

  for (const [k, v] of Object.entries(builtins)) {
    globalEnv.set(k, v);
  }

  function stepTick(line: number): void {
    steps++;
    if (steps > maxSteps) {
      throw new PyException(
        "RuntimeLimit",
        `execution exceeded ${maxSteps} steps (possible infinite loop)`,
        line
      );
    }
  }

  function recordTrace(line: number, env: Env, note = ""): void {
    if (options.collectTrace && line) {
      trace.push({
        line,
        vars: env.snapshot(),
        outputSoFar: output.join(""),
        note,
      });
    }
  }

  function execBlock(stmts: StmtNode[], env: Env): void {
    for (const s of stmts) {
      execStmt(s, env);
    }
  }

  function assignTarget(targetNode: ExprNode, val: PyValue, env: Env): void {
    if (targetNode.type === "Ident") {
      env.set(targetNode.name, val);
    } else if (targetNode.type === "TupleLit" || targetNode.type === "ListLit") {
      const items = toIterable(val);
      if (items.length !== targetNode.items.length) {
        throw new PyException(
          "ValueError",
          `not enough/too many values to unpack (expected ${targetNode.items.length}, got ${items.length})`
        );
      }
      targetNode.items.forEach((t, i) => assignTarget(t, items[i], env));
    } else if (targetNode.type === "Subscript") {
      const obj = evalExpr(targetNode.target, env);
      const key = evalExpr(targetNode.index, env);
      if (Array.isArray(obj)) {
        let i = Math.trunc(toNumber(key));
        if (i < 0) i += obj.length;
        if (i < 0 || i >= obj.length) {
          throw new PyException("IndexError", "list assignment index out of range");
        }
        obj[i] = val;
      } else if (obj instanceof PyDict) {
        obj.set(key, val);
      } else {
        throw new PyException("TypeError", `'${pyTypeName(obj)}' object does not support item assignment`);
      }
    } else if (targetNode.type === "Attr") {
      const obj = evalExpr(targetNode.target, env);
      if (obj instanceof PyInstance || obj instanceof PyClass) {
        obj.attrs.set(targetNode.attr, val);
      } else {
        throw new PyException("AttributeError", `'${pyTypeName(obj)}' object has no attribute '${targetNode.attr}'`);
      }
    } else {
      throw new PyException("SyntaxError", "cannot assign to expression");
    }
  }

  function execStmt(stmt: StmtNode, env: Env): void {
    stepTick(stmt.line);
    try {
      switch (stmt.type) {
        case "Pass":
          recordTrace(stmt.line, env, "pass");
          return;
        case "Break":
          recordTrace(stmt.line, env, "break out of loop");
          throw new BreakSignal();
        case "Continue":
          recordTrace(stmt.line, env, "skip to next iteration");
          throw new ContinueSignal();
        case "Return": {
          const retVal = stmt.value ? evalExpr(stmt.value, env) : null;
          recordTrace(stmt.line, env, `return ${pyRepr(retVal)}`);
          throw new ReturnSignal(retVal);
        }
        case "Raise": {
          if (!stmt.expr) throw new PyException("RuntimeError", "No active exception to reraise", stmt.line);
          const exc = evalExpr(stmt.expr, env);
          if (exc instanceof PyException) throw exc;
          throw new PyException("Exception", pyStr(exc), stmt.line);
        }
        case "Import": {
          if (!modules[stmt.module]) {
            throw new PyException("ModuleNotFoundError", `No module named '${stmt.module}'`, stmt.line);
          }
          env.set(stmt.alias, modules[stmt.module]);
          recordTrace(stmt.line, env, `imported ${stmt.module}`);
          return;
        }
        case "FromImport": {
          const mod = modules[stmt.module];
          if (!mod) throw new PyException("ModuleNotFoundError", `No module named '${stmt.module}'`, stmt.line);
          for (const { name, alias } of stmt.names) {
            if (!(name in mod.attrs)) {
              throw new PyException("ImportError", `cannot import name '${name}' from '${stmt.module}'`, stmt.line);
            }
            env.set(alias, mod.attrs[name]);
          }
          recordTrace(stmt.line, env, `imported from ${stmt.module}`);
          return;
        }
        case "ExprStmt":
          evalExpr(stmt.expr, env);
          recordTrace(stmt.line, env);
          return;
        case "Assign": {
          const val = evalExpr(stmt.value, env);
          for (const t of stmt.targets) assignTarget(t, val, env);
          recordTrace(stmt.line, env);
          return;
        }
        case "AugAssign": {
          const opMap: Record<string, string> = {
            "+=": "+", "-=": "-", "*=": "*", "/=": "/", "//=": "//", "%=": "%",
          };
          const lhs = evalExpr(stmt.target, env);
          const rhs = evalExpr(stmt.value, env);
          const res = applyBinOp(opMap[stmt.op], lhs, rhs);
          assignTarget(stmt.target, res, env);
          recordTrace(stmt.line, env);
          return;
        }
        case "If": {
          const cond = pyTruthy(evalExpr(stmt.test, env));
          recordTrace(stmt.line, env, `if condition is ${cond ? "True" : "False"}`);
          if (cond) {
            execBlock(stmt.body, env);
            return;
          }
          for (const el of stmt.elifs) {
            stepTick(el.line);
            const eCond = pyTruthy(evalExpr(el.test, env));
            recordTrace(el.line, env, `elif condition is ${eCond ? "True" : "False"}`);
            if (eCond) {
              execBlock(el.body, env);
              return;
            }
          }
          if (stmt.orelse.length > 0) {
            recordTrace(stmt.orelse[0].line - 1 || stmt.line, env, "entered else branch");
            execBlock(stmt.orelse, env);
          }
          return;
        }
        case "While": {
          while (true) {
            stepTick(stmt.line);
            const cond = pyTruthy(evalExpr(stmt.test, env));
            recordTrace(stmt.line, env, `while condition is ${cond ? "True" : "False"}`);
            if (!cond) break;
            try {
              execBlock(stmt.body, env);
            } catch (sig) {
              if (sig instanceof ContinueSignal) continue;
              if (sig instanceof BreakSignal) break;
              throw sig;
            }
          }
          return;
        }
        case "For": {
          const items = toIterable(evalExpr(stmt.iter, env));
          for (const item of items) {
            stepTick(stmt.line);
            if (stmt.targets.length === 1) {
              env.set(stmt.targets[0], item);
            } else {
              const unpacked = toIterable(item);
              if (unpacked.length !== stmt.targets.length) {
                throw new PyException("ValueError", "cannot unpack loop item");
              }
              stmt.targets.forEach((name, idx) => env.set(name, unpacked[idx]));
            }
            recordTrace(stmt.line, env, `loop item = ${pyRepr(item)}`);
            try {
              execBlock(stmt.body, env);
            } catch (sig) {
              if (sig instanceof ContinueSignal) continue;
              if (sig instanceof BreakSignal) break;
              throw sig;
            }
          }
          return;
        }
        case "Def": {
          const fnObj: PyCallable = {
            __pyFunc: true,
            name: stmt.name,
            params: stmt.params,
            body: stmt.body,
            closure: env,
          };
          env.set(stmt.name, fnObj);
          recordTrace(stmt.line, env, `defined function ${stmt.name}()`);
          return;
        }
        case "Class": {
          let baseCls: PyClass | null = null;
          if (stmt.baseName) {
            const baseVal = env.get(stmt.baseName);
            if (!(baseVal instanceof PyClass)) {
              throw new PyException("TypeError", `'${stmt.baseName}' is not a class`, stmt.line);
            }
            baseCls = baseVal;
          }
          const cls = new PyClass(stmt.name, baseCls);
          const classEnv = new Env(env);
          execBlock(stmt.body, classEnv);
          for (const [k, v] of classEnv.vars.entries()) {
            if (isPyFunc(v)) {
              cls.methods.set(k, { ...v, ownerClass: cls });
            } else {
              cls.attrs.set(k, v);
            }
          }
          env.set(stmt.name, cls);
          recordTrace(stmt.line, env, `defined class ${stmt.name}`);
          return;
        }
        case "Try": {
          try {
            execBlock(stmt.body, env);
          } catch (err) {
            if (err instanceof PyException) {
              let handled = false;
              for (const h of stmt.handlers) {
                if (!h.excType || h.excType === "Exception" || h.excType === err.pyType) {
                  if (h.excAlias) env.set(h.excAlias, `${err.pyType}: ${err.pyMessage}`);
                  execBlock(h.body, env);
                  handled = true;
                  break;
                }
              }
              if (!handled) throw err;
            } else {
              throw err;
            }
          } finally {
            if (stmt.finallyBody.length > 0) {
              execBlock(stmt.finallyBody, env);
            }
          }
          return;
        }
      }
    } catch (e) {
      if (e instanceof PyException && e.line === null) {
        e.line = stmt.line;
      }
      throw e;
    }
  }

  function applyBinOp(op: string, a: PyValue, b: PyValue): PyValue {
    if (op === "+") {
      if (typeof a === "string" && typeof b === "string") return a + b;
      if (Array.isArray(a) && Array.isArray(b)) return a.concat(b);
      if (a instanceof PyTuple && b instanceof PyTuple) return new PyTuple(a.items.concat(b.items));
      if (isNumeric(a) && isNumeric(b)) {
        const sum = toNumber(a) + toNumber(b);
        return isFloat(a) || isFloat(b) ? new PyFloat(sum) : sum;
      }
    }
    if (op === "*") {
      if (typeof a === "string" && (isInt(b) || isBool(b))) return a.repeat(Math.max(0, toNumber(b)));
      if ((isInt(a) || isBool(a)) && typeof b === "string") return b.repeat(Math.max(0, toNumber(a)));
      if (Array.isArray(a) && (isInt(b) || isBool(b))) {
        const n = Math.max(0, toNumber(b));
        const res: PyValue[] = [];
        for (let i = 0; i < n; i++) res.push(...a);
        return res;
      }
      if (isNumeric(a) && isNumeric(b)) {
        const prod = toNumber(a) * toNumber(b);
        return isFloat(a) || isFloat(b) ? new PyFloat(prod) : prod;
      }
    }
    if (op === "-") {
      if (isNumeric(a) && isNumeric(b)) {
        const diff = toNumber(a) - toNumber(b);
        return isFloat(a) || isFloat(b) ? new PyFloat(diff) : diff;
      }
    }
    if (op === "/") {
      if (isNumeric(a) && isNumeric(b)) {
        const nb = toNumber(b);
        if (nb === 0) throw new PyException("ZeroDivisionError", "division by zero");
        return new PyFloat(toNumber(a) / nb);
      }
    }
    if (op === "//") {
      if (isNumeric(a) && isNumeric(b)) {
        const nb = toNumber(b);
        if (nb === 0) throw new PyException("ZeroDivisionError", "integer division or modulo by zero");
        const res = Math.floor(toNumber(a) / nb);
        return isFloat(a) || isFloat(b) ? new PyFloat(res) : res;
      }
    }
    if (op === "%") {
      if (typeof a === "string") return pyStr(b);
      if (isNumeric(a) && isNumeric(b)) {
        const na = toNumber(a);
        const nb = toNumber(b);
        if (nb === 0) throw new PyException("ZeroDivisionError", "integer division or modulo by zero");
        const res = ((na % nb) + nb) % nb;
        return isFloat(a) || isFloat(b) ? new PyFloat(res) : res;
      }
    }
    if (op === "**") {
      if (isNumeric(a) && isNumeric(b)) {
        const na = toNumber(a);
        const nb = toNumber(b);
        const res = Math.pow(na, nb);
        return isFloat(a) || isFloat(b) || nb < 0 ? new PyFloat(res) : res;
      }
    }
    throw new PyException(
      "TypeError",
      `unsupported operand type(s) for ${op}: '${pyTypeName(a)}' and '${pyTypeName(b)}'`
    );
  }

  function evalCompareOp(op: string, a: PyValue, b: PyValue): boolean {
    switch (op) {
      case "==": return pyEquals(a, b);
      case "!=": return !pyEquals(a, b);
      case "<": return pyCompare(a, b) < 0;
      case "<=": return pyCompare(a, b) <= 0;
      case ">": return pyCompare(a, b) > 0;
      case ">=": return pyCompare(a, b) >= 0;
      case "in": {
        if (typeof b === "string") {
          if (typeof a !== "string") throw new PyException("TypeError", "'in <string>' requires string as left operand");
          return b.includes(a);
        }
        if (b instanceof PyDict || b instanceof PySet) return b.has(a);
        return toIterable(b).some((item) => pyEquals(a, item));
      }
      case "not in": return !evalCompareOp("in", a, b);
      case "is": return a === b || (isNumeric(a) && isNumeric(b) && a === b);
      case "is not": return !evalCompareOp("is", a, b);
      default: return false;
    }
  }

  function callMethod(target: PyValue, attr: string, args: PyValue[], kwargs: Record<string, PyValue>): PyValue {
    if (isPyModule(target)) {
      const member = target.attrs[attr];
      if (!member) throw new PyException("AttributeError", `module '${target.name}' has no attribute '${attr}'`);
      return invokeCallable(member, args, kwargs);
    }
    if (typeof target === "string") {
      switch (attr) {
        case "upper": return target.toUpperCase();
        case "lower": return target.toLowerCase();
        case "title": return target.replace(/\b\w/g, (c) => c.toUpperCase());
        case "capitalize": return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase();
        case "strip": return target.trim();
        case "lstrip": return target.trimStart();
        case "rstrip": return target.trimEnd();
        case "split": return args.length ? target.split(pyStr(args[0])) : target.trim().split(/\s+/).filter(Boolean);
        case "join": return toIterable(args[0]).map((x) => pyStr(x)).join(target);
        case "replace": return target.split(pyStr(args[0])).join(pyStr(args[1]));
        case "startswith": return target.startsWith(pyStr(args[0]));
        case "endswith": return target.endsWith(pyStr(args[0]));
        case "find": return target.indexOf(pyStr(args[0]));
        case "isdigit": return /^\d+$/.test(target);
        case "isalpha": return /^[a-zA-Z]+$/.test(target);
        case "count": {
          const sub = pyStr(args[0]);
          if (!sub) return target.length + 1;
          return target.split(sub).length - 1;
        }
      }
    }
    if (Array.isArray(target)) {
      switch (attr) {
        case "append": target.push(args[0]); return null;
        case "extend": target.push(...toIterable(args[0])); return null;
        case "insert": {
          let i = Math.trunc(toNumber(args[0]));
          if (i < 0) i = Math.max(0, target.length + i);
          target.splice(i, 0, args[1]);
          return null;
        }
        case "pop": {
          if (target.length === 0) throw new PyException("IndexError", "pop from empty list");
          if (args.length === 0) return target.pop() ?? null;
          let i = Math.trunc(toNumber(args[0]));
          if (i < 0) i += target.length;
          if (i < 0 || i >= target.length) throw new PyException("IndexError", "pop index out of range");
          return target.splice(i, 1)[0];
        }
        case "remove": {
          const i = target.findIndex((x) => pyEquals(x, args[0]));
          if (i === -1) throw new PyException("ValueError", "list.remove(x): x not in list");
          target.splice(i, 1);
          return null;
        }
        case "clear": target.length = 0; return null;
        case "sort": {
          const rev = kwargs && pyTruthy(kwargs.reverse);
          target.sort((a, b) => pyCompare(a, b));
          if (rev) target.reverse();
          return null;
        }
        case "reverse": target.reverse(); return null;
        case "copy": return target.slice();
        case "count": return target.filter((x) => pyEquals(x, args[0])).length;
        case "index": {
          const i = target.findIndex((x) => pyEquals(x, args[0]));
          if (i === -1) throw new PyException("ValueError", `${pyRepr(args[0])} is not in list`);
          return i;
        }
      }
    }
    if (target instanceof PyDict) {
      switch (attr) {
        case "get": return target.get(args[0], args.length > 1 ? args[1] : null);
        case "keys": return target.keys();
        case "values": return target.values();
        case "items": return target.items();
        case "pop": {
          if (!target.has(args[0])) {
            if (args.length > 1) return args[1];
            throw new PyException("KeyError", pyRepr(args[0]));
          }
          const val = target.get(args[0]);
          target.delete(args[0]);
          return val;
        }
        case "update": {
          if (args[0] instanceof PyDict) {
            for (const { key, value } of args[0].entries.values()) target.set(key, value);
          }
          return null;
        }
        case "clear": target.entries.clear(); return null;
      }
    }
    if (target instanceof PySet) {
      switch (attr) {
        case "add": target.add(args[0]); return null;
        case "remove":
          if (!target.has(args[0])) throw new PyException("KeyError", pyRepr(args[0]));
          target.delete(args[0]);
          return null;
        case "discard": target.delete(args[0]); return null;
        case "clear": target.map.entries.clear(); return null;
      }
    }
    if (target instanceof PySuper) {
      const m = target.startCls.lookupMethod(attr);
      if (!m) {
        throw new PyException("AttributeError", `'super' object has no attribute '${attr}'`);
      }
      return invokeCallable({ ...m.fn, boundSelf: target.instance, ownerClass: m.owner }, args, kwargs);
    }
    if (target instanceof PyInstance) {
      if (target.attrs.has(attr)) {
        const attrVal = target.attrs.get(attr)!;
        return invokeCallable(attrVal, args, kwargs);
      }
      const m = target.cls.lookupMethod(attr);
      if (m) {
        return invokeCallable({ ...m.fn, boundSelf: target, ownerClass: m.owner }, args, kwargs);
      }
      const clsAttr = target.cls.lookupAttr(attr);
      if (clsAttr !== undefined) return invokeCallable(clsAttr, args, kwargs);
      throw new PyException("AttributeError", `'${target.cls.name}' object has no attribute '${attr}'`);
    }
    if (target instanceof PyClass) {
      const m = target.lookupMethod(attr);
      if (m) return invokeCallable({ ...m.fn, ownerClass: m.owner }, args, kwargs);
      const clsAttr = target.lookupAttr(attr);
      if (clsAttr !== undefined) return invokeCallable(clsAttr, args, kwargs);
      throw new PyException("AttributeError", `type object '${target.name}' has no attribute '${attr}'`);
    }
    throw new PyException("AttributeError", `'${pyTypeName(target)}' object has no attribute '${attr}'`);
  }

  function invokeCallable(fn: PyValue, args: PyValue[], kwargs: Record<string, PyValue>): PyValue {
    if (fn instanceof PyClass) {
      const inst = new PyInstance(fn);
      const init = fn.lookupMethod("__init__");
      if (init) {
        invokeCallable({ ...init.fn, boundSelf: inst, ownerClass: init.owner }, args, kwargs);
      } else if (args.length > 0 || (kwargs && Object.keys(kwargs).length > 0)) {
        throw new PyException("TypeError", `${fn.name}() takes no arguments`);
      }
      return inst;
    }
    if (!isPyFunc(fn)) {
      throw new PyException("TypeError", `'${pyTypeName(fn)}' object is not callable`);
    }
    if (fn.__pyBuiltin && fn.fn) {
      return fn.fn(args, kwargs);
    }
    const callArgs = fn.boundSelf ? [fn.boundSelf, ...args] : args;
    const fnEnv = new Env(fn.closure || globalEnv);
    (fn.params || []).forEach((p, i) => {
      if (i < callArgs.length) {
        fnEnv.set(p.name, callArgs[i]);
      } else if (kwargs && p.name in kwargs) {
        fnEnv.set(p.name, kwargs[p.name]);
      } else if (p.defaultExpr) {
        fnEnv.set(p.name, evalExpr(p.defaultExpr, fn.closure || globalEnv));
      } else {
        throw new PyException("TypeError", `${fn.name}() missing required positional argument: '${p.name}'`);
      }
    });
    const pushedFrame = Boolean(fn.boundSelf && fn.ownerClass);
    if (pushedFrame) {
      methodStack.push({ selfInstance: fn.boundSelf!, ownerClass: fn.ownerClass! });
    }
    try {
      execBlock(fn.body || [], fnEnv);
      return null;
    } catch (sig) {
      if (sig instanceof ReturnSignal) return sig.value;
      throw sig;
    } finally {
      if (pushedFrame) methodStack.pop();
    }
  }

  function evalFString(raw: string, env: Env, line: number): string {
    let out = "";
    let i = 0;
    while (i < raw.length) {
      if (raw[i] === "{") {
        if (raw[i + 1] === "{") {
          out += "{";
          i += 2;
          continue;
        }
        let depth = 1;
        let j = i + 1;
        let exprPart = "";
        let specPart = "";
        let inSpec = false;
        let inQuote: string | null = null;
        while (j < raw.length && depth > 0) {
          const c = raw[j];
          if (inQuote) {
            if (c === inQuote && raw[j - 1] !== "\\") inQuote = null;
            if (inSpec) specPart += c;
            else exprPart += c;
          } else if (c === '"' || c === "'") {
            inQuote = c;
            if (inSpec) specPart += c;
            else exprPart += c;
          } else if (c === "{") {
            depth++;
            if (inSpec) specPart += c;
            else exprPart += c;
          } else if (c === "}") {
            depth--;
            if (depth > 0) {
              if (inSpec) specPart += c;
              else exprPart += c;
            }
          } else if (c === ":" && depth === 1 && !inSpec) {
            inSpec = true;
          } else {
            if (inSpec) specPart += c;
            else exprPart += c;
          }
          j++;
        }
        if (depth !== 0) {
          throw new PyException("SyntaxError", "f-string: single '{' is not allowed", line);
        }
        const subAst = parse(tokenize(exprPart.trim()));
        if (!subAst.body.length || subAst.body[0].type !== "ExprStmt") {
          throw new PyException("SyntaxError", "invalid f-string expression", line);
        }
        const val = evalExpr(subAst.body[0].expr, env);
        out += specPart ? formatSpec(val, specPart) : formatValueStr(val);
        i = j;
      } else if (raw[i] === "}" && raw[i + 1] === "}") {
        out += "}";
        i += 2;
      } else {
        out += raw[i];
        i++;
      }
    }
    return out;
  }

  function evalExpr(node: ExprNode, env: Env): PyValue {
    switch (node.type) {
      case "Lit":
        return node.value;
      case "FString":
        return evalFString(node.raw, env, node.line);
      case "Ident":
        return env.get(node.name);
      case "TupleLit":
        return new PyTuple(node.items.map((x) => evalExpr(x, env)));
      case "ListLit":
        return node.items.map((x) => evalExpr(x, env));
      case "SetLit":
        return new PySet(node.items.map((x) => evalExpr(x, env)));
      case "DictLit": {
        const d = new PyDict();
        for (const [kNode, vNode] of node.pairs) {
          d.set(evalExpr(kNode, env), evalExpr(vNode, env));
        }
        return d;
      }
      case "ListComp": {
        const items = toIterable(evalExpr(node.iter, env));
        const compEnv = new Env(env);
        const result: PyValue[] = [];
        for (const item of items) {
          if (node.targets.length === 1) {
            compEnv.set(node.targets[0], item);
          } else {
            const unpacked = toIterable(item);
            node.targets.forEach((n, idx) => compEnv.set(n, unpacked[idx]));
          }
          if (!node.cond || pyTruthy(evalExpr(node.cond, compEnv))) {
            result.push(evalExpr(node.expr, compEnv));
          }
        }
        return result;
      }
      case "Ternary":
        return pyTruthy(evalExpr(node.test, env)) ? evalExpr(node.body, env) : evalExpr(node.orelse, env);
      case "BoolOp": {
        const left = evalExpr(node.left, env);
        if (node.op === "or") return pyTruthy(left) ? left : evalExpr(node.right, env);
        return !pyTruthy(left) ? left : evalExpr(node.right, env);
      }
      case "Unary": {
        const arg = evalExpr(node.arg, env);
        if (node.op === "not") return !pyTruthy(arg);
        if (node.op === "-") {
          const n = -toNumber(arg);
          return isFloat(arg) ? new PyFloat(n) : n;
        }
        return isFloat(arg) ? new PyFloat(toNumber(arg)) : toNumber(arg);
      }
      case "BinOp":
        return applyBinOp(node.op, evalExpr(node.left, env), evalExpr(node.right, env));
      case "Compare": {
        let curLeft = evalExpr(node.left, env);
        for (let i = 0; i < node.ops.length; i++) {
          const curRight = evalExpr(node.comparators[i], env);
          if (!evalCompareOp(node.ops[i], curLeft, curRight)) return false;
          curLeft = curRight;
        }
        return true;
      }
      case "Attr": {
        const obj = evalExpr(node.target, env);
        if (isPyModule(obj)) {
          if (!(node.attr in obj.attrs)) {
            throw new PyException("AttributeError", `module '${obj.name}' has no attribute '${node.attr}'`);
          }
          return obj.attrs[node.attr];
        }
        if (obj instanceof PyInstance) {
          if (obj.attrs.has(node.attr)) return obj.attrs.get(node.attr)!;
          const m = obj.cls.lookupMethod(node.attr);
          if (m) return { ...m.fn, boundSelf: obj, ownerClass: m.owner };
          const clsAttr = obj.cls.lookupAttr(node.attr);
          if (clsAttr !== undefined) return clsAttr;
          throw new PyException("AttributeError", `'${obj.cls.name}' object has no attribute '${node.attr}'`);
        }
        if (obj instanceof PyClass) {
          const val = obj.lookupAttr(node.attr);
          if (val !== undefined) return val;
          throw new PyException("AttributeError", `type object '${obj.name}' has no attribute '${node.attr}'`);
        }
        throw new PyException("AttributeError", `'${pyTypeName(obj)}' object has no attribute '${node.attr}'`);
      }
      case "Call": {
        const args = node.args.map((a) => evalExpr(a, env));
        const kwargs: Record<string, PyValue> = {};
        for (const kw of node.kwargs) kwargs[kw.name] = evalExpr(kw.value, env);
        if (node.callee.type === "Attr") {
          const target = evalExpr(node.callee.target, env);
          return callMethod(target, node.callee.attr, args, kwargs);
        }
        const fn = evalExpr(node.callee, env);
        return invokeCallable(fn, args, kwargs);
      }
      case "Subscript": {
        const obj = evalExpr(node.target, env);
        const key = evalExpr(node.index, env);
        if (obj instanceof PyDict) {
          if (!obj.has(key)) throw new PyException("KeyError", pyRepr(key));
          return obj.get(key);
        }
        const seq =
          typeof obj === "string"
            ? obj
            : obj instanceof PyTuple
              ? obj.items
              : Array.isArray(obj)
                ? obj
                : null;
        if (seq === null) {
          throw new PyException("TypeError", `'${pyTypeName(obj)}' object is not subscriptable`);
        }
        let idx = Math.trunc(toNumber(key));
        if (idx < 0) idx += seq.length;
        if (idx < 0 || idx >= seq.length) {
          throw new PyException("IndexError", `${pyTypeName(obj)} index out of range`);
        }
        return seq[idx];
      }
      case "Slice": {
        const obj = evalExpr(node.target, env);
        const seq =
          typeof obj === "string"
            ? Array.from(obj)
            : obj instanceof PyTuple
              ? obj.items
              : Array.isArray(obj)
                ? obj
                : null;
        if (seq === null) {
          throw new PyException("TypeError", `'${pyTypeName(obj)}' object is not subscriptable`);
        }
        const len = seq.length;
        const step = node.step ? Math.trunc(toNumber(evalExpr(node.step, env))) : 1;
        if (step === 0) throw new PyException("ValueError", "slice step cannot be zero");

        let start = node.start ? Math.trunc(toNumber(evalExpr(node.start, env))) : step > 0 ? 0 : len - 1;
        let stop = node.stop ? Math.trunc(toNumber(evalExpr(node.stop, env))) : step > 0 ? len : -len - 1;

        if (start < 0) start += len;
        if (stop < 0) stop += len;

        if (step > 0) {
          start = Math.max(0, Math.min(len, start));
          stop = Math.max(0, Math.min(len, stop));
        } else {
          start = Math.max(-1, Math.min(len - 1, start));
          stop = Math.max(-1, Math.min(len - 1, stop));
        }

        const out: PyValue[] = [];
        if (step > 0) {
          for (let i = start; i < stop; i += step) out.push(seq[i]);
        } else {
          for (let i = start; i > stop; i += step) out.push(seq[i]);
        }
        if (typeof obj === "string") return out.join("");
        if (obj instanceof PyTuple) return new PyTuple(out);
        return out;
      }
    }
  }

  try {
    const tokens = tokenize(source);
    const ast = parse(tokens);
    execBlock(ast.body, globalEnv);
    return {
      ok: true,
      output: output.join(""),
      error: null,
      trace,
      vars: globalEnv.snapshot(),
    };
  } catch (err) {
    if (err instanceof PyException) {
      const lineInfo = err.line ? ` (line ${err.line})` : "";
      return {
        ok: false,
        output: output.join(""),
        error: `${err.pyType}${lineInfo}: ${err.pyMessage}`,
        errorLine: err.line,
        trace,
        vars: globalEnv.snapshot(),
      };
    }
    return {
      ok: false,
      output: output.join(""),
      error: `Error: ${err instanceof Error ? err.message : String(err)}`,
      trace,
      vars: globalEnv.snapshot(),
    };
  }
}
