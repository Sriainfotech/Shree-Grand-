/**
 * Central image registry.
 *
 * Every entry here is a real photograph of the Shri Grand Farm Stay
 * property (phone photos, a CCTV still, and the property's own gate
 * signage) — nothing in this file is stock or reference imagery.
 *
 * Files live in `public/images/` and are referenced as plain string paths
 * (no bundler import needed for anything under `public/`).
 */

export const images = {
  hero: "/images/real-hero-gate.jpg",
  gate: "/images/real-gate-welcome.jpg",
  aerial: "/images/real-aerial-cctv.jpg",

  pool: "/images/real-pool.jpg",
  poolFront: "/images/real-pool-02.jpg",
  poolBright: "/images/real-pool-exterior-bright.jpg",
  poolCloudy: "/images/real-pool-exterior-cloudy.jpg",
  poolPergola: "/images/real-pool-pergola.jpg",

  hall: "/images/real-hall-pergola.jpg",

  dining: "/images/real-dining.jpg",
  diningSeating: "/images/real-dining-02.jpg",
  diningOutdoor: "/images/real-dining-outdoor-01.jpg",
  diningOutdoor2: "/images/real-dining-outdoor-02.jpg",
  pergolaMural: "/images/real-pergola-mural.jpg",

  campfire: "/images/real-campfire.jpg",
  campfirePit: "/images/real-campfire-pit.jpg",

  kidsPlay: "/images/real-kids-play.jpg",
  playgroundSlide: "/images/real-playground-slide.jpg",

  room: "/images/real-bedroom-01.jpg",
  roomMural: "/images/real-bedroom-02.jpg",
  roomLeafWall: "/images/real-bedroom-leaf-wall.jpg",
  roomPalmWall: "/images/real-bedroom-palm-wall.jpg",

  // No dedicated photo exists yet for these specific uses — reused from the
  // closest real photo above rather than left pointing at stock imagery.
  lawn: "/images/real-aerial-cctv.jpg",
  garden: "/images/real-pool-pergola.jpg",
  wedding: "/images/real-hall-pergola.jpg",
  birthday: "/images/real-dining-outdoor-01.jpg",
  corporate: "/images/real-dining-outdoor-02.jpg",
  parking: "/images/real-gate-welcome.jpg",
  bbq: "/images/real-campfire-pit.jpg",
} as const;

export type ImageKey = keyof typeof images;
