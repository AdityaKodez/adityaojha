"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ActivityType,
  getActivityImageUrl,
  getPrimaryActivity,
  type DiscordStatus as DiscordStatusType,
  type LanyardData,
} from "@/lib/discord-status";
import { useQuery } from "@/lib/react-query";
import {
  Activity,
  Circle,
  CircleOff,
  Code,
  Focus,
  Gamepad2,
  Loader2,
  Moon,
  Music,
  Radio,
  Swords,
  Tv,
} from "lucide-react";
import Image from "next/image";
import { useState, type ComponentProps } from "react";

const fetchDiscordStatus = async (): Promise<LanyardData> => {
  const response = await fetch("/api/discord-status");

  if (!response.ok) {
    throw new Error("Failed to fetch Discord status.");
  }

  return response.json() as Promise<LanyardData>;
};

const statusConfig: Record<
  DiscordStatusType,
  {
    icon: typeof Circle;
    label: string;
    iconClassName: string;
  }
> = {
  online: {
    icon: Circle,
    label: "online",
    iconClassName: "text-green-500 fill-green-500",
  },
  idle: {
    icon: Moon,
    label: "chilling",
    iconClassName: "text-yellow-400 fill-yellow-400",
  },
  dnd: {
    icon: Focus,
    label: "deep work",
    iconClassName: "text-red-500 fill-red-500",
  },
  offline: {
    icon: Moon,
    label: "sleeping",
    iconClassName: "text-muted-foreground fill-muted-foreground",
  },
};

/** Map activity type to a fallback lucide icon */
const activityTypeIcons: Record<number, typeof Activity> = {
  [ActivityType.PLAYING]: Gamepad2,
  [ActivityType.STREAMING]: Radio,
  [ActivityType.LISTENING]: Music,
  [ActivityType.WATCHING]: Tv,
  [ActivityType.COMPETING]: Swords,
  [ActivityType.CUSTOM]: Activity,
};

/** Known app names → specific icons */
const knownAppIcons: Record<string, typeof Activity> = {
  "Visual Studio Code": Code,
  Code: Code,
  Cursor: Code,
};

/** Image that falls back to an icon if the URL is missing or fails to load */
function SafeImage({
  src,
  alt,
  fallback: Fallback,
  fallbackClassName,
  ...props
}: ComponentProps<typeof Image> & {
  fallback: typeof Activity;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <Fallback className={fallbackClassName ?? "h-5 w-5 shrink-0"} />;
  }

  return (
    <Image src={src} alt={alt} {...props} onError={() => setFailed(true)} />
  );
}

/** Small label + icon confirming what the user is doing */
function ActivityKindLabel({
  icon: Icon,
  label,
  className,
}: {
  icon: typeof Activity;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 text-[11px] ${className ?? ""}`}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}

/** Human label for an activity type */
function activityKindLabel(activity: LanyardData["activities"][number]) {
  const isCoding = activity.name in knownAppIcons;
  if (isCoding) return "coding";
  switch (activity.type) {
    case ActivityType.PLAYING:
      return "playing";
    case ActivityType.STREAMING:
      return "streaming";
    case ActivityType.LISTENING:
      return "listening";
    case ActivityType.WATCHING:
      return "watching";
    case ActivityType.COMPETING:
      return "competing";
    default:
      return "activity";
  }
}

function TooltipBody({ data }: { data: LanyardData }) {
  const spotify = data.listening_to_spotify ? data.spotify : null;
  const activity = getPrimaryActivity(data);

  // ── Spotify ──
  if (spotify) {
    return (
      <div className="flex items-start flex-col gap-1 max-w-65">
        <ActivityKindLabel
          icon={Music}
          label="listening"
          className="text-green-400 self-end"
        />
        <div className="flex items-center gap-2.5 max-w-65 ">
          <SafeImage
            src={spotify.album_art_url}
            alt={spotify.album}
            width={40}
            height={40}
            className="rounded-md shrink-0"
            unoptimized
            fallback={Music}
            fallbackClassName="h-5 w-5 shrink-0 text-green-400"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 min-w-0">
              <p className="font-medium truncate ">{spotify.song}</p>
            </div>
            <p className="text-[11px] opacity-70 truncate">
              {spotify.artist} - {spotify.album}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Other activity ──
  if (activity) {
    const activityImgUrl = getActivityImageUrl(activity);

    const FallbackIcon =
      knownAppIcons[activity.name] ??
      activityTypeIcons[activity.type] ??
      Activity;

    return (
      <div className="flex items-center gap-4 max-w-65">
        <Button variant="ghost" size={"icon-lg"} className="rounded-sm p-0">
          <SafeImage
            src={activityImgUrl ?? ""}
            alt={activity.name}
            width={50}
            height={50}
            className="rounded-md shrink-0 "
            unoptimized
            fallback={FallbackIcon}
          />
        </Button>
        <div className="min-w-0">
          <ActivityKindLabel
            icon={FallbackIcon}
            label={activityKindLabel(activity)}
            className="text-muted-foreground mb-0.5"
          />
          <p className="font-medium truncate">{activity.name}</p>
          {activity.details && (
            <p className="text-[11px] opacity-70 truncate">
              {activity.details}
            </p>
          )}
          {activity.state && (
            <p className="text-[11px] opacity-70 truncate">{activity.state}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Fallback ──
  if (data.discord_status === "offline") {
    return <p>currently offline</p>;
  }

  return <p>no activity right now.</p>;
}

export function DiscordStatus() {
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
    return (
      <Badge variant="ghost" className="rounded-lg h-6 px-2 cursor-default text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      </Badge>
    );
  }

  if (error || !data) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            tabIndex={0}
            role="button"
            aria-label="discord status: offline"
            className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-sm inline-flex"
          >
            <Badge variant="ghost" className="rounded-lg h-6 px-2 cursor-default text-muted-foreground">
              <CircleOff className="h-3.5 w-3.5 text-muted-foreground" />
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-2.5">
          <p className="text-xs text-muted-foreground">offline</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  const config = statusConfig[data.discord_status];
  const StatusIcon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          tabIndex={0}
          role="button"
          aria-label={`Discord status: ${config.label}`}
          className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-sm inline-flex"
        >
          <Badge variant="secondary" className="rounded-lg h-6 px-2 cursor-pointer">
            <StatusIcon className={`h-3.5 w-3.5 ${config.iconClassName}`} />
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="p-2.5">
        <div className="space-y-1">
          <TooltipBody data={data} />
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default DiscordStatus;
