"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

type StickerId = "rocket" | "cactus" | "house";

type Sticker = {
  id: StickerId;
  src: string;
  tooltip: string;
  side: "left" | "right";
  className: string;
};

const STICKERS: Sticker[] = [
  {
    id: "rocket",
    src: "/images/watercolor/rocket.png",
    tooltip: "ship it, even small",
    side: "left",
    className: "-rotate-3 rounded-[14px_10px_12px_16px]",
  },
  {
    id: "cactus",
    src: "/images/watercolor/cactus.png",
    tooltip: "slow growth is still growth",
    side: "right",
    className: "rotate-2 rounded-[10px_16px_12px_14px]",
  },
  {
    id: "house",
    src: "/images/watercolor/house.png",
    tooltip: "thanks for stopping by",
    side: "left",
    className: "-rotate-2 rounded-[12px_14px_16px_10px]",
  },
];

// the column is max-w-3xl (768px) centered, so its edges sit 384px from the
// viewport middle; +16px breathing room keeps stickers inside the gutter at lg
const GUTTER_OFFSET = "calc(50% + 400px)";

export function MarginStickers() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [tops, setTops] = useState<Partial<Record<StickerId, number>>>({});
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const measure = () => {
      const layerTop = layer.getBoundingClientRect().top;
      const next: Partial<Record<StickerId, number>> = {};
      for (const sticker of STICKERS) {
        const anchor = document.querySelector(
          `[data-sticker-anchor="${sticker.id}"]`
        );
        if (!anchor) continue;
        const rect = anchor.getBoundingClientRect();
        next[sticker.id] = rect.top - layerTop + rect.height / 2;
      }
      setTops(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
    >
      <TooltipProvider>
        {STICKERS.map((sticker) => (
          <div
            key={sticker.id}
            className={cn(
              "absolute -translate-y-1/2",
              tops[sticker.id] == null && "invisible"
            )}
            style={{
              top: tops[sticker.id] ?? 0,
              ...(sticker.side === "left"
                ? { right: GUTTER_OFFSET }
                : { left: GUTTER_OFFSET }),
            }}
          >
            <Tooltip>
              <TooltipTrigger
                tabIndex={-1}
                className="pointer-events-auto block cursor-default outline-none"
              >
                <motion.div
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }
                  }
                  whileInView={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 1, scale: 1 }
                  }
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={cn(
                      "bg-foreground p-2.5 shadow-[0_12px_24px_-14px_rgb(0_0_0/0.28)]",
                      "transition-[translate,scale,rotate,box-shadow,filter] duration-(--motion-duration-slow) ease-(--motion-ease-smooth) motion-reduce:transition-none",
                      "hover:-translate-y-0.5 hover:rotate-0 hover:scale-[1.02] hover:shadow-[0_18px_32px_-14px_rgb(0_0_0/0.35)]",
                      "dark:brightness-[0.85]",
                      sticker.className
                    )}
                  >
                    <Image
                      src={sticker.src}
                      alt=""
                      width={1536}
                      height={1024}
                      sizes="(min-width: 1280px) 128px, 96px"
                      className="h-auto w-24 select-none xl:w-32"
                    />
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={10}>
                {sticker.tooltip}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
}
