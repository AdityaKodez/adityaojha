"use client";

import dynamic from "next/dynamic";
import {
  getEnabledSponsors,
  getEnabledSupportLinks,
  sponsorTiers,
  sponsorsSectionConfig,
} from "@/config/sponsors";
import type { Sponsor } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Message, Plus } from "@/components/shared/site-icons";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { FaXTwitter } from "react-icons/fa6";
import { SiBuymeacoffee } from "react-icons/si";
import { Signature } from "./signature";

const Avvvatars = dynamic(() => import("avvvatars-react"), { ssr: false });

const badgeSpring = { type: "spring", duration: 0.35, bounce: 0.3 } as const;
const tooltipGlide =
  "transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
const tooltipFade =
  "transition-opacity duration-150 ease-out motion-reduce:transition-none";
const SEAT_PRICE_LABEL = `$${sponsorTiers.find((tier) => tier.enabled !== false)?.price ?? sponsorTiers[0]?.price ?? 5}`;
const hitTileClass =
  "group relative block size-14 shrink-0 rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const visualTileClass =
  "relative flex size-full items-center justify-center rounded-xl will-change-transform";
const visualBadgeClass = `${visualTileClass} overflow-hidden`;

const supportTiles = {
  coffee: {
    Icon: SiBuymeacoffee,
    BadgeIcon: Plus,
    tile: "bg-[color:var(--logo-wax-light)] text-[color:var(--logo-wick)] ring-[color:var(--logo-wax-gold)]",
    badge: "bg-[color:var(--logo-flame)] text-[color:var(--logo-flame-core)]",
  },
  x: {
    Icon: FaXTwitter,
    BadgeIcon: Message,
    tile: "bg-secondary text-foreground ring-foreground/10",
    badge: "bg-foreground text-background",
  },
} as const;

type SponsorTooltipState = {
  id: string;
  label: string;
  note?: string;
  x: number;
  top: number;
};

type TooltipHandlers = {
  activeId: string | null;
  tooltipId: string;
  onShow: (id: string, label: string, el: HTMLElement, note?: string) => void;
  onHide: (id: string) => void;
};

function withReferral(url: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("utm_source", "akoder.xyz");
    parsed.searchParams.set("utm_medium", "sponsor");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function EmitRays({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden
      className={className}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="3">
        <line x1="59.4" y1="50.5" x2="52.5" y2="40.7" opacity="0.7" />
        <line x1="89.8" y1="43.3" x2="94" y2="27.8" opacity="1" />
        <line x1="117.6" y1="66.3" x2="132.6" y2="60.8" opacity="0.7" />
        <line x1="112.9" y1="99" x2="123.3" y2="105" opacity="1" />
        <line x1="70.7" y1="114.8" x2="68.1" y2="124.4" opacity="0.7" />
        <line x1="45.6" y1="96.1" x2="32.9" y2="102" opacity="1" />
      </g>
    </svg>
  );
}

type TileFrameProps = {
  id: string;
  label: string;
  note?: string;
  href?: string;
  external?: boolean;
  visualClassName: string;
  tooltip: TooltipHandlers;
  onClick?: () => void;
  children: ReactNode;
};

function TileFrame({
  id,
  label,
  note,
  href,
  external,
  visualClassName,
  tooltip,
  onClick,
  children,
}: TileFrameProps) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const active = hovered || focused;
  const animate = reduceMotion
    ? pressed
      ? { opacity: 0.65 }
      : active
        ? { opacity: 0.8 }
        : { opacity: 1 }
    : pressed
      ? { y: 0, scale: 0.94, rotate: 3 }
      : active
        ? { y: -4, scale: 1.08, rotate: -5 }
        : { y: 0, scale: 1, rotate: 0 };

  const sharedEvents = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      setHovered(true);
      tooltip.onShow(id, label, event.currentTarget, note);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      setHovered(false);
      setPressed(false);
    },
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerCancel: () => setPressed(false),
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      setFocused(true);
      tooltip.onShow(id, label, event.currentTarget, note);
    },
    onBlur: () => {
      setFocused(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") tooltip.onHide(id);
    },
  };

  const inner = (
    <motion.span
      initial={false}
      animate={animate}
      transition={badgeSpring}
      className={visualClassName}
    >
      {children}
    </motion.span>
  );

  const describedBy = tooltip.activeId === id ? tooltip.tooltipId : undefined;

  return (
    <li className="shrink-0">
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={label}
          aria-describedby={describedBy}
          className={hitTileClass}
          onClick={onClick}
          {...sharedEvents}
        >
          {inner}
        </a>
      ) : (
        <span
          role="img"
          tabIndex={0}
          aria-label={label}
          aria-describedby={describedBy}
          className={hitTileClass}
          {...sharedEvents}
        >
          {inner}
        </span>
      )}
    </li>
  );
}

