import type { Metadata } from "next";
import { ScratchpadWorkspace } from "@/components/slides/ScratchpadWorkspace";

export const metadata: Metadata = {
  title: "Python IDE Scratchpad — Python Programming Short Course",
  description:
    "Interactive browser Python 3 IDE with multi-file tabs, standard library support, live console, stdin, and variables inspector.",
};

export default function ScratchpadPage() {
  return <ScratchpadWorkspace />;
}
