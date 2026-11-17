import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const PAPER_EDGE =
  "polygon(0.6% 1.4%, 9% 0.4%, 18% 1.2%, 27% 0.2%, 37% 1%, 46% 0.3%, 56% 1.3%, 65% 0.4%, 74% 1.1%, 83% 0.2%, 92% 1%, 99.4% 0.5%, 99.8% 10%, 99.1% 21%, 99.9% 33%, 99.2% 45%, 99.8% 57%, 99.1% 69%, 99.9% 80%, 99.3% 91%, 99.6% 99.3%, 91% 99.8%, 82% 99%, 72% 99.9%, 62% 99.1%, 52% 99.8%, 42% 99%, 32% 99.9%, 22% 99.2%, 12% 99.8%, 0.5% 99.2%, 0.1% 90%, 0.8% 79%, 0.2% 67%, 0.9% 55%, 0.1% 43%, 0.8% 31%, 0.2% 20%, 0.9% 9%)";
const PAPER_TEXTURE = {
  backgroundImage: "radial-gradient(var(--foreground) 0.45px, transparent 0.65px)",
  backgroundSize: "3px 3px",
};

export function PaperFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative isolate overflow-hidden bg-muted", className)}
      style={{ clipPath: PAPER_EDGE }}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply dark:opacity-[0.035] dark:mix-blend-screen"
        style={PAPER_TEXTURE}
      />
    </div>
  );
}