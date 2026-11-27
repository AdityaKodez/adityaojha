"use client";

import dynamic from "next/dynamic";

const NotFoundExperience = dynamic(
  () => import("./not-found-experience").then((m) => m.NotFoundExperience),
  { ssr: false },
);

export function NotFoundLoader() {
  return <NotFoundExperience />;
}
