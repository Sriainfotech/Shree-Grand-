import { apiGet } from "@/config/api";

/** The whole farm stay is one bookable unit — this is the single property
 * record shown before the booking form and used to price bookings. */
export type Property = {
  id: string;
  name: string;
  description: string;
  images: string[];
  amenities: string[];
  guestCapacity: number | null;
  pricePerDay: number | null;
  priceLabel: string;
};

/** Public — GET /api/property, no auth needed. */
export function getProperty() {
  return apiGet<Property>("/api/property");
}
