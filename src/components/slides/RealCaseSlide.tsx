"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Play,
  Radio,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/slides/RichText";
import { cn } from "@/lib/utils";

export interface RealCaseSlideProps {
  caseKey: string;
  title?: string;
  description?: string;
  nextSlideTitle?: string;
  nextLabel?: string;
  onNextSlide?: () => void;
  compact?: boolean;
}

const SVG_FRAME_CLASS =
  "w-full select-none rounded-xl border bg-slate-50/85 dark:bg-slate-900/60";

function formatPythonDivision(numerator: number, denominator: number): string {
  const exact = numerator / denominator;
  if (Number.isInteger(exact)) return exact.toFixed(1);
  return Number(exact.toFixed(2)).toString();
}

function LiveHeader({
  tag,
  onReset,
  compact,
}: {
  tag: string;
  onReset?: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/40 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/12 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          LIVE MODE
        </span>
        <span
          className={cn(
            "font-medium text-muted-foreground",
            compact ? "text-xs" : "text-xs sm:text-[13px]"
          )}
        >
          {tag}
        </span>
      </div>
      {onReset && (
        <Button type="button" variant="ghost" size="xs" onClick={onReset}>
          <RotateCcw />
          Reset
        </Button>
      )}
    </div>
  );
}

function SceneFrame({
  tag,
  onReset,
  compact,
  controls,
  details,
  ruleText,
  previewCode,
  children,
}: {
  tag: string;
  onReset?: () => void;
  compact?: boolean;
  controls: React.ReactNode;
  details?: React.ReactNode;
  ruleText: string;
  previewCode: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <LiveHeader tag={tag} compact={compact} onReset={onReset} />
      <div className="grid gap-4 p-3.5 sm:p-4 lg:grid-cols-12 lg:items-start">
        <div className="space-y-3 lg:col-span-7">
          {children}
          <div className="flex flex-wrap items-center gap-2.5">{controls}</div>
        </div>

        <div className="space-y-2.5 lg:col-span-5">
          {details}
          <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] px-3.5 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Plain-English Logic
            </div>
            <div className="mt-1 text-xs sm:text-[13px] leading-relaxed text-foreground">
              {ruleText}
            </div>
          </div>
          <div className="rounded-xl border border-border/80 bg-slate-950 px-3.5 py-2.5 font-mono text-xs text-emerald-300">
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Live Values Preview
            </div>
            <div className="mt-1 whitespace-pre-wrap leading-5">{previewCode}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ==================== 1. PRINT & COMMENTS ==================== */
function ScreenVsNoteScene({ compact }: { compact?: boolean }) {
  const [message, setMessage] = useState("Hello, Python!");
  const [note, setNote] = useState("Show greeting on screen");
  const [runComments, setRunComments] = useState(false);

  const presets = ["Hello, Python!", "Welcome, Student", "Total: $13.50"];

  return (
    <SceneFrame
      tag="Interactive Monitor vs Sticky Note"
      compact={compact}
      onReset={() => {
        setMessage("Hello, Python!");
        setNote("Show greeting on screen");
        setRunComments(false);
      }}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Pick output:</span>
          {presets.map((p) => (
            <Button
              key={p}
              type="button"
              size="xs"
              variant={message === p ? "default" : "outline"}
              onClick={() => setMessage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            type="button"
            size="xs"
            variant="secondary"
            onClick={() => setRunComments((v) => !v)}
          >
            {runComments ? "Reset Note View" : "Highlight Note Rule"}
          </Button>
        </>
      }
      ruleText={`The user sees "${message}" on screen, while "# ${note}" stays strictly as a reminder for programmers.`}
      previewCode={`print("${message}")\n# ${note}`}
    >
      <svg viewBox="0 0 640 190" className={SVG_FRAME_CLASS}>
        <rect x="28" y="20" width="290" height="128" rx="14" className="fill-slate-900 stroke-slate-700" strokeWidth="3" />
        <rect x="42" y="34" width="262" height="96" rx="8" className="fill-slate-950" />
        <text x="56" y="56" className="fill-sky-400 text-[11px] font-mono font-bold">
          USER SCREEN (print)
        </text>
        <text x="56" y="88" className="fill-emerald-300 text-[16px] font-mono font-bold">
          {message}
        </text>
        <rect x="148" y="148" width="50" height="14" rx="3" className="fill-slate-600" />
        <rect x="122" y="162" width="102" height="8" rx="4" className="fill-slate-500" />

        <line x1="348" y1="30" x2="348" y2="165" strokeDasharray="6 5" className="stroke-amber-500/70" strokeWidth="2.5" />
        <rect x="318" y="76" width="60" height="24" rx="12" className="fill-amber-500" />
        <text x="348" y="92" textAnchor="middle" className="fill-slate-950 text-[10px] font-bold">
          SKIPPED
        </text>

        <rect x="382" y="26" width="230" height="134" rx="12" className="fill-amber-100 stroke-amber-400 dark:fill-amber-950/60 dark:stroke-amber-600" strokeWidth="2" />
        <text x="400" y="52" className="fill-amber-800 dark:fill-amber-300 text-[11px] font-mono font-bold">
          # DEVELOPER NOTE
        </text>
        <text x="400" y="84" className="fill-slate-800 dark:fill-amber-100 text-[13px] font-sans font-semibold">
          {note}
        </text>
        <text x="400" y="138" className="fill-amber-700 dark:fill-amber-300 text-[11px] font-sans">
          {runComments ? "Humans read this; Python ignores it!" : "Never appears on user screen"}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 2. VARIABLES BOXES ==================== */
function ScoreBoxScene({ compact }: { compact?: boolean }) {
  const [studentName, setStudentName] = useState("Ada");
  const [score, setScore] = useState(10);
  const [bonusPoints, setBonusPoints] = useState(5);

  const updatedScore = score + bonusPoints;

  return (
    <SceneFrame
      tag="Interactive Memory Boxes"
      compact={compact}
      onReset={() => {
        setStudentName("Ada");
        setScore(10);
        setBonusPoints(5);
      }}
      controls={
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Name:</span>
            {["Ada", "Leo", "Mina"].map((n) => (
              <Button
                key={n}
                type="button"
                size="xs"
                variant={studentName === n ? "default" : "outline"}
                onClick={() => setStudentName(n)}
              >
                {n}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Start:</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setScore((s) => Math.max(0, s - 5))}>
              -5
            </Button>
            <span className="w-7 text-center font-mono text-xs font-bold">{score}</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setScore((s) => s + 5)}>
              +5
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Bonus:</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setBonusPoints((b) => Math.max(0, b - 1))}>
              -1
            </Button>
            <span className="w-6 text-center font-mono text-xs font-bold">{bonusPoints}</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setBonusPoints((b) => b + 1)}>
              +1
            </Button>
          </div>
        </>
      }
      ruleText={`First put ${score} into score, calculate ${score} + ${bonusPoints} = ${updatedScore} on the right, then replace score with ${updatedScore}.`}
      previewCode={`student_name = "${studentName}"\nscore = ${score} + ${bonusPoints}  # -> ${updatedScore}`}
    >
      <svg viewBox="0 0 640 185" className={SVG_FRAME_CLASS}>
        <rect x="24" y="24" width="165" height="118" rx="14" className="fill-blue-50 stroke-blue-500 dark:fill-blue-950/50" strokeWidth="2.5" />
        <rect x="38" y="14" width="110" height="22" rx="6" className="fill-blue-600" />
        <text x="93" y="29" textAnchor="middle" className="fill-white text-[11px] font-mono font-bold">
          student_name
        </text>
        <text x="106" y="92" textAnchor="middle" className="fill-blue-950 dark:fill-blue-100 text-[22px] font-mono font-bold">
          &quot;{studentName}&quot;
        </text>

        <rect x="210" y="24" width="150" height="118" rx="14" className="fill-amber-50 stroke-amber-500 dark:fill-amber-950/40" strokeWidth="2.5" />
        <rect x="224" y="14" width="108" height="22" rx="6" className="fill-amber-500" />
        <text x="278" y="29" textAnchor="middle" className="fill-slate-950 text-[11px] font-mono font-bold">
          bonus_points
        </text>
        <text x="285" y="92" textAnchor="middle" className="fill-amber-950 dark:fill-amber-100 text-[26px] font-mono font-bold">
          +{bonusPoints}
        </text>

        <path d="M 372 84 L 414 84" className="stroke-emerald-600" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="414,77 428,84 414,91" className="fill-emerald-600" />

        <rect x="438" y="20" width="178" height="126" rx="14" className="fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/45" strokeWidth="3" />
        <rect x="454" y="10" width="94" height="22" rx="6" className="fill-emerald-600" />
        <text x="501" y="25" textAnchor="middle" className="fill-white text-[11px] font-mono font-bold">
          score (new)
        </text>
        <text x="527" y="76" textAnchor="middle" className="fill-slate-400 text-[13px] font-mono line-through">
          was {score}
        </text>
        <text x="527" y="114" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[30px] font-mono font-bold">
          {updatedScore}
        </text>

        <text x="320" y="168" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[12px] font-semibold">
          {studentName} earned {updatedScore} points
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 3. DATA TYPES ==================== */
function TypeSorterScene({ compact }: { compact?: boolean }) {
  const [studentName, setStudentName] = useState("Mina");
  const [studentAge, setStudentAge] = useState(20);
  const [gpaScore, setGpaScore] = useState(3.85);
  const [isEnrolled, setIsEnrolled] = useState(true);

  return (
    <SceneFrame
      tag="Interactive Registration Form & Type Sorter"
      compact={compact}
      onReset={() => {
        setStudentName("Mina");
        setStudentAge(20);
        setGpaScore(3.85);
        setIsEnrolled(true);
      }}
      controls={
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Name:</span>
            {["Mina", "Sokha", "42"].map((n) => (
              <Button key={n} type="button" size="xs" variant={studentName === n ? "default" : "outline"} onClick={() => setStudentName(n)}>
                &quot;{n}&quot;
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            Age ({studentAge}):
            <input type="range" min={16} max={30} value={studentAge} onChange={(e) => setStudentAge(Number(e.target.value))} className="w-16 accent-amber-500" />
          </label>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            GPA ({gpaScore.toFixed(2)}):
            <input type="range" min={2.0} max={4.0} step={0.05} value={gpaScore} onChange={(e) => setGpaScore(Number(e.target.value))} className="w-16 accent-emerald-600" />
          </label>
          <Button type="button" size="xs" variant={isEnrolled ? "default" : "outline"} onClick={() => setIsEnrolled((v) => !v)}>
            Enrolled: {isEnrolled ? "True" : "False"}
          </Button>
        </>
      }
      ruleText={`"${studentName}" in quotes is text (str), ${studentAge} is a whole number (int), ${gpaScore.toFixed(2)} is a float, and ${isEnrolled ? "True" : "False"} is a bool.`}
      previewCode={`student_name = "${studentName}"  # str\nstudent_age = ${studentAge} | gpa = ${gpaScore.toFixed(2)} | enrolled = ${isEnrolled ? "True" : "False"}`}
    >
      <svg viewBox="0 0 640 175" className={SVG_FRAME_CLASS}>
        <g>
          <rect x="20" y="20" width="142" height="135" rx="12" className="fill-blue-50 stroke-blue-500 dark:fill-blue-950/50" strokeWidth="2" />
          <rect x="34" y="32" width="114" height="22" rx="6" className="fill-blue-600" />
          <text x="91" y="47" textAnchor="middle" className="fill-white text-[11px] font-mono font-bold">str (Text)</text>
          <text x="91" y="96" textAnchor="middle" className="fill-blue-950 dark:fill-blue-100 text-[18px] font-mono font-bold">&quot;{studentName}&quot;</text>
          <text x="91" y="134" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[11px]">Inside quotes</text>
        </g>
        <g>
          <rect x="174" y="20" width="142" height="135" rx="12" className="fill-amber-50 stroke-amber-500 dark:fill-amber-950/40" strokeWidth="2" />
          <rect x="188" y="32" width="114" height="22" rx="6" className="fill-amber-500" />
          <text x="245" y="47" textAnchor="middle" className="fill-slate-950 text-[11px] font-mono font-bold">int (Whole)</text>
          <text x="245" y="96" textAnchor="middle" className="fill-amber-950 dark:fill-amber-100 text-[24px] font-mono font-bold">{studentAge}</text>
          <text x="245" y="134" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300 text-[11px]">No decimal dot</text>
        </g>
        <g>
          <rect x="328" y="20" width="142" height="135" rx="12" className="fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/40" strokeWidth="2" />
          <rect x="342" y="32" width="114" height="22" rx="6" className="fill-emerald-600" />
          <text x="399" y="47" textAnchor="middle" className="fill-white text-[11px] font-mono font-bold">float (Decimal)</text>
          <text x="399" y="96" textAnchor="middle" className="fill-emerald-950 dark:fill-emerald-100 text-[22px] font-mono font-bold">{gpaScore.toFixed(2)}</text>
          <text x="399" y="134" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[11px]">Has decimal point</text>
        </g>
        <g>
          <rect x="482" y="20" width="138" height="135" rx="12" className="fill-violet-50 stroke-violet-500 dark:fill-violet-950/45" strokeWidth="2" />
          <rect x="496" y="32" width="110" height="22" rx="6" className="fill-violet-600" />
          <text x="551" y="47" textAnchor="middle" className="fill-white text-[11px] font-mono font-bold">bool (Flag)</text>
          <text x="551" y="96" textAnchor="middle" className={cn("text-[20px] font-mono font-bold", isEnrolled ? "fill-emerald-600 dark:fill-emerald-300" : "fill-rose-600 dark:fill-rose-300")}>
            {isEnrolled ? "True" : "False"}
          </text>
          <text x="551" y="134" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300 text-[11px]">True or False</text>
        </g>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 4. INPUT & TYPE CONVERSION ==================== */
function ConverterScene({ compact }: { compact?: boolean }) {
  const [year, setYear] = useState(2004);
  const [useInt, setUseInt] = useState(true);
  const age = 2026 - year;

  return (
    <SceneFrame
      tag="Interactive Text-to-Number Converter"
      compact={compact}
      onReset={() => {
        setYear(2004);
        setUseInt(true);
      }}
      controls={
        <>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            Birth year ({year}):
            <input type="range" min={1985} max={2018} value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-28 accent-blue-600" />
          </label>
          <Button type="button" size="xs" variant={useInt ? "default" : "destructive"} onClick={() => setUseInt((v) => !v)}>
            {useInt ? "int() Enabled (Safe Math)" : "int() Disabled (TypeError)"}
          </Button>
        </>
      }
      ruleText={
        useInt
          ? `Keyboard input "${year}" arrives as text, int() turns it into number ${year}, and 2026 - ${year} = ${age}.`
          : `Without int(), Python cannot subtract text "${year}" from the number 2026 — it raises TypeError!`
      }
      previewCode={
        useInt
          ? `birth_year = int("${year}")  # ${year}\nage = 2026 - birth_year      # ${age}`
          : `2026 - "${year}"  # TypeError: int and str!`
      }
    >
      <svg viewBox="0 0 640 170" className={SVG_FRAME_CLASS}>
        <rect x="24" y="34" width="165" height="96" rx="12" className="fill-blue-50 stroke-blue-500 dark:fill-blue-950/50" strokeWidth="2.5" />
        <text x="106" y="58" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[11px] font-bold">
          1. User Typed (str)
        </text>
        <text x="106" y="95" textAnchor="middle" className="fill-blue-950 dark:fill-blue-100 text-[24px] font-mono font-bold">
          &quot;{year}&quot;
        </text>

        <line x1="192" y1="82" x2="232" y2="82" className="stroke-slate-400" strokeWidth="3" />
        <polygon points="232,75 246,82 232,89" className="fill-slate-400" />

        <rect
          x="250"
          y="34"
          width="150"
          height="96"
          rx="12"
          className={useInt ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" : "fill-rose-50 stroke-rose-500 dark:fill-rose-950/40"}
          strokeWidth="2.5"
        />
        <text x="325" y="58" textAnchor="middle" className={useInt ? "fill-emerald-700 dark:fill-emerald-300 text-[11px] font-bold" : "fill-rose-700 dark:fill-rose-300 text-[11px] font-bold"}>
          2. Conversion Step
        </text>
        <text x="325" y="94" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[18px] font-mono font-bold">
          {useInt ? `int("${year}")` : "Skipped int()"}
        </text>

        <line x1="404" y1="82" x2="444" y2="82" className="stroke-slate-400" strokeWidth="3" />
        <polygon points="444,75 458,82 444,89" className="fill-slate-400" />

        <rect
          x="462"
          y="34"
          width="154"
          height="96"
          rx="12"
          className={useInt ? "fill-violet-50 stroke-violet-500 dark:fill-violet-950/50" : "fill-rose-100 stroke-rose-500 dark:fill-rose-950/60"}
          strokeWidth="2.5"
        />
        <text x="539" y="58" textAnchor="middle" className={useInt ? "fill-violet-700 dark:fill-violet-300 text-[11px] font-bold" : "fill-rose-700 dark:fill-rose-300 text-[11px] font-bold"}>
          3. 2026 - birth_year
        </text>
        <text x="539" y="95" textAnchor="middle" className={useInt ? "fill-violet-950 dark:fill-violet-100 text-[22px] font-mono font-bold" : "fill-rose-700 dark:fill-rose-300 text-[16px] font-mono font-bold"}>
          {useInt ? `${age} yrs` : "TypeError!"}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 5. F-STRINGS RECEIPT ==================== */
function ReceiptScene({ compact }: { compact?: boolean }) {
  const items = [
    { name: "Notebook", price: 4.5 },
    { name: "Gel Pen", price: 1.75 },
    { name: "Backpack", price: 18.9 },
  ];
  const [itemIdx, setItemIdx] = useState(0);
  const [quantity, setQuantity] = useState(3);

  const item = items[itemIdx];
  const totalCost = item.price * quantity;

  return (
    <SceneFrame
      tag="Interactive Store Receipt Builder"
      compact={compact}
      onReset={() => {
        setItemIdx(0);
        setQuantity(3);
      }}
      controls={
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Item:</span>
            {items.map((it, idx) => (
              <Button key={it.name} type="button" size="xs" variant={itemIdx === idx ? "default" : "outline"} onClick={() => setItemIdx(idx)}>
                {it.name} (${it.price.toFixed(2)})
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Qty:</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</Button>
            <span className="w-6 text-center font-mono text-xs font-bold">{quantity}</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</Button>
          </div>
        </>
      }
      ruleText={`Drop ${item.name}, ${quantity}, and $${totalCost.toFixed(2)} straight into the { } slots — :.2f always keeps two decimal digits.`}
      previewCode={`f"Item: {item_name} x {quantity}" -> "Item: ${item.name} x ${quantity}"\nf"Total due: \${total_cost:.2f}" -> "Total due: $${totalCost.toFixed(2)}"`}
    >
      <svg viewBox="0 0 640 175" className={SVG_FRAME_CLASS}>
        <rect x="24" y="22" width="275" height="130" rx="12" className="fill-blue-50 stroke-blue-400 dark:fill-blue-950/40" strokeWidth="2" />
        <text x="40" y="46" className="fill-blue-700 dark:fill-blue-300 text-[11px] font-bold">
          FILL-IN TEMPLATE (f-string)
        </text>
        <text x="40" y="78" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-mono">
          Item: {"{item_name}"} x {"{quantity}"}
        </text>
        <text x="40" y="108" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-mono">
          Total due: ${"{total_cost:.2f}"}
        </text>

        <line x1="306" y1="88" x2="346" y2="88" className="stroke-emerald-500" strokeWidth="3" />
        <polygon points="346,81 360,88 346,95" className="fill-emerald-500" />

        <rect x="366" y="18" width="250" height="138" rx="12" className="fill-white stroke-emerald-500 dark:fill-slate-950" strokeWidth="2.5" />
        <text x="491" y="42" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold">
          === STORE RECEIPT ===
        </text>
        <text x="386" y="76" className="fill-slate-900 dark:fill-slate-100 text-[14px] font-mono font-semibold">
          Item: {item.name} x {quantity}
        </text>
        <text x="386" y="108" className="fill-emerald-700 dark:fill-emerald-300 text-[16px] font-mono font-bold">
          Total due: ${totalCost.toFixed(2)}
        </text>
        <text x="386" y="136" className="fill-slate-500 text-[11px] font-mono">
          Unit price: ${item.price.toFixed(2)}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 6. COOKIE DIVISION (math-operators & quiz-1-q0) ==================== */
function CookieDivisionScene({ compact }: { compact?: boolean }) {
  const [totalCookies, setTotalCookies] = useState(17);
  const [studentCount, setStudentCount] = useState(5);

  const wholeEach = Math.floor(totalCookies / studentCount);
  const usedCookies = wholeEach * studentCount;
  const leftovers = totalCookies % studentCount;
  const exactShare = formatPythonDivision(totalCookies, studentCount);

  // Dynamically size and space plates inside x = 20..410 so 2..5 plates always look balanced
  const platesAreaWidth = 390;
  const plateGap = 10;
  const plateWidth = Math.min(92, (platesAreaWidth - plateGap * (studentCount - 1)) / studentCount);
  const totalPlatesWidth = studentCount * plateWidth + (studentCount - 1) * plateGap;
  const platesStartX = 20 + (platesAreaWidth - totalPlatesWidth) / 2;

  return (
    <SceneFrame
      tag="Interactive Cookie Sharing Simulator"
      compact={compact}
      onReset={() => {
        setTotalCookies(17);
        setStudentCount(5);
      }}
      controls={
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Cookies:</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setTotalCookies((c) => Math.max(1, c - 1))}>-</Button>
            <span className="w-6 text-center font-mono text-xs font-bold">{totalCookies}</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setTotalCookies((c) => Math.min(25, c + 1))}>+</Button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Students:</span>
            {[2, 3, 4, 5].map((cnt) => (
              <Button key={cnt} type="button" size="xs" variant={studentCount === cnt ? "default" : "outline"} onClick={() => setStudentCount(cnt)}>
                {cnt}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-muted-foreground">Try:</span>
            {[
              { c: 17, s: 5, label: "17 ÷ 5" },
              { c: 10, s: 2, label: "10 ÷ 2" },
              { c: 7, s: 3, label: "7 ÷ 3" },
            ].map((ex) => (
              <Button
                key={ex.label}
                type="button"
                size="xs"
                variant={totalCookies === ex.c && studentCount === ex.s ? "secondary" : "ghost"}
                onClick={() => {
                  setTotalCookies(ex.c);
                  setStudentCount(ex.s);
                }}
              >
                {ex.label}
              </Button>
            ))}
          </div>
        </>
      }
      details={
        <div className="space-y-2">
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.07] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                1. Exact Split ( / ) — Decimals allowed
              </span>
              <span className="rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                {exactShare}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {leftovers === 0
                ? `Splits evenly! In Python, / always returns a decimal (${exactShare}).`
                : `If you cut the ${leftovers} leftover cookie(s) into pieces, each gets ${exactShare}.`}
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/35 bg-amber-500/[0.08] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                2. Whole Share ( // ) — Whole cookies only
              </span>
              <span className="rounded bg-amber-500 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-950">
                {wholeEach} each
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Each of the {studentCount} students gets {wholeEach} whole cookie(s) ({studentCount} × {wholeEach} = {usedCookies} given).
            </p>
          </div>

          <div className="rounded-xl border border-violet-500/30 bg-violet-500/[0.07] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">
                3. Remainder ( % ) — Left in the jar
              </span>
              <span className="rounded bg-violet-600 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                {leftovers} left
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {leftovers === 0
                ? `Nothing left over! ${totalCookies} − ${usedCookies} = 0.`
                : `${totalCookies} − ${usedCookies} = ${leftovers} cookie(s) left that cannot split evenly.`}
            </p>
          </div>
        </div>
      }
      ruleText={
        leftovers === 0
          ? `${totalCookies} divides evenly by ${studentCount}: / gives ${exactShare} (decimal), // gives ${wholeEach} (whole), and % leaves 0.`
          : `${studentCount} × ${wholeEach} = ${usedCookies} whole cookies handed out (//), leaving ${leftovers} in the jar (%). Cutting them gives ${exactShare} (/).`
      }
      previewCode={`${totalCookies} / ${studentCount}   # -> ${exactShare}\n${totalCookies} // ${studentCount}  # -> ${wholeEach}\n${totalCookies} % ${studentCount}   # -> ${leftovers}`}
    >
      <svg viewBox="0 0 600 218" className={SVG_FRAME_CLASS}>
        {/* Top Starting Pile Banner */}
        <rect x="20" y="12" width="560" height="28" rx="8" className="fill-slate-200/70 dark:fill-slate-800/80" />
        <text x="300" y="30" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[12px] font-semibold">
          Start with {totalCookies} cookies → Share among {studentCount} students ({usedCookies} given out + {leftovers} left over)
        </text>

        {/* Centered Student Plates */}
        {Array.from({ length: studentCount }).map((_, pIdx) => {
          const x = platesStartX + pIdx * (plateWidth + plateGap);
          const shownCookies = Math.min(wholeEach, 6);
          return (
            <g key={pIdx}>
              <rect
                x={x}
                y="50"
                width={plateWidth}
                height="112"
                rx="12"
                className="fill-white stroke-amber-400 dark:fill-slate-950"
                strokeWidth="2"
              />
              <text
                x={x + plateWidth / 2}
                y="68"
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-300 text-[10px] font-bold"
              >
                Student {pIdx + 1}
              </text>
              {shownCookies === 0 ? (
                <text
                  x={x + plateWidth / 2}
                  y="112"
                  textAnchor="middle"
                  className="fill-slate-400 text-[11px] font-mono"
                >
                  0 whole
                </text>
              ) : (
                Array.from({ length: shownCookies }).map((__, cIdx) => {
                  const cols = shownCookies === 1 ? 1 : 2;
                  const col = cIdx % cols;
                  const row = Math.floor(cIdx / cols);
                  const offsetX = cols === 1 ? 0 : (col - 0.5) * 22;
                  return (
                    <circle
                      key={cIdx}
                      cx={x + plateWidth / 2 + offsetX}
                      cy={88 + row * 21}
                      r="8"
                      className="fill-amber-400 stroke-amber-700"
                      strokeWidth="1.5"
                    />
                  );
                })
              )}
              <text
                x={x + plateWidth / 2}
                y="152"
                textAnchor="middle"
                className="fill-amber-800 dark:fill-amber-300 text-[11px] font-mono font-bold"
              >
                {wholeEach} whole
              </text>
            </g>
          );
        })}

        {/* Leftover Jar */}
        <rect
          x="426"
          y="50"
          width="154"
          height="112"
          rx="14"
          className="fill-violet-50 stroke-violet-500 dark:fill-violet-950/50"
          strokeWidth="2.5"
        />
        <text
          x="503"
          y="69"
          textAnchor="middle"
          className="fill-violet-700 dark:fill-violet-300 text-[11px] font-bold"
        >
          LEFTOVER JAR (%)
        </text>
        {leftovers === 0 ? (
          <text
            x="503"
            y="110"
            textAnchor="middle"
            className="fill-violet-500/80 dark:fill-violet-300/80 text-[12px] font-semibold"
          >
            Empty! (0 left)
          </text>
        ) : (
          Array.from({ length: Math.min(leftovers, 6) }).map((_, lIdx) => {
            const cols = Math.min(leftovers, 3);
            const col = lIdx % 3;
            const row = Math.floor(lIdx / 3);
            const startCookieX = 503 - ((cols - 1) * 28) / 2;
            return (
              <circle
                key={lIdx}
                cx={startCookieX + col * 28}
                cy={96 + row * 24}
                r="9.5"
                className="fill-violet-400 stroke-violet-700"
                strokeWidth="1.5"
              />
            );
          })
        )}
        <text
          x="503"
          y="151"
          textAnchor="middle"
          className="fill-violet-800 dark:fill-violet-200 text-[11px] font-mono font-bold"
        >
          {totalCookies} − {usedCookies} = {leftovers} left
        </text>

        {/* Bottom 3 Distinct Result Pills */}
        <rect x="20" y="174" width="180" height="32" rx="8" className="fill-blue-600/12 stroke-blue-500/40" strokeWidth="1.5" />
        <text x="110" y="194" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[12px] font-mono font-bold">
          / Exact: {exactShare}
        </text>

        <rect x="210" y="174" width="180" height="32" rx="8" className="fill-amber-500/15 stroke-amber-500/45" strokeWidth="1.5" />
        <text x="300" y="194" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300 text-[12px] font-mono font-bold">
          {"//"} Whole: {wholeEach} each
        </text>

        <rect x="400" y="174" width="180" height="32" rx="8" className="fill-violet-600/12 stroke-violet-500/40" strokeWidth="1.5" />
        <text x="490" y="194" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300 text-[12px] font-mono font-bold">
          % Leftover: {leftovers}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 7. COMPARISON THRESHOLDS ==================== */
function ThresholdGaugeScene({ compact }: { compact?: boolean }) {
  const [examScore, setExamScore] = useState(85);
  const [passingScore, setPassingScore] = useState(60);

  const passed = examScore >= passingScore;
  const perfect = examScore === 100;
  const notZero = examScore !== 0;
  const validRange = examScore >= 0 && examScore <= 100;
  const markerX = 40 + Math.min(110, Math.max(0, examScore)) * 5;
  const passX = 40 + passingScore * 5;

  return (
    <SceneFrame
      tag="Interactive Score Threshold Checker"
      compact={compact}
      onReset={() => {
        setExamScore(85);
        setPassingScore(60);
      }}
      controls={
        <>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            exam_score ({examScore}):
            <input type="range" min={0} max={110} value={examScore} onChange={(e) => setExamScore(Number(e.target.value))} className="w-28 accent-blue-600" />
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            passing_score ({passingScore}):
            <input type="range" min={40} max={80} step={5} value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} className="w-24 accent-amber-500" />
          </label>
        </>
      }
      ruleText={`At ${examScore} points (pass mark ${passingScore}), Passed is ${passed ? "True" : "False"} and Valid 0..100 is ${validRange ? "True" : "False"}.`}
      previewCode={`exam_score >= ${passingScore} -> ${passed ? "True" : "False"}\n0 <= exam_score <= 100 -> ${validRange ? "True" : "False"}`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <text x="40" y="30" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-bold">
          SCORE METER (0 .. 100 valid zone)
        </text>
        <rect x="40" y="42" width="500" height="22" rx="11" className="fill-emerald-500/20 stroke-emerald-500/40" strokeWidth="1.5" />
        <rect x="540" y="42" width="60" height="22" rx="8" className="fill-rose-500/20 stroke-rose-500/40" strokeWidth="1.5" />
        <line x1={passX} y1="34" x2={passX} y2="74" className="stroke-amber-500" strokeWidth="3" />
        <text x={passX} y="88" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 text-[10px] font-mono font-bold">
          pass={passingScore}
        </text>
        <circle cx={markerX} cy="53" r="10" className="fill-blue-600 stroke-white" strokeWidth="2.5" />
        <text x={markerX} y="27" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[12px] font-mono font-bold">
          {examScore}
        </text>

        {[
          { label: `score >= ${passingScore}`, val: passed, x: 24 },
          { label: "score == 100", val: perfect, x: 174 },
          { label: "score != 0", val: notZero, x: 324 },
          { label: "0 <= score <= 100", val: validRange, x: 474 },
        ].map((c) => (
          <g key={c.label}>
            <rect
              x={c.x}
              y="102"
              width="140"
              height="48"
              rx="10"
              className={c.val ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" : "fill-rose-50 stroke-rose-400 dark:fill-rose-950/40"}
              strokeWidth="2"
            />
            <text x={c.x + 70} y="122" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10px] font-mono font-bold">
              {c.label}
            </text>
            <text x={c.x + 70} y="140" textAnchor="middle" className={c.val ? "fill-emerald-700 dark:fill-emerald-300 text-[12px] font-mono font-bold" : "fill-rose-600 dark:fill-rose-300 text-[12px] font-mono font-bold"}>
              {c.val ? "True" : "False"}
            </text>
          </g>
        ))}
      </svg>
    </SceneFrame>
  );
}

/* ==================== 8. LOGICAL OPERATORS ==================== */
function LogicGatesScene({ compact }: { compact?: boolean }) {
  const [examScore, setExamScore] = useState(85);
  const [hasStudentId, setHasStudentId] = useState(true);
  const [hasScholarship, setHasScholarship] = useState(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);

  const canTakeExam = examScore >= 60 && hasStudentId;
  const getsDiscount = hasStudentId || hasScholarship;
  const canLogin = !isAccountLocked;

  return (
    <SceneFrame
      tag="Interactive Rule Gates (and / or / not)"
      compact={compact}
      onReset={() => {
        setExamScore(85);
        setHasStudentId(true);
        setHasScholarship(false);
        setIsAccountLocked(false);
      }}
      controls={
        <>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            exam_score ({examScore}):
            <input type="range" min={30} max={100} step={5} value={examScore} onChange={(e) => setExamScore(Number(e.target.value))} className="w-24 accent-blue-600" />
          </label>
          <Button type="button" size="xs" variant={hasStudentId ? "default" : "outline"} onClick={() => setHasStudentId((v) => !v)}>
            has_student_id: {hasStudentId ? "True" : "False"}
          </Button>
          <Button type="button" size="xs" variant={hasScholarship ? "default" : "outline"} onClick={() => setHasScholarship((v) => !v)}>
            has_scholarship: {hasScholarship ? "True" : "False"}
          </Button>
          <Button type="button" size="xs" variant={isAccountLocked ? "destructive" : "outline"} onClick={() => setIsAccountLocked((v) => !v)}>
            is_account_locked: {isAccountLocked ? "True" : "False"}
          </Button>
        </>
      }
      ruleText={`"and" needs BOTH True (${canTakeExam ? "True" : "False"}), "or" needs ANY ONE True (${getsDiscount ? "True" : "False"}), and "not" flips locked=${isAccountLocked ? "True" : "False"} to ${canLogin ? "True" : "False"}.`}
      previewCode={`can_take_exam = ${canTakeExam ? "True" : "False"}\ngets_discount = ${getsDiscount ? "True" : "False"}\ncan_login     = ${canLogin ? "True" : "False"}`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        {[
          {
            title: "1. Exam Door (and)",
            cond: `score>=60 (${examScore >= 60 ? "T" : "F"}) & ID (${hasStudentId ? "T" : "F"})`,
            open: canTakeExam,
            x: 20,
          },
          {
            title: "2. Discount Desk (or)",
            cond: `ID (${hasStudentId ? "T" : "F"}) or Scholar (${hasScholarship ? "T" : "F"})`,
            open: getsDiscount,
            x: 225,
          },
          {
            title: "3. Login Gate (not)",
            cond: `not locked (${isAccountLocked ? "True" : "False"})`,
            open: canLogin,
            x: 430,
          },
        ].map((g) => (
          <g key={g.title}>
            <rect
              x={g.x}
              y="18"
              width="190"
              height="130"
              rx="14"
              className={g.open ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" : "fill-rose-50 stroke-rose-400 dark:fill-rose-950/45"}
              strokeWidth="2.5"
            />
            <text x={g.x + 95} y="42" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[12px] font-bold">
              {g.title}
            </text>
            <text x={g.x + 95} y="66" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10.5px] font-mono">
              {g.cond}
            </text>
            <rect x={g.x + 35} y="84" width="120" height="42" rx="10" className={g.open ? "fill-emerald-600" : "fill-rose-600"} />
            <text x={g.x + 95} y="110" textAnchor="middle" className="fill-white text-[14px] font-mono font-bold">
              {g.open ? "OPEN (True)" : "DENIED (False)"}
            </text>
          </g>
        ))}
      </svg>
    </SceneFrame>
  );
}

/* ==================== 9. IF / ELIF / ELSE WATERFALL (if-elif-else & quiz-1-q1) ==================== */
function WaterfallScene({ mode, compact }: { mode: "grade" | "thermostat"; compact?: boolean }) {
  const defaultVal = mode === "grade" ? 84 : 25;
  const [val, setVal] = useState(defaultVal);

  const branches =
    mode === "grade"
      ? [
          { label: "if score >= 90:", result: 'grade = "A"', match: val >= 90 },
          { label: "elif score >= 80:", result: 'grade = "B"', match: val < 90 && val >= 80 },
          { label: "elif score >= 70:", result: 'grade = "C"', match: val < 80 && val >= 70 },
          { label: "else:", result: 'grade = "Needs Review"', match: val < 70 },
        ]
      : [
          { label: "if temperature > 30:", result: 'print("Hot")', match: val > 30 },
          { label: "elif temperature > 20:", result: 'print("Warm")', match: val <= 30 && val > 20 },
          { label: "else:", result: 'print("Cool")', match: val <= 20 },
        ];

  const matched = branches.find((b) => b.match) || branches[branches.length - 1];

  return (
    <SceneFrame
      tag={mode === "grade" ? "Interactive Grade Waterfall" : "Interactive Smart Thermostat"}
      compact={compact}
      onReset={() => setVal(defaultVal)}
      controls={
        <>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            {mode === "grade" ? `score (${val}):` : `temperature (${val}°C):`}
            <input
              type="range"
              min={mode === "grade" ? 50 : 5}
              max={mode === "grade" ? 100 : 40}
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-28 accent-blue-600"
            />
          </label>
          {(mode === "grade" ? [95, 84, 73, 62] : [35, 25, 15]).map((preset) => (
            <Button key={preset} type="button" size="xs" variant={val === preset ? "default" : "outline"} onClick={() => setVal(preset)}>
              {preset}{mode === "thermostat" ? "°C" : ""}
            </Button>
          ))}
        </>
      }
      ruleText={`Checking top-to-bottom at ${val}${mode === "thermostat" ? "°C" : ""}, "${matched.label}" matches first, runs "${matched.result}", and skips branches below.`}
      previewCode={`${mode === "grade" ? "score" : "temperature"} = ${val}\n# -> ${matched.result}`}
    >
      <svg viewBox="0 0 640 175" className={SVG_FRAME_CLASS}>
        <rect x="24" y="20" width="135" height="135" rx="14" className="fill-white stroke-blue-500 dark:fill-slate-950" strokeWidth="2.5" />
        <text x="91" y="48" textAnchor="middle" className="fill-slate-500 text-[11px] font-bold">
          {mode === "grade" ? "SCORE INPUT" : "TEMP (°C)"}
        </text>
        <text x="91" y="96" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[34px] font-mono font-bold">
          {val}{mode === "thermostat" ? "°" : ""}
        </text>
        <text x="91" y="132" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 text-[12px] font-mono font-bold">
          → {matched.result}
        </text>

        {branches.map((b, idx) => {
          const y = 18 + idx * (mode === "grade" ? 36 : 46);
          const h = mode === "grade" ? 30 : 38;
          return (
            <g key={b.label}>
              <rect
                x="184"
                y={y}
                width="430"
                height={h}
                rx="8"
                className={b.match ? "fill-emerald-500/18 stroke-emerald-500" : "fill-slate-200/50 stroke-slate-300 dark:fill-slate-800/40 dark:stroke-slate-700"}
                strokeWidth={b.match ? "2.5" : "1"}
              />
              <text x="200" y={y + h / 2 + 4} className={b.match ? "fill-emerald-900 dark:fill-emerald-200 text-[12px] font-mono font-bold" : "fill-slate-400 text-[12px] font-mono"}>
                {b.label}
              </text>
              <text x="415" y={y + h / 2 + 4} className={b.match ? "fill-emerald-700 dark:fill-emerald-300 text-[12px] font-mono font-bold" : "fill-slate-400 text-[12px] font-mono"}>
                {b.result}
              </text>
              <text x="598" y={y + h / 2 + 4} textAnchor="end" className={b.match ? "fill-emerald-600 text-[11px] font-bold" : "fill-slate-400 text-[10px]"}>
                {b.match ? "FIRST MATCH ✓" : "skipped"}
              </text>
            </g>
          );
        })}
      </svg>
    </SceneFrame>
  );
}

/* ==================== 10. ORDER SCREEN (quiz-1-q2) ==================== */
function OrderScreenScene({ compact }: { compact?: boolean }) {
  const [status, setStatus] = useState<"preparing" | "ready" | "picked_up">("ready");
  const isReady = status === "ready";

  return (
    <SceneFrame
      tag="Interactive Pickup Screen Checker"
      compact={compact}
      onReset={() => setStatus("ready")}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Set order_status:</span>
          {(["preparing", "ready", "picked_up"] as const).map((s) => (
            <Button key={s} type="button" size="xs" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)}>
              &quot;{s}&quot;
            </Button>
          ))}
        </>
      }
      ruleText={`Use == (not =) to ask a Yes/No comparison, and end every if line with a colon (:). Currently order_status == "ready" is ${isReady ? "True" : "False"}.`}
      previewCode={`order_status = "${status}"\nif order_status == "ready":  # ${isReady ? "True" : "False"}`}
    >
      <svg viewBox="0 0 640 155" className={SVG_FRAME_CLASS}>
        <rect x="28" y="20" width="250" height="115" rx="14" className="fill-white stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700" strokeWidth="2" />
        <text x="153" y="48" textAnchor="middle" className="fill-slate-500 text-[11px] font-bold">KITCHEN ORDER #108</text>
        <text x="153" y="88" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[20px] font-mono font-bold">
          &quot;{status}&quot;
        </text>
        <text x="153" y="116" textAnchor="middle" className="fill-slate-500 text-[11px] font-mono">
          order_status == &quot;ready&quot; → {isReady ? "True" : "False"}
        </text>

        <line x1="286" y1="78" x2="340" y2="78" className="stroke-slate-400" strokeWidth="3" />
        <polygon points="340,71 354,78 340,85" className="fill-slate-400" />

        <rect x="362" y="20" width="250" height="115" rx="14" className={isReady ? "fill-emerald-600" : "fill-slate-800"} />
        <text x="487" y="68" textAnchor="middle" className="fill-white text-[18px] font-bold">
          {isReady ? "READY FOR PICKUP ✓" : status === "preparing" ? "STILL COOKING..." : "COMPLETED"}
        </text>
        <text x="487" y="102" textAnchor="middle" className={isReady ? "fill-emerald-100 text-[12px] font-mono" : "fill-slate-400 text-[12px] font-mono"}>
          {isReady ? 'if order_status == "ready": runs!' : "Condition is False — skipped"}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 11. WHY LOOPS ==================== */
function LoopScaleScene({ compact }: { compact?: boolean }) {
  const [days, setDays] = useState(5);

  return (
    <SceneFrame
      tag="Interactive Loop Scaling Comparison"
      compact={compact}
      onReset={() => setDays(5)}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Days to send:</span>
          {[3, 5, 30, 365, 1000].map((d) => (
            <Button key={d} type="button" size="xs" variant={days === d ? "default" : "outline"} onClick={() => setDays(d)}>
              {d} days
            </Button>
          ))}
        </>
      }
      ruleText={`Repeating ${days} reminders manually takes ${days} separate lines, while one loop handles all ${days} days in just 2 lines.`}
      previewCode={`for day in range(1, ${days + 1}):\n    print("Day", day)`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <rect x="24" y="20" width="275" height="124" rx="14" className="fill-rose-50 stroke-rose-400 dark:fill-rose-950/40" strokeWidth="2" />
        <text x="161" y="46" textAnchor="middle" className="fill-rose-700 dark:fill-rose-300 text-[12px] font-bold">
          WITHOUT A LOOP (Copy-Paste)
        </text>
        <text x="161" y="92" textAnchor="middle" className="fill-rose-700 dark:fill-rose-200 text-[32px] font-mono font-bold">
          {days} lines
        </text>
        <text x="161" y="122" textAnchor="middle" className="fill-rose-600 dark:fill-rose-300 text-[11px]">
          Breaks down as work grows
        </text>

        <rect x="336" y="20" width="280" height="124" rx="14" className="fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/45" strokeWidth="2.5" />
        <text x="476" y="46" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[12px] font-bold">
          WITH A for LOOP
        </text>
        <text x="476" y="92" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-200 text-[32px] font-mono font-bold">
          2 lines
        </text>
        <text x="476" y="122" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[11px] font-mono">
          for day in range(1, {days + 1}):
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 12. FOR LOOP ACCUMULATOR ==================== */
function AccumulatorScene({ compact }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  const nums = [1, 2, 3, 4];
  const currentTotal = nums.slice(0, step).reduce((a, b) => a + b, 0);

  return (
    <SceneFrame
      tag="Interactive Cash Drawer Accumulator"
      compact={compact}
      onReset={() => setStep(0)}
      controls={
        <>
          <Button type="button" size="xs" onClick={() => setStep((s) => (s < nums.length ? s + 1 : 0))}>
            <Play className="fill-current" />
            {step < nums.length ? `Add Next (#${step + 1})` : "Restart Loop"}
          </Button>
          <Button type="button" size="xs" variant="outline" onClick={() => setStep(nums.length)}>
            Run All (1..4)
          </Button>
        </>
      }
      ruleText={
        step === 0
          ? "Start with total = 0 before the loop begins. Click Add Next to drop each number in."
          : `Step ${step}: Added ${nums[step - 1]} onto total -> running sum is now ${currentTotal}.`
      }
      previewCode={`number = ${step > 0 ? nums[step - 1] : "None (start)"}\ntotal = ${currentTotal}`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        {nums.map((n, idx) => {
          const added = idx < step;
          const current = idx === step - 1;
          const x = 28 + idx * 96;
          return (
            <g key={n}>
              <rect
                x={x}
                y="36"
                width="76"
                height="90"
                rx="12"
                className={current ? "fill-blue-600 stroke-blue-700" : added ? "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/60" : "fill-white stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"}
                strokeWidth="2.5"
              />
              <text x={x + 38} y="74" textAnchor="middle" className={current ? "fill-white text-[22px] font-mono font-bold" : "fill-slate-800 dark:fill-slate-100 text-[22px] font-mono font-bold"}>
                +{n}
              </text>
              <text x={x + 38} y="108" textAnchor="middle" className={current ? "fill-blue-100 text-[10px] font-bold" : added ? "fill-emerald-700 dark:fill-emerald-300 text-[10px] font-bold" : "fill-slate-400 text-[10px]"}>
                {current ? "ADDED NOW" : added ? "counted" : "waiting"}
              </text>
            </g>
          );
        })}

        <rect x="434" y="24" width="182" height="114" rx="14" className="fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" strokeWidth="2.5" />
        <text x="525" y="52" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[11px] font-mono font-bold">
          RUNNING total
        </text>
        <text x="525" y="106" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-200 text-[36px] font-mono font-bold">
          {currentTotal}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 13. WHILE COUNTDOWN ==================== */
function CountdownScene({ compact }: { compact?: boolean }) {
  const [startCount, setStartCount] = useState(3);
  const [count, setCount] = useState(3);
  const launched = count <= 0;

  return (
    <SceneFrame
      tag="Interactive Rocket Countdown"
      compact={compact}
      onReset={() => setCount(startCount)}
      controls={
        <>
          <Button type="button" size="xs" disabled={launched} onClick={() => setCount((c) => Math.max(0, c - 1))}>
            Tick -1 Second
          </Button>
          <span className="text-xs font-semibold text-muted-foreground">Start from:</span>
          {[2, 3, 5].map((s) => (
            <Button
              key={s}
              type="button"
              size="xs"
              variant={startCount === s ? "default" : "outline"}
              onClick={() => {
                setStartCount(s);
                setCount(s);
              }}
            >
              {s}
            </Button>
          ))}
        </>
      }
      ruleText={
        launched
          ? "count reached 0, so count > 0 became False — the while loop stopped and Liftoff ran!"
          : `count is ${count} (> 0 is True), so the loop prints T-minus ${count} and subtracts 1.`
      }
      previewCode={`count = ${count}  # count > 0 is ${count > 0 ? "True" : "False"}`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <rect x="28" y="22" width="250" height="120" rx="14" className="fill-slate-900" />
        <text x="153" y="50" textAnchor="middle" className="fill-sky-400 text-[11px] font-mono font-bold">
          while count &gt; 0:
        </text>
        <text x="153" y="96" textAnchor="middle" className={launched ? "fill-emerald-400 text-[28px] font-mono font-bold" : "fill-amber-300 text-[34px] font-mono font-bold"}>
          {launched ? "LIFTOFF!" : `T-minus ${count}`}
        </text>
        <text x="153" y="126" textAnchor="middle" className="fill-slate-400 text-[11px] font-mono">
          {count} &gt; 0 is {count > 0 ? "True (keep looping)" : "False (exit!)"}
        </text>

        <rect x="310" y="22" width="302" height="120" rx="14" className={launched ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/45" : "fill-amber-50 stroke-amber-400 dark:fill-amber-950/35"} strokeWidth="2" />
        <g transform={`translate(461, ${launched ? 42 : 76})`}>
          <polygon points="0,-24 -16,12 16,12" className="fill-blue-600" />
          <rect x="-10" y="12" width="20" height="16" rx="3" className="fill-slate-700" />
          {launched && <polygon points="-8,28 0,50 8,28" className="fill-amber-500" />}
        </g>
        <text x="461" y="128" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[12px] font-bold">
          {launched ? "Loop finished — Rocket launched!" : "Waiting for count to reach 0"}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 14. BREAK VS CONTINUE ==================== */
function ConveyorScene({ compact }: { compact?: boolean }) {
  const [mode, setMode] = useState<"continue" | "break">("continue");
  const boxes = [1, 2, 3, 4, 5];

  return (
    <SceneFrame
      tag="Interactive Conveyor Belt Scanner"
      compact={compact}
      onReset={() => setMode("continue")}
      controls={
        <>
          <Button type="button" size="xs" variant={mode === "continue" ? "default" : "outline"} onClick={() => setMode("continue")}>
            Mode: continue (skip #3)
          </Button>
          <Button type="button" size="xs" variant={mode === "break" ? "destructive" : "outline"} onClick={() => setMode("break")}>
            Mode: break (stop at #4)
          </Button>
        </>
      }
      ruleText={
        mode === "continue"
          ? "continue skips ONLY turn #3 and keeps scanning boxes #4 and #5."
          : "break halts the conveyor immediately at #4 — box #5 is never visited."
      }
      previewCode={
        mode === "continue"
          ? "Output: 1 2 4 5  (#3 skipped)"
          : "Output: 1 2 3    (stopped at #4)"
      }
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <line x1="28" y1="128" x2="612" y2="128" className="stroke-slate-400" strokeWidth="6" strokeLinecap="round" />
        {boxes.map((num, idx) => {
          const x = 40 + idx * 116;
          const isSkip = mode === "continue" && num === 3;
          const isStop = mode === "break" && num === 4;
          const isUnreached = mode === "break" && num > 4;
          const boxClass = isSkip
            ? "fill-amber-100 stroke-amber-500 dark:fill-amber-950/60"
            : isStop
              ? "fill-rose-100 stroke-rose-500 dark:fill-rose-950/60"
              : isUnreached
                ? "fill-slate-100 stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-700"
                : "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/55";
          const label = isSkip ? "SKIP (continue)" : isStop ? "STOP (break)" : isUnreached ? "never reached" : `Printed ${num}`;
          return (
            <g key={num}>
              <rect x={x} y="30" width="96" height="86" rx="12" className={boxClass} strokeWidth="2.5" />
              <text x={x + 48} y="68" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[22px] font-mono font-bold">
                #{num}
              </text>
              <text x={x + 48} y="98" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10px] font-bold">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </SceneFrame>
  );
}

/* ==================== 15. LISTS INDEXING (lists-basics & quiz-2-q0) ==================== */
function BasketIndexScene({ compact }: { compact?: boolean }) {
  const [selectedIdx, setSelectedIdx] = useState(2);
  const [replaced, setReplaced] = useState(false);
  const fruits = ["apple", replaced ? "blueberry" : "banana", "cherry", "mango"];
  const negIdx = selectedIdx - fruits.length;

  return (
    <SceneFrame
      tag="Interactive Fruit Basket Indexing"
      compact={compact}
      onReset={() => {
        setSelectedIdx(2);
        setReplaced(false);
      }}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Pick index:</span>
          {fruits.map((_, idx) => (
            <Button key={idx} type="button" size="xs" variant={selectedIdx === idx ? "default" : "outline"} onClick={() => setSelectedIdx(idx)}>
              [{idx}] / [{idx - 4}]
            </Button>
          ))}
          <Button type="button" size="xs" variant="secondary" onClick={() => setReplaced((r) => !r)}>
            {replaced ? "Restore banana" : 'Replace [1] -> "blueberry"'}
          </Button>
        </>
      }
      ruleText={`Both positive fruits[${selectedIdx}] and negative fruits[${negIdx}] point to "${fruits[selectedIdx]}".`}
      previewCode={`fruits[${selectedIdx}] == fruits[${negIdx}] == "${fruits[selectedIdx]}"`}
    >
      <svg viewBox="0 0 640 175" className={SVG_FRAME_CLASS}>
        {fruits.map((f, idx) => {
          const x = 32 + idx * 148;
          const active = idx === selectedIdx;
          const neg = idx - fruits.length;
          return (
            <g key={idx}>
              <text x={x + 64} y="30" textAnchor="middle" className={active ? "fill-blue-600 dark:fill-blue-300 text-[12px] font-mono font-bold" : "fill-slate-400 text-[12px] font-mono"}>
                [{idx}]
              </text>
              <rect
                x={x}
                y="40"
                width="128"
                height="88"
                rx="14"
                className={active ? "fill-blue-600 stroke-blue-700" : "fill-white stroke-emerald-400 dark:fill-slate-950"}
                strokeWidth={active ? "3" : "2"}
              />
              <text x={x + 64} y="90" textAnchor="middle" className={active ? "fill-white text-[16px] font-mono font-bold" : "fill-slate-900 dark:fill-slate-100 text-[16px] font-mono font-bold"}>
                &quot;{f}&quot;
              </text>
              <text x={x + 64} y="152" textAnchor="middle" className={active ? "fill-violet-600 dark:fill-violet-300 text-[12px] font-mono font-bold" : "fill-slate-400 text-[12px] font-mono"}>
                [{neg}]
              </text>
            </g>
          );
        })}
      </svg>
    </SceneFrame>
  );
}

/* ==================== 16. LIST SLICING (lists-methods-slicing & quiz-2-q1) ==================== */
function SliceWindowScene({ mode, compact }: { mode: "scores5" | "scores4"; compact?: boolean }) {
  const defaultItems = mode === "scores5" ? [72, 95, 88, 64, 91] : [10, 20, 30, 40];
  const defaultStop = mode === "scores5" ? 4 : 3;
  const [start, setStart] = useState(1);
  const [stop, setStop] = useState(defaultStop);

  const sliced = defaultItems.slice(start, stop);

  return (
    <SceneFrame
      tag="Interactive Slice Range Window"
      compact={compact}
      onReset={() => {
        setStart(1);
        setStop(defaultStop);
      }}
      controls={
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">start:</span>
            {[0, 1, 2].map((s) => (
              <Button key={s} type="button" size="xs" variant={start === s ? "default" : "outline"} onClick={() => setStart(Math.min(s, stop))}>
                {s}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">stop (excluded):</span>
            {Array.from({ length: defaultItems.length }, (_, k) => k + 1).map((st) => (
              <Button key={st} type="button" size="xs" variant={stop === st ? "default" : "outline"} onClick={() => setStop(Math.max(st, start))}>
                {st}
              </Button>
            ))}
          </div>
        </>
      }
      ruleText={`scores[${start}:${stop}] starts at index ${start} and stops BEFORE index ${stop}, copying [${sliced.join(", ")}].`}
      previewCode={`scores[${start}:${stop}] -> [${sliced.join(", ")}]`}
    >
      <svg viewBox="0 0 640 160" className={SVG_FRAME_CLASS}>
        {defaultItems.map((item, idx) => {
          const w = mode === "scores5" ? 108 : 135;
          const gap = 16;
          const x = 30 + idx * (w + gap);
          const inside = idx >= start && idx < stop;
          const isStopWall = idx === stop;
          return (
            <g key={idx}>
              <text x={x + w / 2} y="30" textAnchor="middle" className="fill-slate-500 text-[11px] font-mono">
                index {idx}
              </text>
              <rect
                x={x}
                y="40"
                width={w}
                height="78"
                rx="12"
                className={inside ? "fill-emerald-500/20 stroke-emerald-500" : isStopWall ? "fill-rose-50 stroke-rose-400 dark:fill-rose-950/40" : "fill-white stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"}
                strokeWidth={inside ? "3" : "1.5"}
              />
              <text x={x + w / 2} y="86" textAnchor="middle" className={inside ? "fill-emerald-800 dark:fill-emerald-200 text-[22px] font-mono font-bold" : "fill-slate-500 text-[22px] font-mono"}>
                {item}
              </text>
              <text x={x + w / 2} y="140" textAnchor="middle" className={inside ? "fill-emerald-600 text-[10px] font-bold" : isStopWall ? "fill-rose-500 text-[10px] font-bold" : "fill-slate-400 text-[10px]"}>
                {inside ? "INCLUDED" : isStopWall ? "STOP BEFORE" : "outside"}
              </text>
            </g>
          );
        })}
      </svg>
    </SceneFrame>
  );
}

/* ==================== 17. FILTER FUNNEL ==================== */
function FilterFunnelScene({ compact }: { compact?: boolean }) {
  const [threshold, setThreshold] = useState(85);
  const scores = [72, 95, 88, 64];
  const honors = scores.filter((s) => s >= threshold);

  return (
    <SceneFrame
      tag="Interactive Honor-Roll Filter"
      compact={compact}
      onReset={() => setThreshold(85)}
      controls={
        <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          Honor cutoff (&gt;= {threshold}):
          <input type="range" min={60} max={96} step={5} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-32 accent-emerald-600" />
        </label>
      }
      ruleText={`Looping through [72, 95, 88, 64] and keeping scores >= ${threshold} produces [${honors.join(", ")}].`}
      previewCode={`honors = [${honors.join(", ")}]  # ${honors.length} item(s)`}
    >
      <svg viewBox="0 0 640 160" className={SVG_FRAME_CLASS}>
        {scores.map((s, idx) => {
          const pass = s >= threshold;
          const x = 24 + idx * 94;
          return (
            <g key={s}>
              <rect x={x} y="32" width="78" height="92" rx="12" className={pass ? "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/60" : "fill-slate-100 stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-700"} strokeWidth="2.5" />
              <text x={x + 39} y="76" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[22px] font-mono font-bold">{s}</text>
              <text x={x + 39} y="106" textAnchor="middle" className={pass ? "fill-emerald-700 dark:fill-emerald-300 text-[10px] font-bold" : "fill-slate-400 text-[10px]"}>
                {pass ? `>= ${threshold} ✓` : "skip"}
              </text>
            </g>
          );
        })}

        <rect x="412" y="24" width="204" height="110" rx="14" className="fill-blue-50 stroke-blue-500 dark:fill-blue-950/45" strokeWidth="2.5" />
        <text x="514" y="52" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[11px] font-mono font-bold">
          honors list
        </text>
        <text x="514" y="92" textAnchor="middle" className="fill-blue-950 dark:fill-blue-100 text-[20px] font-mono font-bold">
          [{honors.join(", ")}]
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 18. DICTIONARY PROFILE (dictionaries-basics & quiz-2-q2) ==================== */
function DictProfileScene({ mode, compact }: { mode: "mina" | "sam"; compact?: boolean }) {
  const keys = mode === "mina" ? ["name", "grade", "track", "email"] : ["name", "role"];
  const [selectedKey, setSelectedKey] = useState(mode === "mina" ? "email" : "role");
  const [useGet, setUseGet] = useState(true);

  const data: Record<string, string> =
    mode === "mina"
      ? { name: '"Mina"', grade: "95", track: '"Python"' }
      : { name: '"Sam"' };
  const fallback = mode === "mina" ? '"Not provided"' : '"Guest"';
  const exists = selectedKey in data;
  const output = exists ? data[selectedKey] : useGet ? fallback : "KeyError!";

  return (
    <SceneFrame
      tag="Interactive Dictionary Key Lookup"
      compact={compact}
      onReset={() => {
        setSelectedKey(mode === "mina" ? "email" : "role");
        setUseGet(true);
      }}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Key:</span>
          {keys.map((k) => (
            <Button key={k} type="button" size="xs" variant={selectedKey === k ? "default" : "outline"} onClick={() => setSelectedKey(k)}>
              &quot;{k}&quot;
            </Button>
          ))}
          <Button type="button" size="xs" variant={useGet ? "secondary" : "destructive"} onClick={() => setUseGet((v) => !v)}>
            {useGet ? "Using .get() (Safe)" : "Using [key] (Unsafe)"}
          </Button>
        </>
      }
      ruleText={
        exists
          ? `Key "${selectedKey}" exists, so Python directly returns ${output}.`
          : useGet
            ? `Key "${selectedKey}" is missing, so .get() safely returns fallback ${fallback} without crashing.`
            : `Key "${selectedKey}" is missing and [ ] has no fallback, causing a KeyError crash!`
      }
      previewCode={`${useGet ? `student.get("${selectedKey}", ${fallback})` : `student["${selectedKey}"]`} -> ${output}`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <rect x="24" y="20" width="305" height="125" rx="14" className="fill-white stroke-emerald-500 dark:fill-slate-950" strokeWidth="2.5" />
        <text x="42" y="44" className="fill-emerald-700 dark:fill-emerald-300 text-[11px] font-mono font-bold">
          STUDENT DICTIONARY {"{ key: value }"}
        </text>
        {Object.entries(data).map(([k, v], i) => (
          <g key={k}>
            <rect x="40" y={56 + i * 26} width="270" height="22" rx="6" className={selectedKey === k ? "fill-blue-500/20" : "fill-slate-100 dark:fill-slate-900"} />
            <text x="52" y={71 + i * 26} className="fill-blue-700 dark:fill-blue-300 text-[12px] font-mono font-bold">&quot;{k}&quot;</text>
            <text x="150" y={71 + i * 26} className="fill-slate-400 text-[12px] font-mono">→</text>
            <text x="176" y={71 + i * 26} className="fill-slate-900 dark:fill-slate-100 text-[12px] font-mono font-semibold">{v}</text>
          </g>
        ))}

        <rect
          x="352"
          y="20"
          width="264"
          height="125"
          rx="14"
          className={!exists && !useGet ? "fill-rose-50 stroke-rose-500 dark:fill-rose-950/50" : "fill-blue-50 stroke-blue-500 dark:fill-blue-950/45"}
          strokeWidth="2.5"
        />
        <text x="484" y="48" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-mono font-bold">
          {useGet ? `student.get("${selectedKey}", ${fallback})` : `student["${selectedKey}"]`}
        </text>
        <text x="484" y="96" textAnchor="middle" className={!exists && !useGet ? "fill-rose-600 dark:fill-rose-300 text-[22px] font-mono font-bold" : "fill-blue-700 dark:fill-blue-200 text-[20px] font-mono font-bold"}>
          {output}
        </text>
        <text x="484" y="128" textAnchor="middle" className="fill-slate-500 text-[11px]">
          {exists ? "Key found!" : useGet ? "Safe fallback returned!" : "Crashes because key is missing"}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 19. CAFE MENU DICT LOOP ==================== */
function CafeMenuScene({ compact }: { compact?: boolean }) {
  const [viewMode, setViewMode] = useState<"items" | "keys" | "values">("items");
  const menu = [
    { item: "Coffee", price: 2.5 },
    { item: "Tea", price: 1.8 },
    { item: "Cake", price: 3.2 },
  ];
  const sumAll = menu.reduce((acc, m) => acc + m.price, 0);

  return (
    <SceneFrame
      tag="Interactive Café Menu Board"
      compact={compact}
      onReset={() => setViewMode("items")}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Loop view:</span>
          {(["items", "keys", "values"] as const).map((m) => (
            <Button key={m} type="button" size="xs" variant={viewMode === m ? "default" : "outline"} onClick={() => setViewMode(m)}>
              .{m}()
            </Button>
          ))}
        </>
      }
      ruleText={
        viewMode === "items"
          ? ".items() gives BOTH the drink name (key) and price (value) together on every loop turn."
          : viewMode === "keys"
            ? '.keys() loops over only the drink names ("Coffee", "Tea", "Cake").'
            : `.values() gives just the numbers (2.50, 1.80, 3.20), so sum() totals $${sumAll.toFixed(2)}.`
      }
      previewCode={
        viewMode === "items"
          ? "for item, price in menu.items():"
          : viewMode === "keys"
            ? "for item in menu.keys():"
            : `sum(menu.values()) -> ${sumAll.toFixed(2)}`
      }
    >
      <svg viewBox="0 0 640 160" className={SVG_FRAME_CLASS}>
        {menu.map((m, idx) => {
          const x = 24 + idx * 140;
          return (
            <g key={m.item}>
              <rect x={x} y="24" width="126" height="112" rx="12" className="fill-white stroke-emerald-500 dark:fill-slate-950" strokeWidth="2" />
              <text x={x + 63} y="54" textAnchor="middle" className={viewMode !== "values" ? "fill-blue-600 dark:fill-blue-300 text-[15px] font-bold" : "fill-slate-400 text-[15px]"}>
                {m.item}
              </text>
              <text x={x + 63} y="92" textAnchor="middle" className={viewMode !== "keys" ? "fill-emerald-600 dark:fill-emerald-300 text-[20px] font-mono font-bold" : "fill-slate-400 text-[20px] font-mono"}>
                ${m.price.toFixed(2)}
              </text>
              <text x={x + 63} y="120" textAnchor="middle" className="fill-slate-400 text-[10px]">
                {viewMode === "items" ? "key + value" : viewMode === "keys" ? "key only" : "value only"}
              </text>
            </g>
          );
        })}

        <rect x="454" y="24" width="162" height="112" rx="14" className="fill-amber-50 stroke-amber-500 dark:fill-amber-950/45" strokeWidth="2.5" />
        <text x="535" y="54" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300 text-[11px] font-mono font-bold">
          sum(menu.values())
        </text>
        <text x="535" y="96" textAnchor="middle" className="fill-amber-950 dark:fill-amber-100 text-[26px] font-mono font-bold">
          ${sumAll.toFixed(2)}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 20. FUNCTION BLENDER / MACHINE ==================== */
function FunctionMachineScene({ compact }: { compact?: boolean }) {
  const [price, setPrice] = useState(80);
  const [percent, setPercent] = useState(25);
  const saved = price * (percent / 100);
  const finalPrice = price - saved;

  return (
    <SceneFrame
      tag="Interactive Discount Function Machine"
      compact={compact}
      onReset={() => {
        setPrice(80);
        setPercent(25);
      }}
      controls={
        <>
          <Button type="button" size="xs" variant="outline" onClick={() => { setPrice(80); setPercent(25); }}>
            Jacket ($80, 25%)
          </Button>
          <Button type="button" size="xs" variant="outline" onClick={() => { setPrice(120); setPercent(10); }}>
            Shoes ($120, 10%)
          </Button>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            Discount ({percent}%):
            <input type="range" min={5} max={50} step={5} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-24 accent-amber-500" />
          </label>
        </>
      }
      ruleText={`Write the discount formula once inside apply_discount(price, percent), then reuse it for any item ($${price} at ${percent}% off returns $${finalPrice.toFixed(2)}).`}
      previewCode={`apply_discount(${price}, ${percent}) -> ${finalPrice.toFixed(2)}`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <rect x="24" y="28" width="160" height="108" rx="12" className="fill-blue-50 stroke-blue-500 dark:fill-blue-950/50" strokeWidth="2.5" />
        <text x="104" y="54" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[11px] font-bold">IN: Parameters</text>
        <text x="104" y="84" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[14px] font-mono font-bold">price = ${price}</text>
        <text x="104" y="108" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[14px] font-mono font-bold">percent = {percent}%</text>

        <line x1="188" y1="82" x2="228" y2="82" className="stroke-slate-400" strokeWidth="3" />
        <polygon points="228,75 242,82 228,89" className="fill-slate-400" />

        <rect x="246" y="24" width="165" height="116" rx="14" className="fill-amber-50 stroke-amber-500 dark:fill-amber-950/45" strokeWidth="2.5" />
        <text x="328" y="50" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300 text-[11px] font-bold">DO: apply_discount</text>
        <text x="328" y="84" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-mono">saved = ${saved.toFixed(2)}</text>
        <text x="328" y="110" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-mono">{price} - {saved.toFixed(2)}</text>

        <line x1="415" y1="82" x2="455" y2="82" className="stroke-emerald-500" strokeWidth="3" />
        <polygon points="455,75 469,82 455,89" className="fill-emerald-500" />

        <rect x="473" y="28" width="144" height="108" rx="14" className="fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" strokeWidth="2.5" />
        <text x="545" y="54" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[11px] font-bold">OUT: return</text>
        <text x="545" y="98" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-200 text-[26px] font-mono font-bold">${finalPrice.toFixed(2)}</text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 21. RETURN VS PRINT ==================== */
function ReturnVsPrintScene({ compact }: { compact?: boolean }) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [useReturn, setUseReturn] = useState(true);
  const sum = a + b;

  return (
    <SceneFrame
      tag="Interactive print() vs return Comparison"
      compact={compact}
      onReset={() => {
        setA(3);
        setB(4);
        setUseReturn(true);
      }}
      controls={
        <>
          <Button type="button" size="xs" variant={useReturn ? "default" : "destructive"} onClick={() => setUseReturn((v) => !v)}>
            {useReturn ? "Using return (reusable)" : "Using print() (returns None)"}
          </Button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">a:</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setA((v) => Math.max(1, v - 1))}>-</Button>
            <span className="w-5 text-center font-mono text-xs font-bold">{a}</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setA((v) => Math.min(9, v + 1))}>+</Button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">b:</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setB((v) => Math.max(1, v - 1))}>-</Button>
            <span className="w-5 text-center font-mono text-xs font-bold">{b}</span>
            <Button type="button" size="xs" variant="outline" onClick={() => setB((v) => Math.min(9, v + 1))}>+</Button>
          </div>
        </>
      }
      ruleText={
        useReturn
          ? `return ${sum} gives result a real number (${sum}), so result * 10 cleanly gives ${sum * 10}.`
          : `print(${sum}) shows ${sum} on screen, but result gets None — multiplying None * 10 crashes with TypeError!`
      }
      previewCode={useReturn ? `result = ${sum}  ->  result * 10 == ${sum * 10}` : "result = None  ->  result * 10  # TypeError!"}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <rect x="24" y="24" width="185" height="116" rx="14" className="fill-white stroke-blue-500 dark:fill-slate-950" strokeWidth="2.5" />
        <text x="116" y="50" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300 text-[11px] font-bold">
          Function Computes {a} + {b}
        </text>
        <text x="116" y="88" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[22px] font-mono font-bold">
          {useReturn ? `return ${sum}` : `print(${sum})`}
        </text>
        <text x="116" y="118" textAnchor="middle" className="fill-slate-500 text-[11px]">
          {useReturn ? "Hands value back!" : "Only prints to glass"}
        </text>

        <line x1="214" y1="82" x2="254" y2="82" className={useReturn ? "stroke-emerald-500" : "stroke-rose-400"} strokeWidth="3" />
        <polygon points="254,75 268,82 254,89" className={useReturn ? "fill-emerald-500" : "fill-rose-400"} />

        <rect x="272" y="24" width="160" height="116" rx="14" className={useReturn ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" : "fill-rose-50 stroke-rose-400 dark:fill-rose-950/40"} strokeWidth="2.5" />
        <text x="352" y="50" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-mono font-bold">result = ...</text>
        <text x="352" y="92" textAnchor="middle" className={useReturn ? "fill-emerald-700 dark:fill-emerald-200 text-[28px] font-mono font-bold" : "fill-rose-600 dark:fill-rose-300 text-[24px] font-mono font-bold"}>
          {useReturn ? sum : "None"}
        </text>

        <rect x="454" y="24" width="162" height="116" rx="14" className={useReturn ? "fill-emerald-600" : "fill-rose-600"} />
        <text x="535" y="58" textAnchor="middle" className="fill-white text-[12px] font-mono font-bold">result * 10</text>
        <text x="535" y="98" textAnchor="middle" className="fill-white text-[22px] font-mono font-bold">
          {useReturn ? sum * 10 : "TypeError!"}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 22. DEFAULTS & SCOPE ==================== */
function ScopeBadgeScene({ compact }: { compact?: boolean }) {
  const [name, setName] = useState("Sokha");
  const [customRole, setCustomRole] = useState<string | null>(null);
  const [outsideRead, setOutsideRead] = useState(false);

  const effectiveRole = customRole ?? "Student";
  const badgeText = `Welcome, ${name} (${effectiveRole})!`;

  return (
    <SceneFrame
      tag="Interactive Default Role & Local Scope Wall"
      compact={compact}
      onReset={() => {
        setName("Sokha");
        setCustomRole(null);
        setOutsideRead(false);
      }}
      controls={
        <>
          {["Sokha", "Dr. Chen"].map((n) => (
            <Button key={n} type="button" size="xs" variant={name === n ? "default" : "outline"} onClick={() => setName(n)}>
              name=&quot;{n}&quot;
            </Button>
          ))}
          <Button type="button" size="xs" variant={customRole === null ? "secondary" : "outline"} onClick={() => setCustomRole(null)}>
            Skip role (default)
          </Button>
          <Button type="button" size="xs" variant={customRole === "Instructor" ? "secondary" : "outline"} onClick={() => setCustomRole("Instructor")}>
            role=&quot;Instructor&quot;
          </Button>
          <Button type="button" size="xs" variant={outsideRead ? "destructive" : "outline"} onClick={() => setOutsideRead((v) => !v)}>
            {outsideRead ? "Hide NameError Test" : "Try print(message) Outside"}
          </Button>
        </>
      }
      ruleText={`When role is skipped, Python fills in "Student". Helper variable message exists only inside greet() and cannot be read outside.`}
      previewCode={customRole ? `greet("${name}", role="${customRole}") -> "${badgeText}"` : `greet("${name}") -> "${badgeText}"`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <rect x="24" y="18" width="380" height="128" rx="14" className="fill-blue-50 stroke-blue-500 dark:fill-blue-950/45" strokeWidth="2.5" />
        <text x="42" y="42" className="fill-blue-700 dark:fill-blue-300 text-[11px] font-mono font-bold">
          PRIVATE INSIDE greet(name, role=&quot;Student&quot;)
        </text>
        <text x="42" y="76" className="fill-slate-900 dark:fill-white text-[13px] font-mono">
          role = &quot;{effectiveRole}&quot; {!customRole ? "(default fallback)" : "(custom)"}
        </text>
        <rect x="42" y="92" width="342" height="36" rx="8" className="fill-white stroke-emerald-500 dark:fill-slate-950" strokeWidth="1.5" />
        <text x="213" y="114" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[12px] font-mono font-bold">
          {badgeText}
        </text>

        <rect x="426" y="18" width="190" height="128" rx="14" className={outsideRead ? "fill-rose-50 stroke-rose-500 dark:fill-rose-950/50" : "fill-slate-100 stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-700"} strokeWidth="2" />
        <text x="521" y="46" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-bold">OUTSIDE FUNCTION</text>
        <text x="521" y="88" textAnchor="middle" className={outsideRead ? "fill-rose-600 dark:fill-rose-300 text-[15px] font-mono font-bold" : "fill-slate-500 text-[12px] font-mono"}>
          {outsideRead ? "NameError!" : "message is private"}
        </text>
        <text x="521" y="118" textAnchor="middle" className="fill-slate-500 text-[10px]">
          Local vars stay inside def
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 23. TRY / EXCEPT SHIELD ==================== */
function TryExceptShieldScene({ compact }: { compact?: boolean }) {
  const cases = [
    { a: "10", b: "2", label: '"10" ÷ "2"', ok: true, out: "5.0", trap: "None — succeeds cleanly!" },
    { a: "10", b: "0", label: '"10" ÷ "0"', ok: false, out: "Error: Cannot divide by zero.", trap: "ZeroDivisionError caught!" },
    { a: "abc", b: "2", label: '"abc" ÷ "2"', ok: false, out: "Error: Please enter valid numbers.", trap: "ValueError caught!" },
  ];
  const [idx, setIdx] = useState(0);
  const current = cases[idx];

  return (
    <SceneFrame
      tag="Interactive Error Shield Simulator"
      compact={compact}
      onReset={() => setIdx(0)}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Test inputs:</span>
          {cases.map((c, i) => (
            <Button key={c.label} type="button" size="xs" variant={idx === i ? "default" : "outline"} onClick={() => setIdx(i)}>
              {c.label}
            </Button>
          ))}
        </>
      }
      ruleText={`With inputs ${current.label}: ${current.trap} The app stays alive and returns "${current.out}".`}
      previewCode={`safe_divide("${current.a}", "${current.b}") -> ${current.ok ? current.out : `"${current.out}"`}`}
    >
      <svg viewBox="0 0 640 160" className={SVG_FRAME_CLASS}>
        <rect x="24" y="26" width="160" height="108" rx="12" className="fill-white stroke-blue-500 dark:fill-slate-950" strokeWidth="2" />
        <text x="104" y="54" textAnchor="middle" className="fill-slate-500 text-[11px] font-bold">USER INPUTS</text>
        <text x="104" y="92" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300 text-[18px] font-mono font-bold">{current.label}</text>

        <rect x="218" y="22" width="170" height="116" rx="14" className={current.ok ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" : "fill-amber-50 stroke-amber-500 dark:fill-amber-950/45"} strokeWidth="2.5" />
        <text x="303" y="52" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-bold">try / except SHIELD</text>
        <text x="303" y="92" textAnchor="middle" className={current.ok ? "fill-emerald-700 dark:fill-emerald-300 text-[13px] font-bold" : "fill-amber-800 dark:fill-amber-300 text-[12px] font-bold"}>
          {current.trap}
        </text>

        <rect x="418" y="26" width="198" height="108" rx="14" className={current.ok ? "fill-emerald-600" : "fill-slate-900"} />
        <text x="517" y="54" textAnchor="middle" className="fill-emerald-200 text-[11px] font-bold">SAFE RETURN (NO CRASH)</text>
        <text x="517" y="92" textAnchor="middle" className="fill-white text-[12px] font-mono font-bold">
          {current.out}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 24. BLUEPRINT & INSTANCES ==================== */
function BlueprintInstancesScene({ mode, compact }: { mode: "dog" | "book"; compact?: boolean }) {
  const [count, setCount] = useState(2);
  const items =
    mode === "dog"
      ? [
          { varName: "dog1", label: 'Dog("Milo", 2)', detail: "Milo says: Woof!" },
          { varName: "dog2", label: 'Dog("Luna", 4)', detail: "Luna says: Woof!" },
          { varName: "dog3", label: 'Dog("Coco", 1)', detail: "Coco says: Woof!" },
        ]
      : [
          { varName: "book1", label: 'Book("Python 101")', detail: "title: Python 101" },
          { varName: "book2", label: 'Book("OOP Guide")', detail: "title: OOP Guide" },
          { varName: "book3", label: 'Book("Data Lab")', detail: "title: Data Lab" },
        ];

  const visible = items.slice(0, count);

  return (
    <SceneFrame
      tag="Interactive Blueprint vs Object Copies"
      compact={compact}
      onReset={() => setCount(2)}
      controls={
        <>
          <Button type="button" size="xs" disabled={count >= 3} onClick={() => setCount((c) => Math.min(3, c + 1))}>
            + Stamp Another Object
          </Button>
          <Button type="button" size="xs" variant="outline" disabled={count <= 1} onClick={() => setCount((c) => Math.max(1, c - 1))}>
            Remove Copy
          </Button>
        </>
      }
      ruleText={`You write the ${mode === "dog" ? "Dog" : "Book"} class blueprint once, then stamp ${count} independent object(s) from it.`}
      previewCode={visible.map((v) => `${v.varName} = ${v.label}`).join("\n")}
    >
      <svg viewBox="0 0 640 185" className={SVG_FRAME_CLASS}>
        <rect x="170" y="14" width="300" height="46" rx="10" className="fill-violet-600" />
        <text x="320" y="42" textAnchor="middle" className="fill-white text-[14px] font-mono font-bold">
          {mode === "dog" ? "class Dog: (1 Blueprint)" : "class Book: (1 Blueprint)"}
        </text>

        {visible.map((obj, idx) => {
          const w = 180;
          const totalW = visible.length * w + (visible.length - 1) * 20;
          const startX = (640 - totalW) / 2;
          const x = startX + idx * (w + 20);
          return (
            <g key={obj.varName}>
              <line x1="320" y1="60" x2={x + w / 2} y2="86" className="stroke-violet-400" strokeWidth="2" strokeDasharray="4 3" />
              <rect x={x} y="86" width={w} height="84" rx="12" className="fill-white stroke-emerald-500 dark:fill-slate-950" strokeWidth="2.5" />
              <text x={x + w / 2} y="108" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold">
                {obj.varName} (object)
              </text>
              <text x={x + w / 2} y="132" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[12px] font-mono font-bold">
                {obj.label}
              </text>
              <text x={x + w / 2} y="154" textAnchor="middle" className="fill-slate-500 text-[11px]">
                {obj.detail}
              </text>
            </g>
          );
        })}
      </svg>
    </SceneFrame>
  );
}

/* ==================== 25. INDEPENDENT OBJECTS & SELF ==================== */
function IndependentObjectsScene({
  mode,
  compact,
}: {
  mode: "student" | "self" | "counter";
  compact?: boolean;
}) {
  const [val1, setVal1] = useState(mode === "student" ? 85 : 0);
  const [val2, setVal2] = useState(mode === "student" ? 92 : 0);
  const [activeTarget, setActiveTarget] = useState<1 | 2>(1);

  const label1 = mode === "student" ? "student1 (Ada)" : mode === "self" ? "user (Ada)" : "counter1";
  const label2 = mode === "student" ? "student2 (Leo)" : mode === "self" ? "admin (Chen)" : "counter2";

  return (
    <SceneFrame
      tag="Interactive Independent Objects & self Spotlight"
      compact={compact}
      onReset={() => {
        setVal1(mode === "student" ? 85 : 0);
        setVal2(mode === "student" ? 92 : 0);
        setActiveTarget(1);
      }}
      controls={
        mode === "self" ? (
          <>
            <Button type="button" size="xs" variant={activeTarget === 1 ? "default" : "outline"} onClick={() => setActiveTarget(1)}>
              Call user.greet()
            </Button>
            <Button type="button" size="xs" variant={activeTarget === 2 ? "default" : "outline"} onClick={() => setActiveTarget(2)}>
              Call admin.greet()
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              size="xs"
              onClick={() => {
                setActiveTarget(1);
                setVal1((v) => v + (mode === "student" ? 5 : 1));
              }}
            >
              {mode === "student" ? "student1.add_bonus(5)" : "counter1.add_one()"}
            </Button>
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => {
                setActiveTarget(2);
                setVal2((v) => v + (mode === "student" ? 5 : 1));
              }}
            >
              {mode === "student" ? "student2.add_bonus(5)" : "counter2.add_one()"}
            </Button>
          </>
        )
      }
      ruleText={
        mode === "self"
          ? `Calling ${activeTarget === 1 ? "user.greet()" : "admin.greet()"} automatically points self to ${activeTarget === 1 ? "user" : "admin"}.`
          : `Each object keeps its own memory box: updating ${activeTarget === 1 ? label1 : label2} never changes the other object.`
      }
      previewCode={
        mode === "self"
          ? `self is ${activeTarget === 1 ? "user" : "admin"} -> "${activeTarget === 1 ? "Hi, Ada" : "Hi, Chen"}"`
          : `${label1}: ${val1}  |  ${label2}: ${val2}`
      }
    >
      <svg viewBox="0 0 640 175" className={SVG_FRAME_CLASS}>
        <rect x="240" y="12" width="160" height="30" rx="15" className="fill-rose-600" />
        <text x="320" y="31" textAnchor="middle" className="fill-white text-[12px] font-mono font-bold">
          self → {activeTarget === 1 ? label1 : label2}
        </text>
        <line x1="320" y1="42" x2={activeTarget === 1 ? 165 : 475} y2="64" className="stroke-rose-500" strokeWidth="3" />

        <rect
          x="40"
          y="64"
          width="250"
          height="94"
          rx="14"
          className={activeTarget === 1 ? "fill-blue-50 stroke-blue-500 dark:fill-blue-950/50" : "fill-white stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"}
          strokeWidth={activeTarget === 1 ? "3" : "1.5"}
        />
        <text x="165" y="90" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[12px] font-mono font-bold">
          {label1}
        </text>
        <text x="165" y="132" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[24px] font-mono font-bold">
          {mode === "self" ? '"Hi, Ada"' : mode === "student" ? `score: ${val1}` : `count: ${val1}`}
        </text>

        <rect
          x="350"
          y="64"
          width="250"
          height="94"
          rx="14"
          className={activeTarget === 2 ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" : "fill-white stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700"}
          strokeWidth={activeTarget === 2 ? "3" : "1.5"}
        />
        <text x="475" y="90" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[12px] font-mono font-bold">
          {label2}
        </text>
        <text x="475" y="132" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[24px] font-mono font-bold">
          {mode === "self" ? '"Hi, Chen"' : mode === "student" ? `score: ${val2}` : `count: ${val2}`}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 26. BANK ACCOUNT (__str__ & Methods) ==================== */
function BankAccountScene({ compact }: { compact?: boolean }) {
  const [balance, setBalance] = useState(100);
  const [hasStr, setHasStr] = useState(true);

  return (
    <SceneFrame
      tag="Interactive PyBank Account & __str__"
      compact={compact}
      onReset={() => {
        setBalance(100);
        setHasStr(true);
      }}
      controls={
        <>
          <Button type="button" size="xs" onClick={() => setBalance((b) => b + 45)}>
            account.deposit(45)
          </Button>
          <Button type="button" size="xs" variant="outline" onClick={() => setBalance((b) => b + 20)}>
            account.deposit(20)
          </Button>
          <Button type="button" size="xs" variant={hasStr ? "secondary" : "destructive"} onClick={() => setHasStr((v) => !v)}>
            {hasStr ? "__str__ Enabled" : "__str__ Disabled"}
          </Button>
        </>
      }
      ruleText={
        hasStr
          ? `deposit() safely increases balance to $${balance.toFixed(2)}, and __str__ formats print(account) cleanly.`
          : `Without __str__, Python prints the raw object memory address instead of a readable summary.`
      }
      previewCode={`print(account) -> ${hasStr ? `"[PyBank] Mina: $${balance.toFixed(2)}"` : "<BankAccount object>"}`}
    >
      <svg viewBox="0 0 640 155" className={SVG_FRAME_CLASS}>
        <rect x="28" y="20" width="265" height="115" rx="14" className="fill-slate-900" />
        <text x="48" y="48" className="fill-emerald-400 text-[11px] font-mono font-bold">PyBank ACCOUNT</text>
        <text x="48" y="84" className="fill-white text-[16px] font-bold">Owner: Mina</text>
        <text x="48" y="114" className="fill-emerald-300 text-[22px] font-mono font-bold">${balance.toFixed(2)}</text>

        <rect x="322" y="20" width="290" height="115" rx="14" className={hasStr ? "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/50" : "fill-amber-50 stroke-amber-400 dark:fill-amber-950/40"} strokeWidth="2.5" />
        <text x="467" y="48" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[11px] font-mono font-bold">
          print(account) OUTPUT
        </text>
        <text x="467" y="92" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[15px] font-mono font-bold">
          {hasStr ? `[PyBank] Mina: $${balance.toFixed(2)}` : "<BankAccount object 0x104a>"}
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== 27. INHERITANCE ==================== */
function InheritanceScene({ compact }: { compact?: boolean }) {
  const [medal, setMedal] = useState<"Gold" | "Silver">("Gold");

  return (
    <SceneFrame
      tag="Interactive Parent -> Child Inheritance"
      compact={compact}
      onReset={() => setMedal("Gold")}
      controls={
        <>
          <span className="text-xs font-semibold text-muted-foreground">Medal:</span>
          {(["Gold", "Silver"] as const).map((m) => (
            <Button key={m} type="button" size="xs" variant={medal === m ? "default" : "outline"} onClick={() => setMedal(m)}>
              {m} Medal
            </Button>
          ))}
        </>
      }
      ruleText={`HonorStudent automatically inherits Student's __str__ and attributes via super().__init__(), adding only badge() and ${medal} medal.`}
      previewCode={`student2.badge() -> "★ Mina — ${medal} Medal"`}
    >
      <svg viewBox="0 0 640 165" className={SVG_FRAME_CLASS}>
        <rect x="28" y="24" width="240" height="116" rx="14" className="fill-blue-50 stroke-blue-500 dark:fill-blue-950/45" strokeWidth="2.5" />
        <text x="148" y="50" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[13px] font-mono font-bold">
          Parent: Student
        </text>
        <text x="148" y="84" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[12px] font-mono">
          name, score, __str__()
        </text>
        <text x="148" y="114" textAnchor="middle" className="fill-blue-600 dark:fill-blue-300 text-[11px] font-mono">
          Leo (score: 82)
        </text>

        <line x1="274" y1="82" x2="338" y2="82" className="stroke-emerald-500" strokeWidth="3" />
        <polygon points="338,75 352,82 338,89" className="fill-emerald-500" />
        <text x="310" y="68" textAnchor="middle" className="fill-emerald-600 text-[10px] font-bold">inherits</text>

        <rect x="358" y="20" width="254" height="124" rx="14" className="fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/45" strokeWidth="2.5" />
        <text x="485" y="46" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[13px] font-mono font-bold">
          Child: HonorStudent(Student)
        </text>
        <text x="485" y="78" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[12px] font-mono">
          reuses name, score, __str__()
        </text>
        <text x="485" y="106" textAnchor="middle" className="fill-amber-600 dark:fill-amber-300 text-[13px] font-mono font-bold">
          ★ Mina — {medal} Medal
        </text>
        <text x="485" y="130" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[10.5px]">
          isinstance(student2, Student) → True
        </text>
      </svg>
    </SceneFrame>
  );
}

/* ==================== CASE ROUTER ==================== */
function renderSceneForKey(caseKey: string, compact?: boolean) {
  switch (caseKey) {
    case "first-program":
      return <ScreenVsNoteScene compact={compact} />;
    case "variables-boxes":
      return <ScoreBoxScene compact={compact} />;
    case "data-types":
      return <TypeSorterScene compact={compact} />;
    case "input-and-conversion":
      return <ConverterScene compact={compact} />;
    case "f-strings":
      return <ReceiptScene compact={compact} />;
    case "math-operators":
    case "quiz-1-q0":
      return <CookieDivisionScene compact={compact} />;
    case "comparison-operators":
      return <ThresholdGaugeScene compact={compact} />;
    case "logical-operators":
      return <LogicGatesScene compact={compact} />;
    case "if-elif-else":
      return <WaterfallScene mode="grade" compact={compact} />;
    case "quiz-1-q1":
      return <WaterfallScene mode="thermostat" compact={compact} />;
    case "quiz-1-q2":
      return <OrderScreenScene compact={compact} />;
    case "why-loops":
      return <LoopScaleScene compact={compact} />;
    case "for-loops-tracer":
      return <AccumulatorScene compact={compact} />;
    case "while-loops-tracer":
      return <CountdownScene compact={compact} />;
    case "break-vs-continue":
      return <ConveyorScene compact={compact} />;
    case "lists-basics":
    case "quiz-2-q0":
      return <BasketIndexScene compact={compact} />;
    case "lists-methods-slicing":
      return <SliceWindowScene mode="scores5" compact={compact} />;
    case "quiz-2-q1":
      return <SliceWindowScene mode="scores4" compact={compact} />;
    case "lists-looping-tracer":
      return <FilterFunnelScene compact={compact} />;
    case "dictionaries-basics":
      return <DictProfileScene mode="mina" compact={compact} />;
    case "quiz-2-q2":
      return <DictProfileScene mode="sam" compact={compact} />;
    case "dictionaries-looping":
      return <CafeMenuScene compact={compact} />;
    case "functions-intro":
      return <FunctionMachineScene compact={compact} />;
    case "return-vs-print":
      return <ReturnVsPrintScene compact={compact} />;
    case "defaults-scope":
      return <ScopeBadgeScene compact={compact} />;
    case "error-handling":
      return <TryExceptShieldScene compact={compact} />;
    case "oop-classes-objects":
      return <BlueprintInstancesScene mode="dog" compact={compact} />;
    case "quiz-3-oop-q0":
      return <BlueprintInstancesScene mode="book" compact={compact} />;
    case "oop-init-self":
      return <IndependentObjectsScene mode="student" compact={compact} />;
    case "quiz-3-oop-q1":
      return <IndependentObjectsScene mode="self" compact={compact} />;
    case "quiz-3-oop-q2":
      return <IndependentObjectsScene mode="counter" compact={compact} />;
    case "oop-methods-str":
      return <BankAccountScene compact={compact} />;
    case "oop-inheritance":
      return <InheritanceScene compact={compact} />;
    default:
      return <ScoreBoxScene compact={compact} />;
  }
}

export function RealCaseSlide({
  caseKey,
  title,
  description,
  nextSlideTitle,
  nextLabel,
  onNextSlide,
  compact = false,
}: RealCaseSlideProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {compact && (title || description) && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/[0.06] px-4 py-2.5 dark:bg-sky-950/25">
          {title && (
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <span>{title}</span>
            </div>
          )}
          {description && (
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">
              <RichText text={description} />
            </p>
          )}
        </div>
      )}

      <div key={caseKey}>{renderSceneForKey(caseKey, compact)}</div>

      {onNextSlide && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Radio className="size-3.5 text-emerald-500" />
            <span>
              {nextSlideTitle
                ? `Next up: ${nextSlideTitle}`
                : "Play with the live visual above, then continue to the code."}
            </span>
          </div>
          <Button
            type="button"
            size={compact ? "sm" : "default"}
            onClick={onNextSlide}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {nextLabel || "Continue to Python Code"}
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
}
