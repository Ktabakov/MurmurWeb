/**
 * Real App Store reviews of Murmur, copied from App Store Connect (customerReviews API) on 2026-11-13.
 * NEVER invent or edit a review. Keep the original text in `original` when we translate it, and mark the
 * translation as ours. Name-like nicknames are shortened to first name + initial; handles stay as written.
 *
 * Left out on purpose: one 1-star review (2026-10-26, US) that took the one-time Pro unlock for a subscription.
 * To refresh: list the reviews from App Store Connect, add new ones here with their date and country.
 */
export type Review = {
  app: "Murmur" | "Lala";
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  author: string;
  country: string;
  /** Month the review was written, e.g. "Oct 2026". */
  date: string;
  /** Original text when `title`/`body` are our translation. */
  original?: { language: string; lang: string; title: string; body: string };
  /** A short note from us under the review (e.g. what changed since). */
  note?: string;
};

export const reviews: Review[] = [
  {
    app: "Murmur",
    rating: 5,
    title: "Wow",
    body: "Best app ever. Paid for pro and worth every penny. Incredible app. Thank you 🙏\n\nUpdate: Works even better with the iPad Pro 13” M5 with 16GB of unified memory. Developer has my lifetime support!",
    author: "Johnathon H.",
    country: "United States",
    date: "Oct 2026",
  },
  {
    app: "Murmur",
    rating: 5,
    title: "Top",
    body: "A lovely discovery! I use it to create little pieces of music for my audio fiction. I love being able to try different moods right on my iPhone, with just a few words to describe what I'm looking for. Sometimes it takes a few tries to get the right result, but that's part of the fun too. An app that makes you want to experiment!",
    author: "LaCantatricerebelle",
    country: "France",
    date: "Oct 2026",
    original: {
      language: "French",
      lang: "fr",
      title: "Top",
      body: "Une belle découverte ! Je m’en sers pour créer de petites musiques pour mes fictions audio. J’aime pouvoir tester différentes ambiances directement sur mon iPhone, avec juste quelques mots pour décrire ce que je cherche. Il faut parfois plusieurs essais pour trouver le bon résultat, mais ça fait aussi partie du plaisir. Une appli qui donne envie d’expérimenter !",
    },
  },
  {
    app: "Murmur",
    rating: 5,
    title: "It looked good, so I bought it",
    body: "Perfect for making songs through lots of trial and error.\nI'd like it to be in Japanese.\nIt's a one-time purchase, so people who make a lot of songs can relax.",
    author: "仕事やめたいなぁ",
    country: "Japan",
    date: "Aug 2026",
    original: {
      language: "Japanese",
      lang: "ja",
      title: "良さそうだから買っちゃいました",
      body: "何度も試行錯誤して曲を作るのに最適。\n日本語化して欲しい。\n買い切りだから作る曲が多い人も安心",
    },
    note: "Murmur has been available in Japanese since version 2.1.",
  },
  {
    app: "Murmur",
    rating: 5,
    title: "Great idea!",
    body: "I love the idea of this app! It’s also looking great!",
    author: "SilenceMuseum",
    country: "Bulgaria",
    date: "Aug 2026",
  },
  {
    app: "Murmur",
    rating: 5,
    title: "Great Idea, perfect for me",
    body: "I love the app, it works great and allows me to generate different types of beats and get ideas for songs",
    author: "Ivaylo P.",
    country: "Bulgaria",
    date: "Jun 2026",
  },
  {
    app: "Murmur",
    rating: 5,
    title: "Amazing new app",
    body: "Great app for music ideas! Super easy to use, it generates inspiring music samples in seconds, a great tool for new tracks. Highly recommend! ⭐⭐⭐⭐",
    author: "Slaveycho",
    country: "Bulgaria",
    date: "Jun 2026",
  },
];
