import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Apex domain — matches where GitHub Pages serves the site (www redirects here). */
const SITE_URL = "https://murmurapps.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Murmur — Compose Your Scene | Royalty-Free AI Music for Creators",
    template: "%s | Murmur",
  },
  description:
    "Compose your scene on iPhone. Generate original, copyright-free soundtracks for YouTube, TikTok, indie games, and podcasts — on-device, export-ready WAV, no subscription.",
  category: "music",
  keywords: [
    "royalty-free AI music",
    "copyright-free background music",
    "AI soundtrack generator",
    "AI music for YouTube",
    "AI music for TikTok",
    "video editor background music",
    "indie game music generator",
    "content creator music app",
    "WAV export music app",
    "offline AI music iPhone",
    "on-device AI music",
    "no subscription AI music",
    "one-time purchase music app",
    "Magenta RT",
    "Apple Neural Engine",
  ],
  authors: [{ name: "Murmur" }],
  creator: "Murmur",
  publisher: "Murmur",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Murmur",
    title: "Murmur — Compose Your Scene | Royalty-Free AI Music",
    description:
      "Generate copyright-free soundtracks on iPhone. Export WAV for YouTube, TikTok, games, and podcasts — on-device, no subscription.",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/MurmurLogo.webp`,
        width: 1024,
        height: 1024,
        alt: "Murmur — royalty-free AI music app for creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Murmur — Compose Your Scene | Royalty-Free AI Music",
    description:
      "Original, copyright-free soundtracks on iPhone — for YouTube, TikTok, games, and podcasts. On-device generation, WAV export, no subscription.",
    images: [`${SITE_URL}/MurmurLogo.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0712",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`}>
      <head>
        <link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
