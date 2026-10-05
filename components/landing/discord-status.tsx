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
  Activity,
  Check,
  Code,
  Gamepad2,
  Music,
  Radio,
  Swords,
  Tv,
} from "lucide-react";
import { useInView } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

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

const activityTypeIcons: Record<number, typeof Activity> = {
  [ActivityType.PLAYING]: Gamepad2,
  [ActivityType.STREAMING]: Radio,
  [ActivityType.LISTENING]: Music,
  [ActivityType.WATCHING]: Tv,
  [ActivityType.COMPETING]: Swords,
  [ActivityType.CUSTOM]: Activity,
};

const codingApps = new Set(["Visual Studio Code", "Code", "Cursor", "Zed"]);

type Presence = {
  status: DiscordStatusType | null;
  title: string;
  subtitle: string;
  image: string | null;
  fallbackIcon: typeof Activity | null;
};

function describePresence(data: LanyardData | undefined): Presence {
  const avatar = {
    image: siteConfig.personal.avatar.src,
    fallbackIcon: null,
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
      fallbackIcon: Music,
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
        ? Code
        : (activityTypeIcons[activity.type] ?? Activity),
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

function Artwork({ presence }: { presence: Presence }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const FallbackIcon = presence.fallbackIcon ?? Activity;
  const showImage = presence.image && failedSrc !== presence.image;

  return (
    <div className="relative size-7 shrink-0">
      <div className="flex size-full items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
        {showImage ? (
          <Image
            src={presence.image!}
            alt=""
            width={28}
            height={28}
            unoptimized
            className={cn(
              "size-full object-cover",
              presence.status === "offline" && "grayscale",
            )}
            onError={() => setFailedSrc(presence.image)}
          />
        ) : (
          <FallbackIcon className="size-3.5" />
        )}
      </div>
      {presence.status && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2 rounded-full ring-[1.5px] ring-background",
            statusDotColorMap[presence.status],
          )}
        />
      )}
    </div>
  );
}

function CopyHandleButton() {
  const { status, copy } = useCopy();

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

  const label =
    status === "copied"
      ? "Copied!"
      : status === "error"
        ? "Copy failed"
        : discordSocial.handle;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy Discord username ${discordSocial.copyValue}`}
      className="micro-transition inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-1.5 font-mono text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 cursor-pointer"
    >
      {status === "copied" ? (
        <Check className="size-3 text-green-500" />
      ) : (
        <Image src="/discord.svg" alt="" width={12} height={12} />
      )}
      <span className="hidden sm:inline" aria-live="polite">
        {label}
      </span>
    </button>
  );
}

function PresenceCard() {
  const { data, error, isLoading } = useQuery<LanyardData>(
    "discord-status",
    fetchDiscordStatus,
    {
      staleTime: 60_000,
      gcTime: 600_000,
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
    },
  );

  if (isLoading) {
    return <PresenceSkeleton />;
  }

  const presence = describePresence(error ? undefined : data);

  return (
    <div className="flex items-center gap-2.5">
      <Artwork key={presence.image ?? "none"} presence={presence} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium leading-tight tracking-tight text-foreground">
          {presence.title}
        </p>
        {presence.subtitle && (
          <p className="truncate text-[11px] leading-tight text-muted-foreground">
            {presence.subtitle}
          </p>
        )}
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
  const inView = useInView(ref, { once: true, margin: "200px" });

  return (
    <div ref={ref}>{inView ? <PresenceCard /> : <PresenceSkeleton />}</div>
  );
}

export default DiscordStatus;
