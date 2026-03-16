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
  Gamepad2,
  Loader2,
  MinusCircle,
  Moon,
  Music,
  Radio,
  Swords,
  Tv,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentProps } from "react";
import { FaSpotify } from "react-icons/fa";

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
    label: "Online",
    iconClassName: "text-green-500 fill-green-500",
  },
  idle: {
    icon: Moon,
    label: "Chilling",
    iconClassName: "text-yellow-400 fill-yellow-400",
  },
  dnd: {
    icon: MinusCircle,
    label: "Deep Work",
    iconClassName: "text-red-500",
  },
  offline: {
    icon: Moon,
    label: "Sleeping",
    iconClassName: "text-muted-foreground",
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

function TooltipBody({ data }: { data: LanyardData }) {
  const spotify = data.listening_to_spotify ? data.spotify : null;
  const activity = getPrimaryActivity(data);

  // ── Spotify ──
  if (spotify) {
    return (
      <div className="flex items-center flex-col gap-1 max-w-65">
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
        {spotify.track_id && (
          <Link
            href={`https://open.spotify.com/track/${spotify.track_id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Play on Spotify"
            className="w-full mt-2"
            prefetch="auto"
          >
            <Button
              variant="secondary"
              size={"lg"}
              className="w-full rounded-sm"
            >
              <FaSpotify className="mr-2 text-green-600" />
              Listen on Spotify
            </Button>
          </Link>
        )}
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
    return <p>Currently offline</p>;
  }

  return <p>No activity right now.</p>;
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
      <Badge variant="outline" className="gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Syncing...</span>
      </Badge>
    );
  }

  if (error || !data) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <CircleOff className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">Offline</span>
      </Badge>
    );
  }

  const config = statusConfig[data.discord_status];
  const StatusIcon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Badge variant="outline" className="gap-1.5 cursor-default">
            <StatusIcon className={`h-3 w-3 ${config.iconClassName}`} />
            <span className="font-sans">{config.label}</span>
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
