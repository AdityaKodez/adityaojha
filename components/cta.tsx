"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Gmail from "@/public/stacks/gmail";
import Image from "next/image";
import { Check, Copy, Coffee } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
export function CTA() {
  const [copied, setCopied] = useState(false);

  const copyDiscordId = () => {
    navigator.clipboard.writeText("t1x_faker");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="no-js-visible border-y border-dashed pt-6 pb-12"
    >
      <h2 className="text-xl font-semibold mb-3 border-y px-6 py-2">
        Ready to build?
      </h2>
      <div className="px-6">
        <p className="text-lg text-muted-foreground mb-6">
          I am currently available for scoped MVP projects. Reach out if you are
          ready to ship.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="mailto:adityakodez@gmail.com"
                  className="flex items-center gap-2"
                >
                  <Gmail size="16" />
                  Email Me
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Email Me</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 cursor-pointer"
                disabled={false}
                onClick={copyDiscordId}
              >
                <Image
                  src="/discord.svg"
                  alt="Discord"
                  width={16}
                  height={16}
                />
                @t1x_faker
                {copied ? (
                  <Check className="size-3 text-green-500" />
                ) : (
                  <Copy className="size-3 text-muted-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dm me on discord</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://buymeacoffee.com/adiKodez"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Coffee size="16" className="fill-yellow-200" />
                  Buy me a coffee
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thank You ❤️</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.section>
  );
}
