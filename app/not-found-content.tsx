"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRightIcon } from "@/components/shared/site-icons";
import { Button } from "@/components/ui/button";
import { notFoundConfig } from "@/config/not-found";
import { MOTION_EASE, revealVariants } from "@/lib/motion";

const itemVariants = revealVariants();
const artworkVariants = revealVariants({ y: 20 });
const pointerSpring = { stiffness: 100, damping: 22, mass: 0.8 };

export function NotFoundContent() {
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, pointerSpring);
  const y = useSpring(0, pointerSpring);
  const planeX = useTransform(x, (value) => value * -1.5);
  const planeY = useTransform(y, (value) => value * -1.5);
  const mapRotate = useTransform(x, [-8, 8], [-2, 2]);

  const resetArtwork = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="w-full max-w-lg text-center"
    >
      <motion.p
        data-reveal=""
        variants={itemVariants}
        className="no-js-visible font-mono text-[11px] tracking-wide text-muted-foreground"
      >
        {notFoundConfig.title}
      </motion.p>

      <motion.div
        aria-hidden="true"
        variants={{ visible: { transition: { staggerChildren: 0.065 } } }}
        className="relative isolate mx-auto mt-5 h-64 w-full max-w-120 select-none sm:mt-6 sm:h-80"
        onPointerMove={(event) => {
          if (reduceMotion || event.pointerType !== "mouse") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 16);
          y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
        }}
        onPointerLeave={resetArtwork}
        onPointerCancel={resetArtwork}
      >
        <div className="absolute inset-x-0 top-0 flex justify-center gap-1 font-serif text-[clamp(8rem,28vw,12.75rem)] leading-none tracking-tight text-foreground sm:gap-2">
          {notFoundConfig.code.split("").map((digit, index) => (
            <motion.span
              key={index}
              data-reveal=""
              variants={artworkVariants}
              className="no-js-visible inline-block"
            >
              <span
                className={`inline-block ${index === 0 ? "-rotate-9" : index === 2 ? "rotate-8" : "rotate-3"}`}
              >
                {digit}
              </span>
            </motion.span>
          ))}
        </div>

        <motion.svg
          data-reveal=""
          variants={itemVariants}
          viewBox="0 0 480 320"
          fill="none"
          className="no-js-visible absolute inset-0 size-full text-muted-foreground/35"
        >
          <path
            d="M74 205C19 187 23 122 66 129C103 135 85 198 62 175C34 147 110 75 181 103C239 126 340 128 345 78C351 27 300 24 314 58C326 87 379 59 400 38"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray="3 6"
          />
        </motion.svg>

        <motion.div
          data-reveal=""
          variants={artworkVariants}
          className="no-js-visible absolute bottom-0 left-[16%] z-10 w-[68%] sm:bottom-1 sm:left-[20%] sm:w-[62%]"
        >
          <motion.div
            data-reveal=""
            style={reduceMotion ? undefined : { x, y, rotate: mapRotate }}
          >
            <Image
              {...notFoundConfig.artwork.map}
              alt=""
              sizes="(max-width: 639px) 68vw, 300px"
              className="pointer-events-none h-auto w-full -rotate-6"
              draggable={false}
              preload
            />
          </motion.div>
        </motion.div>

        <motion.div
          data-reveal=""
          variants={{
            hidden: { opacity: 0, x: -28, y: 16, rotate: -12 },
            visible: {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              transition: {
                type: "spring",
                duration: 0.65,
                bounce: 0.25,
                opacity: { duration: 0.18, ease: MOTION_EASE },
              },
            },
          }}
          className="no-js-visible absolute right-[1%] top-[10%] w-[25%] sm:right-0 sm:top-[8%]"
        >
          <motion.div
            data-reveal=""
            style={reduceMotion ? undefined : { x: planeX, y: planeY }}
          >
            <Image
              src={notFoundConfig.artwork.plane.src}
              alt=""
              width={480}
              height={300}
              sizes="(max-width: 639px) 25vw, 120px"
              className="pointer-events-none h-auto w-full -rotate-12"
              draggable={false}
              loading="eager"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        data-reveal=""
        variants={itemVariants}
        className="no-js-visible relative mt-5 sm:mt-6"
      >
        <h1 className="text-balance font-serif text-4xl font-medium italic tracking-tight sm:text-[2.75rem]">
          <span className="sr-only">{notFoundConfig.code}. </span>
          {notFoundConfig.heading}
        </h1>
        <p className="mx-auto mt-3 max-w-68 text-pretty text-sm leading-relaxed text-muted-foreground">
          {notFoundConfig.description}
        </p>
      </motion.div>

      <motion.div
        data-reveal=""
        variants={itemVariants}
        className="no-js-visible mt-6 flex flex-wrap items-center justify-center gap-2"
      >
        <Button asChild className="group h-9 gap-2 px-3.5">
          <Link href={notFoundConfig.home.href}>
            <ArrowLeft
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none"
            />
            {notFoundConfig.home.label}
          </Link>
        </Button>
        <Button asChild variant="ghost" className="group h-9 gap-1.5 px-3">
          <Link href={notFoundConfig.components.href}>
            {notFoundConfig.components.label}
            <ArrowRightIcon
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
