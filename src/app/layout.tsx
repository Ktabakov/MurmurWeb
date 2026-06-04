import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.murmurapps.site";
// Bump when favicon assets change — forces browsers to drop stale tab icons.
const FAVICON_VERSION = "4";

const siteMetadata = {
  title: {
    default: "Murmur — Private, On-Device AI Music Generation for iPhone",
    template: "%s | Murmur",
  },
  description:
    "Murmur is a private, on-device AI music generator for iPhone. Turn presets or your own words into original AI-generated instrumental music — composed entirely on your phone with no cloud rendering. Powered by Magenta RT and boosted by the Apple Neural Engine.",
  category: "music",
  keywords: [
    "AI generated music",
    "AI music generation",
    "AI music generator",
    "on-device AI music",
    "private music generation",
    "offline music generator",
    "no cloud AI music",
    "instrumental music generator",
    "text to music AI",
    "mood to music",
    "ambient music generator",
    "lo-fi music generator",
    "Magenta RT",
    "Apple Neural Engine",
    "Core ML music",
    "iPhone music app",
    "privacy-first AI",
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
    title: "Murmur — Private, On-Device AI Music Generation",
    description:
      "Compose your mood. Turn presets or your own words into original AI-generated instrumental music, privately on your iPhone. No cloud rendering — powered by Magenta RT on the Apple Neural Engine.",
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
    title: "Murmur — Private, On-Device AI Music Generation",
    description:
      "Compose your mood. Private, on-device AI music generation for iPhone — powered by Magenta RT, boosted by the Apple Neural Engine.",
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
} satisfies Omit<Metadata, "metadataBase" | "icons">;

export function generateMetadata(): Metadata {
  const metadataBase =
    process.env.NODE_ENV === "development"
      ? new URL("http://localhost:3000")
      : new URL(SITE_URL);

  return {
    ...siteMetadata,
    metadataBase,
    icons: {
      icon: [
        {
          url: `/favicon-32.png?v=${FAVICON_VERSION}`,
          type: "image/png",
          sizes: "32x32",
        },
        {
          url: `/favicon.ico?v=${FAVICON_VERSION}`,
          type: "image/x-icon",
          sizes: "32x32",
        },
      ],
      apple: [
        {
          url: `/apple-icon.png?v=${FAVICON_VERSION}`,
          type: "image/png",
          sizes: "180x180",
        },
      ],
      shortcut: `/favicon-32.png?v=${FAVICON_VERSION}`,
    },
  };
}

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
