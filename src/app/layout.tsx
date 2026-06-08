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
    default: "Murmur — Royalty-Free AI Music for Creators on iPhone",
    template: "%s | Murmur",
  },
  description:
    "Generate 100% original, copyright-free instrumental music on iPhone. Murmur creates royalty-free background tracks for YouTube, TikTok, indie games, and podcasts — on-device, no subscription.",
  category: "music",
  keywords: [
    "royalty-free AI music",
    "copyright-free background music",
    "AI music for YouTube",
    "AI music for TikTok",
    "indie game music generator",
    "content creator music app",
    "on-device AI music",
    "offline music generator",
    "no subscription AI music",
    "WAV export music app",
    "Magenta RT",
    "Apple Neural Engine",
    "iPhone music app",
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
    title: "Murmur — Royalty-Free AI Music for Creators",
    description:
      "Generate copyright-free instrumental music on iPhone. Perfect for YouTube, TikTok, indie games, and podcasts — on-device, no subscription.",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/MurmurLogo.webp`,
        width: 1024,
        height: 1024,
        alt: "Murmur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Murmur — Royalty-Free AI Music for Creators",
    description:
      "Original, copyright-free AI music on iPhone — for YouTube, TikTok, games, and podcasts. On-device generation, no subscription.",
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
