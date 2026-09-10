"use client";

import { useState, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function Campfire() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [burning, setBurning] = useState(false);
  const [stoked, setStoked] = useState(false);
  const flickerDuration = stoked ? ".45s" : ".9s";
  const handleAudio = () => {
    const nextBurning = !burning;
    setBurning(nextBurning);
    trackEvent("campfire_toggled", {
      action: nextBurning ? "light" : "extinguish",
    });
    if (audioRef.current) {
      if (nextBurning) {
        audioRef.current.volume = 0.2;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };
  return (
    <div className="absolute bottom-[30rem] right-full z-10 mr-3 hidden justify-center xl:flex">
      <button
        type="button"
        aria-label={burning ? "Extinguish campfire" : "Light campfire"}
        aria-pressed={burning}
        onClick={handleAudio}
        onPointerEnter={() => setStoked(true)}
        onPointerLeave={() => setStoked(false)}
        onFocus={() => setStoked(true)}
        onBlur={() => setStoked(false)}
        className="group flex flex-col items-center gap-2 rounded-lg px-6 py-3 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          focusable="false"
          shapeRendering="crispEdges"
          className="size-26 overflow-visible transition-transform duration-200 group-hover:-translate-y-1 group-active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
        >
          <g className="transition-opacity duration-200 motion-reduce:transition-none">
            <path
              fill="#57372b"
              d="M12 32h6v2h8v2h10v5h-8v-2h-8v-2h-8z"
            />
            <path
              fill="#885437"
              d="M30 32h6v5h-8v2h-8v2h-8v-5h10v-2h8z"
            />
            <path fill="#b57b48" d="M13 36h7v2h-7z M28 33h6v2h-6z" />
            <path fill="#39291f" d="M13 38h3v2h-3z M32 38h3v2h-3z" />
          </g>

          <g
            opacity={burning ? 1 : 0}
            style={{
              filter: burning
                ? `drop-shadow(0 0 ${stoked ? 4 : 2}px #ed6235)`
                : "none",
              transform: burning ? "scale(1)" : "scale(0.55)",
              transformOrigin: "24px 35px",
              transition: "opacity 180ms ease, transform 220ms ease, filter 180ms ease",
            }}
          >
            <g>
              <animate
                attributeName="opacity"
                values="1;0;1;0;1"
                keyTimes="0;.25;.5;.75;1"
                calcMode="discrete"
                dur={flickerDuration}
                repeatCount="indefinite"
              />
              <path
                fill="#ed6235"
                d="M22 12h4v6h4v5h4v9h-4v3H18v-3h-4v-7h4v-6h4z"
              />
              <path
                fill="#ffac3d"
                d="M22 20h4v5h4v7h-4v2h-6v-3h-3v-5h5z"
              />
              <path fill="#ffe68b" d="M23 26h3v4h2v3h-7v-4h2z" />
            </g>

            <g opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;0;1;0"
                keyTimes="0;.25;.5;.75;1"
                calcMode="discrete"
                dur={flickerDuration}
                repeatCount="indefinite"
              />
              <path
                fill="#ed6235"
                d="M25 11h4v9h3v6h3v6h-5v3H18v-3h-4v-9h4v-5h3v7h4z"
              />
              <path
                fill="#ffac3d"
                d="M25 20h3v7h3v5h-5v2h-6v-3h-3v-5h5v-3h3z"
              />
              <path fill="#ffe68b" d="M24 26h3v5h2v2h-8v-4h3z" />
            </g>

            <rect x="20" y="17" width="2" height="2" fill="#ffc45b">
              <animate attributeName="y" values="17;6" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="x" values="20;18;20" dur="1.8s" repeatCount="indefinite" />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;.15;.6;1"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </rect>

            {stoked ? (
              <>
                <rect x="28" y="20" width="1.5" height="1.5" fill="#ffe68b">
                  <animate attributeName="y" values="20;8" dur="1.15s" repeatCount="indefinite" />
                  <animate attributeName="x" values="28;31;29" dur="1.15s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="1.15s" repeatCount="indefinite" />
                </rect>
                <rect x="17" y="22" width="1" height="1" fill="#ffac3d">
                  <animate attributeName="y" values="22;10" dur="1.35s" repeatCount="indefinite" />
                  <animate attributeName="x" values="17;14;16" dur="1.35s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="1.35s" repeatCount="indefinite" />
                </rect>
              </>
            ) : null}
          </g>

          {!burning ? (
            <g className="text-muted-foreground" opacity="0.55">
              <rect x="21" y="29" width="2" height="2" fill="currentColor" />
              <rect x="26" y="27" width="1" height="1" fill="currentColor" />
            </g>
          ) : null}
        </svg>

        <span className="font-mono text-[10px]">
          {burning ? "Extinguish fire" : "Light campfire"}
        </span>
      </button>
      <audio ref={audioRef} src="campfire.mp3" loop/>
    </div>
  );
}