function SponsorList({
  sponsors,
  tooltip,
}: {
  sponsors: Sponsor[];
  tooltip: TooltipHandlers;
}) {
  const { supportLabel, supportNote } = sponsorsSectionConfig;

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {sponsors.map((sponsor) => {
        const url = sponsor.url;
        const logo = (
          <span className="block size-full [&>div]:!size-full">
            {sponsor.logo ? (
              <Image
                src={sponsor.logo}
                alt=""
                width={56}
                height={56}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <Avvvatars value={sponsor.id} style="shape" size={56} radius={1} />
            )}
          </span>
        );
        const visualClassName = cn(
          visualBadgeClass,
          "bg-card shadow-xs shadow-foreground/10 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-foreground/10",
        );

        return (
          <TileFrame
            key={sponsor.id}
            id={`sponsor-${sponsor.id}`}
            label={sponsor.name}
            href={url ? withReferral(url) : undefined}
            external={Boolean(url)}
            visualClassName={visualClassName}
            tooltip={tooltip}
            onClick={
              url
                ? () =>
                    trackEvent("sponsor_link_clicked", {
                      sponsor_name: sponsor.name,
                      seat: sponsor.seat,
                      url,
                      location: window.location.pathname,
                    })
                : undefined
            }
          >
            {logo}
          </TileFrame>
        );
      })}
      <TileFrame
        id="sponsor-checkout"
        label={supportLabel}
        note={`${SEAT_PRICE_LABEL} · ${supportNote}`}
        href="/api/sponsor-checkout"
        visualClassName={cn(
          visualBadgeClass,
          "bg-background text-muted-foreground ring-1 ring-inset ring-border transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground group-focus-visible:bg-secondary group-focus-visible:text-secondary-foreground",
        )}
        tooltip={tooltip}
      >
        <Plus className="size-5" aria-hidden />
      </TileFrame>
    </ul>
  );
}

function SupportLinks({ tooltip }: { tooltip: TooltipHandlers }) {
  return (
    <ul aria-label="Support links" className="flex flex-wrap items-center gap-3">
      {getEnabledSupportLinks().map((link) => {
        const { Icon, BadgeIcon, tile, badge } = supportTiles[link.icon];

        return (
          <TileFrame
            key={link.id}
            id={`support-${link.id}`}
            label={link.label}
            href={link.href}
            external
            visualClassName={visualTileClass}
            tooltip={tooltip}
            onClick={() =>
              trackEvent("sponsor_support_link_clicked", {
                link_id: link.id,
                url: link.href,
                location: window.location.pathname,
              })
            }
          >
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center overflow-hidden rounded-[inherit] shadow-xs shadow-foreground/10 ring-1 ring-inset",
                tile,
              )}
            >
              <Icon className="size-6" aria-hidden />
            </span>
            <span
              aria-hidden
              className={cn(
                "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full ring-2 ring-background",
                badge,
              )}
            >
              <BadgeIcon className="size-3" strokeWidth={2.4} />
            </span>
          </TileFrame>
        );
      })}
    </ul>
  );
}

