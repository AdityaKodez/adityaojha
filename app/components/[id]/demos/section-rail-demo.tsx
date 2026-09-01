"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";

import { SectionRail, type RailItem } from "@/components/section-rail";

const sections = [
  {
    id: "rail-demo-overview",
    label: "overview",
    markdown: `## A calmer table of contents

Long-form pages should stay readable without making navigation feel heavy. The rail turns the document outline into a quiet waveform at the edge of the page.

- hover a mark to reveal its label
- select one to jump to that section
- scroll to watch the active mark travel`,
  },
  {
    id: "rail-demo-structure",
    label: "structure",
    markdown: `## Structure

Each rail item points to an element with the same \`id\`. The content can come from Markdown, MDX, a CMS, or ordinary React components.

> Keep section IDs unique when more than one document appears on a page.`,
  },
  {
    id: "rail-demo-behavior",
    label: "behavior",
    markdown: `## Scroll behavior

An intersection observer follows the section nearest the reading band. Selecting a mark scrolls smoothly, while **reduced motion preferences** switch the jump to instant scrolling.

The contained variant can track an overflow panel like this preview instead of the browser viewport.`,
  },
  {
    id: "rail-demo-finish",
    label: "finish",
    markdown: `## Ready to publish

Use the default viewport variant for articles and documentation pages. Use \`variant="contained"\` with a \`scrollRootRef\` for dialogs, side panels, and component previews.

That is the whole pattern: stable IDs, useful labels, and content worth navigating.`,
  },
] as const;

const railItems: RailItem[] = sections.map(({ id, label }) => ({ id, label }));

export function SectionRailDemo() {
  const scrollRootRef = useRef<HTMLDivElement>(null);

  return (
    <>
    
      <SectionRail
        items={railItems}
        variant="contained"
        scrollRootRef={scrollRootRef}
        className="left-3"
      />
      <div
        ref={scrollRootRef}
        className="h-[360px] overflow-y-auto scroll-smooth pl-24 pr-7"
      >
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex min-h-[310px] scroll-mt-0 items-center border-b border-dashed py-12 last:min-h-[360px] last:border-b-0"
          >
            <div className="prose max-w-none text-sm">
              <ReactMarkdown>{section.markdown}</ReactMarkdown>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
