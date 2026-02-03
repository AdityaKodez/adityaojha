"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutTemplate, Rocket, Zap } from "lucide-react";
import { motion } from "motion/react";

export function Services() {
  const services = [
    {
      title: "Web Development",
      description: "Rapid MVP development and deployment.",
      icon: Rocket,
    },
    {
      title: "System Design",
      description: "Scalable full-stack application architecture.",
      icon: LayoutTemplate,
    },
    {
      title: "Optimization",
      description: "Performance optimization and code refactoring.",
      icon: Zap,
    },
  ];

  return (
    <section className="border-t border-dashed pt-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold mb-6 border-y px-6 py-2"
      >
        What I can help you with
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full shadow-none border border-dashed hover:border-foreground/20 transition-colors">
              <CardHeader>
                <service.icon className="h-8 w-8 mb-2 text-foreground" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
