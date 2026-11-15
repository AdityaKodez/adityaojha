"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "@/components/shared/site-icons";
import { Button } from "@/components/ui/button";
import { notFoundConfig } from "@/config/not-found";
import { revealVariants } from "@/lib/motion";
import { NotFoundScene } from "./not-found-scene";

const itemVariants = revealVariants();
const sceneVariants = revealVariants({ y: 16 });

export function NotFoundContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="w-full max-w-lg text-center"
    >
      <motion.div
        data-reveal=""
        variants={sceneVariants}
        className="no-js-visible mx-auto mb-6 mt-4 w-4/5 max-w-90"
      >
        <NotFoundScene carLabel={notFoundConfig.carLabel} />
      </motion.div>

      <motion.div data-reveal="" variants={itemVariants} className="no-js-visible relative">
        <h1 className="text-balance font-serif text-4xl font-medium italic tracking-tight sm:text-[2.75rem]">
          <span className="sr-only">{notFoundConfig.code}. </span>
          {notFoundConfig.heading}
        </h1>
        <p className="mx-auto mt-3 max-w-76 text-pretty text-sm leading-relaxed text-muted-foreground">
          {notFoundConfig.description}
        </p>
      </motion.div>

      <motion.div
        data-reveal=""
        variants={itemVariants}
        className="no-js-visible mt-6 flex flex-wrap items-center justify-center gap-2"
      >
        <Button asChild variant="ghost" className="group h-9 gap-1.5 px-3">
          <Link href={notFoundConfig.components.href}>
            {notFoundConfig.components.label}
            <ArrowRightIcon
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
