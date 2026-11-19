import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PerfOverlay } from "@/components/perf-overlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Apex domain — matches where GitHub Pages serves the site (www redirects here). */
const SITE_URL = "https://murmurapps.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Murmur Apps — On-device AI music apps for iPhone",
    template: "%s | Murmur Apps",
  },
  description:
    "Murmur Apps is a one-person studio in Germany making iPhone apps that create music right on your phone: Murmur for royalty-free instrumentals, Lala for personal songs with vocals. No cloud, no subscription.",
  authors: [{ name: "Murmur Apps" }],
  creator: "Murmur Apps",
  publisher: "Murmur Apps",
  openGraph: {
    type: "website",
    siteName: "Murmur Apps",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Murmur Apps — music made on your iPhone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/og-image.png`],
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

/** Default for the Murmur-styled pages (privacy, terms, impressum): dark. The studio home and Lala pages override it. */
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
      <body className="min-h-full flex flex-col">
        {children}
        <PerfOverlay />
      </body>
    </html>
  );
}
