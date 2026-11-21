/** Shared facts for the studio site (murmurapps.com): both apps, contact, links. */

/** Apex domain — matches where GitHub Pages serves the site (www redirects here). */
export const SITE_URL = "https://murmurapps.com";
export const STUDIO_NAME = "Murmur Apps";
export const CONTACT_EMAIL = "murmurapps@gmail.com";

export const MURMUR = {
  name: "Murmur",
  storeName: "Murmur: On-Device AI Music",
  appId: "6776807467",
  // Geo-neutral App Store link: Apple redirects each visitor to their own storefront. Never hardcode a country.
  appStoreUrl: "https://apps.apple.com/app/id6776807467",
  /** Opens the "Write a Review" sheet in the App Store app. */
  writeReviewUrl: "https://apps.apple.com/app/id6776807467?action=write-review",
  path: "/murmur/",
  privacyPath: "/privacy/",
};

/**
 * Lala release switch. RELEASE DAY: set `IS_RELEASED` to true once 1.0 is live on the App Store —
 * every "Coming soon" badge and TestFlight button turns into an App Store button.
 */
export const SERENADA = {
  name: "Lala",
  storeName: "Lala: Custom Song Maker",
  appId: "6834330111",
  IS_RELEASED: true,
  appStoreUrl: "https://apps.apple.com/app/id6834330111",
  path: "/lala/",
  privacyPath: "/lala/privacy/",
  price: "€14.99",
  /** Waitlist without a form or a server: a pre-filled email. Nothing is collected by the website. */
  waitlistMailto:
    "mailto:murmurapps@gmail.com?subject=Lala%20TestFlight&body=Hi%2C%20I%27d%20like%20to%20try%20Lala%20on%20TestFlight.%20My%20iPhone%20model%3A%20",
};
