import type { ImageKey } from "./images";

export type GalleryCategory =
  | "property"
  | "rooms"
  | "pool"
  | "events"
  | "outdoor"
  | "celebrations"
  | "drone"
  | "videos";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  type: "image" | "video";
  image: ImageKey;
  /** True for generic placeholder visuals that are not property photography. */
  placeholder: boolean;
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
): GalleryItem => ({ id, title, category, type: "image", image, placeholder: true });

/**
 * Placeholder gallery. Every entry is flagged `placeholder: true` and the UI
 * states clearly that these are representative visuals, not property photos.
 * Drone footage, site videos and 3D renders will replace these once supplied.
 */
export const galleryItems: GalleryItem[] = [
  item("g1", "The property at dusk", "property", "hero"),
  item("g2", "Aerial view of the grounds", "drone", "aerial"),
  item("g3", "Swimming pool", "pool", "pool"),
  item("g4", "Open lawn", "outdoor", "lawn"),
  item("g5", "Party hall", "events", "hall"),
  item("g6", "Bedroom", "rooms", "room"),
  item("g7", "Dining under the pergola", "property", "dining"),
  item("g8", "Campfire evening", "outdoor", "campfire"),
  item("g9", "Garden path", "outdoor", "garden"),
  item("g10", "Wedding setup on the lawn", "celebrations", "wedding"),
  item("g11", "Birthday celebration", "celebrations", "birthday"),
  item("g12", "Corporate offsite", "events", "corporate"),
];

export const videosComingSoon =
  "Drone footage and site videos will be added once the property shoot is complete.";
