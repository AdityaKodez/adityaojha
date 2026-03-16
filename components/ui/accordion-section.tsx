"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  id?: string;
}

export function AccordionSection({
  title,
  children,
  defaultExpanded = false,
  className,
  id,
}: AccordionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("pt-6 border-t border-dashed", className)}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group w-full flex items-center justify-between no-js-visible section-heading hover:bg-muted/40 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring mb-3"
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        <motion.div
          initial={false}
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
