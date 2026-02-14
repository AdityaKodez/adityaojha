export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type DiscordActivity = {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
};

export type DiscordSpotify = {
  track_id: string;
  song: string;
  artist: string;
  album: string;
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

export function getPrimaryActivityName(data: LanyardData): string | null {
  const customStatusType = 4;

  const primaryActivity = data.activities.find(
    (activity) => activity.type !== customStatusType,
  );

  return primaryActivity?.name ?? null;
}
