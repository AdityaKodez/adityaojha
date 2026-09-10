"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function Vader() {
  const [ignited, setIgnited] = useState(false);
  const saberAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = saberAudio.current;

    return () => {
      audio?.pause();
    };
  }, []);

  const handleToggle = () => {
    const nextIgnited = !ignited;
    setIgnited(nextIgnited);
    trackEvent("vader_lightsaber_toggled", {
      action: nextIgnited ? "ignite" : "extinguish",
    });

    // Fired from a click, so playback is allowed; ignored when it is not.
    if (!nextIgnited) return;
    const audio = saberAudio.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  return (
    <div className=" absolute right-14 top-6 flex justify-center px-6 py-6">
      <button
        type="button"
        aria-label="Toggle Vader's lightsaber"
        aria-pressed={ignited}
        onClick={handleToggle}
        className="group flex flex-col items-center gap-2 rounded-lg px-6 py-3 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          focusable="false"
          className="size-26 overflow-visible transition-transform duration-200 group-hover:rotate-9 group-active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
          shapeRendering="crispEdges"
        >
          <path d="M10 44h28v1H10z" className="fill-border" />

          {/* Cape, boots, and shoulders. */}
          <path
            d="M14 24h18v4h3v7h2v7H10v-7h2v-7h2z"
            className="fill-foreground stroke-muted-foreground dark:fill-background"
            strokeWidth="0.5"
          />
          <path d="M14 29h2v11h-2zM31 29h2v11h-2z" className="fill-muted-foreground/40" />
          <path d="M18 38h5v5h-7v-2h2zM25 38h5v3h2v2h-7z" className="fill-foreground dark:fill-muted" />

          {/* Helmet and the stepped brow. */}
          <path
            d="M20 5h8v2h3v3h2v9h2v4h-5v2H18v-2h-5v-4h2v-9h2V7h3z"
            className="fill-foreground stroke-muted-foreground dark:fill-background"
            strokeWidth="0.5"
          />
          <path d="M20 8h3v2h-3v3h-2v5h-2v-7h2V9h2zM24 7h2v8h-2z" className="fill-muted-foreground/60" />
          <path d="M18 15h5v3h-2v-1h-3zM25 15h5v2h-3v1h-2z" className="fill-muted-foreground" />
          <path d="M23 18h2v2h2v3h-6v-3h2z" className="fill-muted-foreground" />
          <path d="M22 21h1v3h-1zM24 20h1v4h-1zM26 21h1v3h-1z" className="fill-foreground dark:fill-background" />
          <path d="M17 20h2v2h-2zM29 20h2v2h-2z" className="fill-muted-foreground" />

          {/* Chest panel and belt. */}
          <path d="M19 27h10v7H19z" className="fill-muted-foreground/50" />
          <path d="M20 28h2v2h-2z" className="fill-destructive" />
          <path d="M23 28h2v2h-2zM26 28h2v2h-2zM20 31h8v1h-8zM16 36h16v2H16z" className="fill-muted-foreground" />
          <path d="M22 35h4v4h-4z" className="fill-secondary" />

          {/* Center the hilt through the fist, with both ends visible behind the hand. */}
          <g transform="translate(-3.5 0) rotate(-135 39 32)">
            <g
              style={{
                transform: `scaleY(${ignited ? 1 : 0})`,
                transformOrigin: "39px 26px",
                filter: ignited ? "drop-shadow(0 0 2px var(--destructive))" : "none",
              }}
              className="transition-transform duration-200 motion-reduce:transition-none"
            >
              <path d="M38 5h2v21h-2z" className="fill-destructive" />
              <path d="M38.75 6h0.5v20h-0.5z" className="fill-primary-foreground dark:fill-foreground" />
            </g>
            <path d="M37 26h4v2h-1v9h-2v-9h-1z" className="fill-muted-foreground" />
          </g>
          <path d="M32 30h7v4h-7z" className="fill-foreground stroke-muted-foreground dark:fill-muted" strokeWidth="0.5" />
        </svg>
        <span className="font-mono text-[10px]">
          {ignited ? "Power down" : "Ignite lightsaber"}
        </span>
      </button>

      <audio src="/lightsader.mp3" ref={saberAudio} preload="none" />
    </div>
  );
}
