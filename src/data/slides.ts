/**
 * Curriculum & Slide Deck Data for "Python Programming — Short Course"
 * 33 detailed, part-by-part slides across 7 structured modules (00 through 06).
 */

export type AccentTone = "blue" | "amber" | "emerald" | "purple" | "red";

export type SlideLayout =
  | "hero"
  | "concept-flow"
  | "split-code"
  | "step-tracer"
  | "type-cards"
  | "compare"
  | "quiz"
  | "exercise"
  | "visual-collection";

export interface ModuleInfo {
  id: string;
  number: string;
  title: string;
  color: string;
}

export interface TeacherNotes {
  duration: string;
  goal: string;
  say: string;
  ask: string;
  watchOut: string;
}

export interface CodeBlockConfig {
  title: string;
  code: string;
  presetInputs?: string[];
}

export interface SyntaxPart {
  token: string;
  label: string;
  explain: string;
  tone: AccentTone;
}

export interface QuizQuestion {
  prompt: string;
  code: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export type CollectionVisualConfig =
  | {
      kind: "list";
      varName: string;
      items: Array<{ value: string; pos: string; neg: string }>;
      caption: string;
    }
  | {
      kind: "dict";
      varName: string;
      pairs: Array<{ key: string; value: string; type: string }>;
      caption: string;
    };

export interface SlideData {
  id: string;
  moduleId: string;
  layout: SlideLayout;
  badge: string;
  title: string;
  subtitle?: string;
  lead?: string;
  highlights?: Array<{ icon: "play" | "layers" | "check"; label: string; detail: string }>;
  roadmap?: Array<{ num: string; title: string; desc: string }>;
  analogy?: { title: string; text: string };
  flowSteps?: Array<{ step: string; title: string; desc: string; tone: AccentTone }>;
  bullets?: Array<{ title: string; desc: string }>;
  points?: Array<{ tag: string; title: string; desc: string }>;
  rules?: Array<{ label: string; text: string }>;
  tracer?: { title: string; code: string };
  syntaxAnatomy?: { title?: string; parts: SyntaxPart[] };
  cards?: Array<{
    pill: string;
    accent: AccentTone;
    example: string;
    desc: string;
    tip: string;
  }>;
  columns?: Array<{
    title: string;
    tone: AccentTone;
    rule: string;
    example: string;
    desc: string;
  }>;
  questions?: QuizQuestion[];
  task?: string;
  expectedOutput?: string;
  starterCode?: string;
  hint?: string;
  solutionCode?: string;
  collectionVisual?: CollectionVisualConfig;
  codeBlock?: CodeBlockConfig;
  notes: TeacherNotes;
}

export const MODULES: ModuleInfo[] = [
  { id: "intro", number: "00", title: "Welcome", color: "#2563EB" },
  { id: "basics", number: "01", title: "Variables & Types", color: "#0284C7" },
  { id: "logic", number: "02", title: "Logic & Decisions", color: "#7C3AED" },
  { id: "loops", number: "03", title: "Loops", color: "#D97706" },
  { id: "collections", number: "04", title: "Lists & Dicts", color: "#059669" },
  { id: "functions", number: "05", title: "Functions & Errors", color: "#DC2626" },
  { id: "oop", number: "06", title: "OOP & Classes", color: "#0D9488" },
];

export const SLIDES: SlideData[] = [
  /* ==================== MODULE 00: WELCOME ==================== */
  {
    id: "welcome",
    moduleId: "intro",
    layout: "hero",
    badge: "Short Course • Beginner Friendly",
    title: "Python Programming Essentials",
    subtitle:
      "A clear, part-by-part introduction to Python — every concept broken down into small visual steps with live runnable examples.",
    highlights: [
      { icon: "play", label: "Live Code on Every Topic", detail: "Edit & run Python right inside the slide" },
      { icon: "layers", label: "Part-by-Part Breakdowns", detail: "Inspect syntax & watch memory step by step" },
      { icon: "check", label: "Practice Labs & Quizzes", detail: "Check understanding after every core skill" },
    ],
    roadmap: [
      { num: "01", title: "Variables & Types", desc: "print(), boxes, types, input & f-strings" },
      { num: "02", title: "Logic & Decisions", desc: "Math, comparisons, and/or/not, if/elif/else" },
      { num: "03", title: "Loops", desc: "for + range(), while, break & continue" },
      { num: "04", title: "Lists & Dicts", desc: "Indexing, slicing, methods & looping" },
      { num: "05", title: "Functions & Errors", desc: "def, return vs print, scope & try/except" },
      { num: "06", title: "OOP & Classes", desc: "class, __init__, self, methods & inheritance" },
    ],
    notes: {
      duration: "2 min",
      goal: "Welcome students and explain how the course builds piece by piece.",
      say: "Each module splits Python into small, easy steps: first we understand one piece visually, then we inspect its syntax part-by-part, then we run it live.",
      ask: "Has anyone written a single line of any programming language before, or is today completely new?",
      watchOut: "Reassure beginners that seeing errors is normal — Python error messages are clues, not failures.",
    },
  },
  {
    id: "why-python",
    moduleId: "intro",
    layout: "concept-flow",
    badge: "Module 00 • Big Picture",
    title: "Why Python & How Code Runs",
    lead: "Python reads almost like plain English. When you run a file, the Python interpreter executes your code line by line from top to bottom.",
    analogy: {
      title: "Think of Python like a Recipe",
      text: "Just like cooking step 1 before step 2, Python reads line 1, completes it, then moves to line 2. Order matters!",
    },
    flowSteps: [
      { step: "1", title: "You Write Code", desc: "Clean English-like instructions in a `.py` file", tone: "blue" },
      { step: "2", title: "Python Interpreter", desc: "Checks grammar and runs line by line top-to-bottom", tone: "amber" },
      { step: "3", title: "Instant Output", desc: "Prints results, saves data, or performs tasks", tone: "emerald" },
    ],
    bullets: [
      { title: "AI & Data Science", desc: "Powers machine learning models, charts, and analytics" },
      { title: "Web Backends & APIs", desc: "Runs server apps behind Instagram, Spotify, and more" },
      { title: "Everyday Automation", desc: "Renames files, cleans Excel sheets, and sends reports" },
    ],
    codeBlock: {
      title: "Try It: Top-to-Bottom Execution",
      code: `# Line 1 runs first, then Line 2, then Line 4 & 5
course = "Python Short Course"
hours = 4

print("Welcome to:", course)
print("Total minutes:", hours * 60)`,
    },
    notes: {
      duration: "4 min",
      goal: "Explain why Python is popular and build a mental model of top-to-bottom execution.",
      say: "Click Run Code and walk down lines 1 -> 2 -> 4 -> 5 to show execution order.",
      ask: "What repetitive task in your school or job would you love to automate?",
      watchOut: "Students sometimes think code reads bottom-up or all at once. Emphasize strict top-to-bottom order.",
    },
  },

  /* ==================== MODULE 01: VARIABLES & TYPES ==================== */
  {
    id: "first-program",
    moduleId: "basics",
    layout: "split-code",
    badge: "Module 01 • Part 1 of 5",
    title: "Your First Program: print() & # Comments",
    lead: "Every Python journey starts with two simple tools: `print()` to display output on screen, and `#` comments to leave human-readable notes.",
    syntaxAnatomy: {
      title: "Anatomy of print()",
      parts: [
        { token: "print", label: "Function Name", explain: "Must be lowercase `print` (never `Print`).", tone: "blue" },
        { token: "(", label: "Open Paren", explain: "Starts what you want to display.", tone: "amber" },
        { token: '"Hello,", 2026', label: "Values", explain: "Wrap text in quotes; separate multiple items with commas `,`.", tone: "emerald" },
        { token: ")", label: "Close Paren", explain: "Every opening `(` must have a matching closing `)`.", tone: "purple" },
      ],
    },
    points: [
      {
        tag: "Text Needs Quotes",
        title: '"Hello" or \'Hello\'',
        desc: "Strings of text always sit inside matching quotes. Numbers like `42` or `2 + 3` do not use quotes.",
      },
      {
        tag: "Comma Separation",
        title: 'print("Age:", 20)',
        desc: "A comma `,` prints several values on one line with a space automatically added between them.",
      },
      {
        tag: "# Comments",
        title: "Ignored by Python",
        desc: "Anything after `#` on a line is skipped when code runs. Use comments to explain *why*.",
      },
    ],
    codeBlock: {
      title: "Live Demo — Edit & Run",
      code: `# Comments start with # and are skipped by Python
print("Hello, Python!")
print("2 + 3 equals:", 2 + 3)  # inline comment!

# Try changing the name below:
print("Welcome,", "Student")`,
    },
    notes: {
      duration: "4 min",
      goal: "Break down every piece of `print()` syntax and `#` comments.",
      say: "Click each numbered chip in the Part-by-Part Breakdown so students see what `print`, `(`, quotes, commas, and `)` each do.",
      ask: "What happens if we remove the quotes around `Hello`?",
      watchOut: "Watch for smart/curly quotes when copy-pasting; Python requires straight `\"` or `'`.",
    },
  },
  {
    id: "variables-boxes",
    moduleId: "basics",
    layout: "step-tracer",
    badge: "Module 01 • Part 2 of 5",
    title: "Variables: Labeled Storage Boxes",
    lead: "A variable gives a clear name to a value in memory so you can reuse or update it later. Think of `=` as 'put inside', NOT math equality.",
    rules: [
      { label: "1. Create: name = val", text: "`score = 10` creates a box labeled `score` and puts `10` inside." },
      { label: "2. Update: right-side first", text: "`score = score + 5` computes `10 + 5` FIRST, then stores `15` back in `score`." },
      { label: "3. Naming Rules", text: "Use `snake_case` (`user_age`). No spaces, no starting with digits (`1st_name` is invalid)." },
    ],
    tracer: {
      title: "Watch Memory Boxes Change Line by Line",
      code: `player = "Ada"
score = 10
bonus = 5
score = score + bonus
print(player, "has", score, "points")`,
    },
    notes: {
      duration: "5 min",
      goal: "Build a rock-solid mental model of variable creation and reassignment.",
      say: "Step line by line! When line 4 runs, highlight that Python reads the old `score` (10), adds `bonus` (5), and replaces the box content with `15`.",
      ask: "After line 4 runs, what happened to the old value `10`? (It was replaced by `15`.)",
      watchOut: "Beginners often read `=` as 'equals'. Reinforce that `=` means 'assign / store into'.",
    },
  },
  {
    id: "data-types",
    moduleId: "basics",
    layout: "type-cards",
    badge: "Module 01 • Part 3 of 5",
    title: "The 4 Core Data Types",
    lead: "Python tracks the *type* of every value so it knows whether `+` means adding numbers or joining words. Use `type(x)` anytime to inspect.",
    cards: [
      {
        pill: "str (String)",
        accent: "blue",
        example: '"Hello"   \'Ada\'   "42"',
        desc: "Text inside matching quotes. Even `\"42\"` in quotes is text, not a math number!",
        tip: "Used for names, messages & emails",
      },
      {
        pill: "int (Integer)",
        accent: "amber",
        example: "42   -7   0",
        desc: "Whole numbers with no decimal point. Supports exact whole-number arithmetic.",
        tip: "Used for ages, counts & scores",
      },
      {
        pill: "float (Decimal)",
        accent: "emerald",
        example: "3.14   99.5   2.0",
        desc: "Any number written with a decimal point `.` — even `2.0` is a float!",
        tip: "Dividing with `/` always gives float",
      },
      {
        pill: "bool (Boolean)",
        accent: "purple",
        example: "True   False",
        desc: "Only two values (must start with capital `T` or `F`, no quotes).",
        tip: "Powers every `if` check and loop",
      },
    ],
    codeBlock: {
      title: "Inspect Types Live with type()",
      code: `name = "Mina"
age = 20
gpa = 3.85
is_enrolled = True

print(name, "->", type(name))
print(age, "->", type(age))
print(gpa, "->", type(gpa))
print(is_enrolled, "->", type(is_enrolled))`,
    },
    notes: {
      duration: "5 min",
      goal: "Ensure students distinguish `str`, `int`, `float`, and `bool` cleanly.",
      say: "Ask students to guess the type of `\"100\"`, `100`, and `100.0` before running.",
      ask: "Why is `\"True\"` in quotes a `str`, whereas `True` without quotes is a `bool`?",
      watchOut: "Lowercase `true` or `false` throws a `NameError`.",
    },
  },
  {
    id: "input-and-conversion",
    moduleId: "basics",
    layout: "split-code",
    badge: "Module 01 • Part 4 of 5",
    title: "User Input & Type Conversion",
    lead: "`input()` pauses to ask the user a question — and **always** returns text (`str`). Convert to `int()` or `float()` before doing math!",
    syntaxAnatomy: {
      title: "Two-Step Conversion Pattern",
      parts: [
        { token: "age", label: "Variable", explain: "Stores the final whole number.", tone: "blue" },
        { token: "=", label: "Assign", explain: "Saves the converted number.", tone: "amber" },
        { token: "int(", label: "Convert to int", explain: "Turns text like `\"21\"` into real number `21`.", tone: "emerald" },
        { token: 'input("Age: "))', label: "Ask User", explain: "Shows prompt and returns typed answer as `str`.", tone: "purple" },
      ],
    },
    points: [
      {
        tag: "Why Convert?",
        title: '"5" + "3" gives "53"!',
        desc: "Adding two `str` values glues them side by side instead of adding mathematically.",
      },
      {
        tag: "int() & float()",
        title: "Text -> Number",
        desc: "Use `int(\"25\")` for whole numbers and `float(\"9.5\")` for decimals.",
      },
      {
        tag: "str()",
        title: "Number -> Text",
        desc: "Converts numbers back into text when needed: `str(100)` gives `\"100\"`.",
      },
    ],
    codeBlock: {
      title: "Compare String Joining vs Integer Math",
      presetInputs: ["2004"],
      code: `raw_year = input("Birth year: ")
print("As text (type):", type(raw_year))

# Convert text -> integer before subtracting!
year = int(raw_year)
age = 2026 - year
print("Age in 2026:", age)`,
    },
    notes: {
      duration: "5 min",
      goal: "Eliminate the #1 beginner input bug (`TypeError` or `'5' + '3' == '53'`).",
      say: "Show what happens on line 2 (`type(raw_year)` is `str`), then why line 5 wraps `raw_year` in `int(...)` before subtracting from `2026`.",
      ask: "What happens if a user types `'twenty'` when `int()` runs? (Preview: `ValueError` — we catch that with `try/except` in Module 05!)",
      watchOut: "Remind students they can change the `Test input() values` field above the editor to test different years.",
    },
  },
  {
    id: "f-strings",
    moduleId: "basics",
    layout: "split-code",
    badge: "Module 01 • Part 5 of 5",
    title: "Clean Output with f-strings",
    lead: "Instead of gluing strings with `+` and `str()`, use an **f-string** (`f\"...\"`) to drop variables and math cleanly right inside curly braces `{ }`.",
    syntaxAnatomy: {
      title: "Anatomy of an f-string",
      parts: [
        { token: "f", label: "f Prefix", explain: "Tells Python: replace `{...}` placeholders inside this string.", tone: "blue" },
        { token: '"Hi ', label: "Normal Text", explain: "Regular text stays exactly as typed.", tone: "amber" },
        { token: "{name}", label: "Variable Slot", explain: "Automatically converts any value (int, float, bool) to text!", tone: "emerald" },
        { token: '${total:.2f}"', label: "Format Spec", explain: "`:.2f` formats a decimal neatly to 2 decimal places (`19.50`).", tone: "purple" },
      ],
    },
    points: [
      {
        tag: 'f"...{var}..."',
        title: "No str() Needed",
        desc: "Numbers and booleans inside `{ }` are converted to text automatically.",
      },
      {
        tag: "{price * qty}",
        title: "Expressions Work Too",
        desc: "You can even put quick math or method calls inside `{ }`.",
      },
      {
        tag: "{val:.2f}",
        title: "Clean Decimal Control",
        desc: "`:.1f` shows 1 decimal (`91.7`); `:.2f` shows 2 decimals (`19.50`).",
      },
    ],
    codeBlock: {
      title: "Build Clean Messages with f-strings",
      code: `item = "Notebook"
price = 4.5
qty = 3

total = price * qty
print(f"Item: {item} x {qty}")
print(f"Total due: \${total:.2f}")
print(f"Next item discount price: \${price * 0.8:.2f}")`,
    },
    notes: {
      duration: "4 min",
      goal: "Make f-strings students' default habit for formatting output cleanly.",
      say: "Walk through each part of `f\"Total due: ${total:.2f}\"` — the `f`, the `{total}`, and the `:.2f` rounding.",
      ask: "What prints if we accidentally forget the `f` before the opening quote?",
      watchOut: "Forgetting the leading `f` prints literal `{total}` instead of its value.",
    },
  },

  /* ==================== MODULE 02: LOGIC & DECISIONS ==================== */
  {
    id: "math-operators",
    moduleId: "logic",
    layout: "type-cards",
    badge: "Module 02 • Part 1 of 5",
    title: "Math Operators (+ - * / // % **)",
    lead: "Python works like a smart calculator. Pay special attention to the three division-related operators: `/`, `//`, and `%`.",
    cards: [
      {
        pill: "+   -   *",
        accent: "blue",
        example: "10 + 3 -> 13  |  4 * 2 -> 8",
        desc: "Standard addition, subtraction, and multiplication. Follows PEMDAS order (parentheses first).",
        tip: "Use `(a + b) * c` to make order obvious",
      },
      {
        pill: "/  (True Division)",
        accent: "emerald",
        example: "10 / 2  ->  5.0",
        desc: "Single slash `/` ALWAYS returns a `float` (decimal), even when it divides evenly!",
        tip: "10 / 4 gives 2.5",
      },
      {
        pill: "//  (Floor Division)",
        accent: "amber",
        example: "17 // 5  ->  3",
        desc: "Double slash `//` gives only the **whole number** quotient (drops the remainder).",
        tip: "17 cookies ÷ 5 kids = 3 whole cookies each",
      },
      {
        pill: "%  &  **",
        accent: "purple",
        example: "17 % 5 -> 2   |   2 ** 4 -> 16",
        desc: "`%` (modulo) gives the **remainder** after dividing. `**` raises to a power (`2⁴ = 16`).",
        tip: "`n % 2 == 0` checks if `n` is even!",
      },
    ],
    codeBlock: {
      title: "Test All 7 Math Operators Live",
      code: `cookies = 17
students = 5

print("Exact share (/):", cookies / students)
print("Whole cookies each (//):", cookies // students)
print("Leftover cookies (%):", cookies % students)
print("Power (2 ** 5):", 2 ** 5)`,
    },
    notes: {
      duration: "5 min",
      goal: "Make `/`, `//`, `%`, and `**` crystal clear with a physical sharing analogy.",
      say: "Use the 17-cookies-for-5-students example: `/` gives `3.4`, `//` gives `3` whole cookies each, and `%` gives `2` leftover cookies!",
      ask: "If `number % 2` equals `0`, is `number` even or odd?",
      watchOut: "New coders sometimes write `^` for exponents (e.g. `2^3`); remind them Python uses `**` (`2**3`).",
    },
  },
  {
    id: "comparison-operators",
    moduleId: "logic",
    layout: "type-cards",
    badge: "Module 02 • Part 2 of 5",
    title: "Comparison Operators (== != > < >= <=)",
    lead: "Comparisons ask Python a Yes/No question and **always** give back a `bool` (`True` or `False`).",
    cards: [
      {
        pill: "==   !=",
        accent: "blue",
        example: '5 == 5 -> True  |  "a" != "b" -> True',
        desc: "`==` asks 'Are these equal?'. `!=` asks 'Are these NOT equal?'.",
        tip: "Never confuse `=` (store) with `==` (ask)!",
      },
      {
        pill: ">   <",
        accent: "amber",
        example: "10 > 3 -> True  |  5 < 5 -> False",
        desc: "Strictly greater than or strictly less than. Equal values give `False`.",
        tip: "5 > 5 is False; use >= if equal counts",
      },
      {
        pill: ">=   <=",
        accent: "emerald",
        example: "score >= 60  ->  True (if 60+)",
        desc: "Greater-than-or-equal (`>=`) and less-than-or-equal (`<=`). Put `<` or `>` BEFORE `=`.",
        tip: "Pass mark 60+: `score >= 60`",
      },
      {
        pill: "Chained Ranges",
        accent: "purple",
        example: "0 <= score <= 100",
        desc: "Python lets you write natural math ranges cleanly in one check!",
        tip: "Checks both `0 <= score` and `score <= 100`",
      },
    ],
    codeBlock: {
      title: "Ask True/False Questions Live",
      code: `score = 85
pass_mark = 60

print("Passed?", score >= pass_mark)
print("Perfect 100?", score == 100)
print("Not zero?", score != 0)
print("Valid 0..100?", 0 <= score <= 100)`,
    },
    notes: {
      duration: "4 min",
      goal: "Separate comparisons from arithmetic so students master `==`, `!=`, `>=`, and `=` vs `==`.",
      say: "Point out that EVERY expression on this slide evaluates to either `True` or `False`.",
      ask: "What is the difference between `x = 10` and `x == 10`?",
      watchOut: "Writing `=>` instead of `>=` or `=<` instead of `<=` causes a `SyntaxError`.",
    },
  },
  {
    id: "logical-operators",
    moduleId: "logic",
    layout: "compare",
    badge: "Module 02 • Part 3 of 5",
    title: "Logical Operators: and, or, not",
    lead: "Combine multiple `True`/`False` checks into one decision — just like everyday English rules.",
    columns: [
      {
        title: "and — Both Must Be True",
        tone: "blue",
        rule: "True and True -> True",
        example: "has_ticket and age >= 18",
        desc: "Strict gatekeeper: if **either** side is `False`, the whole expression becomes `False`.",
      },
      {
        title: "or — At Least One True",
        tone: "emerald",
        rule: "False or True -> True",
        example: "is_student or is_senior",
        desc: "Flexible pass: succeeds as long as **any one** condition is `True`.",
      },
      {
        title: "not — Flips True <-> False",
        tone: "amber",
        rule: "not False -> True",
        example: "not is_banned",
        desc: "Reverses a boolean value to its opposite (`not True` becomes `False`).",
      },
    ],
    codeBlock: {
      title: "Try Changing True / False Values",
      code: `age = 19
has_id = True
is_vip = False

can_enter = (age >= 18 and has_id) or is_vip
print("Allowed inside?", can_enter)
print("Needs supervision?", not (age >= 18))`,
    },
    notes: {
      duration: "4 min",
      goal: "Make `and`, `or`, and `not` intuitive through real-life rules.",
      say: "Change `age = 15` and `is_vip = True` live in class to show how `or` lets the VIP inside.",
      ask: "If `age = 16`, `has_id = True`, and `is_vip = False`, what does `can_enter` become?",
      watchOut: "Classic bug: writing `day == \"Sat\" or \"Sun\"` instead of `day == \"Sat\" or day == \"Sun\"`.",
    },
  },
  {
    id: "if-elif-else",
    moduleId: "logic",
    layout: "step-tracer",
    badge: "Module 02 • Part 4 of 5",
    title: "Conditionals: if / elif / else",
    lead: "Python checks conditions top-to-bottom and executes **only the first** matching indented block, then skips the rest.",
    syntaxAnatomy: {
      title: "Anatomy of an if Statement",
      parts: [
        { token: "if", label: "Keyword", explain: "Starts a conditional decision check.", tone: "purple" },
        { token: "score >= 90", label: "Condition", explain: "Any expression producing `True` or `False`.", tone: "blue" },
        { token: ":", label: "Colon", explain: "Required at the end of `if`, `elif`, and `else` lines.", tone: "amber" },
        { token: "    grade = 'A'", label: "4-Space Indent", explain: "Indented lines belong inside this branch!", tone: "emerald" },
      ],
    },
    rules: [
      { label: "1. Colon (:)", text: "Every `if`, `elif`, and `else` header MUST end with a colon `:`." },
      { label: "2. 4-Space Indentation", text: "Indentation is mandatory in Python — it groups lines into blocks." },
      { label: "3. First Match Wins", text: "Once one branch is `True`, all remaining `elif`/`else` branches are skipped." },
    ],
    tracer: {
      title: "Step Through a Grade Checker",
      code: `score = 84

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "Needs Review"

print("Final grade:", grade)`,
    },
    notes: {
      duration: "5 min",
      goal: "Show top-to-bottom branch evaluation and Python's indentation rule.",
      say: "Step through lines 1–12. Notice line 3 is False, line 5 (`score >= 80`) is True, so `grade` becomes `\"B\"` and lines 7–10 never execute.",
      ask: "Why must we check `>= 90` before `>= 80`? What happens if we swap their order?",
      watchOut: "Explain that `else:` has NO condition — it catches everything that didn't match above.",
    },
  },
  {
    id: "quiz-1",
    moduleId: "logic",
    layout: "quiz",
    badge: "Module 02 • Part 5 of 5",
    title: "Checkpoint #1: Types, Operators & Decisions",
    lead: "Test your understanding part by part before moving on to loops!",
    questions: [
      {
        prompt: "What does `17 // 5` and `17 % 5` print?",
        code: `print(17 // 5, 17 % 5)`,
        options: ["3.4 2", "3 2", "2 3", "3 0"],
        answerIndex: 1,
        explanation: "`17 // 5` is whole division (`3`) and `17 % 5` is the remainder (`2`).",
      },
      {
        prompt: "What is printed when `temp = 25`?",
        code: `temp = 25
if temp > 30:
    print("Hot")
elif temp > 20:
    print("Warm")
else:
    print("Cool")`,
        options: ["Hot", "Warm", "Warm and Cool", "Nothing"],
        answerIndex: 1,
        explanation: "`25 > 30` is `False`, so Python checks `elif`: `25 > 20` is `True`, prints `\"Warm\"`, and skips `else`.",
      },
      {
        prompt: 'Which line validly checks if `status` equals `"ready"`?',
        code: `# Pick the valid Python syntax:`,
        options: [
          'if status = "ready":',
          'if status == "ready"',
          'if status == "ready":',
          'if status is equal "ready":',
        ],
        answerIndex: 2,
        explanation: "Equality comparison uses `==` and every `if` line must end with a colon `:`.",
      },
    ],
    notes: {
      duration: "4 min",
      goal: "Verify arithmetic operators, conditional ordering, and `==` + `:` syntax.",
      say: "Have students vote on each question before revealing the explanation.",
      ask: "In Q1, what would `17 / 5` print instead of `17 // 5`?",
      watchOut: "If students miss Q3, quickly review `=` vs `==` and trailing `:`.",
    },
  },

  /* ==================== MODULE 03: LOOPS ==================== */
  {
    id: "why-loops",
    moduleId: "loops",
    layout: "compare",
    badge: "Module 03 • Part 1 of 5",
    title: "Why Loops? Stop Copy-Pasting",
    lead: "Computers excel at repeating tasks accurately. A loop lets 2 lines of code do the work of 1,000.",
    columns: [
      {
        title: "Without a Loop (Repetitive)",
        tone: "red",
        rule: "Breaks at scale",
        example: 'print("Day 1")\nprint("Day 2")\nprint("Day 3")',
        desc: "To print 365 days or 10,000 users, copy-pasting becomes impossible to maintain.",
      },
      {
        title: "With a for Loop (Clean)",
        tone: "emerald",
        rule: "2 lines for any size!",
        example: 'for day in range(1, 4):\n    print("Day", day)',
        desc: "Change `4` to `366` and the exact same two lines handle an entire year.",
      },
    ],
    codeBlock: {
      title: "Run & Scale It Instantly",
      code: `# Change 6 to 11 and run again!
for number in range(1, 6):
    print(f"Step #{number} complete")`,
    },
    notes: {
      duration: "3 min",
      goal: "Motivate why loops exist before inspecting `range()` and loop mechanics.",
      say: "Change `6` to `11` live and run to show how effortless scaling becomes.",
      ask: "Where do apps you use daily repeat the same action over many items?",
      watchOut: "Let students know we break down `range(1, 6)` part-by-part on the very next slide.",
    },
  },
  {
    id: "for-loops-tracer",
    moduleId: "loops",
    layout: "step-tracer",
    badge: "Module 03 • Part 2 of 5",
    title: "for Loops & range() Step by Step",
    lead: "A `for` loop repeats once for each value in a sequence. `range(start, stop)` starts at `start` and stops **before** `stop`.",
    syntaxAnatomy: {
      title: "Anatomy of a for Loop",
      parts: [
        { token: "for", label: "Keyword", explain: "Begins a counting/sequence loop.", tone: "purple" },
        { token: "i", label: "Loop Variable", explain: "Automatically holds the current item (`1`, then `2`, `3`, `4`).", tone: "blue" },
        { token: "in range(1, 5)", label: "Sequence", explain: "Generates `1, 2, 3, 4` (`5` is excluded!).", tone: "emerald" },
        { token: ":", label: "Colon + Body", explain: "Indented lines below run once per item.", tone: "amber" },
      ],
    },
    rules: [
      { label: "range(5)", text: "Starts at `0` by default: `0, 1, 2, 3, 4` (5 numbers total)." },
      { label: "range(1, 5)", text: "Includes `1`, stops BEFORE `5`: `1, 2, 3, 4`." },
      { label: "range(0, 10, 2)", text: "3rd value is step size: `0, 2, 4, 6, 8`." },
    ],
    tracer: {
      title: "Watch total Accumulate Iteration by Iteration",
      code: `total = 0
for i in range(1, 5):
    total += i
    print("Added", i, "-> total =", total)
print("Done! Sum =", total)`,
    },
    notes: {
      duration: "5 min",
      goal: "Demystify loop iteration and the accumulator pattern (`total += i`).",
      say: "Click Next Step slowly and keep attention on the Memory Boxes: `i` becomes `1`, `total` becomes `1`; then `i` becomes `2`, `total` becomes `3`, etc.",
      ask: "Why must `total = 0` be placed BEFORE the `for` loop instead of inside it?",
      watchOut: "Students often forget that `range(1, 5)` ends at `4`, not `5`.",
    },
  },
  {
    id: "while-loops-tracer",
    moduleId: "loops",
    layout: "step-tracer",
    badge: "Module 03 • Part 3 of 5",
    title: "while Loops: Repeat Until False",
    lead: "Use `for` when you know the count or collection. Use `while` when you want to repeat **as long as** a condition remains `True`.",
    rules: [
      { label: "1. Start Variable", text: "Set a starting value before the loop (`count = 3`)." },
      { label: "2. Check Condition", text: "`while count > 0:` runs the body only if `True`." },
      { label: "3. Must Update!", text: "Always update `count -= 1` inside, or the loop runs forever!" },
    ],
    tracer: {
      title: "Trace a Countdown while Loop",
      code: `count = 3
while count > 0:
    print("T-minus", count)
    count -= 1
print("Liftoff!")`,
    },
    notes: {
      duration: "4 min",
      goal: "Make the 3 parts of a `while` loop (init, condition, update) visual and clear.",
      say: "Step through until `count` hits `0` — point out how Python returns to line 2, checks `0 > 0` (`False`), and exits cleanly to line 5.",
      ask: "What would happen if we deleted line 4 (`count -= 1`)?",
      watchOut: "Infinite loops happen when the loop variable never moves toward making the condition `False`.",
    },
  },
  {
    id: "break-vs-continue",
    moduleId: "loops",
    layout: "compare",
    badge: "Module 03 • Part 4 of 5",
    title: "Loop Control: break vs continue",
    lead: "Inside any `for` or `while` loop, you have two special steering commands to exit early or skip a turn.",
    columns: [
      {
        title: "break — Stop Loop Completely",
        tone: "red",
        rule: "Exits immediately",
        example: "for n in range(1, 6):\n    if n == 4:\n        break\n    print(n)  # prints 1, 2, 3",
        desc: "Jumps **completely out** of the loop as soon as `break` runs. Remaining numbers (4, 5) never run.",
      },
      {
        title: "continue — Skip Only This Turn",
        tone: "amber",
        rule: "Jumps to next round",
        example: "for n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)  # prints 1, 2, 4, 5",
        desc: "Skips the remaining lines **for this turn only**, then moves right on to the next item.",
      },
    ],
    codeBlock: {
      title: "Compare break & continue Live",
      code: `print("--- Using continue (skip 3) ---")
for n in range(1, 6):
    if n == 3:
        continue
    print(n, end=" ")

print()
print("--- Using break (stop at 4) ---")
for n in range(1, 6):
    if n == 4:
        break
    print(n, end=" ")`,
    },
    notes: {
      duration: "4 min",
      goal: "Separate `break` and `continue` cleanly so beginners never mix them up.",
      say: "Think of `break` as hitting the emergency stop button, and `continue` as hitting the 'Skip Track' button for one song.",
      ask: "In the `continue` loop above, why did `4` and `5` still print after `3` was skipped?",
      watchOut: "In `while` loops, make sure the counter updates *before* `continue` so you don't repeat the same value forever.",
    },
  },
  {
    id: "practice-lab-1",
    moduleId: "loops",
    layout: "exercise",
    badge: "Module 03 • Part 5 of 5",
    title: "Practice Lab #1: Mini Multiplication Table",
    lead: "Combine a `for` loop, math, an `if` check, and an `f-string` to print a formatted times table.",
    task: "Fix the loop range so it runs from 1 to 10 (inclusive!) printing `7 x 1 = 7` up to `7 x 10 = 70`. Bonus: add ` ★` next to any result divisible by 5 (`product % 5 == 0`)!",
    expectedOutput: `7 x 1 = 7
7 x 2 = 14
...
7 x 5 = 35 ★
...
7 x 10 = 70 ★`,
    starterCode: `num = 7

# Fix range() to reach 10, then add ★ for multiples of 5!
for i in range(1, 5):
    print(f"{num} x {i} = {num * i}")`,
    hint: "Use `range(1, 11)` so `i` goes up to `10`. Compute `product = num * i`, then check `if product % 5 == 0:`!",
    solutionCode: `num = 7

for i in range(1, 11):
    product = num * i
    if product % 5 == 0:
        print(f"{num} x {i} = {product} ★")
    else:
        print(f"{num} x {i} = {product}")`,
    notes: {
      duration: "6 min",
      goal: "Let students combine `for`, `range()`, `%`, `if/else`, and `f-strings` in one practical task.",
      say: "Give students 3–4 minutes to fix `range(1, 5)` first, then add the `★` condition.",
      ask: "How would you print the 9 times table instead by changing just one number?",
      watchOut: "Most students initially try `range(1, 10)` and see it stop at 9 — great reinforcement!",
    },
  },

  /* ==================== MODULE 04: LISTS & DICTIONARIES ==================== */
  {
    id: "lists-basics",
    moduleId: "collections",
    layout: "visual-collection",
    badge: "Module 04 • Part 1 of 6",
    title: "Lists: Ordered Collections & Indexing",
    lead: "A list stores multiple items in order inside square brackets `[ ]`. Click any item below to see its **positive** (`0..`) and **negative** (`-1..`) index!",
    collectionVisual: {
      kind: "list",
      varName: "fruits",
      items: [
        { value: '"apple"', pos: "0", neg: "-4" },
        { value: '"banana"', pos: "1", neg: "-3" },
        { value: '"cherry"', pos: "2", neg: "-2" },
        { value: '"mango"', pos: "3", neg: "-1" },
      ],
      caption: "Positive index counts from the left starting at `0`. Negative index counts from the right starting at `-1` (always the last item!).",
    },
    codeBlock: {
      title: "Read & Replace List Items by Index",
      code: `fruits = ["apple", "banana", "cherry", "mango"]

print("First [0]:", fruits[0])
print("Last [-1]:", fruits[-1])

fruits[1] = "blueberry"   # replace item at index 1
print("Updated:", fruits)
print("Total items:", len(fruits))`,
    },
    notes: {
      duration: "5 min",
      goal: "Make zero-based and negative indexing visual and intuitive.",
      say: "Click different fruit cards to show how `fruits[0]` and `fruits[-4]` both point to `\"apple\"`, and `fruits[-1]` is always the last item.",
      ask: "What happens if we try `fruits[4]` on a 4-item list? (`IndexError`!)",
      watchOut: "Remind beginners that Python starts counting list positions at `0`, not `1`.",
    },
  },
  {
    id: "lists-methods-slicing",
    moduleId: "collections",
    layout: "split-code",
    badge: "Module 04 • Part 2 of 6",
    title: "List Methods & Slicing ([start:stop])",
    lead: "Grow or shrink lists with built-in methods (`.append()`, `.pop()`, `.remove()`), and grab sub-lists cleanly with slicing.",
    syntaxAnatomy: {
      title: "Anatomy of List Slicing",
      parts: [
        { token: "scores", label: "List", explain: "Original list stays untouched — slicing makes a new copy.", tone: "blue" },
        { token: "[", label: "Open Bracket", explain: "Starts index/slice lookup.", tone: "amber" },
        { token: "1:4", label: "Start : Stop", explain: "Takes indices `1, 2, 3` — stops BEFORE `4`!", tone: "emerald" },
        { token: "]", label: "Close Bracket", explain: "Tip: `[:3]` starts at 0; `[-2:]` grabs the last 2 items.", tone: "purple" },
      ],
    },
    points: [
      {
        tag: ".append(x) / .insert(i, x)",
        title: "Add Items",
        desc: "`.append(x)` adds to the end. `.insert(0, x)` inserts at a specific index.",
      },
      {
        tag: ".pop() / .remove(x)",
        title: "Remove Items",
        desc: "`.pop()` removes & returns the last item (or at index). `.remove(x)` removes matching value.",
      },
      {
        tag: "len() / sorted()",
        title: "Measure & Sort",
        desc: "`len(items)` counts elements; `sorted(items)` returns a sorted copy.",
      },
    ],
    codeBlock: {
      title: "Mutate & Slice Lists Live",
      code: `scores = [72, 95, 88, 64, 91]

print("Middle slice [1:4]:", scores[1:4])
print("First three [:3]:", scores[:3])
print("Last two [-2:]:", scores[-2:])

scores.append(99)
removed = scores.pop(0)  # removes 72
print("Removed:", removed, "| Now:", scores)`,
    },
    notes: {
      duration: "5 min",
      goal: "Cover core list manipulation methods and slice ranges cleanly.",
      say: "Compare `range(1, 4)` and `scores[1:4]` — they follow the exact same rule: start included, stop excluded!",
      ask: "Does `scores[1:4]` modify the original `scores` list, or create a new slice?",
      watchOut: "Note `.append()` modifies the list in place and returns `None`, so don't write `scores = scores.append(99)`!",
    },
  },
  {
    id: "lists-looping-tracer",
    moduleId: "collections",
    layout: "step-tracer",
    badge: "Module 04 • Part 3 of 6",
    title: "Looping & Filtering Lists Step by Step",
    lead: "In Python, you don't need index numbers just to visit every item — loop directly with `for item in items:`!",
    rules: [
      { label: "Direct Loop", text: "`for s in scores:` sets `s` to each score one by one automatically." },
      { label: "Filter Pattern", text: "Start with `honors = []`, check `if s >= 85:`, then `.append(s)`." },
      { label: "Membership (in)", text: "`95 in scores` quickly checks if a value exists (`True`/`False`)." },
    ],
    tracer: {
      title: "Trace Filtering Honor Scores Into a New List",
      code: `scores = [72, 95, 88, 64]
honors = []

for s in scores:
    if s >= 85:
        honors.append(s)

print("Honor scores:", honors)`,
    },
    notes: {
      duration: "5 min",
      goal: "Show beginners how `for item in list:` builds filtered results cleanly.",
      say: "Click Next Step through each score: `72` fails the `if`, `95` appends, `88` appends, `64` skips.",
      ask: "How would you also count how many honor scores there are? (`len(honors)`!)",
      watchOut: "Never add/remove items from the SAME list you are currently looping over — build a new list like `honors` instead.",
    },
  },
  {
    id: "dictionaries-basics",
    moduleId: "collections",
    layout: "visual-collection",
    badge: "Module 04 • Part 4 of 6",
    title: "Dictionaries: Key -> Value Pairs",
    lead: "Lists look up values by number (`0, 1, 2`). Dictionaries look up values by meaningful **key name** inside `{ }`. Click any pair below!",
    collectionVisual: {
      kind: "dict",
      varName: "student",
      pairs: [
        { key: '"name"', value: '"Mina"', type: "str" },
        { key: '"grade"', value: "95", type: "int" },
        { key: '"track"', value: '"Python"', type: "str" },
        { key: '"active"', value: "True", type: "bool" },
      ],
      caption: 'Every entry maps a unique `key` (like `"grade"`) directly to its `value` (`95`), just like a real contact card.',
    },
    codeBlock: {
      title: "Read, Safely .get(), Update & Add Keys",
      code: `student = {"name": "Mina", "grade": 95, "track": "Python"}

print("Name:", student["name"])
print("Email:", student.get("email", "Not provided"))

student["grade"] = 98          # update existing key
student["city"] = "Phnom Penh" # add brand-new key
print("Updated dict:", student)`,
    },
    notes: {
      duration: "5 min",
      goal: "Show dictionary lookup, `.get()` safety, and adding/updating keys.",
      say: "Highlight the difference between `student[\"email\"]` (crashes with `KeyError` if missing) vs `student.get(\"email\", \"Not provided\")` (safe fallback!).",
      ask: "When is a dictionary better than a list?",
      watchOut: "Dictionary keys must be unique — setting the same key twice replaces the old value.",
    },
  },
  {
    id: "dictionaries-looping",
    moduleId: "collections",
    layout: "split-code",
    badge: "Module 04 • Part 5 of 6",
    title: "Looping Over Dictionaries (.keys, .values, .items)",
    lead: "Dictionaries give you three clean ways to loop: keys only, values only, or `(key, value)` pairs together with `.items()`.",
    syntaxAnatomy: {
      title: "Unpacking Key & Value in a Loop",
      parts: [
        { token: "for", label: "Loop", explain: "Visits each entry in insertion order.", tone: "purple" },
        { token: "name, price", label: "Two Variables", explain: "Unpacks each `(key, value)` pair cleanly!", tone: "blue" },
        { token: "in menu.items()", label: ".items()", explain: "Returns every `(key, value)` pair from `menu`.", tone: "emerald" },
        { token: ":", label: "Loop Body", explain: "Runs once per dictionary entry.", tone: "amber" },
      ],
    },
    points: [
      {
        tag: "d.keys()",
        title: "Just the Labels",
        desc: "`for k in menu:` or `menu.keys()` loops over keys (`\"Coffee\"`, `\"Tea\"`).",
      },
      {
        tag: "d.values()",
        title: "Just the Values",
        desc: "`sum(menu.values())` lets you calculate totals right away!",
      },
      {
        tag: "d.items()",
        title: "Both Key & Value",
        desc: "The most common pattern: `for k, v in d.items():` gives both at once.",
      },
    ],
    codeBlock: {
      title: "Looping a Cafe Menu Dictionary",
      code: `menu = {"Coffee": 2.50, "Tea": 1.80, "Cake": 3.20}

print("=== Menu ===")
for item, price in menu.items():
    print(f"- {item}: \${price:.2f}")

total_all = sum(menu.values())
print(f"Buy one of each: \${total_all:.2f}")`,
    },
    notes: {
      duration: "4 min",
      goal: "Make dictionary iteration (`for k, v in d.items():`) natural and memorable.",
      say: "Show how `sum(menu.values())` computes the total across all dictionary values in one line.",
      ask: "How would you check if `\"Matcha\"` is in `menu` before reading it? (`\"Matcha\" in menu`)",
      watchOut: "Forgetting `.items()` when writing `for item, price in menu:` causes a `ValueError` because plain `for x in menu:` only yields keys!",
    },
  },
  {
    id: "quiz-2",
    moduleId: "collections",
    layout: "quiz",
    badge: "Module 04 • Part 6 of 6",
    title: "Checkpoint #2: Lists & Dictionaries",
    lead: "Verify indexing, slicing, and dictionary lookup before we move to functions!",
    questions: [
      {
        prompt: "What does `items[-2]` print?",
        code: `items = ["a", "b", "c", "d"]
print(items[-2])`,
        options: ['"b"', '"c"', '"d"', "IndexError"],
        answerIndex: 1,
        explanation: "`-1` is the last item (`\"d\"`), so `-2` steps one left to `\"c\"`.",
      },
      {
        prompt: "What does `nums[1:3]` return?",
        code: `nums = [10, 20, 30, 40]
print(nums[1:3])`,
        options: ["[10, 20, 30]", "[20, 30]", "[20, 30, 40]", "[10, 20]"],
        answerIndex: 1,
        explanation: "Slicing starts at index `1` (`20`) and stops BEFORE index `3` (`40`), giving `[20, 30]`.",
      },
      {
        prompt: "What prints when a key is missing with `.get()`?",
        code: `user = {"name": "Sam"}
print(user.get("role", "Guest"))`,
        options: ["KeyError crash", "None", "Guest", "Sam"],
        answerIndex: 2,
        explanation: "`.get(key, default)` safely returns the fallback `\"Guest\"` instead of crashing.",
      },
    ],
    notes: {
      duration: "4 min",
      goal: "Reinforce negative indexing, slicing bounds, and `.get()` safety.",
      say: "Review Q2 carefully — slice `[1:3]` excludes index `3`, just like `range(1, 3)`.",
      ask: "What if we have 30 students, each with name and grade? (A list of dictionaries — or a list of `Student` objects in Module 06!)",
      watchOut: "Check that students don't confuse `-1` (last element) with `-2` (second to last).",
    },
  },

  /* ==================== MODULE 05: FUNCTIONS & ERRORS ==================== */
  {
    id: "functions-intro",
    moduleId: "functions",
    layout: "concept-flow",
    badge: "Module 05 • Part 1 of 5",
    title: "Functions (def): Anatomy & Calling",
    lead: "A function packages steps under one reusable name. First you **define** it with `def`, then you **call** it with `(...)` whenever needed.",
    syntaxAnatomy: {
      title: "Anatomy of a Function Definition",
      parts: [
        { token: "def", label: "Keyword", explain: "Short for *define* — teaches Python a new function.", tone: "purple" },
        { token: "apply_discount", label: "Function Name", explain: "Clear verb name in `snake_case`.", tone: "blue" },
        { token: "(price, pct)", label: "Parameters", explain: "Input placeholders passed in when calling.", tone: "amber" },
        { token: ":  return ...", label: "Body & Output", explain: "Indented recipe ending with `return` to hand back the answer.", tone: "emerald" },
      ],
    },
    analogy: {
      title: "Think of a Function Like a Blender",
      text: "You put ingredients in (parameters), press Start to run the recipe (function body), and pour out the smoothie (`return` value).",
    },
    flowSteps: [
      { step: "IN", title: "Parameters", desc: "Inputs received inside `( )`", tone: "blue" },
      { step: "DO", title: "Function Body", desc: "Indented lines run when called", tone: "amber" },
      { step: "OUT", title: "return Value", desc: "Hands back the final result", tone: "emerald" },
    ],
    bullets: [
      { title: "Define != Run", desc: "Writing `def` only saves the recipe; calling `apply_discount(80, 25)` runs it!" },
      { title: "Fix Once, Works Everywhere", desc: "Update formula in one spot instead of hunting down 10 copies." },
    ],
    codeBlock: {
      title: "Define Once, Call Multiple Times",
      code: `def apply_discount(price, pct):
    saved = price * (pct / 100)
    return price - saved

jacket = apply_discount(80, 25)
shoes = apply_discount(120, 10)

print(f"Jacket sale: \${jacket:.2f}")
print(f"Shoes sale:  \${shoes:.2f}")`,
    },
    notes: {
      duration: "5 min",
      goal: "Break down every part of `def` vs calling a function.",
      say: "Walk through each chip in the Anatomy strip, then show how lines 5 and 6 reuse the exact same function with different inputs.",
      ask: "If we delete lines 5–9, does `def apply_discount(...)` print anything on its own? (No!)",
      watchOut: "Forgetting `()` when calling a function (`apply_discount` vs `apply_discount(80, 25)`).",
    },
  },
  {
    id: "return-vs-print",
    moduleId: "functions",
    layout: "compare",
    badge: "Module 05 • Part 2 of 5",
    title: "return vs print() — The #1 Beginner Trap",
    lead: "`print()` only shows text on screen for humans. `return` sends a real usable value back to your code so you can store or calculate with it.",
    columns: [
      {
        title: "Using print() Inside Function",
        tone: "red",
        rule: "Hands back None!",
        example: "def add_bad(a, b):\n    print(a + b)\n\nres = add_bad(3, 4)  # res is None!",
        desc: "You see `7` on screen, but `res` is empty (`None`). Trying `res * 2` crashes with a `TypeError`!",
      },
      {
        title: "Using return Inside Function",
        tone: "emerald",
        rule: "Sends Value Back!",
        example: "def add_good(a, b):\n    return a + b\n\nres = add_good(3, 4)  # res is 7",
        desc: "Now `res` holds the number `7`! You can print it, store it in a list, or multiply `res * 10`.",
      },
    ],
    codeBlock: {
      title: "See the Difference Live",
      code: `def add_print(a, b):
    print("Inside add_print:", a + b)

def add_return(a, b):
    return a + b

x = add_print(3, 4)
y = add_return(3, 4)

print("x is:", x)
print("y is:", y, "-> y * 10 =", y * 10)`,
    },
    notes: {
      duration: "5 min",
      goal: "Eliminate the most common function bug beginners encounter.",
      say: "Run the demo and point directly to `x is: None`! A function without `return` always hands back `None`.",
      ask: "If a function computes a grade or tax amount needed later, should it use `print()` or `return`?",
      watchOut: "Remind students `return` also immediately exits the function — code below `return` in the same branch won't run.",
    },
  },
  {
    id: "defaults-scope",
    moduleId: "functions",
    layout: "split-code",
    badge: "Module 05 • Part 3 of 5",
    title: "Default Arguments & Variable Scope",
    lead: "Give optional parameters smart fallback values, and see why variables created inside a `def` stay private to that function.",
    points: [
      {
        tag: 'role="Student"',
        title: "Default Parameter Values",
        desc: "If the caller skips `role`, Python fills in `\"Student\"` automatically. Put required params first!",
      },
      {
        tag: 'greet("Ada", role="TA")',
        title: "Keyword Arguments",
        desc: "Naming the argument at the call site makes code crystal clear to read.",
      },
      {
        tag: "Local Scope",
        title: "Private Inside def",
        desc: "Variables created inside a function disappear when it returns — preventing accidental name clashes.",
      },
    ],
    codeBlock: {
      title: "Defaults, Keyword Args & Scope",
      code: `def greet(name, role="Student"):
    message = f"Welcome, {name} ({role})!"
    return message

print(greet("Sokha"))
print(greet("Dr. Chen", role="Instructor"))

# Try adding print(message) below — it raises NameError
# because 'message' is local to greet()!`,
    },
    notes: {
      duration: "4 min",
      goal: "Teach optional default parameters, keyword arguments, and local variable scope.",
      say: "Have students uncomment/add `print(message)` at the bottom to prove `message` only lives inside `greet()`.",
      ask: "Why is it helpful that local variables inside two separate functions cannot overwrite each other?",
      watchOut: "Required parameters must always come BEFORE parameters with default values.",
    },
  },
  {
    id: "error-handling",
    moduleId: "functions",
    layout: "split-code",
    badge: "Module 05 • Part 4 of 5",
    title: "Reading Errors & try / except",
    lead: "Programs crash when users enter bad input unless you guard risky lines. Read tracebacks bottom-up, and handle failures cleanly with `try / except`.",
    syntaxAnatomy: {
      title: "Anatomy of Error Handling",
      parts: [
        { token: "try:", label: "Protected Zone", explain: "Put risky lines (like `int()` or `/`) inside this block.", tone: "blue" },
        { token: "except ValueError:", label: "Catch Bad Text", explain: "Runs ONLY if `float(\"abc\")` fails.", tone: "amber" },
        { token: "except ZeroDivisionError:", label: "Catch / 0", explain: "Runs ONLY if dividing by zero.", tone: "red" },
        { token: "return ...", label: "Safe Fallback", explain: "Returns a friendly message instead of crashing!", tone: "emerald" },
      ],
    },
    points: [
      {
        tag: "Bottom-Up Rule",
        title: "How to Read Tracebacks",
        desc: "Look at the **last line** first for the error type (`ValueError`) and the line number right above it.",
      },
      {
        tag: "Be Specific",
        title: "Name the Error Type",
        desc: "Prefer `except ValueError:` over bare `except:` so real coding typos aren't hidden.",
      },
    ],
    codeBlock: {
      title: "Crash-Proof Division Helper",
      code: `def safe_divide(text_a, text_b):
    try:
        a = float(text_a)
        b = float(text_b)
        return a / b
    except ValueError:
        return "Error: Please enter valid numbers."
    except ZeroDivisionError:
        return "Error: Cannot divide by zero."

print(safe_divide("10", "2"))
print(safe_divide("10", "0"))
print(safe_divide("abc", "2"))`,
    },
    notes: {
      duration: "5 min",
      goal: "Take the fear out of error messages and teach defensive input handling.",
      say: "Trace all 3 test calls: valid numbers succeed cleanly, `\"0\"` jumps to `ZeroDivisionError`, and `\"abc\"` jumps to `ValueError`.",
      ask: "What happens to the 2nd and 3rd print statements if we didn't have `try/except`?",
      watchOut: "Remind students to keep `try` blocks small (only the risky lines) so bugs elsewhere aren't swallowed.",
    },
  },
  {
    id: "practice-lab-2",
    moduleId: "functions",
    layout: "exercise",
    badge: "Module 05 • Part 5 of 5",
    title: "Practice Lab #2: Safe Temperature Converter",
    lead: "Build a clean, crash-proof function using `def`, `return`, `f-strings`, and `try / except`.",
    task: "Complete `c_to_f(celsius_text)` so it converts `celsius_text` to `float`, calculates `(c * 9 / 5) + 32`, and returns `f\"{c}°C = {f:.1f}°F\"`. Catch `ValueError` if invalid text is given!",
    expectedOutput: `25.0°C = 77.0°F
0.0°C = 32.0°F
Invalid temperature!`,
    starterCode: `def c_to_f(celsius_text):
    # Convert celsius_text to float, compute Fahrenheit,
    # and handle ValueError safely!
    c = float(celsius_text)
    f = (c * 9 / 5) + 32
    return f"{c}°C = {f:.1f}°F"

print(c_to_f("25"))
print(c_to_f("0"))
# Uncomment line below once try/except is added:
# print(c_to_f("hot"))`,
    hint: "Wrap the 3 lines inside `c_to_f` in `try:`, and add `except ValueError: return \"Invalid temperature!\"`.",
    solutionCode: `def c_to_f(celsius_text):
    try:
        c = float(celsius_text)
        f = (c * 9 / 5) + 32
        return f"{c}°C = {f:.1f}°F"
    except ValueError:
        return "Invalid temperature!"

print(c_to_f("25"))
print(c_to_f("0"))
print(c_to_f("hot"))`,
    notes: {
      duration: "6 min",
      goal: "Practice writing a reusable function that returns a formatted value and handles bad input.",
      say: "Have students uncomment line 11 first to see the `ValueError`, then wrap the function body in `try / except ValueError`.",
      ask: "Why do we use `return` inside `c_to_f` instead of `print`?",
      watchOut: "Check indentation when wrapping existing lines inside `try:` (indent by 4 more spaces!).",
    },
  },

  /* ==================== MODULE 06: OBJECT-ORIENTED PROGRAMMING ==================== */
  {
    id: "oop-classes-objects",
    moduleId: "oop",
    layout: "concept-flow",
    badge: "Module 06 • Part 1 of 5",
    title: "Classes & Objects: Blueprint vs House",
    lead: "Object-Oriented Programming (OOP) bundles data and actions together into your own custom types using `class`.",
    syntaxAnatomy: {
      title: "Anatomy of Creating a Class & Object",
      parts: [
        { token: "class", label: "Keyword", explain: "Declares a new custom blueprint/type.", tone: "purple" },
        { token: "Dog", label: "Class Name", explain: "Written in `PascalCase` (capital first letter).", tone: "blue" },
        { token: ":", label: "Class Body", explain: "Indented methods (`def`) and attributes live inside.", tone: "amber" },
        { token: 'Dog("Milo", 2)', label: "Instantiate", explain: "Builds a brand-new `Dog` object from the blueprint!", tone: "emerald" },
      ],
    },
    analogy: {
      title: "Think of a Class Like a House Blueprint",
      text: "One architectural blueprint (`class`) defines what every house has. From that one blueprint, you can build many real houses (`objects`), each with its own color and owner!",
    },
    flowSteps: [
      { step: "1", title: "Define Blueprint", desc: "Write `class Dog:` with attributes & actions", tone: "blue" },
      { step: "2", title: "Build Objects", desc: 'Call `Dog("Milo", 2)` to create instances', tone: "amber" },
      { step: "3", title: "Use Dot Notation", desc: "Access `dog1.name` or call `dog1.bark()`", tone: "emerald" },
    ],
    bullets: [
      { title: "One Blueprint, Many Instances", desc: "Each object keeps its own independent data in memory." },
      { title: "Data + Actions Together", desc: "Instead of loose dicts + separate functions, objects know how to act on themselves." },
    ],
    codeBlock: {
      title: "Your First Class & Two Independent Objects",
      code: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says: Woof!"

dog1 = Dog("Milo", 2)
dog2 = Dog("Luna", 4)

print(dog1.bark())
print(f"{dog2.name} is {dog2.age} years old")`,
    },
    notes: {
      duration: "5 min",
      goal: "Build a clear mental separation between a `class` (template) and its `objects` (instances).",
      say: "Point out `Dog` is defined once, while `dog1` and `dog2` are two distinct objects in memory.",
      ask: "If we change `dog1.age = 3`, does `dog2.age` change? (No!)",
      watchOut: "Remind students class names start uppercase (`Dog`), while object variables start lowercase (`dog1`).",
    },
  },
  {
    id: "oop-init-self",
    moduleId: "oop",
    layout: "step-tracer",
    badge: "Module 06 • Part 2 of 5",
    title: "Inside __init__ & self (Line by Line)",
    lead: "`__init__` runs automatically whenever you create an object, and `self` always means **that specific object** being built or updated.",
    rules: [
      { label: "1. __init__(self, ...)", text: "The constructor — sets starting fields right when `Student(...)` is called." },
      { label: "2. What is self?", text: "Calling `s1.add_bonus(5)` silently passes `s1` as `self`!" },
      { label: "3. self.attr = val", text: "Saves data inside *that* object's own memory box." },
    ],
    tracer: {
      title: "Watch Two Student Objects in Memory",
      code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def add_bonus(self, pts):
        self.score += pts

s1 = Student("Ada", 85)
s2 = Student("Leo", 92)
s1.add_bonus(5)
print(s1.name, s1.score, "|", s2.name, s2.score)`,
    },
    notes: {
      duration: "5 min",
      goal: "Demystify `__init__` and `self` by tracing two independent objects in memory.",
      say: "Step through lines 9–11 and watch the Memory Boxes: `s1` updates to `score=90` while `s2` stays `score=92`.",
      ask: "Why do we pass 2 values in `Student(\"Ada\", 85)` when `__init__` has 3 parameters `(self, name, score)`?",
      watchOut: "Forgetting `self` as the first parameter inside a class method causes a `TypeError` on call.",
    },
  },
  {
    id: "oop-methods-str",
    moduleId: "oop",
    layout: "split-code",
    badge: "Module 06 • Part 3 of 5",
    title: "Instance Methods & __str__",
    lead: "Methods are functions inside a class that read or safely update `self`. Adding `__str__` gives every object a clean human-readable print format!",
    syntaxAnatomy: {
      title: "How Method Calls Pass self",
      parts: [
        { token: "acct", label: "Object", explain: "Becomes `self` inside the method!", tone: "blue" },
        { token: ".", label: "Dot", explain: "Looks up the method on `acct`.", tone: "amber" },
        { token: "deposit", label: "Method Name", explain: "Runs `def deposit(self, amount):`.", tone: "purple" },
        { token: "(50)", label: "Argument", explain: "Passed as `amount` (after `self`).", tone: "emerald" },
      ],
    },
    points: [
      {
        tag: "Update State Safely",
        title: "acct.withdraw(20)",
        desc: "Methods can validate rules (like checking balance >= amount) before updating `self.balance`.",
      },
      {
        tag: "def __str__(self):",
        title: "Friendly print(obj)",
        desc: "Without `__str__`, `print(acct)` shows `<BankAccount object>`. With `__str__`, it prints cleanly!",
      },
      {
        tag: "Class Attributes",
        title: 'bank_name = "PyBank"',
        desc: "Variables placed directly inside `class` (outside `__init__`) are shared by all instances.",
      },
    ],
    codeBlock: {
      title: "BankAccount with Methods & __str__",
      code: `class BankAccount:
    bank_name = "PyBank"

    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def __str__(self):
        return f"[{self.bank_name}] {self.owner}: \${self.balance:.2f}"

acct = BankAccount("Mina", 100)
acct.deposit(45)
print(acct)`,
    },
    notes: {
      duration: "5 min",
      goal: "Show how methods encapsulate logic and how `__str__` improves `print(obj)`.",
      say: "Point out that `print(acct)` automatically invokes `__str__(self)` behind the scenes!",
      ask: "How would you add a `withdraw(self, amount)` method that refuses if `amount > self.balance`?",
      watchOut: "Remind students `__str__` must `return` a string (never `print` inside `__str__`).",
    },
  },
  {
    id: "oop-inheritance",
    moduleId: "oop",
    layout: "split-code",
    badge: "Module 06 • Part 4 of 5",
    title: "Inheritance & super() (Reusing Classes)",
    lead: "Instead of copy-pasting an existing class, create a **child class** that inherits everything from a **parent class** and adds new features.",
    syntaxAnatomy: {
      title: "Anatomy of Class Inheritance",
      parts: [
        { token: "class", label: "Keyword", explain: "Defines a new child class.", tone: "purple" },
        { token: "HonorStudent", label: "Child Class", explain: "Specialized version with extra abilities.", tone: "blue" },
        { token: "(Student)", label: "Parent Class", explain: "Inherits all attributes & methods from `Student`!", tone: "emerald" },
        { token: "super().__init__(...)", label: "Call Parent Setup", explain: "Runs `Student.__init__` so you don't repeat `self.name = ...`.", tone: "amber" },
      ],
    },
    points: [
      {
        tag: "Automatic Reuse",
        title: "Inherits Methods & __str__",
        desc: "`HonorStudent` gets `Student`'s `__str__` and methods automatically with zero duplication.",
      },
      {
        tag: "super().__init__(...)",
        title: "Extend Without Repeating",
        desc: "Call `super().__init__(name, avg)` first, then set child-only fields like `self.medal`.",
      },
      {
        tag: "isinstance(obj, Parent)",
        title: "Is-A Relationship",
        desc: "An `HonorStudent` is ALSO a `Student` (`isinstance(s2, Student)` is `True`).",
      },
    ],
    codeBlock: {
      title: "Student & HonorStudent Inheritance",
      code: `class Student:
    def __init__(self, name, avg):
        self.name = name
        self.avg = avg

    def __str__(self):
        return f"{self.name} (avg: {self.avg})"

class HonorStudent(Student):
    def __init__(self, name, avg, medal):
        super().__init__(name, avg)
        self.medal = medal

    def badge(self):
        return f"★ {self.name} — {self.medal} Medal"

s1 = Student("Leo", 82)
s2 = HonorStudent("Mina", 96, "Gold")

print(s1)
print(s2)          # inherited __str__ from Student!
print(s2.badge())
print("Is s2 a Student?", isinstance(s2, Student))`,
    },
    notes: {
      duration: "5 min",
      goal: "Show practical inheritance and `super().__init__()` cleanly.",
      say: "Point at `print(s2)`: even though `HonorStudent` didn't define `__str__`, it inherited `Student.__str__` automatically!",
      ask: "When should you use inheritance vs just adding a field to the existing class?",
      watchOut: "Keep inheritance shallow (1–2 levels) for clean, readable beginner code.",
    },
  },
  {
    id: "quiz-3-oop",
    moduleId: "oop",
    layout: "quiz",
    badge: "Module 06 • Part 5 of 5",
    title: "Checkpoint #3: OOP Quiz",
    lead: "Verify your understanding of classes, `self`, methods, and inheritance!",
    questions: [
      {
        prompt: "In this code, what is `Book` vs `b1`?",
        code: `class Book:
    def __init__(self, title):
        self.title = title

b1 = Book("Python 101")`,
        options: [
          "Book is an object, b1 is a class",
          "Book is a class (blueprint), b1 is an object (instance)",
          "Both are lists",
          "Both are strings",
        ],
        answerIndex: 1,
        explanation: "`class Book:` defines the blueprint, and calling `Book(\"Python 101\")` creates a real object stored in `b1`.",
      },
      {
        prompt: "What does `self` represent inside a method?",
        code: `def greet(self):
    return f"Hi, {self.name}"`,
        options: [
          "A global variable shared by all files",
          "The specific object calling the method",
          "A loop keyword",
          "The class name as a string",
        ],
        answerIndex: 1,
        explanation: "`self` refers to the exact object on the left of the dot (for `user.greet()`, `self` is `user`).",
      },
      {
        prompt: "What does this snippet print?",
        code: `class Counter:
    def __init__(self):
        self.n = 0
    def inc(self):
        self.n += 1

a = Counter()
b = Counter()
a.inc()
a.inc()
print(a.n, b.n)`,
        options: ["2 2", "0 0", "2 0", "1 1"],
        answerIndex: 2,
        explanation: "`a` and `b` are independent objects! Calling `a.inc()` twice updates `a.n` to `2` while `b.n` stays `0`.",
      },
    ],
    notes: {
      duration: "4 min",
      goal: "Confirm students grasp class vs instance, `self`, and independent object state.",
      say: "Question 3 is the best check — if students pick `2 0`, they truly understand isolated object state.",
      ask: "How could you modify `Counter` so `Counter(10)` starts at `10` or `0` if omitted? (`def __init__(self, start=0):`)",
      watchOut: "If anyone picks `2 2` on Q3, revisit the two separate memory boxes on slide 30.",
    },
  },
];
