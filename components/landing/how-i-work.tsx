"use client";

import { siteConfig } from "@/config/site";
import type { WorkflowIcon } from "@/config/types";
import { PaperCutIcon } from "@/components/showcase/component-icons";
import { Signature } from "./signature";
import { AccordionSection } from "@/components/ui/accordion-section";

const workIcons: Record<WorkflowIcon, React.ReactElement> = {
  scope: (
    <PaperCutIcon
      size={28}
      accent="var(--chart-1)"
      silhouette="M32 9a23 23 0 1 1 0 46 23 23 0 1 1 0-46Z"
    >
      <path d="M32 3v5m0 48v5M3 32h5m48 0h5" />
      <circle cx="32" cy="32" r="12" strokeWidth="2" />
      <circle cx="32" cy="32" r="4" fill="var(--cutout-accent)" stroke="none" />
    </PaperCutIcon>
  ),
  communication: (
    <PaperCutIcon
      size={28}
      accent="var(--chart-1)"
      tilt={8}
      silhouette="M13 14 42 12Q50 12 50 20L49 34Q49 40 42 40H28L18 48 20 39H14Q8 39 9 32L10 20Q10 15 13 14Z"
    >
      <path d="M20 21h20M20 28h12" />
      <g fill="var(--cutout-accent)" stroke="none">
        <circle cx="21" cy="34" r="1.5" />
        <circle cx="27" cy="34" r="1.5" />
        <circle cx="33" cy="34" r="1.5" />
      </g>
    </PaperCutIcon>
  ),
  handoff: (
    <PaperCutIcon
      size={28}
      accent="var(--chart-2)"
      tilt={-5}
      silhouette="M52 10 12 28l17 6 5 15 8-12Z"
    >
      <path d="M52 10 29 34" />
      <path d="M29 34l5 15 8-12Z" fill="var(--cutout-accent)" strokeWidth="1.5" />
    </PaperCutIcon>
  ),
};

export function HowIWork() {
  return (
    <AccordionSection title={siteConfig.workflow.title}>
      <div className="px-6 flex flex-col gap-4">
        <ul className="space-y-2.5 text-sm text-muted-foreground">
          {siteConfig.workflow.items.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              {item.icon && (
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {workIcons[item.icon]}
                </span>
              )}
              <span>
                <span className="font-medium text-foreground font-sans">
                  {item.label}:
                </span>{" "}
                {item.description}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end pr-4">
          <Signature
            className="text-foreground/80 max-sm:h-10 "
            viewport={{ amount: 0.1 }}
          />
        </div>
      </div>
    </AccordionSection>
  );
}
