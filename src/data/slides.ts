/**
 * Curriculum & Slide Deck Data for "Python Programming — Short Course"
 * 35 detailed, part-by-part slides across 7 structured modules (00 through 06).
 */

export type AccentTone = "blue" | "amber" | "emerald" | "purple" | "red";

export type SlideLayout =
  | "hero"
  | "ide-tour"
  | "module-intro"
  | "real-case"
  | "concept-flow"
  | "split-code"
  | "step-tracer"
  | "type-cards"
  | "compare"
  | "quiz"
  | "exercise"
  | "visual-collection";

export interface DefinitionItem {
  term: string;
  badge?: string;
  meaning: string;
  exampleHint?: string;
  tone: AccentTone;
}

export interface ModuleIntroConfig {
  goal: string;
  whyItMatters: string;
  definitions: DefinitionItem[];
  lessons: Array<{ part: string; title: string }>;
}

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
  caseKey?: string;
  realCase?: { title: string; text: string };
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
  realCase?: { title: string; text: string };
  caseKey?: string;
  nextSlideTitle?: string;
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
    logo?: string;
    logoAlt?: string;
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
  moduleIntro?: ModuleIntroConfig;
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

const BASE_SLIDES: SlideData[] = [
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
      { icon: "play", label: "Live Code on Every Slide", detail: "Edit & run Python right inside the lesson or Scratchpad" },
      { icon: "layers", label: "IDE & Part-by-Part Guides", detail: "Starts with VS Code, Antigravity, PyCharm, Jupyter & syntax" },
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
  {
    id: "what-is-ide",
    moduleId: "intro",
    layout: "ide-tour",
    badge: "Module 00 • IDE & Core Tools",
    title: "What Is an IDE? (Editor, Terminal & Debugger)",
    lead: "An **IDE (Integrated Development Environment)** is your coding studio — it puts file management, a color-coded Python editor, a terminal, and a debugger in one screen. Click any part below to explore how it works.",
    notes: {
      duration: "4 min",
      goal: "Make beginners visually recognize the 4 zones inside an IDE (Files, Editor, Terminal, Run/Debugger) before coding.",
      say: "Walk through zones 1 to 4 right on the mockup window: you organize .py files on the left, write colored/indented code in the center, click Run/Debug at the top, and read output or errors in the Terminal below.",
      ask: "Which part catches an error line number for you when something breaks — the Editor or the Terminal traceback?",
      watchOut: "Show the `····` dots on line 4 of the mockup so beginners immediately connect 4-space indentation with the `if ...:` block.",
    },
  },
  {
    id: "choose-ide",
    moduleId: "intro",
    layout: "type-cards",
    badge: "Module 00 • Real Python IDEs",
    title: "Popular Python IDEs Developers Use",
    lead: "When building real Python apps on your computer, programmers pick tools like **VS Code**, **Google Antigravity**, **PyCharm**, or **Jupyter Notebook** depending on their workflow.",
    cards: [
      {
        pill: "VS Code",
        accent: "blue",
        logo: "/logos/vscode.svg",
        logoAlt: "Visual Studio Code official logo",
        example: "code .  •  Python Extension",
        desc: "Fast, free code editor by Microsoft. Install the official **Python** extension for smart autocomplete, linting, Git tools, and integrated terminal.",
        tip: "Most popular all-around editor for beginners and pros.",
      },
      {
        pill: "Google Antigravity",
        accent: "purple",
        logo: "/logos/antigravity.svg",
        logoAlt: "Google Antigravity official logo",
        example: "AI Agentic IDE  •  Editor + Terminal",
        desc: "Next-generation AI-powered IDE by Google uniting a full code editor, terminal, and browser preview with an autonomous agent that plans, edits, and verifies code.",
        tip: "Great for building full apps and learning with guided workflows.",
      },
      {
        pill: "PyCharm",
        accent: "emerald",
        logo: "/logos/pycharm.svg",
        logoAlt: "PyCharm official logo",
        example: "Dedicated Python IDE  •  JetBrains",
        desc: "Purpose-built Python IDE with smart refactoring, visual debugger, test runner, and built-in virtual environment (`venv`) setup out of the box.",
        tip: "Ideal for multi-file Python backends and large projects.",
      },
      {
        pill: "Jupyter Notebook",
        accent: "amber",
        logo: "/logos/jupyter.svg",
        logoAlt: "Jupyter official logo",
        example: "notebook.ipynb  •  Code Cells",
        desc: "Interactive notebook workspace combining formatted Markdown notes, live Python code cells, data tables, and charts in one document.",
        tip: "Standard tool for AI, Machine Learning, and Data Science.",
      },
    ],
    notes: {
      duration: "4 min",
      goal: "Introduce real-world IDEs (VS Code, Google Antigravity, PyCharm, Jupyter) with their official brand marks and explain when developers choose each.",
      say: "Show each IDE card: VS Code for lightweight flexibility, Google Antigravity for AI-assisted engineering, PyCharm for deep Python projects, and Jupyter for data/AI notebooks.",
      ask: "Which IDE workflow fits what you want to build most — automation scripts, web apps, or data science?",
      watchOut: "Clarify that Python itself (`python.org`) is the language/interpreter, while VS Code, Antigravity, and PyCharm are IDE workspaces that run Python.",
    },
  },

  /* ==================== MODULE 01: VARIABLES & TYPES ==================== */
  {
    id: "module-01-intro",
    moduleId: "basics",
    layout: "module-intro",
    badge: "Module 01 • Introduction & Definitions",
    title: "Module 01: Variables, Types & Output",
    lead: "Before exploring real-world cases and Python syntax, learn the core vocabulary programmers use to store, label, and display information.",
    moduleIntro: {
      goal: "Store values inside named boxes, distinguish text from numbers and booleans, read user input, and format clean output.",
      whyItMatters: "Every Python program—from calculators to AI tools—begins by holding values in variables and showing clear results on screen.",
      definitions: [
        {
          term: "Output & Comments",
          badge: "print() / #",
          tone: "blue",
          meaning: "Output (`print()`) shows text on screen for users; comments (`#`) are private notes ignored by Python.",
          exampleHint: "Like a store receipt vs a sticky note",
        },
        {
          term: "Variable",
          badge: "name = value",
          tone: "amber",
          meaning: "A labeled storage box in memory that holds a value you can read or update later.",
          exampleHint: "Read `=` as 'store inside', not math equals",
        },
        {
          term: "Data Type",
          badge: "str / int / float / bool",
          tone: "emerald",
          meaning: "The kind of value—text, whole number, decimal, or True/False—so Python knows which operations apply.",
          exampleHint: '`\"42\"` is text; `42` is a math number',
        },
        {
          term: "Input & f-string",
          badge: 'input() / f"..."',
          tone: "purple",
          meaning: "`input()` captures keyboard text (`str`); f-strings drop variables cleanly inside `{ }` placeholders.",
          exampleHint: "Convert text with `int()` before doing math",
        },
      ],
      lessons: [
        { part: "01", title: "print() & #" },
        { part: "02", title: "Variables" },
        { part: "03", title: "4 Core Types" },
        { part: "04", title: "Input & int()" },
        { part: "05", title: "f-strings" },
      ],
    },
    notes: {
      duration: "2 min",
      goal: "Introduce Module 01 vocabulary before diving into real-world cases and syntax.",
      say: "Walk through the 4 key terms first so words like 'variable', 'type', and 'comment' feel familiar on the next slides.",
      ask: "What is the difference between typing `42` and typing `\"42\"`?",
      watchOut: "Reassure beginners that we will explore each term visually one by one.",
    },
  },
  {
    id: "first-program",
    moduleId: "basics",
    layout: "split-code",
    badge: "Module 01 • Part 1 of 5",
    title: "Your First Program: print() & # Comments",
    lead: "Every Python journey starts with two simple tools: `print()` to display output on screen, and `#` comments to leave human-readable notes.",
    realCase: {
      title: "Real-World Case: Displaying Messages vs Leaving Developer Notes",
      text: "Apps regularly separate what users see (like a welcome banner or order total on screen) from private notes teammates leave behind explaining *why* a line exists. `print()` writes visible screen output, while `#` comments are skipped completely when Python runs.",
    },
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
    realCase: {
      title: "Real-World Case: Tracking a Player Scoreboard",
      text: "Suppose a game tracks a student's name and current score. Instead of repeating `10` everywhere and losing track when 5 bonus points are earned, you store `10` in a labeled box called `score`, calculate the new total (`10 + 5`), and update that same box to `15`.",
    },
    syntaxAnatomy: {
      title: "Anatomy of a Variable Assignment",
      parts: [
        { token: "student_name", label: "1. Box Name (Left)", explain: "Always put the variable name on the LEFT side using `snake_case` (lowercase with underscores).", tone: "blue" },
        { token: "=", label: "2. Store Operator", explain: "Read `=` as 'store inside' (NOT math equals). It puts the right-side value into the left-side box.", tone: "amber" },
        { token: '"Ada"', label: "3. Value (Right)", explain: "Python evaluates the RIGHT side first, then places the result inside the box.", tone: "emerald" },
        { token: "score = score + 5", label: "4. Updating a Box", explain: "Take the old `score` (10), add 5 to get 15, then overwrite `score` with 15.", tone: "purple" },
      ],
    },
    rules: [
      { label: "1. Create a Box: name = value", text: "`score = 10` creates a box labeled `score` and puts `10` inside it." },
      { label: "2. Right Side Runs First", text: "In `score = score + 5`, Python calculates `10 + 5` FIRST (`15`), then stores `15` back into `score`." },
      { label: "3. Good Names (snake_case)", text: "Use clear, lowercase words joined by `_`: `student_name`, `total_price`, `user_age`." },
      { label: "4. Illegal Variable Names", text: "No spaces (`user age` ❌), no starting with a number (`1st_place` ❌), and no hyphens (`user-age` ❌)." },
    ],
    tracer: {
      title: "Watch Memory Boxes Change Line by Line",
      code: `# 1. Create variables (put values inside boxes)
student_name = "Ada"
score = 10
bonus_points = 5

# 2. Update score (right side runs first: 10 + 5 = 15)
score = score + bonus_points

# 3. Read values from the boxes
print(student_name, "earned", score, "points")`,
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
    realCase: {
      title: "Real-World Case: Filling Out a Student Registration Form",
      text: "A school sign-up form stores different kinds of data: a student's name (text), age (a whole number), GPA (a decimal), and enrollment status (a Yes/No flag). Python labels these `str`, `int`, `float`, and `bool` so it knows which operations make sense.",
    },
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
      code: `# 1. Text (str) — always inside matching quotes
student_name = "Mina"

# 2. Whole number (int) — no decimal point
student_age = 20

# 3. Decimal number (float) — has a decimal point
gpa_score = 3.85

# 4. True / False (bool) — capital T or F, no quotes
is_enrolled = True

print(student_name, "->", type(student_name))
print(student_age, "->", type(student_age))
print(gpa_score, "->", type(gpa_score))
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
    realCase: {
      title: "Real-World Case: Calculating Age from a Web Sign-Up Form",
      text: "When someone types `2004` into a birth-year prompt, Python receives raw keyboard text (`\"2004\"`), not a number. Before subtracting `2004` from `2026` to find their age, your code must convert that text into a whole number with `int()`.",
    },
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
      code: `# Step 1: input() ALWAYS gives you text (str)
birth_year_text = input("Enter birth year: ")
print("Before int():", birth_year_text, type(birth_year_text))

# Step 2: Convert text -> whole number (int) before math
birth_year = int(birth_year_text)
age = 2026 - birth_year
print("Your age in 2026 is:", age)`,
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
    realCase: {
      title: "Real-World Case: Formatting a Store Checkout Receipt",
      text: "A cash register receipt blends fixed labels (`Item:`, `Total due:`) with live numbers (`Notebook`, `3`, `$13.50`) formatted neatly to two cents. An f-string works like a fill-in-the-blank template where variables go directly inside `{ }`.",
    },
    syntaxAnatomy: {
      title: "Anatomy of an f-string",
      parts: [
        { token: "f", label: "f Prefix", explain: "Tells Python: replace `{...}` placeholders inside this string.", tone: "blue" },
        { token: '"Hi ', label: "Normal Text", explain: "Regular text stays exactly as typed.", tone: "amber" },
        { token: "{name}", label: "Variable Slot", explain: "Automatically converts any value (int, float, bool) to text!", tone: "emerald" },
        { token: '{total:.2f}"', label: "Format Spec", explain: "`:.2f` formats a decimal neatly to 2 decimal places (`19.50`).", tone: "purple" },
      ],
    },
    points: [
      {
        tag: 'f"...{var}..."',
        title: "No str() Needed",
        desc: "Numbers and booleans inside `{ }` are converted to text automatically.",
      },
      {
        tag: "{price * quantity}",
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
      code: `# 1. Store item details in clear variables
item_name = "Notebook"
price = 4.50
quantity = 3

# 2. Calculate total cost
total_cost = price * quantity

# 3. Drop variables directly inside { } with an f-string
print(f"Item: {item_name} x {quantity}")
print(f"Total due: \${total_cost:.2f}")
print(f"20% off single price: \${price * 0.8:.2f}")`,
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
    id: "module-02-intro",
    moduleId: "logic",
    layout: "module-intro",
    badge: "Module 02 • Introduction & Definitions",
    title: "Module 02: Logic, Math & Decisions",
    lead: "Before running real-world examples, learn the 4 building blocks Python uses to divide numbers, compare values, and choose code branches.",
    moduleIntro: {
      goal: "Split numbers with `/`, `//`, and `%`, compare values into `True`/`False`, combine rules with `and`/`or`/`not`, and branch using `if`/`elif`/`else`.",
      whyItMatters: "Programs become intelligent when they can test conditions—like pass marks, discounts, or sensor thresholds—and pick the right action.",
      definitions: [
        {
          term: "Division Operators",
          badge: "/   //   %",
          tone: "blue",
          meaning: "`/` gives an exact decimal split, `//` keeps only whole shares, and `%` finds the leftover remainder.",
          exampleHint: "17 cookies ÷ 5 kids → `3.4`, `3` whole, `2` left",
        },
        {
          term: "Comparison",
          badge: "==  !=  >=  <=",
          tone: "amber",
          meaning: "Compares two values like a Yes/No question and always produces a boolean (`True` or `False`).",
          exampleHint: "`==` asks 'are they equal?' (`=` stores)",
        },
        {
          term: "Logical Operators",
          badge: "and  or  not",
          tone: "emerald",
          meaning: "`and` needs both checks `True`, `or` needs at least one `True`, and `not` flips `True` ↔ `False`.",
          exampleHint: "Combine multiple rules into one decision",
        },
        {
          term: "Conditional Branch",
          badge: "if / elif / else",
          tone: "purple",
          meaning: "Checks rules top to bottom and executes only the FIRST matching indented block.",
          exampleHint: "Like a thermostat picking Hot, Warm, or Cool",
        },
      ],
      lessons: [
        { part: "01", title: "Math (/ // %)" },
        { part: "02", title: "Comparisons" },
        { part: "03", title: "and / or / not" },
        { part: "04", title: "if / elif / else" },
        { part: "05", title: "Checkpoint #1" },
      ],
    },
    notes: {
      duration: "2 min",
      goal: "Define operators, comparisons, boolean logic, and conditionals before the Module 02 real cases.",
      say: "Preview the 4 cards briefly so students know *why* we have 3 division symbols and how comparisons feed into `if` checks.",
      ask: "Which everyday decision checks TWO rules at once (`and`), and which accepts EITHER rule (`or`)?",
      watchOut: "Highlight `=` (store) vs `==` (compare) early so it clicks before coding.",
    },
  },
  {
    id: "math-operators",
    moduleId: "logic",
    layout: "type-cards",
    badge: "Module 02 • Part 1 of 5",
    title: "Math Operators (+ - * / // % **)",
    lead: "Python works like a smart calculator. Pay special attention to the three division-related operators: `/`, `//`, and `%`.",
    realCase: {
      title: "Real-World Case: Sharing Snacks Fairly & Checking Leftovers",
      text: "Suppose you share a batch of cookies fairly among students. Depending on your goal, Python gives you 3 division tools: exact split with decimals (/), whole cookies only (//), and leftover cookies in the jar (%).",
    },
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
      code: `total_cookies = 17
student_count = 5

print("Exact share (/):", total_cookies / student_count)
print("Whole cookies each (//):", total_cookies // student_count)
print("Leftover cookies (%):", total_cookies % student_count)
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
    realCase: {
      title: "Real-World Case: Checking Exam Pass Marks & Valid Score Ranges",
      text: "Before issuing a certificate, a grading portal asks Yes/No questions: Did the student score at least 60? Did they get a perfect 100? Is the entered score safely between 0 and 100? Comparisons turn each rule into `True` or `False`.",
    },
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
        example: "exam_score >= 60  ->  True (if 60+)",
        desc: "Greater-than-or-equal (`>=`) and less-than-or-equal (`<=`). Put `<` or `>` BEFORE `=`.",
        tip: "Passing score 60+: `exam_score >= 60`",
      },
      {
        pill: "Chained Ranges",
        accent: "purple",
        example: "0 <= exam_score <= 100",
        desc: "Python lets you write natural math ranges cleanly in one check!",
        tip: "Checks both `0 <= exam_score` and `exam_score <= 100`",
      },
    ],
    codeBlock: {
      title: "Ask True/False Questions Live",
      code: `exam_score = 85
passing_score = 60

print("Passed?", exam_score >= passing_score)
print("Perfect 100?", exam_score == 100)
print("Not zero?", exam_score != 0)
print("Valid 0..100?", 0 <= exam_score <= 100)`,
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
    realCase: {
      title: "Real-World Case: School Exam Entry & Student Discount Rules",
      text: "Real decisions often check multiple rules at once. Taking an exam requires BOTH a passing score AND a student ID (`and`). Qualifying for a discount accepts EITHER a student ID OR a scholarship (`or`). Logging in requires that the account is NOT locked (`not`).",
    },
    columns: [
      {
        title: "and — Both Must Be True",
        tone: "blue",
        rule: "True and True -> True",
        example:
          "exam_score = 85\nhas_student_id = True\nexam_score >= 60 and has_student_id  # -> True",
        desc: "Strict gatekeeper: if **either** side is `False`, the whole expression becomes `False`.",
      },
      {
        title: "or — At Least One True",
        tone: "emerald",
        rule: "False or True -> True",
        example:
          "has_student_id = False\nhas_scholarship = True\nhas_student_id or has_scholarship  # -> True",
        desc: "Flexible pass: succeeds as long as **any one** condition is `True`.",
      },
      {
        title: "not — Flips True <-> False",
        tone: "amber",
        rule: "not False -> True",
        example:
          "is_account_locked = False\n# Flips False to True:\nnot is_account_locked  # -> True",
        desc: "Reverses a boolean value to its opposite (`not True` becomes `False`).",
      },
    ],
    codeBlock: {
      title: "Try Changing True / False Values",
      code: `exam_score = 85
has_student_id = True
has_scholarship = False
is_account_locked = False

# 1. and — both checks must be True
can_take_exam = exam_score >= 60 and has_student_id
print("Can take exam?", can_take_exam)

# 2. or — at least one check must be True
gets_discount = has_student_id or has_scholarship
print("Gets discount?", gets_discount)

# 3. not — flips False <-> True
can_login = not is_account_locked
print("Can log in?", can_login)`,
    },
    notes: {
      duration: "4 min",
      goal: "Make `and`, `or`, and `not` intuitive through real-life rules.",
      say: "Change `exam_score = 50` or `is_account_locked = True` live in class to show how `and`, `or`, and `not` each react.",
      ask: "If `has_student_id = False` and `has_scholarship = True`, what do `can_take_exam` and `gets_discount` become?",
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
    realCase: {
      title: "Real-World Case: Assigning a Letter Grade from a Score",
      text: "Teachers turn a numeric score into a single letter grade by checking tiers from highest to lowest: 90+ gets an A, 80+ gets a B, 70+ gets a C, and anything below needs review. As soon as one tier matches, the remaining checks are skipped.",
    },
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
        realCase: {
          title: "Sharing Snacks Fairly in a Classroom",
          text: "Suppose a teacher shares 17 cookies equally among 5 students. Each student receives only whole cookies (no breaking cookies in half), and any remaining cookies stay in the jar. In Python, `//` calculates the whole share per student, while `%` finds the leftovers.",
        },
        prompt: "What does `total_cookies // student_count` and `%` print?",
        code: `total_cookies = 17
student_count = 5
print(total_cookies // student_count, total_cookies % student_count)`,
        options: ["3.4 2", "3 2", "2 3", "3 0"],
        answerIndex: 1,
        explanation: "`17 // 5` is whole division (`3`) and `17 % 5` is the remainder (`2`).",
      },
      {
        realCase: {
          title: "Smart Thermostat Comfort Mode",
          text: "A room thermostat checks temperature rules from top to bottom and picks only the FIRST match: above 30°C triggers Hot, above 20°C (when not above 30°C) triggers Warm, and anything 20°C or cooler triggers Cool.",
        },
        prompt: "What is printed when `temperature = 25`?",
        code: `temperature = 25
if temperature > 30:
    print("Hot")
elif temperature > 20:
    print("Warm")
else:
    print("Cool")`,
        options: ["Hot", "Warm", "Warm and Cool", "Nothing"],
        answerIndex: 1,
        explanation: "`25 > 30` is `False`, so Python checks `elif`: `25 > 20` is `True`, prints `\"Warm\"`, and skips `else`.",
      },
      {
        realCase: {
          title: "Restaurant Pickup Display Screen",
          text: "A kitchen screen highlights an order only when its status equals `\"ready\"`. In Python, `=` stores a value into a variable, `==` compares two values, and every `if` header ends with a colon `:`.",
        },
        prompt: 'Which line validly checks if `order_status` equals `"ready"`?',
        code: `order_status = "ready"
# Pick the valid if line:`,
        options: [
          'if order_status = "ready":',
          'if order_status == "ready"',
          'if order_status == "ready":',
          'if order_status is equal "ready":',
        ],
        answerIndex: 2,
        explanation: "Equality comparison uses `==` and every `if` line must end with a colon `:`.",
      },
    ],
    notes: {
      duration: "4 min",
      goal: "Verify arithmetic operators, conditional ordering, and `==` + `:` syntax.",
      say: "Have students vote on each question before revealing the explanation.",
      ask: "In Q1, what would `total_cookies / student_count` print instead of `total_cookies // student_count`?",
      watchOut: "If students miss Q3, quickly review `=` vs `==` and trailing `:`.",
    },
  },

  /* ==================== MODULE 03: LOOPS ==================== */
  {
    id: "module-03-intro",
    moduleId: "loops",
    layout: "module-intro",
    badge: "Module 03 • Introduction & Definitions",
    title: "Module 03: Loops & Repetition",
    lead: "Before stepping through loop animations, understand what loops, iterations, accumulators, and early loop exits mean.",
    moduleIntro: {
      goal: "Repeat tasks automatically with `for` and `while` loops, accumulate running totals, and steer loops using `break` and `continue`.",
      whyItMatters: "Instead of copy-pasting code 1,000 times, loops let a few clean lines handle days, students, or files of any size.",
      definitions: [
        {
          term: "Loop & Iteration",
          badge: "Repeat",
          tone: "blue",
          meaning: "A loop runs a block of indented lines repeatedly; each single pass through the loop is one iteration.",
          exampleHint: "Write 2 lines instead of 365 `print()` lines",
        },
        {
          term: "for Loop & range()",
          badge: "Known Sequence",
          tone: "amber",
          meaning: "Loops once per item in a sequence. `range(start, stop)` starts at `start` and stops BEFORE `stop`.",
          exampleHint: "`range(1, 5)` yields `1, 2, 3, 4`",
        },
        {
          term: "while Loop",
          badge: "Until False",
          tone: "emerald",
          meaning: "Repeats as long as a condition stays `True`. Always update the counter inside so it eventually stops.",
          exampleHint: "Like a rocket countdown: `3, 2, 1, Liftoff!`",
        },
        {
          term: "break & continue",
          badge: "Loop Steering",
          tone: "purple",
          meaning: "`break` exits the loop completely; `continue` skips only the current round and moves to the next item.",
          exampleHint: "Emergency stop (`break`) vs skip one box (`continue`)",
        },
      ],
      lessons: [
        { part: "01", title: "Why Loops" },
        { part: "02", title: "for & range()" },
        { part: "03", title: "while Loops" },
        { part: "04", title: "break / continue" },
        { part: "05", title: "Practice Lab #1" },
      ],
    },
    notes: {
      duration: "2 min",
      goal: "Introduce loop vocabulary (`iteration`, `range`, `while`, `break`, `continue`) before Module 03 real cases.",
      say: "Explain that a `for` loop is for known counts/lists, while a `while` loop repeats until a condition turns `False`.",
      ask: "What happens if a `while` loop condition never becomes `False`?",
      watchOut: "Flag that `range(1, 5)` excludes `5` right from the start.",
    },
  },
  {
    id: "why-loops",
    moduleId: "loops",
    layout: "compare",
    badge: "Module 03 • Part 1 of 5",
    title: "Why Loops? Stop Copy-Pasting",
    lead: "Computers excel at repeating tasks accurately. A loop lets 2 lines of code do the work of 1,000.",
    realCase: {
      title: "Real-World Case: Sending Daily Course Reminders",
      text: "Imagine sending a progress check-in for 365 days or welcoming 10,000 new users. Writing one `print()` line per day does not scale—a loop writes the rule once and tells Python how many times to repeat it.",
    },
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
    realCase: {
      title: "Real-World Case: Adding Up Daily Cash Register Totals",
      text: "Think of adding bills into a cash drawer: start the running `total` at `0`, take each day's number (`1`, `2`, `3`, `4`) one round at a time, and add it onto `total` until the whole range is counted.",
    },
    syntaxAnatomy: {
      title: "Anatomy of a for Loop",
      parts: [
        { token: "for", label: "Keyword", explain: "Begins a counting/sequence loop.", tone: "purple" },
        { token: "number", label: "Loop Variable", explain: "Automatically holds the current item (`1`, then `2`, `3`, `4`).", tone: "blue" },
        { token: "in range(1, 5)", label: "Sequence", explain: "Generates `1, 2, 3, 4` (`5` is excluded!).", tone: "emerald" },
        { token: ":", label: "Colon + Body", explain: "Indented lines below run once per item.", tone: "amber" },
      ],
    },
    rules: [
      { label: "range(5)", text: "Starts at `0` by default: `0, 1, 2, 3, 4` (5 numbers total)." },
      { label: "range(1, 5)", text: "Includes `1`, stops BEFORE `5`: `1, 2, 3, 4`." },
      { label: "range(0, 10, 2)", text: "3rd value is step size: `0, 2, 4, 6, 8`." },
      { label: "Accumulator Pattern", text: "`total = total + number` adds each `number` onto `total` (short form: `total += number`)." },
    ],
    tracer: {
      title: "Watch total Accumulate Iteration by Iteration",
      code: `total = 0
for number in range(1, 5):
    total = total + number
    print("Added", number, "-> total =", total)
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
    realCase: {
      title: "Real-World Case: Rocket Launch Countdown Timer",
      text: "Mission control announces the countdown (`3`, `2`, `1`) repeatedly as long as the timer stays above zero. Each round lowers `count` by 1 until `count > 0` becomes `False`, then launches.",
    },
    rules: [
      { label: "1. Start Variable", text: "Set a starting value before the loop (`count = 3`)." },
      { label: "2. Check Condition", text: "`while count > 0:` runs the body only if `True`." },
      { label: "3. Must Update!", text: "Always update `count = count - 1` inside (short form: `count -= 1`), or the loop runs forever!" },
    ],
    tracer: {
      title: "Trace a Countdown while Loop",
      code: `count = 3
while count > 0:
    print("T-minus", count)
    count = count - 1
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
    realCase: {
      title: "Real-World Case: Scanning Packages on a Conveyor Belt",
      text: "While inspecting packages numbered 1 to 5, if item `#3` is damaged you can skip just that item and continue scanning (`continue`). If you spot the urgent package `#4` you were searching for, you stop the belt immediately (`break`).",
    },
    columns: [
      {
        title: "break — Stop Loop Completely",
        tone: "red",
        rule: "Exits immediately",
        example: "for number in range(1, 6):\n    if number == 4:\n        break\n    print(number)  # prints 1, 2, 3",
        desc: "Jumps **completely out** of the loop as soon as `break` runs. Remaining numbers (4, 5) never run.",
      },
      {
        title: "continue — Skip Only This Turn",
        tone: "amber",
        rule: "Jumps to next round",
        example: "for number in range(1, 6):\n    if number == 3:\n        continue\n    print(number)  # prints 1, 2, 4, 5",
        desc: "Skips the remaining lines **for this turn only**, then moves right on to the next item.",
      },
    ],
    codeBlock: {
      title: "Compare break & continue Live",
      code: `print("--- Using continue (skip 3) ---")
for number in range(1, 6):
    if number == 3:
        continue
    print(number, end=" ")

print()
print("--- Using break (stop at 4) ---")
for number in range(1, 6):
    if number == 4:
        break
    print(number, end=" ")`,
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
    starterCode: `number = 7

# Fix range() to reach 10, then add ★ for multiples of 5!
for step in range(1, 5):
    print(f"{number} x {step} = {number * step}")`,
    hint: "Use `range(1, 11)` so `step` goes up to `10`. Compute `product = number * step`, then check `if product % 5 == 0:`!",
    solutionCode: `number = 7

for step in range(1, 11):
    product = number * step
    if product % 5 == 0:
        print(f"{number} x {step} = {product} ★")
    else:
        print(f"{number} x {step} = {product}")`,
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
    id: "module-04-intro",
    moduleId: "collections",
    layout: "module-intro",
    badge: "Module 04 • Introduction & Definitions",
    title: "Module 04: Lists & Dictionaries",
    lead: "When one variable isn't enough, Python groups related values into collections. Here are the key definitions before the visual cases.",
    moduleIntro: {
      goal: "Store ordered items in lists, read positions with positive/negative indices and slices, and map named keys to values in dictionaries.",
      whyItMatters: "Real apps manage playlists, leaderboards, shopping carts, and user profiles—collections keep all that data organized.",
      definitions: [
        {
          term: "List",
          badge: "[ item0, item1 ]",
          tone: "blue",
          meaning: "An ordered collection inside square brackets `[ ]` that keeps items in sequence and allows duplicates.",
          exampleHint: '`["apple", "banana", "cherry"]`',
        },
        {
          term: "Index & Slicing",
          badge: "items[0] / [1:3]",
          tone: "amber",
          meaning: "Position numbers start at `0` from the left (or `-1` from the end). `[start:stop]` copies a slice stopping before `stop`.",
          exampleHint: "`items[-1]` is always the last item",
        },
        {
          term: "Dictionary",
          badge: "{ key: value }",
          tone: "emerald",
          meaning: "A lookup table inside curly braces `{ }` pairing each unique label (`key`) directly with its `value`.",
          exampleHint: '`{"name": "Mina", "grade": 95}`',
        },
        {
          term: ".get() & .items()",
          badge: "Safe Dict Tools",
          tone: "purple",
          meaning: "`.get(key, default)` avoids crashes when a key is missing; `.items()` loops over both key and value together.",
          exampleHint: "Like looking up a field on a student ID card",
        },
      ],
      lessons: [
        { part: "01", title: "Lists & Index" },
        { part: "02", title: "Methods & Slice" },
        { part: "03", title: "Filter Lists" },
        { part: "04", title: "Dictionaries" },
        { part: "05", title: ".items() Loop" },
        { part: "06", title: "Checkpoint #2" },
      ],
    },
    notes: {
      duration: "2 min",
      goal: "Contrast ordered lists (position lookup) with dictionaries (key lookup) before Module 04 slides.",
      say: "Lists look things up by number (`0, 1, 2`); dictionaries look things up by label (`\"name\"`, `\"grade\"`).",
      ask: "Would you store a student's name, grade, and email as a list or a dictionary? Why?",
      watchOut: "Zero-based indexing (`0` is first) is new for non-coders—highlight it clearly.",
    },
  },
  {
    id: "lists-basics",
    moduleId: "collections",
    layout: "visual-collection",
    badge: "Module 04 • Part 1 of 6",
    title: "Lists: Ordered Collections & Indexing",
    lead: "A list stores multiple items in order inside square brackets `[ ]`. Click any item below to see its **positive** (`0..`) and **negative** (`-1..`) index!",
    realCase: {
      title: "Real-World Case: Tracking Items in a Shopping Cart",
      text: "When order matters—like groceries in a cart or songs in a playlist—storing 10 separate variables is messy. Putting them in one ordered list lets you grab the first item (`[0]`), swap an item, or grab the last item (`[-1]`) anytime.",
    },
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
    realCase: {
      title: "Real-World Case: Managing a Game High-Score Leaderboard",
      text: "A live leaderboard needs to append new scores, remove old entries, and show slices like the first three scores or the most recent two without altering the full score history.",
    },
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
    realCase: {
      title: "Real-World Case: Building an Honor-Roll List from Exam Scores",
      text: "Given a class list of exam scores, a teacher wants a second list containing only scores of 85 or higher. Start with an empty `honors` list, check each score one by one, and keep only the qualifying ones.",
    },
    rules: [
      { label: "Direct Loop", text: "`for score in scores:` sets `score` to each score one by one automatically." },
      { label: "Filter Pattern", text: "Start with `honors = []`, check `if score >= 85:`, then `.append(score)`." },
      { label: "Membership (in)", text: "`95 in scores` quickly checks if a value exists (`True`/`False`)." },
    ],
    tracer: {
      title: "Trace Filtering Honor Scores Into a New List",
      code: `scores = [72, 95, 88, 64]
honors = []

for score in scores:
    if score >= 85:
        honors.append(score)

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
    realCase: {
      title: "Real-World Case: Storing a Student Profile Card",
      text: "On a student ID card, remembering whether `grade` is at position `0` or `1` is error-prone. A dictionary pairs descriptive labels (`\"name\"`, `\"grade\"`, `\"track\"`) directly with their values and safely handles missing fields via `.get()`.",
    },
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
    realCase: {
      title: "Real-World Case: Printing a Café Menu Board & Summing Prices",
      text: "A café POS system stores drink names paired with prices. To print the full menu board line by line or calculate the sum of all prices, you loop across keys, values, or `(item, price)` pairs together.",
    },
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
        realCase: {
          title: "Grabbing the Second-to-Last Fruit in a Basket",
          text: "A fruit list holds four items ordered left to right (`apple`, `banana`, `cherry`, `mango`). Negative indexing counts backward from the right end: `-1` is the last item, and `-2` steps one spot left.",
        },
        prompt: "What does `fruits[-2]` print?",
        code: `fruits = ["apple", "banana", "cherry", "mango"]
print(fruits[-2])`,
        options: ['"banana"', '"cherry"', '"mango"', "IndexError"],
        answerIndex: 1,
        explanation: "`-1` is the last item (`\"mango\"`), so `-2` steps one left to `\"cherry\"`.",
      },
      {
        realCase: {
          title: "Copying a Middle Slice of Test Scores",
          text: "Suppose you want a sub-list of leaderboard scores `[10, 20, 30, 40]` starting at index `1` and stopping BEFORE index `3`. Slicing `[start:stop]` follows the same rule as `range(1, 3)`—it includes `start` and excludes `stop`.",
        },
        prompt: "What does `scores[1:3]` return?",
        code: `scores = [10, 20, 30, 40]
print(scores[1:3])`,
        options: ["[10, 20, 30]", "[20, 30]", "[20, 30, 40]", "[10, 20]"],
        answerIndex: 1,
        explanation: "Slicing starts at index `1` (`20`) and stops BEFORE index `3` (`40`), giving `[20, 30]`.",
      },
      {
        realCase: {
          title: "Showing a Fallback Role on a Student Profile",
          text: "A newly created student record only stores `\"name\"` and does not have a `\"role\"` key yet. Using `.get(\"role\", \"Guest\")` safely provides a default fallback instead of crashing with a `KeyError`.",
        },
        prompt: "What prints when a key is missing with `.get()`?",
        code: `student = {"name": "Sam"}
print(student.get("role", "Guest"))`,
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
    id: "module-05-intro",
    moduleId: "functions",
    layout: "module-intro",
    badge: "Module 05 • Introduction & Definitions",
    title: "Module 05: Functions & Error Handling",
    lead: "Before testing function machines and error shields, define how functions receive inputs, return answers, and protect against bad data.",
    moduleIntro: {
      goal: "Build reusable functions with `def`, send back values with `return`, use default parameters and local scope, and catch errors with `try/except`.",
      whyItMatters: "Clean code avoids repeating the same logic in ten places and never crashes when a user types unexpected text.",
      definitions: [
        {
          term: "Function (def)",
          badge: "def name():",
          tone: "blue",
          meaning: "A named, reusable recipe. `def` saves the instructions; calling `name(...)` actually runs them.",
          exampleHint: "Fix a formula once, reuse it everywhere",
        },
        {
          term: "Parameters vs return",
          badge: "Input → Output",
          tone: "amber",
          meaning: "Parameters accept inputs; `return` hands a usable value back to your program (unlike `print()`, which only shows text).",
          exampleHint: "Without `return`, a function hands back `None`",
        },
        {
          term: "Defaults & Scope",
          badge: "Local Privacy",
          tone: "emerald",
          meaning: "Default values fill in optional inputs automatically. Variables created inside `def` stay private to that function.",
          exampleHint: '`def greet(name, role="Student"):`',
        },
        {
          term: "try / except",
          badge: "Error Shield",
          tone: "purple",
          meaning: "Protects risky lines (like `float(text)` or division) and catches specific errors gracefully instead of crashing.",
          exampleHint: "Handles `ValueError` and `ZeroDivisionError`",
        },
      ],
      lessons: [
        { part: "01", title: "def Anatomy" },
        { part: "02", title: "return vs print" },
        { part: "03", title: "Defaults & Scope" },
        { part: "04", title: "try / except" },
        { part: "05", title: "Practice Lab #2" },
      ],
    },
    notes: {
      duration: "2 min",
      goal: "Introduce function terminology and defensive error handling before Module 05 real cases.",
      say: "Think of a function like a machine: inputs go in (parameters), work happens inside, and `return` hands the result out.",
      ask: "Why is `return` better than `print()` when calculating a discount or tax amount?",
      watchOut: "Emphasize `define != call` right away.",
    },
  },
  {
    id: "functions-intro",
    moduleId: "functions",
    layout: "concept-flow",
    badge: "Module 05 • Part 1 of 5",
    title: "Functions (def): Anatomy & Calling",
    lead: "A function packages steps under one reusable name. First you **define** it with `def`, then you **call** it with `(...)` whenever needed.",
    realCase: {
      title: "Real-World Case: Calculating Store Discounts Without Rewriting Math",
      text: "Imagine an online store calculating 25% off a $80 jacket and 10% off $120 shoes. Instead of repeating the percentage formula everywhere, you build one reusable discount machine (`apply_discount`) that takes price and percent in and hands the sale price out.",
    },
    syntaxAnatomy: {
      title: "Anatomy of a Function Definition",
      parts: [
        { token: "def", label: "Keyword", explain: "Short for *define* — teaches Python a new function.", tone: "purple" },
        { token: "apply_discount", label: "Function Name", explain: "Clear verb name in `snake_case`.", tone: "blue" },
        { token: "(price, percent)", label: "Parameters", explain: "Input placeholders passed in when calling.", tone: "amber" },
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
      code: `def apply_discount(price, percent):
    discount_amount = price * (percent / 100)
    return price - discount_amount

jacket_price = apply_discount(80, 25)
shoes_price = apply_discount(120, 10)

print(f"Jacket sale: \${jacket_price:.2f}")
print(f"Shoes sale:  \${shoes_price:.2f}")`,
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
    realCase: {
      title: "Real-World Case: Calculator Screen vs Passing a Total to Checkout",
      text: "Showing `7` on a screen (`print()`) lets a human read it, but the rest of your app cannot multiply or tax what was only displayed on screen. A function must `return` its result so later lines can save or reuse that value.",
    },
    columns: [
      {
        title: "Using print() Inside Function",
        tone: "red",
        rule: "Hands back None!",
        example: "def add_bad(a, b):\n    print(a + b)\n\nresult = add_bad(3, 4)  # result is None!",
        desc: "You see `7` on screen, but `result` is empty (`None`). Trying `result * 2` crashes with a `TypeError`!",
      },
      {
        title: "Using return Inside Function",
        tone: "emerald",
        rule: "Sends Value Back!",
        example: "def add_good(a, b):\n    return a + b\n\nresult = add_good(3, 4)  # result is 7",
        desc: "Now `result` holds the number `7`! You can print it, store it in a list, or multiply `result * 10`.",
      },
    ],
    codeBlock: {
      title: "See the Difference Live",
      code: `def add_print(a, b):
    print("Inside add_print:", a + b)

def add_return(a, b):
    return a + b

bad_result = add_print(3, 4)
good_result = add_return(3, 4)

print("bad_result is:", bad_result)
print("good_result is:", good_result, "-> * 10 =", good_result * 10)`,
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
    realCase: {
      title: "Real-World Case: Course Sign-Up Badges with a Default Role",
      text: "Most people joining a class are Students while a few are Instructors. Setting `role=\"Student\"` as a default avoids typing `\"Student\"` on every call, while keeping internal helper variables private inside the function.",
    },
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
    realCase: {
      title: "Real-World Case: Keeping a Division Tool Running on Bad Input",
      text: "In real apps, users sometimes type text like `\"abc\"` into a number box or enter `0` as a divisor. Instead of crashing the whole program, `try / except` catches those specific mistakes and returns a clear friendly message.",
    },
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
    task: "Complete `c_to_f(celsius_text)` so it converts `celsius_text` to `float`, calculates `(celsius * 9 / 5) + 32`, and returns `f\"{celsius}°C = {fahrenheit:.1f}°F\"`. Catch `ValueError` if invalid text is given!",
    expectedOutput: `25.0°C = 77.0°F
0.0°C = 32.0°F
Invalid temperature!`,
    starterCode: `def c_to_f(celsius_text):
    # Convert celsius_text to float, compute Fahrenheit,
    # and handle ValueError safely!
    celsius = float(celsius_text)
    fahrenheit = (celsius * 9 / 5) + 32
    return f"{celsius}°C = {fahrenheit:.1f}°F"

print(c_to_f("25"))
print(c_to_f("0"))
# Uncomment line below once try/except is added:
# print(c_to_f("hot"))`,
    hint: "Wrap the 3 lines (`celsius = ...`, `fahrenheit = ...`, `return ...`) inside `c_to_f` in `try:`, and add `except ValueError: return \"Invalid temperature!\"`.",
    solutionCode: `def c_to_f(celsius_text):
    try:
        celsius = float(celsius_text)
        fahrenheit = (celsius * 9 / 5) + 32
        return f"{celsius}°C = {fahrenheit:.1f}°F"
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
    id: "module-06-intro",
    moduleId: "oop",
    layout: "module-intro",
    badge: "Module 06 • Introduction & Definitions",
    title: "Module 06: Object-Oriented Programming",
    lead: "Before creating custom Python classes, learn the 4 essential OOP concepts: blueprints, instances, constructors (`__init__` / `self`), and inheritance.",
    moduleIntro: {
      goal: "Define custom data types with `class`, initialize independent objects with `__init__` and `self`, format with `__str__`, and extend classes via inheritance.",
      whyItMatters: "OOP lets large programs model real-world entities—students, bank accounts, products—by bundling data and actions together.",
      definitions: [
        {
          term: "Class vs Object",
          badge: "Blueprint vs Copy",
          tone: "blue",
          meaning: "A `class` is a single blueprint defining shared fields and actions; each `object` (instance) built from it holds its own data.",
          exampleHint: "1 `Dog` class → `dog1` and `dog2` instances",
        },
        {
          term: "__init__ & self",
          badge: "Setup & Identity",
          tone: "amber",
          meaning: "`__init__` runs automatically when building a new object; `self` always refers to that specific object.",
          exampleHint: "Keeps `student1.score` separate from `student2`",
        },
        {
          term: "Methods & __str__",
          badge: "Object Actions",
          tone: "emerald",
          meaning: "Methods are functions belonging to a class. `__str__` defines a clean human-readable string for `print(obj)`.",
          exampleHint: "`account.deposit(45)` updates only `account`",
        },
        {
          term: "Inheritance & super()",
          badge: "Extend & Reuse",
          tone: "purple",
          meaning: "A child class inherits attributes and methods from a parent class and uses `super()` to extend setup without duplicating code.",
          exampleHint: "`HonorStudent` inherits from `Student`",
        },
      ],
      lessons: [
        { part: "01", title: "Class & Object" },
        { part: "02", title: "__init__ & self" },
        { part: "03", title: "Methods & __str__" },
        { part: "04", title: "Inheritance" },
        { part: "05", title: "Checkpoint #3" },
      ],
    },
    notes: {
      duration: "2 min",
      goal: "Introduce OOP vocabulary (`class`, `object`, `__init__`, `self`, inheritance) before Module 06 visuals.",
      say: "Use the house blueprint vs real houses analogy so `class` vs `object` makes sense before any syntax appears.",
      ask: "If two objects are built from one blueprint, does changing one change the other?",
      watchOut: "`self` looks strange to beginners—frame it simply as 'this specific object right here'.",
    },
  },
  {
    id: "oop-classes-objects",
    moduleId: "oop",
    layout: "concept-flow",
    badge: "Module 06 • Part 1 of 5",
    title: "Classes & Objects: Blueprint vs House",
    lead: "Object-Oriented Programming (OOP) bundles data and actions together into your own custom types using `class`.",
    realCase: {
      title: "Real-World Case: Designing One Blueprint to Stamp Many Objects",
      text: "Just like one house blueprint or pet-adoption template defines what every record contains (`name`, `age`, `bark`), a `class` defines the pattern once so you can build many independent `Dog` objects from it.",
    },
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
    realCase: {
      title: "Real-World Case: Enrolling Separate Students with Independent Scores",
      text: "When Ada and Leo both enroll in a course, each student gets their own profile box (`self`). Running `student1.add_bonus(5)` adds 5 points to Ada's record while leaving Leo's score completely untouched.",
    },
    rules: [
      { label: "1. __init__(self, ...)", text: "The constructor — sets starting fields right when `Student(...)` is called." },
      { label: "2. What is self?", text: "Calling `student1.add_bonus(5)` silently passes `student1` as `self`!" },
      { label: "3. self.attr = value", text: "Saves data inside *that* object's own memory box." },
    ],
    tracer: {
      title: "Watch Two Student Objects in Memory",
      code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def add_bonus(self, points):
        self.score = self.score + points

student1 = Student("Ada", 85)
student2 = Student("Leo", 92)
student1.add_bonus(5)
print(student1.name, student1.score, "|", student2.name, student2.score)`,
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
    realCase: {
      title: "Real-World Case: A Bank Account with Deposits & Readable Statements",
      text: "A bank account pairs customer data (`owner`, `balance`) with safe actions like `deposit()`. Adding `__str__` turns `print(account)` from a cryptic memory address into a clean account summary line.",
    },
    syntaxAnatomy: {
      title: "How Method Calls Pass self",
      parts: [
        { token: "account", label: "Object", explain: "Becomes `self` inside the method!", tone: "blue" },
        { token: ".", label: "Dot", explain: "Looks up the method on `account`.", tone: "amber" },
        { token: "deposit", label: "Method Name", explain: "Runs `def deposit(self, amount):`.", tone: "purple" },
        { token: "(50)", label: "Argument", explain: "Passed as `amount` (after `self`).", tone: "emerald" },
      ],
    },
    points: [
      {
        tag: "Update State Safely",
        title: "account.withdraw(20)",
        desc: "Methods can validate rules (like checking balance >= amount) before updating `self.balance`.",
      },
      {
        tag: "def __str__(self):",
        title: "Friendly print(obj)",
        desc: "Without `__str__`, `print(account)` shows `<BankAccount object>`. With `__str__`, it prints cleanly!",
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
        self.balance = self.balance + amount

    def __str__(self):
        return f"[{self.bank_name}] {self.owner}: \${self.balance:.2f}"

account = BankAccount("Mina", 100)
account.deposit(45)
print(account)`,
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
    realCase: {
      title: "Real-World Case: Extending a Student Record for Honor Students",
      text: "An Honor Student still has a `name`, a `score`, and a printed summary just like any `Student`, plus an extra `medal` and `badge()`. Inheritance reuses the existing `Student` code instead of duplicating it.",
    },
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
        desc: "Call `super().__init__(name, score)` first, then set child-only fields like `self.medal`.",
      },
      {
        tag: "isinstance(obj, Parent)",
        title: "Is-A Relationship",
        desc: "An `HonorStudent` is ALSO a `Student` (`isinstance(student2, Student)` is `True`).",
      },
    ],
    codeBlock: {
      title: "Student & HonorStudent Inheritance",
      code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def __str__(self):
        return f"{self.name} (score: {self.score})"

class HonorStudent(Student):
    def __init__(self, name, score, medal):
        super().__init__(name, score)
        self.medal = medal

    def badge(self):
        return f"★ {self.name} — {self.medal} Medal"

student1 = Student("Leo", 82)
student2 = HonorStudent("Mina", 96, "Gold")

print(student1)
print(student2)          # inherited __str__ from Student!
print(student2.badge())
print("Is student2 a Student?", isinstance(student2, Student))`,
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
        realCase: {
          title: "Printing Book Copies from a Publisher's Template",
          text: "A book publisher designs one reusable template describing what every book has (a `title`), then prints individual physical book copies from it. In OOP, the template is the `class`, and each copy you build from it is an object (`instance`).",
        },
        prompt: "In this code, what is `Book` vs `book1`?",
        code: `class Book:
    def __init__(self, title):
        self.title = title

book1 = Book("Python 101")`,
        options: [
          "Book is an object, book1 is a class",
          "Book is a class (blueprint), book1 is an object (instance)",
          "Both are lists",
          "Both are strings",
        ],
        answerIndex: 1,
        explanation: "`class Book:` defines the blueprint, and calling `Book(\"Python 101\")` creates a real object stored in `book1`.",
      },
      {
        realCase: {
          title: "Personalizing a Greeting for Whichever User Clicked",
          text: "When many users share the same `greet` method, Python needs to know *which* specific user object triggered the call (`user.greet()` vs `admin.greet()`). The `self` parameter always points to that exact calling object.",
        },
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
        realCase: {
          title: "Two Separate Scoreboards in a Two-Player Game",
          text: "Suppose Player 1 and Player 2 each get their own `Counter` scoreboard starting at `0`. Pressing `+1` twice on Player 1's counter raises only Player 1's count to `2` while Player 2's counter stays `0`.",
        },
        prompt: "What does this snippet print?",
        code: `class Counter:
    def __init__(self):
        self.count = 0
    def add_one(self):
        self.count = self.count + 1

counter1 = Counter()
counter2 = Counter()
counter1.add_one()
counter1.add_one()
print(counter1.count, counter2.count)`,
        options: ["2 2", "0 0", "2 0", "1 1"],
        answerIndex: 2,
        explanation: "`counter1` and `counter2` are independent objects! Calling `counter1.add_one()` twice updates `counter1.count` to `2` while `counter2.count` stays `0`.",
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

export const SLIDES: SlideData[] = BASE_SLIDES.flatMap((slide) => {
  if (!slide.realCase) return [slide];

  const cleanTitle = slide.realCase.title.replace(/^Real-World Case:\s*/i, "");
  const caseSlide: SlideData = {
    id: `${slide.id}-case`,
    moduleId: slide.moduleId,
    layout: "real-case",
    badge: `${slide.badge} • Real Case`,
    title: cleanTitle,
    lead: slide.realCase.text,
    realCase: slide.realCase,
    caseKey: slide.id,
    nextSlideTitle: slide.title,
    notes: {
      duration: "2 min",
      goal: `Understand the real-world scenario before coding: ${slide.title}.`,
      say: slide.realCase.text,
      ask: `Before looking at Python syntax, how would you solve "${cleanTitle}" in everyday life?`,
      watchOut: "Connect every value in the interactive visual to the variables shown on the next slide.",
    },
  };

  return [caseSlide, slide];
});
