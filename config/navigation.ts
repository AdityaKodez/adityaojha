import type { SiteNavigationItem } from "@/config/types";

export const navigationConfig = {
  label: "Site navigation",
  menu: "Menu",
  close: "Close navigation",
  search: "Open command palette",
  githubLabel: "View source on GitHub (opens in a new tab)",
};

export const navigationItems: SiteNavigationItem[] = [
  { id: "home", label: "Home", href: "/", icon: "home", order: 0 },
  { id: "components", label: "Components", href: "/components", icon: "stack", order: 1 },
  { id: "testimonials", label: "Testimonials", href: "/testimonials", icon: "testimonial", order: 2 },
  { id: "sponsor", label: "Sponsor", href: "/sponsor", icon: "sparkles", order: 3 },
];
