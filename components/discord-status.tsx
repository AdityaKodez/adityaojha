"use client";

import {
  getPrimaryActivity,
  getActivityImageUrl,
  ActivityType,
  type LanyardData,
  type DiscordStatus as DiscordStatusType,
} from "@/lib/discord-status";
import { useQuery } from "@/lib/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Circle,
  Moon,
  MinusCircle,
  CircleOff,
  Loader2,
  Music,
  Gamepad2,
  Code,
  Tv,
  Radio,
  Swords,
  Activity,
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
    label: "Online",
    iconClassName: "text-green-500 fill-green-500",
  },
  idle: {
    icon: Moon,
    label: "Idle",
    iconClassName: "text-yellow-400 fill-yellow-400",
  },
  dnd: {
    icon: MinusCircle,
    label: "Do Not Disturb",
    iconClassName: "text-red-500",
  },
  offline: {
    icon: CircleOff,
    label: "Offline",
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
      <div className="flex items-center gap-2.5 max-w-[260px]">
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
        <div className="min-w-0">
          <p className="font-medium truncate">{spotify.song}</p>
          <p className="text-[11px] opacity-70 truncate">by {spotify.artist}</p>
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
      <div className="flex items-center gap-2.5 max-w-[260px]">
        <SafeImage
          src={activityImgUrl ?? ""}
          alt={activity.name}
          width={40}
          height={40}
          className="rounded-md shrink-0"
          unoptimized
          fallback={FallbackIcon}
        />
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
            {config.label}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="p-2.5">
        <div className="space-y-1">
          <TooltipBody data={data} />
          <p className="text-[10px] text-muted-foreground">From Discord status</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default DiscordStatus;
