import { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
    "Aditya",
    "Aditya Ojha",
    "AdityaKodez",
    "SaaS",
  ],
  authors: [{ name: "Aditya", url: "https://akoder.xyz" }],
  creator: "Aditya",
  publisher: "Aditya",
  classification: "Portfolio",
  category: "technology",
  alternates: {
    canonical: "https://akoder.xyz",
  },
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
    creator: "@AdiKodez",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
  verification: {
    google: "google-site-verification-code", // Placeholder
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aditya Ojha",
  url: "https://akoder.xyz",
  jobTitle: "Full-Stack Engineer",
  description:
    "Full-stack Engineer building high-performance web applications. Specializing in Next.js, TypeScript, and modern web architecture.",
  knowsAbout: [
    "Next.js",
    "TypeScript",
    "React",
    "Prisma",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "AWS",
  ],
  sameAs: [
    "https://github.com/AdityaKodez",
    "https://x.com/AdiKodez",
    "https://linkedin.com/in/adityakodez",
  ],
  image: "https://akoder.xyz/profile.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={bricolageGrotesque.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <style>{`.no-js-visible { opacity: 1 !important; transform: none !important; stroke-dashoffset: 0 !important; stroke-dasharray: none !important; }`}</style>
        </noscript>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
