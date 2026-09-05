"use client";

import { markdownComponents } from "@/components/content/markdown-components";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { projectsSectionConfig } from "@/config/projects";
import type { Project } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowLeft,
  ArrowRight,
  ForwardIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "shipped") return null;

  if (status === "building") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-blue-500/10 px-1.5 py-0.5 font-pixel text-[10px] leading-none text-blue-600 dark:text-blue-400">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
        </span>
        building&hellip;
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-sm bg-amber-500/10 px-1.5 py-0.5 font-pixel text-[10px] leading-none text-amber-600 dark:text-amber-400">
      new
    </span>
  );
}

type ProjectNav = Pick<Project, "id" | "title">;

export function ProjectContent({
  project,
  prev,
  next,
}: {
  project: Project;
  prev?: ProjectNav;
  next?: ProjectNav;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.main
      id="main-content"
      variants={containerVariants}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      className="relative min-h-dvh gap-y-4 flex flex-col max-w-3xl mx-auto border-x border-b-2 overflow-x-clip pt-14 pb-12"
    >
      {/* Breadcrumb */}
      <motion.div variants={itemVariants} className="px-6 pt-4 border-t border-dashed">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/#projects">
                  {projectsSectionConfig.title.toLowerCase()}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate max-w-[40ch]">
                {project.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Title bar */}
      <motion.h1 variants={itemVariants} className="section-heading text-balance">
        {project.title}
      </motion.h1>

      {/* Meta */}
      <motion.div
        variants={itemVariants}
        className="px-6 flex flex-wrap items-center gap-x-3 gap-y-2"
      >
        <p className="font-mono text-xs text-muted-foreground">
          <span className="tabular-nums">{project.year}</span>
          <span aria-hidden="true" className="mx-2 text-muted-foreground/50">
            {"//"}
          </span>
          {project.category}
        </p>
        <StatusBadge status={project.status} />
      </motion.div>

      {/* Description */}
      <motion.div variants={itemVariants} className="px-6">
        <p className="text-base text-muted-foreground leading-relaxed text-pretty">
          {project.description}
        </p>
      </motion.div>

      <motion.div
        variants={imageVariants}
        className="aspect-video relative bg-muted overflow-hidden border-y"
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
          priority
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset dark:ring-white/15"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="px-6 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {project.liveUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild>
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
                      Live Preview{" "}
                      <ForwardIcon aria-hidden="true" className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>visit live site</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {project.githubUrl && (
            <Button asChild variant="outline">
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
                <FaGithub aria-hidden="true" className="mr-2 h-4 w-4" />
                Source Code
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      {project.content && (
        <motion.section
          variants={itemVariants}
          aria-label="case study"
          className="border-t border-dashed px-6 py-6"
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {typeof project.content === "string" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {project.content}
              </ReactMarkdown>
            ) : (
              project.content
            )}
          </div>
        </motion.section>
      )}

      {/* Prev / next */}
      <motion.nav
        variants={itemVariants}
        aria-label="more projects"
        className="border-t border-dashed px-6 py-6 flex items-start justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          {prev ? (
            <Link
              href={`/project/${prev.id}`}
              className="group inline-flex min-w-0 max-w-full flex-col gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                <ArrowLeft
                  aria-hidden="true"
                  className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
                />
                prev
              </span>
              <span className="truncate text-sm font-medium group-hover:text-primary group-hover:underline group-hover:underline-offset-4">
                {prev.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ArrowLeft aria-hidden="true" className="h-3 w-3" />
              all work
            </Link>
          )}
        </div>
        <div className="min-w-0 flex-1 text-right">
          {next ? (
            <Link
              href={`/project/${next.id}`}
              className="group inline-flex min-w-0 max-w-full flex-col items-end gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                next
                <ArrowRight
                  aria-hidden="true"
                  className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                />
              </span>
              <span className="truncate text-sm font-medium group-hover:text-primary group-hover:underline group-hover:underline-offset-4">
                {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              all work
              <ArrowRight aria-hidden="true" className="h-3 w-3" />
            </Link>
          )}
        </div>
      </motion.nav>
    </motion.main>
  );
}
