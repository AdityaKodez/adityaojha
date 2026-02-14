"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BarChart3, ForwardIcon, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function ZenoProject() {
  return (
    <section className="border-t border-dashed pt-6">
      <h2 className="text-xl font-semibold mb-6 border-y px-6 py-2">
        Projects
      </h2>

      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-6"
      >
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="overflow-hidden shadow-none border border-dashed rounded-sm transition-colors hover:border-foreground/20 ring-0">
            <div className="aspect-video relative bg-muted max-h-[300px]">
              <Image
                src="/zeno.png"
                alt="Zeno SaaS Boilerplate"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Zeno — Accountability tracker for builders
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Designed and shipped a full-stack web app to track work
                    logs, streaks, and performance trends. Built authentication,
                    streak logic, analytics dashboards, and core data models.
                    Shipped solo and iterated based on usage.
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      <Link href="https://zeno.akoder.xyz/" target="_blank">
                        Live <ForwardIcon className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Live Preview</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind</Badge>
                <Badge variant="secondary">Prisma</Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t border-dashed flex gap-6 py-4">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  20+ active builders
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  200+ logs created
                </span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 px-6"
      >
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="overflow-hidden shadow-none border border-dashed rounded-sm transition-colors hover:border-foreground/20 ring-0">
            <div className="aspect-video relative bg-muted max-h-[350px]">
              <Image
                src="/root.png"
                alt="Root - Math Drill Engine"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Root — Math Drill Engine
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A practice-focused web app centered on question patterns and
                    timed drills. Exploring how students interact with practice
                    workflows and how data models evolve with usage.
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      <Link href="https://root.akoder.xyz/" target="_blank">
                        Live <ForwardIcon className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Live Preview</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">Education</Badge>
                <Badge variant="secondary">UX Research</Badge>
                <Badge variant="secondary">Data Modeling</Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t border-dashed flex gap-6 py-4">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  40+ students
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  50 + Session Created
                </span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
