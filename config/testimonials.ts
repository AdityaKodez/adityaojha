import type { Testimonial } from "@/config/types";

export const testimonialsSectionConfig = {
  seeMoreLabel: "view all",
};

export const testimonialsConfig: Testimonial[] = [
  {
    id: "natey",
    name: "natey_mac",
    role: "Redditor",
    content:
      "This is great. Most of the portfolios people post here are doing WAY too much. Yours here shows off just enough skill and an eye for design and doesn’t look like a boiler plate template to me at least. So great work. No notes.",
    avatar: "NM",
    image: "/testimonial/natey.png",
    order: 1,
    enabled: true,
  },
  {
    id: "elongated",
    name: "ElongatedBear",
    role: "Redditor",
    content: "You've got a good eye for design",
    avatar: "EB",
    image: "/testimonial/elongated.png",
    order: 2,
    enabled: true,
  },
  {
    id: "garvit",
    name: "Garvit Joshi",
    role: "Creator of animbits.dev.",
    content: "I like the minimalistic look good work.",
    avatar: "GJ",
    image: "/testimonial/garvit.png",
    order: 3,
    enabled: true,
  },
  {
    id: "kraig",
    name: "KraiG",
    role: "Creative Designer",
    content:
      "Thanks! Lovely, what more can I say just build and build and build...",
    avatar: "KG",
    image: "/testimonial/kraig.jpg",
    order: 4,
    enabled: true,
  },
  {
    id: "quby",
    name: "Quby",
    role: "Design Engineer",
    content: "Very nice man",
    avatar: "QB",
    image: "/testimonial/quby.jpg",
    order: 5,
    enabled: true,
  },
  {
    id: "rachit",
    name: "Rachit Thakur",
    role: "Designer & Builder",
    content: "Looks cool bro",
    avatar: "RT",
    image: "/testimonial/rachit.jpg",
    order: 6,
    enabled: true,
  },
  {
    id: "rohit",
    name: "Rohit",
    role: "Developer",
    content: "Love the minimal vibe. Cool",
    avatar: "RH",
    image: "/testimonial/rohit.jpg",
    order: 7,
    enabled: true,
  },
  {
    id: "gaurav",
    name: "gauravii",
    role: "Agency Builder",
    content: "That looks good!",
    avatar: "GV",
    image: "/testimonial/gaurav.jpg",
    order: 8,
    enabled: true,
  },
  {
    id: "vishal",
    name: "Vishal Sharma",
    role: "Student",
    content:
      "Your portfolio UI looks good, well which tech stack and state management you have used ?",
    avatar: "VS",
    image: "/testimonial/vishal.png",
    order: 9,
    enabled: false,
  },
  {
    id: "vivek",
    name: "Vivek Singh",
    role: "CoFounder at Digia",
    content: "Congrats on your launch. Looking forward",
    avatar: "VS",
    image: "/testimonial/vivek.png",
    order: 10,
    enabled: false,
  },
  {
    id: "Tolani",
    name: "Tolani",
    role: "Frontend Developer",
    content: "Just took a look And i love it",
    avatar: "TL",
    image: "/testimonial/tolani.png",
    order: 11,
    enabled: false,
  },
  {
    id: "Sahil",
    name: "Sahil Sahu",
    role: "Developer",
    content: "Cool bro",
    avatar: "SA",
    image: "/testimonial/sahil.png",
    order: 12,
    enabled: false,
  },
];

/** Every testimonial in authored order. Used by the /testimonials page. */
export function getAllTestimonials(): Testimonial[] {
  return [...testimonialsConfig].sort((a, b) => a.order - b.order);
}

/** Only the published ones. Used by the home page marquee. */
export function getEnabledTestimonials(): Testimonial[] {
  return getAllTestimonials().filter((item) => item.enabled !== false);
}
