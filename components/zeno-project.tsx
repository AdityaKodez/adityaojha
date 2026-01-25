"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BarChart3, ForwardIcon, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function ZenoProject() {
  return (
    <section className="px-6 border-t border-dashed pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden shadow-none border-none rounded-sm">
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
                  Designed and shipped a full-stack web app to track work logs,
                  streaks, and performance trends. Built authentication, streak
                  logic, analytics dashboards, and core data models. Shipped
                  solo and iterated based on usage.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href="https://shipzeno.vercel.app/" target="_blank">
                  Live <ForwardIcon className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Currently building
          </h2>
        </div>
        <Card className="shadow-none border-dashed rounded-sm">
          <CardContent className="pt-5 flex gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-base mb-1">
                  Class 10 Practice Platform
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A practice-focused web app centered on question patterns and
                  timed drills. Exploring how students interact with practice
                  workflows and how data models evolve with usage.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-background text-xs font-normal"
                >
                  Education
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background text-xs font-normal"
                >
                  UX Research
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background text-xs font-normal"
                >
                  Data Modeling
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
