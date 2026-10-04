"use client";

import { ArrowUpRight, ChevronDown, Copy, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SiClaude, SiGithub, SiMarkdown, SiOpenai, SiV0 } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getItemUrl, siteUrl } from "@/config/registry";
import { cn } from "@/lib/utils";
import { useCopy } from "@/lib/use-copy";

const LABELS = {
  idle: "Copy page",
  copied: "Copied!",
  error: "Copy failed",
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function CopyPageMenu({
  componentId,
  componentTitle,
  githubUrl,
  markdown,
}: {
  componentId: string;
  componentTitle: string;
  githubUrl: string;
  markdown: string;
}) {
  const { status, copy } = useCopy();
  const reducedMotion = useReducedMotion();
  const markdownUrl = `${siteUrl}/components/${componentId}/markdown`;
  const prompt = `Read ${markdownUrl} and help me use the ${componentTitle} component.`;

  const pageLinks = [
    {
      href: githubUrl,
      icon: SiGithub,
      label: "Open in GitHub",
      hint: "Browse the source file",
    },
    {
      href: `/components/${componentId}/markdown`,
      icon: SiMarkdown,
      label: "View as markdown",
      hint: "Plain text for LLMs",
    },
  ];
  const aiLinks = [
    {
      href: `https://chatgpt.com/?${new URLSearchParams({ q: prompt })}`,
      icon: SiOpenai,
      label: "Open in ChatGPT",
      hint: "Ask questions about this page",
    },
    {
      href: `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`,
      icon: SiClaude,
      label: "Open in Claude",
      hint: "Ask questions about this page",
    },
    {
      href: `https://v0.app/chat/api/open?${new URLSearchParams({ url: getItemUrl(componentId) })}`,
      icon: SiV0,
      label: "Open in v0",
      hint: "Remix the component in v0",
    },
  ];

  const renderLink = ({ href, icon: Icon, label, hint }: (typeof pageLinks)[number]) => (
    <DropdownMenuItem key={label} asChild className="gap-2.5 py-1.5 pr-2">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-inset ring-border transition-transform duration-200 group-data-highlighted/dropdown-menu-item:scale-105 motion-reduce:transition-none [&_svg]:size-3.5">
          <Icon aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[0.8rem] leading-none font-medium">{label}</span>
          <span className="truncate text-xs leading-none text-muted-foreground!">
            {hint}
          </span>
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 -translate-x-1 translate-y-1 text-muted-foreground! opacity-0 transition-[opacity,translate] duration-200 group-data-highlighted/dropdown-menu-item:translate-0 group-data-highlighted/dropdown-menu-item:opacity-100 motion-reduce:transition-none"
        />
      </a>
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <ButtonGroup
        aria-label="Copy page and open options"
        data-status={status}
        className="shrink-0 bg-background ring-1 ring-inset ring-border transition-shadow duration-300 data-[status=copied]:ring-primary/50 data-[status=error]:ring-destructive/50"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="relative overflow-hidden rounded-none bg-transparent px-2.5 text-xs transition-transform duration-150 ease-out hover:bg-foreground/5 active:scale-[0.96] dark:hover:bg-foreground/5 motion-reduce:transition-none motion-reduce:active:scale-100"
          onClick={() => copy(markdown)}
        >
          <AnimatePresence>
            {status === "copied" && !reducedMotion && (
              <motion.span
                key="shine"
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-primary/20 to-transparent"
                initial={{ x: "0%" }}
                animate={{ x: "400%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            )}
          </AnimatePresence>
          <motion.span
            className="relative inline-flex items-center gap-1.5"
            animate={
              status === "error" && !reducedMotion
                ? { x: [0, -3, 3, -2, 2, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <span className="relative inline-flex size-3.5 shrink-0">
              <AnimatePresence initial={false}>
                <motion.span
                  key={status}
                  className={cn(
                    "absolute inset-0 inline-flex items-center justify-center",
                    status === "copied" && "text-primary",
                    status === "error" && "text-destructive",
                  )}
                  initial={
                    reducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, scale: 0.5, rotate: -12 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 500, damping: 25, mass: 0.6 }
                  }
                >
                  {status === "copied" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <motion.path
                        d="M4 12.5l5 5L20 6.5"
                        initial={{ pathLength: reducedMotion ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.35, ease: EASE, delay: 0.08 }}
                      />
                    </svg>
                  ) : status === "error" ? (
                    <X aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
            <span aria-hidden="true" className="relative inline-grid overflow-hidden">
              <span className="invisible [grid-area:1/1]">{LABELS.error}</span>
              <AnimatePresence initial={false}>
                <motion.span
                  key={status}
                  className="text-left [grid-area:1/1]"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: "0%" }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: "-100%" }}
                  transition={
                    reducedMotion
                      ? { duration: 0.12 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                >
                  {LABELS[status]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="sr-only" aria-live="polite">
              {LABELS[status]}
            </span>
          </motion.span>
        </Button>
        <ButtonGroupSeparator />
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-none bg-transparent hover:bg-foreground/5 aria-expanded:bg-foreground/5 dark:hover:bg-foreground/5"
            aria-label="More page options"
          >
            <ChevronDown
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
            />
          </Button>
        </DropdownMenuTrigger>
      </ButtonGroup>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        theme="inherit"
        className="min-w-64 bg-popover before:hidden"
      >
        {pageLinks.map(renderLink)}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="pt-1.5 pb-1 font-mono text-[11px] font-normal">
          Ask AI
        </DropdownMenuLabel>
        {aiLinks.map(renderLink)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
