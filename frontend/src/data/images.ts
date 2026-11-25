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
  // Real property photos (supplied 2026-11-19 and 2026-11-25). Everything
  // else below is still the curated stock/reference set — see
  // PLACEHOLDER_IMAGE_NOTE.
  hero: "/images/real-hero-gate.jpg",
  pool: "/images/real-pool.jpg",
  hall: "/images/real-hall-pergola.jpg",
  dining: "/images/real-dining.jpg",
  campfire: "/images/real-campfire.jpg",
  kidsPlay: "/images/real-kids-play.jpg",
  room: "/images/real-bedroom-01.jpg",
  // Pool photos are colour-graded (public/images/graded/) to a warmer, more
  // muted tone — the originals' saturated turquoise clashed with the warm
  // earthy grading used across the rest of the site's photography.
  aerial: "/images/graded/pool-14.jpg",
  lawn: "/images/garden-01.jpg",
  garden: "/images/garden-03.jpg",
  wedding: "/images/wedding-03.jpg",
  birthday: "/images/dining-11-birthday.jpg",
  corporate: "/images/dining-01.jpg",
  parking: "/images/parking-01.jpg",
  bbq: "/images/bbq-01.jpg",
} as const;

export type ImageKey = keyof typeof images;

/** Shown wherever placeholder imagery is used, so nothing is misrepresented. */
export const PLACEHOLDER_IMAGE_NOTE =
  "Representative imagery. Actual property photography will be published soon.";