export function SponsorsSection() {
  const { heading, description } = sponsorsSectionConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tipOpenRef = useRef(false);
  const tooltipId = useId();
  const [tip, setTip] = useState<SponsorTooltipState | null>(null);
  const [tipOpen, setTipOpen] = useState(false);
  const [tipGliding, setTipGliding] = useState(false);
  const [tipPos, setTipPos] = useState<{
    left: number;
    arrowLeft: number;
  } | null>(null);

  const onShow = useCallback(
    (id: string, label: string, el: HTMLElement, note?: string) => {
      const container = containerRef.current;
      if (!container) return;
      const box = container.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const x = rect.left - box.left + rect.width / 2;
      const top = rect.top - box.top;
      const wasOpen = tipOpenRef.current;
      tipOpenRef.current = true;
      setTipGliding(wasOpen);
      setTipOpen(true);
      setTip({ id, label, note, x, top });
    },
    [],
  );

  const closeTip = useCallback(() => {
    tipOpenRef.current = false;
    setTipOpen(false);
    setTipGliding(false);
  }, []);

  const onHide = useCallback(() => {
    closeTip();
  }, [closeTip]);

  useLayoutEffect(() => {
    if (!tip || !containerRef.current || !tooltipRef.current) {
      setTipPos(null);
      return;
    }
    const containerWidth = containerRef.current.clientWidth;
    const tipWidth = tooltipRef.current.offsetWidth;
    // Allow slight overhang into the section's 24px horizontal padding while staying inside the frame.
    const minLeft = -16;
    const maxLeft = Math.max(minLeft, containerWidth - tipWidth + 16);
    const left = Math.max(minLeft, Math.min(tip.x - tipWidth / 2, maxLeft));
    const arrowLeft = Math.max(10, Math.min(tip.x - left, tipWidth - 10));
    setTipPos((current) =>
      current && current.left === left && current.arrowLeft === arrowLeft
        ? current
        : { left, arrowLeft },
    );
  }, [tip]);

  const tooltipHandlers: TooltipHandlers = {
    activeId: tipOpen ? (tip?.id ?? null) : null,
    tooltipId,
    onShow,
    onHide,
  };

  const tipVisible = tipOpen && Boolean(tipPos);
  const tipMotion = tipGliding ? tooltipGlide : tooltipFade;

  return (
    <section className="relative border-y border-dashed pt-6">
      <h2 className="no-js-visible section-heading px-[21px] py-px font-serif text-[25px] leading-8 font-medium italic">
        {heading}
      </h2>
      <div className="flex flex-col gap-6 px-6 py-6">
        <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div
          ref={containerRef}
          className="relative flex flex-col gap-3"
          onPointerLeave={(event) => {
            if (event.pointerType !== "touch") closeTip();
          }}
          onBlur={(event) => {
            if (
              event.relatedTarget instanceof Node &&
              event.currentTarget.contains(event.relatedTarget)
            ) {
              return;
            }
            closeTip();
          }}
        >
          <SponsorList sponsors={getEnabledSponsors()} tooltip={tooltipHandlers} />
          <SupportLinks tooltip={tooltipHandlers} />
          {tip && (
            <div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              aria-hidden={!tipVisible}
              className={cn(
                "pointer-events-none absolute left-0 top-0 z-50 inline-flex w-max max-w-xs flex-col items-center gap-0.5 rounded-md bg-foreground px-3 py-1.5 font-mono text-[11px] font-normal text-background will-change-transform",
                tipMotion,
                tipVisible ? "opacity-100" : "opacity-0",
              )}
              style={{
                transform: tipPos
                  ? `translate3d(${tipPos.left}px, ${tip.top - 10}px, 0) translateY(-100%)`
                  : `translate3d(${tip.x}px, ${tip.top - 10}px, 0) translate(-50%, -100%)`,
              }}
            >
              <span>{tip.label}</span>
              {tip.note && <span className="opacity-70">{tip.note}</span>}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-[3px] left-0 size-2 rounded-[1.5px] bg-foreground",
                  tipGliding
                    ? "transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    : undefined,
                )}
                style={{
                  transform: `translate3d(${tipPos ? tipPos.arrowLeft - 4 : 0}px, 0, 0) rotate(45deg)`,
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Signature
        className="pointer-events-none absolute right-6 top-1/2 h-12 w-auto -translate-y-1/2 text-foreground/80 max-sm:hidden"
        viewport={{ amount: 0.1 }}
      />
    </section>
  );
}
