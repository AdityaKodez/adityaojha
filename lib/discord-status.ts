export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type DiscordActivity = {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
};

export type DiscordSpotify = {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
};

export type LanyardData = {
  discord_status: DiscordStatus;
  activities: DiscordActivity[];
  spotify: DiscordSpotify | null;
  listening_to_spotify: boolean;
};

export const statusDotColorMap: Record<DiscordStatus, string> = {
  online: "bg-green-500",
  idle: "bg-yellow-400",
  dnd: "bg-red-500",
  offline: "bg-gray-400",
};

/** Discord activity type numbers */
export const ActivityType = {
  PLAYING: 0,
  STREAMING: 1,
  LISTENING: 2,
  WATCHING: 3,
  CUSTOM: 4,
  COMPETING: 5,
} as const;

export function getPrimaryActivity(data: LanyardData): DiscordActivity | null {
  return (
    data.activities.find((activity) => activity.type !== ActivityType.CUSTOM) ??
    null
  );
}

export function getPrimaryActivityName(data: LanyardData): string | null {
  return getPrimaryActivity(data)?.name ?? null;
}

/**
 * Resolve a Discord activity asset image to a usable URL.
 * Lanyard returns assets in two formats:
 *  - "mp:external/<hash>/<url>" → external image
 *  - "<asset_id>" → Discord CDN app asset
 */
export function getActivityImageUrl(activity: DiscordActivity): string | null {
  const raw = activity.assets?.large_image;
  if (!raw) return null;

  if (raw.startsWith("mp:external/")) {
    // format: mp:external/<hash>/https/domain/path
    const urlPart = raw.replace("mp:external/", "");
    const slashIdx = urlPart.indexOf("/");
    if (slashIdx !== -1) {
      return `https://wsrv.nl/?url=${urlPart.substring(slashIdx + 1)}&w=64&h=64`;
    }
  }

  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${raw}.png?size=64`;
  }

  return null;
}
