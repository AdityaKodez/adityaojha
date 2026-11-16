"use client";

import { useState } from "react";
import { NotFoundContent } from "./not-found-content";
import { NotFoundScene } from "./not-found-scene";

export function NotFoundExperience() {
  const [homeHovered, setHomeHovered] = useState(false);
  const [homeFocused, setHomeFocused] = useState(false);

  return (
    <>
      <NotFoundScene homeActive={homeHovered || homeFocused} />
      <NotFoundContent
        onHomePointerChange={setHomeHovered}
        onHomeFocusChange={setHomeFocused}
      />
    </>
  );
}
