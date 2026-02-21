"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import type { ProjectMetric } from "@/config/types";
import { BarChart3, ForwardIcon, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
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

export function ZenoProject() {
  return (
    <section id="projects" className="border-t border-dashed pt-6">
      <h2 className="text-xl font-semibold mb-6 border-y px-6 py-2">
        {projectsSectionConfig.title}
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="no-js-visible grid grid-cols-1 md:grid-cols-2 gap-4 px-6"
      >
        {enabledProjects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col overflow-hidden shadow-none border border-dashed rounded-none transition-colors hover:bg-card/50 hover:border-foreground/20 ring-0 bg-background">
              <div className="aspect-video relative bg-muted">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-3 grow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{project.title}</h3>
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
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
