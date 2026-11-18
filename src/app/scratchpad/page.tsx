import type { Metadata } from "next";
import { ScratchpadWorkspace } from "@/components/slides/ScratchpadWorkspace";

export const metadata: Metadata = {
  title: "Live Python Scratchpad — Python Programming Short Course",
  description:
    "Interactive in-browser Python scratchpad with starter templates, syntax highlighting, and instant console output.",
};

export default function ScratchpadPage() {
  return <ScratchpadWorkspace />;
}
