export const notFoundConfig = {
  title: "Page not found",
  code: "404",
  label: "Page not found",
  heading: "Took a wrong turn.",
  description:
    "This page isn't here. Let's get you back on familiar ground.",
  moleNote: "This way?",
  foundNote: "Found it!",
  foxNote: "z z z",
  interactions: {
    hiker: "Help the hiker read his map",
    snail: "Say hello to the shy snail",
    mole: "Play peekaboo with the mole",
    fox: "Wake the sleepy fox",
  },
  home: { label: "Back to home", href: "/" },
} as const;
