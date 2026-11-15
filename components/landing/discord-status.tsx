"use client";

import {
  ActivityType,
  getActivityImageUrl,
  getPrimaryActivity,
  statusDotColorMap,
  type DiscordStatus as DiscordStatusType,
  type LanyardData,
} from "@/lib/discord-status";
import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/socials";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@/lib/react-query";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";
import {
  CodingActivityIcon,
  CompetingActivityIcon,
  GenericActivityIcon,
  MusicActivityIcon,
  PlayingActivityIcon,
  StreamingActivityIcon,
  WatchingActivityIcon,
} from "@/components/landing/discord-activity-icons";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { CopyStatusIcon } from "@/components/showcase/copy-status-icon";
import type { CopyStatus } from "@/lib/use-copy";
import Image from "next/image";
import { useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fetchDiscordStatus = async (): Promise<LanyardData> => {
  const response = await fetch("/api/discord-status");

  if (!response.ok) {
    throw new Error("Failed to fetch Discord status.");
  }

  return response.json() as Promise<LanyardData>;
};

/* Discord has no public profile URL for a username, so the card copies the
   handle instead, from the same socials config entry the rest of the site uses. */
const discordSocial = socialsConfig.find((social) => social.id === "discord");

const activityTypeIcons: Record<number, typeof GenericActivityIcon> = {
  [ActivityType.PLAYING]: PlayingActivityIcon,
  [ActivityType.STREAMING]: StreamingActivityIcon,
  [ActivityType.LISTENING]: MusicActivityIcon,
  [ActivityType.WATCHING]: WatchingActivityIcon,
  [ActivityType.COMPETING]: CompetingActivityIcon,
  [ActivityType.CUSTOM]: GenericActivityIcon,
};

const codingApps = new Set(["Visual Studio Code", "Code", "Cursor", "Zed"]);

type Presence = {
  status: DiscordStatusType | null;
  title: string;
  subtitle: string;
  image: string | null;
  fallbackIcon: typeof GenericActivityIcon | null;
  listening: boolean;
};

function describePresence(data: LanyardData | undefined): Presence {
  const avatar = {
    image: siteConfig.personal.avatar.src,
    fallbackIcon: null,
    listening: false,
  };

  if (!data) {
    return {
      status: null,
      title: "Can't reach Discord right now.",
      subtitle: "Messages still land, I'll reply when I see them.",
      ...avatar,
    };
  }

  const spotify = data.listening_to_spotify ? data.spotify : null;

  if (spotify) {
    return {
      status: data.discord_status,
      title: spotify.song,
      subtitle: spotify.artist,
      image: spotify.album_art_url,
      fallbackIcon: MusicActivityIcon,
      listening: true,
    };
  }

  const activity = getPrimaryActivity(data);

  if (activity) {
    const isCoding = codingApps.has(activity.name);

    return {
      status: data.discord_status,
      title: activity.name,
      subtitle: [activity.details, activity.state].filter(Boolean).join(" · "),
      image: getActivityImageUrl(activity),
      fallbackIcon: isCoding
        ? CodingActivityIcon
        : (activityTypeIcons[activity.type] ?? GenericActivityIcon),
      listening: activity.type === ActivityType.LISTENING,
    };
  }

  if (data.discord_status === "offline") {
    return {
      status: "offline",
      title: "Away from the keyboard.",
      subtitle: "Leave a message, I'll reply when I'm back.",
      ...avatar,
    };
  }

  return {
    status: data.discord_status,
    title: "Around, nothing running.",
    subtitle: "Good time to say hi.",
    ...avatar,
  };
}

function Artwork({ presence, active }: { presence: Presence; active: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const FallbackIcon = presence.fallbackIcon ?? GenericActivityIcon;
  const showImage = presence.image && failedSrc !== presence.image;

  return (
    <div className="relative size-7 shrink-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={presence.image ?? presence.title}
          className="absolute inset-0 flex items-center justify-center text-muted-foreground"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
          transition={
            reducedMotion ? { duration: 0 } : { duration: 0.2, ease: EASE }
          }
        >
          {showImage ? (
            <Image
              src={presence.image!}
              alt=""
              width={28}
              height={28}
              /* Local artwork rides the optimizer; remote Discord and Spotify
                 images keep their direct URLs. */
              unoptimized={!presence.image!.startsWith("/")}
              className={cn(
                "size-full rounded-md object-cover",
                presence.status === "offline" && "grayscale",
              )}
              onError={() => setFailedSrc(presence.image)}
            />
          ) : (
            <FallbackIcon size={28} className="size-7" />
          )}
        </motion.div>
      </AnimatePresence>
      {presence.status && (
        <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 size-2">
          {presence.status === "online" && active && !reducedMotion && (
            /* A slow halo says "live" without pulling focus from the quote. */
            <motion.span
              className={cn(
                "absolute inset-0 rounded-full",
                statusDotColorMap.online,
              )}
              initial={{ opacity: 0.45, scale: 1 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{
                duration: 1.6,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 1.4,
              }}
            />
          )}
          <motion.span
            key={presence.status}
            className={cn(
              "absolute inset-0 rounded-full ring-[1.5px] ring-background",
              statusDotColorMap[presence.status],
            )}
            initial={reducedMotion ? false : { scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
          />
        </span>
      )}
    </div>
  );
}

function ListeningBars({ active }: { active: boolean }) {
  const reducedMotion = useReducedMotion();
  const moving = active && !reducedMotion;

  return (
    <span aria-hidden="true" className="inline-flex h-2 shrink-0 items-end gap-px">
      {[0, 1, 2].map((bar) => (
        <motion.span
          key={bar}
          className="h-full w-0.5 origin-bottom rounded-full bg-success"
          initial={{ scaleY: 0.5 }}
          animate={
            moving
              ? { scaleY: [0.35, 1, 0.55, 0.85, 0.35] }
              : { scaleY: [0.5, 0.9, 0.65][bar] }
          }
          transition={
            moving
              ? {
                  duration: 1.1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: bar * 0.16,
                }
              : { duration: 0 }
          }
        />
      ))}
    </span>
  );
}

const copyLabelOrder: CopyStatus[] = ["idle", "copied", "error"];

function CopyHandleButton() {
  const { status, copy } = useCopy();
  const reducedMotion = useReducedMotion();

  if (!discordSocial?.copyValue) {
    return null;
  }

  const handleCopy = () => {
    copy(discordSocial.copyValue!);
    trackEvent("social_handle_copied", {
      platform: discordSocial.platform,
      handle: discordSocial.handle,
      method: "click",
      location: "footer_discord_status",
    });
  };

  const labels: Record<CopyStatus, string> = {
    idle: discordSocial.handle,
    copied: "Copied!",
    error: "Copy failed",
  };
  const activeIndex = copyLabelOrder.indexOf(status);

  return (
    <>
      <motion.button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy Discord username ${discordSocial.copyValue}`}
        whileTap={reducedMotion ? undefined : { scale: 0.95 }}
        transition={{ type: "spring", stiffness: 600, damping: 32 }}
        className="micro-transition inline-flex h-6 shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 font-mono text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
      >
        <CopyStatusIcon
          status={status}
          className="size-3"
          idleIcon={<Image src="/discord.svg" alt="" width={12} height={12} />}
        />
        {/* Every label shares one grid cell, so the pill keeps the width of
            the longest label and the row never shifts while they roll. */}
        <span aria-hidden="true" className="hidden overflow-hidden sm:grid">
          {copyLabelOrder.map((labelStatus, index) => {
            const isActive = labelStatus === status;
            const offset = index < activeIndex ? -10 : 10;

            return (
              <motion.span
                key={labelStatus}
                className={cn(
                  "col-start-1 row-start-1 whitespace-nowrap",
                  labelStatus === "copied" && "text-success",
                  labelStatus === "error" && "text-destructive",
                )}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive || reducedMotion ? 0 : offset,
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: EASE }
                }
              >
                {labels[labelStatus]}
              </motion.span>
            );
          })}
        </span>
      </motion.button>
      <span className="sr-only" aria-live="polite">
        {status === "idle" ? "" : labels[status]}
      </span>
    </>
  );
}

function PresenceCard({ poll }: { poll: boolean }) {
  const reducedMotion = useReducedMotion();
  const { data, error, isLoading } = useQuery<LanyardData>(
    "discord-status",
    fetchDiscordStatus,
    {
      staleTime: 60_000,
      gcTime: 600_000,
      refetchInterval: poll ? 30_000 : undefined,
      refetchOnWindowFocus: true,
    },
  );

  if (isLoading) {
    return <PresenceSkeleton />;
  }

  const presence = describePresence(error ? undefined : data);

  return (
    <div className="flex items-center gap-2.5">
      <Artwork presence={presence} active={poll} />
      <div className="relative min-w-0 flex-1">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={`${presence.title}\n${presence.subtitle}`}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={
              reducedMotion ? { duration: 0 } : { duration: 0.22, ease: EASE }
            }
          >
            <p className="truncate text-xs font-medium leading-tight tracking-tight text-foreground">
              {presence.title}
            </p>
            {presence.subtitle && (
              <p className="flex min-w-0 items-center gap-1.5 text-[11px] leading-tight text-muted-foreground">
                {presence.listening && <ListeningBars active={poll} />}
                <span className="truncate">{presence.subtitle}</span>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <CopyHandleButton />
    </div>
  );
}

function PresenceSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse items-center gap-2.5"
    >
      <div className="size-7 shrink-0 rounded-md bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2 w-20 rounded bg-muted" />
        <div className="h-2.5 w-32 rounded bg-muted" />
      </div>
    </div>
  );
}

/* The footer is the last thing on the page, so polling Lanyard from first
   paint wastes requests for visitors who never scroll that far. The query
   only mounts once the card is about to enter the viewport. */
export function DiscordStatus() {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useInView(ref, { once: true, margin: "200px" });
  /* Polls stay active only while the card sits near the viewport; the card
     itself stays mounted so the cached presence never flashes a skeleton. */
  const nearViewport = useInView(ref, { margin: "200px" });

  return (
    <div ref={ref}>
      {mounted ? (
        <PresenceCard poll={nearViewport} />
      ) : (
        <PresenceSkeleton />
      )}
    </div>
  );
}

export default DiscordStatus;
