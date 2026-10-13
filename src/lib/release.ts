/**
 * Murmur 2.2 release switch (Score mode, Moments, Story Worlds search, regional styles).
 *
 * RELEASE DAY: set this to `true`, once 2.2 is live on the App Store. Every "coming soon" badge,
 * every "coming in 2.2" sentence and the 2.2 lines in the structured data read it, so nothing else
 * on the site needs editing.
 */
export const IS_RELEASED_2_2 = false;

/** Badge on the 2.2 sections and cards. */
export const BADGE_2_2 = IS_RELEASED_2_2 ? "New in 2.2" : "New in 2.2 · coming soon";

/** Short badge for the smaller cards inside a 2.2 section. */
export const BADGE_2_2_SHORT = IS_RELEASED_2_2 ? "New" : "Coming soon";

/** Mid-sentence wording, e.g. "Yes, with Score mode, coming in Murmur 2.2." */
export const INLINE_2_2 = IS_RELEASED_2_2 ? "new in Murmur 2.2" : "coming in Murmur 2.2";

/** Returns `items` only once 2.2 is out: for lists that must not claim 2.2 features before release. */
export function after2_2<T>(items: T[]): T[] {
  return IS_RELEASED_2_2 ? items : [];
}
