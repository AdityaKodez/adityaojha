"use client";

import {
  getPrimaryActivityName,
  statusDotColorMap,
  type LanyardData,
} from "@/lib/discord-status";
import { useQuery } from "@/lib/react-query";

const fetchDiscordStatus = async (): Promise<LanyardData> => {
  const response = await fetch("/api/discord-status");

  if (!response.ok) {
    throw new Error("Failed to fetch Discord status.");
  }

  return response.json() as Promise<LanyardData>;
};

export function DiscordStatus() {
  const { data, error, isLoading, isFetching } = useQuery<LanyardData>(
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
      <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
        Loading Discord status...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
        Unable to load Discord status right now.
      </div>
    );
  }

  const activityName = getPrimaryActivityName(data);
  const spotify = data.listening_to_spotify ? data.spotify : null;

  return (
    <section className="rounded-xl border border-dashed p-4 space-y-2">
      <div className="flex items-center justify-between gap-2 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span
            aria-label={`Discord status: ${data.discord_status}`}
            className={`inline-flex h-2.5 w-2.5 rounded-full ${statusDotColorMap[data.discord_status]}`}
          />
          <span className="capitalize">{data.discord_status}</span>
        </div>
        {isFetching ? (
          <span className="text-xs text-muted-foreground">Syncing...</span>
        ) : null}
      </div>

      {spotify ? (
        <p className="text-sm text-muted-foreground">
          Listening to <span className="font-medium">{spotify.song}</span> by{" "}
          <span className="font-medium">{spotify.artist}</span>
        </p>
      ) : activityName ? (
        <p className="text-sm text-muted-foreground">
          Active on <span className="font-medium">{activityName}</span>
        </p>
      ) : data.discord_status === "offline" ? (
        <p className="text-sm text-muted-foreground">Currently offline.</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nothing active right now.
        </p>
      )}
    </section>
  );
}

export default DiscordStatus;
