import type { HeroStyleId } from "@/components/score-hero-audio";

/**
 * Which Orpheus render plays for each style in the hero (paths in /public, no extension: the player
 * loads ".m4a" and falls back to ".webm"). Both seeds are in public/media/hero/ — to try the other
 * take of a style, change "-s1" to "-s2" here. Nothing else needs editing.
 */
export const HERO_SOUNDTRACK_FILES: Record<HeroStyleId, string> = {
  epic: "/media/hero/lake-epic-s1",
  chill: "/media/hero/lake-chill-s1",
  uplifting: "/media/hero/lake-uplifting-s1",
  ethereal: "/media/hero/lake-ethereal-s1",
};

/** The style the first tap plays; shown as "Best match" (its prompt describes this very scene). */
export const HERO_DEFAULT_STYLE: HeroStyleId = "chill";

export const HERO_STYLES: { id: HeroStyleId; label: string; dot: string; detail: string }[] = [
  { id: "epic", label: "Epic", dot: "#ff9f43", detail: "Soaring strings · taiko drums" },
  { id: "chill", label: "Chill", dot: "#38bdf8", detail: "Nylon guitar · soft Rhodes" },
  { id: "uplifting", label: "Uplifting", dot: "#facc15", detail: "Acoustic strums · handclaps" },
  { id: "ethereal", label: "Ethereal", dot: "#c59aff", detail: "Shimmering pads · piano" },
];

export const HERO_VIDEO = {
  mp4: "/media/hero/lake.mp4",
  webm: "/media/hero/lake.webm",
  poster: "/media/hero/lake-poster.jpg",
  /**
   * Mirror the clip on wide screens, where the headline sits over the left of the frame: the boat
   * then crosses the open right side instead of hiding behind the text. Set false to show it as shot.
   */
  mirrorOnDesktop: true,
};
