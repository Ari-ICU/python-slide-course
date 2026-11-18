import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Python Programming — Interactive Short Course Slides",
  description:
    "Modern interactive Python programming course slides with live code execution, step-by-step memory tracer, quizzes, and teacher presenter notes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground selection:bg-blue-500/20"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
