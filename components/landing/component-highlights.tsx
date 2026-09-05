"use client";

import { getComponentIcon } from "@/components/showcase/component-icons";
import {
  componentsSectionConfig,
  getEnabledComponents,
} from "@/config/components";
import { motion } from "motion/react";
import Link from "next/link";
import { BsArrowUpRightCircle } from "react-icons/bs";

export function ComponentHighlights() {
  const components = getEnabledComponents();
  const preview = components.slice(0, componentsSectionConfig.previewCount);

  if (preview.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-dashed"
    >
      <h2 className="section-heading">{componentsSectionConfig.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {preview.map((component) => {
          const Icon = getComponentIcon(component.icon);

          return (
            <Link
              key={component.id}
              href={`/components/${component.id}`}
              className="group relative flex items-stretch"
            >
              <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5 transition-colors hover:bg-muted/10">
                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  <Icon className="h-4 w-4" />
                  <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-muted-foreground/5" />
                  {component.new && (
                    <span
                      className="absolute -top-1 -right-1 size-2 rounded-full bg-sky-500 ring-2 ring-background"
                      aria-label="new component"
                    />
                  )}
                </div>
                <div className="flex min-w-0 grow flex-col">
                  <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                    {component.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
                    {component.description}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-muted-foreground/5" />
              <div className="blueprint-bg pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center items-center border-y py-4">
        <Link
          href="/components"
          className="flex items-center gap-2 font-pixel text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {`${componentsSectionConfig.seeMoreLabel} ${components.length} components`}
          <BsArrowUpRightCircle className="size-3.5" />
        </Link>
      </div>
    </motion.section>
  );
}
