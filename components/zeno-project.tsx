"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import type { ProjectMetric } from "@/config/types";
import { ArrowDownCircleIcon, BarChart3, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const enabledProjects = projectsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

const INITIAL_VISIBLE_COUNT = 4;

const cardHoverTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 26,
  mass: 0.5,
};

function Metric({ metric }: { metric: ProjectMetric }) {
  return (
    <div className="flex items-center gap-1.5">
      {metric.icon === "users" ? (
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className="font-pixel text-xs font-medium text-muted-foreground">
        {metric.label}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof enabledProjects)[number];
}) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.985 }}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.995 }}
      transition={cardHoverTransition}
      className="h-full"
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden p-0">
        <>
          <Link
            href={`/project/${project.id}`}
            className="group/project-media relative block aspect-video overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="micro-transition-slow object-cover group-hover/project-media:scale-[1.01] group-focus-visible/project-media:scale-[1.01]"
            />

          </Link>

          <CardContent className="flex grow flex-col gap-4 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <Link
                  href={`/project/${project.id}`}
                  className="group/title rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <h3 className="text-pretty text-lg font-semibold transition-colors group-hover/title:text-primary">
                    {project.title}
                  </h3>
                </Link>
                <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>

              {project.liveUrl ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="w-fit shrink-0 gap-1.5">
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        {projectsSectionConfig.liveButtonLabel}
                        <LuExternalLink aria-hidden="true" data-icon="inline-end" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{projectsSectionConfig.liveTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/source micro-transition inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:text-primary"
                >
                  <FaGithub aria-hidden="true" className="size-4 transition-transform group-hover/source:scale-110" />
                  <span className="transition-colors">Source code</span>
                </Link>
              )}
            </div>
          </CardContent>

          {project.metrics?.length ? (
            <CardFooter className="flex gap-6 border-t border-dashed py-4">
              {project.metrics.map((metric) => (
                <Metric key={metric.label} metric={metric} />
              ))}
            </CardFooter>
          ) : null}
        </>
      </Card>
    </motion.div>
  );
}

export function ZenoProject() {
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll
    ? enabledProjects
    : enabledProjects.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <section id="projects" className="border-t border-dashed pt-6">
         <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
          className="no-js-visible section-heading mb-3"
        >
          {projectsSectionConfig.title}
        </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="no-js-visible "
      >
        <motion.div
          id="projects-grid"
          layout
          className="grid auto-rows-fr grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-2"
        >
          <AnimatePresence initial={false}>
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
        {enabledProjects.length > INITIAL_VISIBLE_COUNT && (
          <div className="mt-6 flex justify-center border-y border-dashed py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              aria-controls="projects-grid"
              className="group flex items-center gap-2 font-pixel text-xs text-muted-foreground hover:text-foreground"
            >
              {showAll
                ? "Show less"
                : `View all ${enabledProjects.length} projects`}
              <ArrowDownCircleIcon
                aria-hidden="true"
                className={`size-3.5 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
