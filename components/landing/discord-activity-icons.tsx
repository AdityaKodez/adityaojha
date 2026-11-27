import {
  PortfolioSticker,
  type DiscordActivityStickerName,
} from "@/components/shared/portfolio-sticker";
import { cn } from "@/lib/utils";

type ActivityIconProps = {
  size?: number | string;
  className?: string;
};

function createActivityIcon(name: DiscordActivityStickerName) {
  return function DiscordActivityIcon({ size = 28, className }: ActivityIconProps) {
    return (
      <PortfolioSticker
        name={name}
        size={size}
        className={cn("object-contain", className)}
      />
    );
  };
}

export const MusicActivityIcon = createActivityIcon("activity-music");
export const WatchingActivityIcon = createActivityIcon("activity-watching");
export const PlayingActivityIcon = createActivityIcon("activity-playing");
export const StreamingActivityIcon = createActivityIcon("activity-streaming");
export const CodingActivityIcon = createActivityIcon("activity-coding");
export const CompetingActivityIcon = createActivityIcon("activity-competing");
export const GenericActivityIcon = createActivityIcon("activity-generic");
