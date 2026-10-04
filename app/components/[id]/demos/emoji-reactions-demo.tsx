"use client";

import Avatar from "boring-avatars";
import { EmojiReactions, type EmojiReactionsProps } from "@/components/ui/emoji-reactions";

export function EmojiReactionsDemo(props: Partial<EmojiReactionsProps> = {}) {
  return (
    <div className="flex min-h-80 w-full items-center justify-center px-2 py-12">
      <div className="flex w-full max-w-72 items-start gap-3">
        <div className="size-8 shrink-0">
          <Avatar
            size={32}
            name="Aditya Ojha"
            variant="marble"
            colors={["var(--primary)", "var(--muted)", "var(--accent)", "var(--foreground)", "var(--secondary)"]}
            role="img"
            aria-label="Aditya's avatar"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-baseline gap-2">
            <span className="text-sm font-medium">Aditya</span>
            <span className="font-mono text-[10px] text-muted-foreground">Just now</span>
          </div>
          <div className="relative rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
            <p className="text-sm leading-relaxed">Just shipped the new design. What do you think?</p>
            <EmojiReactions defaultValue="like" className="absolute -bottom-5 right-3" {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}
