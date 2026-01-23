import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

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
    url: "https://aditya-builds.vercel.app",
    siteName: "Aditya Portfolio",
    images: [
      {
        url: "https://aditya-builds.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "Aditya — Full-Stack Web Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aditya — Full-Stack Web Developer",
    description:
      "Building fast, scalable SaaS products with Next.js and modern web tech.",
    images: ["https://aditya-builds.vercel.app/og.png"],
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
      </body>
    </html>
  );
}
