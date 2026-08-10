import { PRICE_ON_REQUEST } from "@/config/site";

/**
 * Package catalogue. Categories come from the business brief.
 * NO PRICES ARE SUPPLIED — `price` stays null and the UI renders
 * "Price on request". Never populate a price here from guesswork.
 */
export type PackageCategory =
  | "stay"
  | "day-out"
  | "event"
  | "wedding"
  | "corporate"
  | "seasonal";

export type Package = {
  id: string;
  name: string;
  category: PackageCategory;
  description: string;
  price: number | null;
  priceLabel: string;
  duration: string | null;
  guests: string | null;
  inclusions: string[];
  exclusions: string[];
  terms: string | null;
  available: boolean;
};

export const packageCategories: { id: PackageCategory; label: string }[] = [
  { id: "stay", label: "Stay Packages" },
  { id: "day-out", label: "Day Out Packages" },
  { id: "event", label: "Event Packages" },
  { id: "wedding", label: "Wedding Packages" },
  { id: "corporate", label: "Corporate Packages" },
  { id: "seasonal", label: "Seasonal Packages" },
];

const draft = (
  id: string,
  name: string,
  category: PackageCategory,
  description: string,
): Package => ({
  id,
  name,
  category,
  description,
  price: null,
  priceLabel: PRICE_ON_REQUEST,
  duration: null,
  guests: null,
  inclusions: [],
  exclusions: [],
  terms: null,
  available: true,
});

export const packages: Package[] = [
  draft(
    "stay-overnight",
    "Overnight Stay",
    "stay",
    "An overnight stay at the property with access to the pool, lawn and dining area. Inclusions are confirmed at the time of booking.",
  ),
  draft(
    "stay-weekend",
    "Weekend Stay",
    "stay",
    "A weekend format for families, couples and small groups.",
  ),
  draft(
    "dayout-family",
    "Family Day Out",
    "day-out",
    "A day-use booking for families, without an overnight stay.",
  ),
  draft(
    "dayout-group",
    "Group Day Out",
    "day-out",
    "A day-use booking for larger friend groups and student groups.",
  ),
  draft(
    "event-birthday",
    "Birthday Celebration",
    "event",
    "Lawn or party hall for birthday celebrations, with dining and parking.",
  ),
  draft(
    "event-private",
    "Private Celebration",
    "event",
    "Anniversaries, reunions and private functions on the property.",
  ),
  draft(
    "wedding-full",
    "Destination Wedding",
    "wedding",
    "Full-property wedding booking across lawn, hall, dining and accommodation.",
  ),
  draft(
    "wedding-prewedding",
    "Pre-Wedding Shoot",
    "wedding",
    "Shoot access across the garden, lawn, pool and campfire areas.",
  ),
  draft(
    "corporate-offsite",
    "Corporate Offsite",
    "corporate",
    "A corporate day at the property with hall, lawn and dining.",
  ),
  draft(
    "corporate-teamouting",
    "Team Outing",
    "corporate",
    "An activity-led day outing for teams.",
  ),
  draft(
    "seasonal-festive",
    "Festive Season",
    "seasonal",
    "Seasonal availability and formats. Details will be published closer to each season.",
  ),
];

export const packagesByCategory = (category: PackageCategory) =>
  packages.filter((p) => p.category === category);

export const packageById = (id: string) => packages.find((p) => p.id === id);
