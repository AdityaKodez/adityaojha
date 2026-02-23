"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import type { ProjectMetric } from "@/config/types";
import { BarChart3, ForwardIcon, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const enabledProjects = projectsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

function Metric({ metric }: { metric: ProjectMetric }) {
  return (
    <div className="flex items-center gap-1.5">
      {metric.icon === "users" ? (
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className="text-xs font-medium text-muted-foreground font-pixel">
        {metric.label}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: (typeof enabledProjects)[number];
  featured?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden shadow-none border border-dashed rounded-none transition-colors hover:bg-card/50 hover:border-foreground/20 ring-0 bg-background">
        {featured ? (
          /* Featured: side-by-side layout on md+ */
          <div className="flex flex-col md:flex-row">
            <Link
              href={`/project/${project.id}`}
              className="aspect-video md:aspect-auto relative bg-muted md:w-1/2 md:min-h-[260px] block overflow-hidden group"
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-col grow md:w-1/2">
              <CardContent className="p-4 md:p-5 space-y-3 grow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/project/${project.id}`}>
                      <h3 className="font-semibold text-lg md:text-xl hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-fit"
                        >
                          <Link href={project.liveUrl} target="_blank">
                            {projectsSectionConfig.liveButtonLabel}{" "}
                            <ForwardIcon className="ml-1.5 h-3 w-3" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{projectsSectionConfig.liveTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                    >
                      <FaGithub className="size-4 " />
                      Source code
                    </Link>
                  )}
                </div>
              </CardContent>
              {project.metrics?.length ? (
                <CardFooter className="border-t border-dashed flex gap-6 py-4">
                  {project.metrics.map((metric) => (
                    <Metric key={metric.label} metric={metric} />
                  ))}
                </CardFooter>
              ) : null}
            </div>
          </div>
        ) : (
          /* Standard: stacked layout */
          <>
            <Link
              href={`/project/${project.id}`}
              className="aspect-video relative bg-muted block overflow-hidden group"
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <CardContent className="p-4 space-y-3 grow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/project/${project.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
                {project.liveUrl ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <Link href={project.liveUrl} target="_blank">
                          {projectsSectionConfig.liveButtonLabel}{" "}
                          <ForwardIcon className="ml-1.5 h-3 w-3" />
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
            </CardContent>
            {project.metrics?.length ? (
              <CardFooter className="border-t border-dashed flex gap-6 py-4">
                {project.metrics.map((metric) => (
                  <Metric key={metric.label} metric={metric} />
                ))}
              </CardFooter>
            ) : null}
          </>
        )}
      </Card>
    </motion.div>
  );
}

export function ZenoProject() {
  const [featured, ...rest] = enabledProjects;

  return (
    <section id="projects" className="border-t border-dashed pt-6">
      <h2 className="section-heading mb-6">
        {projectsSectionConfig.title}
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="no-js-visible space-y-4 px-6"
      >
        {/* Featured project — full width */}
        {featured && <ProjectCard project={featured} featured />}

        {/* Remaining projects — 2-col grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
