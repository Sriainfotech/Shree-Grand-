import type { ImageKey } from "./images";
import { PRICE_ON_REQUEST } from "@/config/site";

/**
 * Room catalogue.
 *
 * The business has NOT supplied room count, room names or room types.
 * `rooms` is intentionally EMPTY — the UI renders an honest "coming soon"
 * state instead of invented rooms. When the property confirms its rooms
 * (or once the admin CMS is live), entries are added here / in the DB.
 */
export type Room = {
  id: string;
  name: string;
  description: string;
  images: ImageKey[];
  amenities: string[];
  occupancy: string | null;
  price: number | null;
  priceLabel: string;
  available: boolean;
};

export const rooms: Room[] = [];

export const roomsPlaceholder = {
  title: "Room details coming soon",
  body: "Room types, occupancy and tariffs are being finalised by the property. Share your dates and group size and we will confirm the right rooms for you.",
  priceLabel: PRICE_ON_REQUEST,
};

/** Confirmed stay facts (from the business brief). */
export const stayFacts = [
  { label: "Check-in", value: "12:00 PM" },
  { label: "Check-out", value: "10:00 AM" },
  { label: "Rooms", value: "Air-conditioned" },
  { label: "Guest capacity", value: "Based on party" },
];
