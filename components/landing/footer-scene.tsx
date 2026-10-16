"use client";

import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring, type Variants } from "motion/react";
import { DiscordStatus } from "@/components/landing/discord-status";
import { footerConfig } from "@/config/site";
import { MOTION_EASE } from "@/lib/motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: MOTION_EASE },
  },
};
const gardenVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: MOTION_EASE },
  },
};
const parallaxSpring = { stiffness: 100, damping: 22, mass: 0.8 };
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: MOTION_EASE },
  },
};

export function FooterScene({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const x = useSpring(0, parallaxSpring);
  const y = useSpring(0, parallaxSpring);
  const rotate = useSpring(0, parallaxSpring);

  const resetGarden = () => {
    x.set(0);
    y.set(0);
    rotate.set(0);
  };

  return (
    <footer
      data-footer-reveal=""
      className="relative w-full overflow-hidden bg-background"
    >
      <noscript>
        <style>{`[data-footer-reveal] [data-reveal] { opacity: 1 !important; transform: none !important; filter: none !important; }`}</style>
      </noscript>
      {/* Displacement map behind the visitor pill's liquid glass. Zero-sized
          and inert; only the filter definition is referenced, by the
          .liquid-glass rule in app/globals.css. */}
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <filter
            id="glass-refraction"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="40"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <motion.div
        className="relative z-10 mx-auto flex max-w-[var(--frame-max-w)] flex-col items-center px-6 pt-14 sm:pt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5, margin: "0px 0px -120px 0px" }}
        variants={{ visible: { transition: { staggerChildren: 0.16 } } }}
      >
        <figure className="max-w-sm text-center">
          <motion.blockquote
            className="text-balance font-serif text-[1.75rem] italic leading-snug text-foreground sm:text-[2rem]"
            variants={{ visible: { transition: { staggerChildren: 0.075 } } }}
          >
            <p>
              <span className="sr-only">{footerConfig.quote}</span>
              <span aria-hidden="true">
                {footerConfig.quote.split(" ").map((word, index) => (
                  <Fragment key={`${word}-${index}`}>
                    {index > 0 && " "}
                    <motion.span
                      data-reveal=""
                      className="inline-block"
                      variants={wordVariants}
                    >
                      {word}
                    </motion.span>
                  </Fragment>
                ))}
              </span>
            </p>
          </motion.blockquote>
          <motion.figcaption
            data-reveal=""
            variants={itemVariants}
            className="mt-4 font-mono text-[10px] tracking-[0.12em] text-muted-foreground"
          >
            {footerConfig.attribution}
          </motion.figcaption>
        </figure>

        <motion.div
          data-reveal=""
          variants={itemVariants}
          className="mt-7 w-full max-w-[19rem]"
        >
          <DiscordStatus />
        </motion.div>

        <motion.div
          data-reveal=""
          variants={itemVariants}
          className="mt-5 flex flex-col items-center gap-1 sm:flex-row sm:gap-6"
        >
          <p className="text-center font-mono text-[11px] leading-relaxed tracking-[0.06em] text-muted-foreground">
            {footerConfig.credit}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        data-reveal=""
        variants={gardenVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35, margin: "0px 0px -120px 0px" }}
        onPointerMove={(event) => {
          if (reducedMotion || event.pointerType === "touch") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
          const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
          x.set(horizontal * 16);
          y.set(vertical * 8);
          rotate.set(horizontal * 1.2);
        }}
        onPointerLeave={resetGarden}
        onPointerCancel={resetGarden}
        className="relative -mt-6 h-70 select-none overflow-hidden sm:-mt-12 sm:h-80"
      >
        <div className="relative left-1/2 h-full w-[calc(100%+24px)] min-w-180 -translate-x-1/2">
          <motion.div
            className="h-full origin-bottom"
            style={{
              x: reducedMotion ? 0 : x,
              y: reducedMotion ? 0 : y,
              rotate: reducedMotion ? 0 : rotate,
            }}
          >
            <Image
              src={footerConfig.artwork.src}
              alt=""
              width={footerConfig.artwork.width}
              height={footerConfig.artwork.height}
              sizes="(max-width: 719px) 720px, 792px"
              className="block h-auto w-full max-w-none"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* The visitor count floats centered over the panorama as a glass
            pill. A sibling of the parallaxing artwork, not a child of it, so
            the garden shifts behind still glass. */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          {children}
        </div>
      </motion.div>
    </footer>
  );
}
