"use client";
import { motion } from "motion/react";
import Link from "next/link";
import Gmail from "@/public/stacks/gmail";
import Image from "next/image";
import { Check, Copy, Coffee } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
export function CTA() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyDiscordId = () => {
    navigator.clipboard.writeText("t1x_faker");
    setCopiedField("discord");
    setTimeout(() => setCopiedField(null), 2000);
  };
  const copyEmail = () => {
    navigator.clipboard.writeText("adityakodez@gmail.com");
    setCopiedField("email");
    setTimeout(() => setCopiedField(null), 2000);
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
      <div>
        <p className="px-6 text-md text-muted-foreground mb-6">
          I am currently available for scoped MVP projects. Reach out if you are
          ready to ship.
        </p>
        <div className="grid border-t border-dashed grid-cols-3 max-sm:grid-cols-1 overflow-hidden">
          {/* Email */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={copyEmail} className="text-left cursor-pointer">
                <div className="group flex items-center gap-3 p-4 border-b border-r border-dashed max-sm:border-r-0 transition-colors hover:bg-muted/50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
                    <Gmail size="18" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium leading-none">
                      Email
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 truncate">
                      adityakodez@gmail.com
                    </span>
                  </div>
                  <div className="ml-auto">
                    {copiedField === "email" ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copiedField === "email" ? "Copied!" : "Copy email"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Discord */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={copyDiscordId}
                className="text-left cursor-pointer"
              >
                <div className="group flex items-center gap-3 p-4 border-b border-r border-dashed max-sm:border-r-0 transition-colors hover:bg-muted/50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
                    <Image
                      src="/discord.svg"
                      alt="Discord"
                      width={18}
                      height={18}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium leading-none">
                      Discord
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 truncate">
                      @t1x_faker
                    </span>
                  </div>
                  <div className="ml-auto">
                    {copiedField === "discord" ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copiedField === "discord" ? "Copied!" : "Copy Discord ID"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Buy me a coffee */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="https://buymeacoffee.com/adiKodez"
                target="_blank"
                className="focus-visible:outline-none"
              >
                <div className="group flex items-center gap-3 p-4 border-b border-dashed max-sm:border-r-0 transition-colors hover:bg-muted/50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
                    <Coffee size={18} className="fill-yellow-200" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium leading-none">
                      Buy me a coffee
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 truncate">
                      @adiKodez
                    </span>
                  </div>
                </div>
              </Link>
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
