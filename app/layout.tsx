import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya — Full-Stack Web Developer",
  description:
    "Full-stack web developer building fast, scalable web applications for early-stage founders. Next.js, React, TypeScript, Prisma,Trpc , PostgreSQL.",
  verification: {
    google:
      "google-site-verification=g3qcAByxzXth5-9FAc4ZGNbMuD360f9xaQkpa18yads",
  },
  keywords: [
    "Full-stack developer",
    "Web developer",
    "Next.js developer",
    "React developer",
    "TypeScript",
    "SaaS builder",
    "Startup developer",
    "India",
  ],

  authors: [{ name: "Aditya" }],
  creator: "Aditya",

  openGraph: {
    title: "Aditya — Full-Stack Web Developer",
    description:
      "I build high-performance web applications for early-stage founders using modern web stacks.",
    url: "https://akodez.xyz",
    siteName: "Aditya Portfolio",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    title: "Aditya — Full-Stack Web Developer",
    description:
      "Building fast, scalable SaaS products with Next.js and modern web tech.",
  },

  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
