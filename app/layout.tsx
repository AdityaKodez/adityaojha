import { Metadata } from "next";
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
  metadataBase: new URL("https://akoder.xyz"),
  title: {
    default: "Aditya — Full-Stack Engineer",
    template: "%s | Aditya",
  },
  description:
    "Aditya is a Full-stack Engineer building high-performance web applications. Specializing in Next.js, TypeScript, and modern web architecture.",
  keywords: [
    "Full-stack Engineer",
    "Web Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Software Engineer",
    "India",
  ],
  authors: [{ name: "Aditya", url: "https://akoder.xyz" }],
  creator: "Aditya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://akoder.xyz",
    title: "Aditya — Full-Stack Engineer",
    description:
      "Aditya is a Full-stack Engineer building high-performance web applications. Specializing in Next.js, TypeScript, and modern web architecture.",
    siteName: "Aditya",
    images: [
      {
        url: "/profile.png",
        width: 1200,
        height: 630,
        alt: "Aditya — Full-Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya — Full-Stack Engineer",
    description:
      "Aditya is a Full-stack Engineer building high-performance web applications. Specializing in Next.js, TypeScript, and modern web architecture.",
    images: ["/profile.png"],
    creator: "@AdityaKodez",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
