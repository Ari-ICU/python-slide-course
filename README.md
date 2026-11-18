# Python Programming — Interactive Short Course Slides

A modern, clean, interactive presentation deck for teaching and learning Python Programming, built with **Next.js**, **Tailwind CSS**, **shadcn/ui**, **Motion**, **Lucide Icons**, and an integrated zero-dependency **in-browser Python runner**.

## Features

- **33 Part-by-Part Slides across 7 Modules (`00` – `06`)**: Welcome, Variables & Types, Logic & Decisions, Loops, Lists & Dicts, Functions & Error Handling, and Object-Oriented Programming (OOP), with interactive syntax breakdowns on key slides.
- **Live Editable Python Playground**: Students and teachers can edit and run Python snippets directly on the slides with syntax highlighting, line numbers, Tab indentation, and instant console output.
- **Step-by-Step Memory Tracer**: Step through code line-by-line while watching variable boxes update live in memory.
- **Interactive Checkpoints & Practice Labs**: Built-in multiple-choice quizzes with instant explanations and guided coding labs with hints and sample solutions.
- **Teacher Presenter Notes (`N`)**: Slide-over drawer with time estimates, learning goals, speaking prompts, student questions, and common pitfall alerts.
- **Live Python Scratchpad (`P`)**: Pop-open sandbox accessible from any slide to test student "What if...?" questions live.
- **Classroom Ready**: Light/Dark theme toggle (`T`), Fullscreen (`F`), Slides Overview grid (`O`), URL hash linking (`#slide-12`), and Print / Save PDF export.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Keyboard Shortcuts

- `←` / `→` / `Space`: Previous / Next slide
- `O`: Toggle Slides Overview grid
- `N`: Toggle Teacher Presenter Notes
- `P`: Toggle Live Python Scratchpad
- `T`: Toggle Light / Dark theme
- `F`: Toggle Fullscreen

## Customizing Slides

Edit modules, slide content, code demos, quizzes, and teacher notes in [`src/data/slides.ts`](./src/data/slides.ts).
