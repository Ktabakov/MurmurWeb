import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://murmurapps.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Real content dates, not build time — a lastmod that changes on every
  // deploy without content changes teaches crawlers to ignore it.
  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-07-05"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy/`,
      lastModified: new Date("2026-06-05"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
