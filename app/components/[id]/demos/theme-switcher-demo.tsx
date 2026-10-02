"use client";

import { ThemeSwitcher, type ThemeSwitcherProps } from "@/components/ui/theme-switcher";

export function ThemeSwitcherDemo(props: Partial<ThemeSwitcherProps> = {}) {
  return <ThemeSwitcher {...props} />;
}
