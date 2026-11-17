"use client";

import { markdownComponents } from "@/lib/markdown/markdown-components";
import { Button } from "@/components/ui/button";
import { PaperFrame } from "@/components/shared/paper-frame";
import { projectsSectionConfig } from "@/config/projects";
import type { Project } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { revealVariants } from "@/lib/motion";
import {
  ArrowDoodle,
  CodeDoodle,
  FolderDoodle,
  handwriting,
} from "@/components/shared/doodles";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const itemVariants = revealVariants({ y: 10 });

const pillClass = "group h-9 gap-1.5 rounded-full px-4 text-[13px]";
export function ProjectContent({ project }: { project: Project }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.main
      id="main-content"
      variants={containerVariants}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      data-project-page=""
      className="relative flex min-h-dvh flex-col justify-center overflow-x-clip bg-background px-5 pt-16 pb-24 md:pb-12"
    >
      <article className="mx-auto flex w-full max-w-[30.5rem] flex-col">
      <motion.div variants={itemVariants} className="mb-8">
        <Link
          href="/#projects"
          className="group inline-flex min-h-11 items-center gap-1.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <FolderDoodle className="size-6" />
          <span className={cn(handwriting.className, "text-xl leading-none")}>
            {projectsSectionConfig.title}
          </span>
        </Link>
      </motion.div>

        <motion.header variants={itemVariants}>
          <h1 className="text-[15px] font-medium leading-6 text-foreground">
            {project.title}
          </h1>
          <p className="text-[15px] leading-6 text-muted-foreground">
            {project.tagline}, {project.year}
          </p>
        </motion.header>

        <motion.div variants={itemVariants} className="pt-5">
          <PaperFrame className="aspect-[16/10] w-full min-w-[12rem] max-w-[min(100%,calc((100dvh-30rem)*1.6))]">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 640px) 488px, 100vw"
              className={cn(
                "object-cover object-top",
                project.imageTone === "light" &&
                  "dark:[filter:invert(0.9)_hue-rotate(180deg)]",
              )}
              priority
            />
          </PaperFrame>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-5">
          <p className="text-[15px] leading-7 text-foreground text-pretty">
            {project.description}
          </p>
          {project.content && (
            <div className="prose mt-3 max-w-none text-[15px] leading-7 text-muted-foreground [&_p]:my-0">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {project.content}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 pt-5">
          {project.liveUrl && (
            <Button
              asChild
              className={`${pillClass} bg-foreground text-background hover:bg-foreground/85 [a]:hover:bg-foreground/85`}
            >
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("project_live_preview_clicked", {
                    project_id: project.id,
                    live_url: project.liveUrl!,
                  });
                }}
              >
                {projectsSectionConfig.liveButtonLabel}
                <ArrowDoodle className="size-4" />
              </Link>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="secondary" className={pillClass}>
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("project_source_code_clicked", {
                    project_id: project.id,
                    github_url: project.githubUrl!,
                  });
                }}
              >
                <CodeDoodle className="size-4" />
                {projectsSectionConfig.sourceButtonLabel}
              </Link>
            </Button>
          )}
        </motion.div>
      </article>
    </motion.main>
  );
}