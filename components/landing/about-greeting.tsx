"use client";

import { useSyncExternalStore } from "react";
import type { AboutGreetings } from "@/config/types";

function subscribe(onChange: () => void) {
  const interval = window.setInterval(onChange, 60_000);
  window.addEventListener("focus", onChange);

  return () => {
    window.clearInterval(interval);
    window.removeEventListener("focus", onChange);
  };
}

function getPeriod(): keyof AboutGreetings {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}

// Keep the server and first browser render identical until local time is known.
const getServerSnapshot = () => null;

export function AboutGreeting({
  fallback,
  greetings,
}: {
  fallback: string;
  greetings: AboutGreetings;
}) {
  const period = useSyncExternalStore(subscribe, getPeriod, getServerSnapshot);
  return period ? greetings[period] : fallback;
}
