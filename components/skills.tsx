"use client";
import { Badge } from "@/components/ui/badge";
import {
  Blocks,
  Atom,
  FileCode,
  Wind,
  Layers,
  ShieldCheck,
  Database,
  Server,
  Bot,
} from "lucide-react";
import { motion } from "motion/react";

export function Skills() {
  const skills = [
    { name: "Next.js", icon: Blocks },
    { name: "React", icon: Atom },
    { name: "TypeScript", icon: FileCode },
    { name: "Tailwind CSS", icon: Wind },
    { name: "shadcn/ui", icon: Layers },
    { name: "better-auth", icon: ShieldCheck },
    { name: "Prisma", icon: Database },
    { name: "PostgreSQL", icon: Server },
    { name: "AI / LLM", icon: Bot },
  ];

  return (
    <section className="px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {skills.map((skill) => (
          <Badge key={skill.name} variant="secondary">
            <skill.icon className="h-3.5 w-3.5" />
            {skill.name}
          </Badge>
        ))}
      </motion.div>
    </section>
  );
}
