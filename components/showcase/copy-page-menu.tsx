"use client";

import { Check, ChevronDown, Copy, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SiClaude, SiMarkdown, SiOpenai, SiV0 } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getItemUrl, siteUrl } from "@/config/registry";
import { useCopy } from "@/lib/use-copy";

export function CopyPageMenu({
  componentId,
  componentTitle,
  markdown,
}: {
  componentId: string;
  componentTitle: string;
  markdown: string;
}) {
  const { status, copy } = useCopy();
  const reducedMotion = useReducedMotion();
  const markdownUrl = `${siteUrl}/components/${componentId}/markdown`;
  const registryUrl = getItemUrl(componentId);
  const prompt = `Read ${markdownUrl} and help me use the ${componentTitle} component.`;
  const chatGptUrl = `https://chatgpt.com/?${new URLSearchParams({ q: prompt })}`;
  const claudeUrl = `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`;
  const v0Url = `https://v0.app/chat/api/open?${new URLSearchParams({ url: registryUrl })}`;

  return (
    <DropdownMenu>
      <ButtonGroup
        aria-label="Copy page and open options"
        className="shrink-0 bg-background ring-1 ring-inset ring-border"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-w-25 rounded-none bg-transparent px-2.5 text-xs transition-transform duration-200 hover:bg-transparent dark:hover:bg-transparent active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100 motion-reduce:active:translate-y-0"
          onClick={() => copy(markdown)}
        >
          <span className="relative inline-flex size-3.5 shrink-0">
            <AnimatePresence initial={false}>
              <motion.span
                key={status}
                className="absolute inset-0 inline-flex items-center justify-center"
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
                  <Check aria-hidden="true" />
                ) : status === "error" ? (
                  <X aria-hidden="true" />
                ) : (
                  <Copy aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
          <span aria-live="polite">
            {status === "copied"
              ? "Copied!"
              : status === "error"
                ? "Copy failed"
                : "Copy page"}
          </span>
        </Button>
        <ButtonGroupSeparator />
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-none bg-transparent hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent"
            aria-label="More page options"
          >
            <ChevronDown aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
      </ButtonGroup>
      <DropdownMenuContent
        align="end"
        theme="inherit"
        className="min-w-48 bg-popover before:hidden"
      >
        <DropdownMenuItem asChild>
          <a
            href={`/components/${componentId}/markdown`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiMarkdown aria-hidden="true" />
            View as markdown
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={chatGptUrl} target="_blank" rel="noopener noreferrer">
            <SiOpenai aria-hidden="true" />
            Open in ChatGPT
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={claudeUrl} target="_blank" rel="noopener noreferrer">
            <SiClaude aria-hidden="true" />
            Open in Claude
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={v0Url} target="_blank" rel="noopener noreferrer">
            <SiV0 aria-hidden="true" />
            Open in v0
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
