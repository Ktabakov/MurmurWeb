/**
 * The hero's soundtracks: four real Murmur presets / Story Worlds, rendered by Orpheus for the lake clip
 * from the app's own prompts. The first entry is what "Compose score" plays first (and is the "Best match").
 */
export type HeroTrackId =
  | "italian-golden-hour"
  | "japanese-koto"
  | "tiny-planet-campfire"
  | "campfire-on-the-range";

/**
 * Which render plays for each track (paths in /public, no extension: the player loads ".m4a" and falls
 * back to ".webm"). Both seeds are in public/media/hero/ — to try the other take of a track, change "-s1"
 * to "-s2" here. Nothing else needs editing.
 */
export const HERO_SOUNDTRACK_FILES: Record<HeroTrackId, string> = {
  "italian-golden-hour": "/media/hero/lake-italian-golden-hour-s1",
  "japanese-koto": "/media/hero/lake-japanese-koto-s1",
  "tiny-planet-campfire": "/media/hero/lake-tiny-planet-campfire-s1",
  "campfire-on-the-range": "/media/hero/lake-campfire-on-the-range-s1",
};

export type HeroIcon = "air" | "note" | "planet" | "fire";

export type HeroTrack = {
  id: HeroTrackId;
  name: string;
  kind: "Preset" | "Story World";
  detail: string;
  /** App colours: presets use the Score mood palette, Story Worlds their own accent (StoryWorlds.tsx). */
  accent: string;
  icon: HeroIcon;
};

export const HERO_TRACKS: HeroTrack[] = [
  {
    id: "italian-golden-hour",
    name: "Italian Golden Hour",
    kind: "Preset",
    detail: "Wistful clarinet · nylon guitar · nostalgic",
    accent: "#ffc15e",
    icon: "air",
  },
  {
    id: "japanese-koto",
    name: "Japanese Koto",
    kind: "Preset",
    detail: "Koto · shakuhachi · calm",
    accent: "#4dd6e0",
    icon: "note",
  },
  {
    id: "tiny-planet-campfire",
    name: "Tiny Planet Campfire",
    kind: "Story World",
    detail: "Space folk · banjo · under the stars",
    accent: "#7dd3a8",
    icon: "planet",
  },
  {
    id: "campfire-on-the-range",
    name: "Campfire on the Range",
    kind: "Story World",
    detail: "Western folk · pedal steel · quiet night",
    accent: "#f0a35e",
    icon: "fire",
  },
];

/** How long "Composing…" shows at least, in ms (longer only while the audio is really still loading). */
export const COMPOSE_MS = 1600;

export const HERO_DEFAULT_TRACK: HeroTrackId = HERO_TRACKS[0].id;

export const HERO_VIDEO = {
  mp4: "/media/hero/lake.mp4",
  webm: "/media/hero/lake.webm",
  poster: "/media/hero/lake-poster.jpg",
  /**
   * Mirror the clip on wide screens. Off: as shot, the boat rows left to right from behind the headline
   * and stops at ~60% of the width, so it never passes under the Score panel docked bottom-right.
   */
  mirrorOnDesktop: false,
};
