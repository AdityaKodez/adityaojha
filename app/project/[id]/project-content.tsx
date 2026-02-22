"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/config/types";
import { BarChart3, ArrowLeft, ForwardIcon, Users } from "lucide-react";
import { motion, Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
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
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export function ProjectContent({ project }: { project: Project }) {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen max-w-3xl mx-auto md:pb-16 border border-dashed overflow-hidden pt-6"
    >
      <motion.div variants={itemVariants} className="border-b px-6 pb-6 mb-6">
        <Button
          asChild
          variant="link"
          className="-ml-4 text-muted-foreground hover:text-foreground mb-8"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl mt-2">
          {project.title}
        </h1>
      </motion.div>

      <motion.div variants={itemVariants} className="px-6 mb-8">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </motion.div>

      <motion.div
        variants={imageVariants}
        className="aspect-video relative bg-muted border-y overflow-hidden"
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <div className="px-6 mt-4 space-y-8">
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-4 mt-8"
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
                      <Link href={project.liveUrl} target="_blank">
                        Live Preview <ForwardIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visit Live Site</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {project.githubUrl && (
              <Button asChild variant="outline">
                <Link href={project.githubUrl} target="_blank">
                  <FaGithub className="mr-2 h-4 w-4" />
                  Source Code
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {project.metrics && project.metrics.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {project.metrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {metric.icon === "users" ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <BarChart3 className="h-4 w-4" />
                  )}
                  <p className="font-semibold text-sm">{metric.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {project.content && (
          <motion.div
            variants={itemVariants}
            className="prose prose-neutral dark:prose-invert max-w-none py-4"
          >
            {typeof project.content === "string" ? (
              <ReactMarkdown>{project.content}</ReactMarkdown>
            ) : (
              project.content
            )}
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
