/**
 * Central image registry.
 *
 * These are curated stock / reference photographs, NOT confirmed photography
 * of the actual Shri Grand Farm Stay property. Per the business brief, no
 * construction photos, drone footage or 3D renders have been supplied yet.
 * Treat every entry here as representative imagery only — see
 * `PLACEHOLDER_IMAGE_NOTE` below, shown wherever these are used.
 *
 * Files live in `public/images/` and are referenced as plain string paths
 * (no bundler import needed for anything under `public/`).
 */

export const images = {
  // Pool photos are colour-graded (public/images/graded/) to a warmer, more
  // muted tone — the originals' saturated turquoise clashed with the warm
  // earthy grading used across the rest of the site's photography.
  hero: "/images/graded/pool-18.jpg",
  aerial: "/images/graded/pool-14.jpg",
  pool: "/images/graded/pool-01.jpg",
  lawn: "/images/garden-01.jpg",
  hall: "/images/party-hall-01.jpg",
  room: "/images/bedroom-05.jpg",
  dining: "/images/dining-05.jpg",
  campfire: "/images/campfire-01.jpg",
  garden: "/images/garden-03.jpg",
  wedding: "/images/wedding-03.jpg",
  birthday: "/images/dining-11-birthday.jpg",
  corporate: "/images/dining-01.jpg",
  parking: "/images/parking-01.jpg",
  kidsPlay: "/images/kids-play-01.jpg",
  bbq: "/images/bbq-01.jpg",
} as const;

export type ImageKey = keyof typeof images;

/** Shown wherever placeholder imagery is used, so nothing is misrepresented. */
export const PLACEHOLDER_IMAGE_NOTE =
  "Representative imagery. Actual property photography will be published soon.";
