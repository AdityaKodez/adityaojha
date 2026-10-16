export const notFoundConfig = {
  title: "Page not found",
  code: "404",
  heading: "A little off the map.",
  description:
    "This page has wandered off. Let's get you back to familiar ground.",
  home: { label: "Back to home", href: "/" },
  components: { label: "Explore components", href: "/components" },
  artwork: {
    map: {
      src: "/images/not-found-map.webp",
      width: 1000,
      height: 667,
    },
    plane: { src: "/images/profile-stickers/plane.webp" },
  },
} as const;
