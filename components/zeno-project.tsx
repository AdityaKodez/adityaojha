"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import type { ProjectMetric } from "@/config/types";
import { BarChart3, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const enabledProjects = projectsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

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
      whileHover={{ y: -0.5 }}
      whileTap={{ y: 0, scale: 0.9985 }}
      transition={cardHoverTransition}
      className="h-full"
    >
      <Card className="p-0">
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

          <CardContent className="grow space-y-3 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  href={`/project/${project.id}`}
                  className="micro-transition rounded-sm focus-visible:outline-none focus-visible:text-primary"
                >
                  <h3 className="text-lg font-semibold transition-colors hover:text-primary">
                    {project.title}
                  </h3>
                </Link>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>

              {project.liveUrl ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        {projectsSectionConfig.liveButtonLabel}{" "}
                        <LuExternalLink className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{projectsSectionConfig.liveTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="micro-transition flex items-center gap-2 text-xs hover:text-primary focus-visible:outline-none focus-visible:text-primary"
              >
                <FaGithub className="size-4" />
                Source code
              </Link>
            )}
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
        className="no-js-visible px-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {enabledProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

