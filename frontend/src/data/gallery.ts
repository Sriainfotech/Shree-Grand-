import type { ImageKey } from "./images";

export type GalleryCategory =
  "property" | "rooms" | "pool" | "events" | "outdoor" | "celebrations" | "drone" | "videos";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  type: "image" | "video";
  image: ImageKey;
};

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "property", label: "Property" },
  { id: "rooms", label: "Rooms" },
  { id: "pool", label: "Pool" },
  { id: "events", label: "Events" },
  { id: "outdoor", label: "Outdoor" },
  { id: "celebrations", label: "Celebrations" },
  { id: "drone", label: "Drone" },
  { id: "videos", label: "Videos" },
];

const item = (
  id: string,
  title: string,
  category: GalleryCategory,
  image: ImageKey,
): GalleryItem => ({ id, title, category, type: "image", image });

/** Home-page gallery preview — real property photography only. */
export const galleryItems: GalleryItem[] = [
  item("g1", "The property gate", "property", "hero"),
  item("g2", "Aerial view of the grounds", "drone", "aerial"),
  item("g3", "Swimming pool", "pool", "pool"),
  item("g4", "The lawn and play area", "outdoor", "lawn"),
  item("g5", "Party hall", "events", "hall"),
  item("g6", "Bedroom", "rooms", "room"),
  item("g7", "Dining under the pergola", "property", "dining"),
  item("g8", "Campfire evening", "outdoor", "campfire"),
];

export const videosComingSoon =
  "Drone footage and site videos will be added once the property shoot is complete.";

/**
 * Richer, multi-photo browsing set used by the /gallery page. Every path
 * here is a real photograph of the Shri Grand Farm Stay property.
 */
export type PhotoCategoryId = "property" | "pool" | "bedroom" | "dining" | "campfire" | "kidsPlay" | "partyHall";

export type Photo = { src: string; caption: string };

export type PhotoCategory = {
  id: PhotoCategoryId;
  label: string;
  photos: Photo[];
};

const photo = (file: string, caption: string): Photo => ({
  src: `/images/${file}`,
  caption,
});

export const photoCategories: PhotoCategory[] = [
  {
    id: "property",
    label: "Property & Grounds",
    photos: [
      photo("real-hero-gate.jpg", "The entrance gate at Shri Grand Farm Stay, in the evening."),
      photo("real-gate-welcome.jpg", "The property's entrance signage and gate."),
      photo("real-aerial-cctv.jpg", "An overhead view of the pool, lawn and play area."),
    ],
  },
  {
    id: "pool",
    label: "Pool",
    photos: [
      photo("real-pool.jpg", "The pool and pergola at Shri Grand Farm Stay."),
      photo("real-pool-02.jpg", "A frontal view of the pool and guest rooms at Shri Grand Farm Stay."),
      photo("real-pool-exterior-bright.jpg", "The pool and guest rooms building on a bright day."),
      photo("real-pool-exterior-cloudy.jpg", "The pool and guest rooms building on an overcast day."),
      photo("real-pool-pergola.jpg", "The pool deck with its pergola and painted murals."),
    ],
  },
  {
    id: "bedroom",
    label: "Rooms",
    photos: [
      photo("real-bedroom-01.jpg", "An AC bedroom at Shri Grand Farm Stay with a tropical palm-print accent wall."),
      photo("real-bedroom-02.jpg", "An AC bedroom at Shri Grand Farm Stay with a botanical mural accent wall."),
      photo("real-bedroom-leaf-wall.jpg", "A bedroom with a tropical bird-of-paradise mural accent wall."),
      photo("real-bedroom-palm-wall.jpg", "A bedroom with a palm-forest mural accent wall."),
    ],
  },
  {
    id: "dining",
    label: "Dining",
    photos: [
      photo("real-dining.jpg", "The covered dining area at Shri Grand Farm Stay."),
      photo("real-dining-02.jpg", "Seating in the covered dining and kitchen area at Shri Grand Farm Stay."),
      photo("real-dining-outdoor-01.jpg", "Outdoor seating near the property's coffee corner."),
      photo("real-dining-outdoor-02.jpg", "Outdoor seating near the property's kitchen area."),
      photo("real-pergola-mural.jpg", "The pergola seating area and its painted murals."),
    ],
  },
  {
    id: "campfire",
    label: "Campfire",
    photos: [
      photo("real-campfire.jpg", "The campfire pit at Shri Grand Farm Stay."),
      photo("real-campfire-pit.jpg", "A closer view of the campfire pit area."),
    ],
  },
  {
    id: "kidsPlay",
    label: "Children's Play Area",
    photos: [
      photo("real-kids-play.jpg", "The children's play structure at Shri Grand Farm Stay."),
      photo("real-playground-slide.jpg", "A closer view of the children's play structure."),
    ],
  },
  {
    id: "partyHall",
    label: "Party Hall",
    photos: [photo("real-hall-pergola.jpg", "The covered party pavilion at Shri Grand Farm Stay.")],
  },
];
