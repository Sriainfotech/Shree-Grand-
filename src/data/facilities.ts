import type { ImageKey } from "./images";

/**
 * Facilities exactly as supplied by the business. Do not add facilities that
 * were not listed. Descriptions are neutral and make no unsupported claims
 * (no sizes, counts or capacities).
 */
export type Facility = {
  slug: string;
  name: string;
  icon: string; // lucide icon name
  summary: string;
  description: string;
  image?: ImageKey;
  group: "stay" | "outdoor" | "celebration" | "dining" | "recreation" | "convenience";
  /** Hotspot id used by the 3D explore scene once a real model is supplied. */
  hotspot?: string;
};

export const facilities: Facility[] = [
  {
    slug: "swimming-pool",
    name: "Swimming Pool",
    icon: "Waves",
    summary: "A pool at the heart of the property.",
    description:
      "A swimming pool for relaxed afternoons and unhurried evenings. Pool dimensions and depth will be published once confirmed by the property.",
    image: "pool",
    group: "recreation",
    hotspot: "pool",
  },
  {
    slug: "ac-rooms",
    name: "AC Rooms",
    icon: "Snowflake",
    summary: "Air-conditioned comfort.",
    description:
      "Air-conditioned rooms for comfortable stays through the year. Room types and counts will be listed once confirmed.",
    image: "room",
    group: "stay",
    hotspot: "rooms",
  },
  {
    slug: "bedrooms",
    name: "Bedrooms",
    icon: "BedDouble",
    summary: "Private bedrooms for your group.",
    description:
      "Bedrooms for families and groups staying over. Exact configuration is available on request.",
    image: "room",
    group: "stay",
    hotspot: "rooms",
  },
  {
    slug: "lawn-area",
    name: "Lawn Area",
    icon: "Trees",
    summary: "Open green for gatherings.",
    description:
      "An open lawn used for outdoor gatherings, ceremonies and evening celebrations.",
    image: "lawn",
    group: "outdoor",
    hotspot: "lawn",
  },
  {
    slug: "party-hall",
    name: "Party Hall",
    icon: "PartyPopper",
    summary: "An indoor celebration space.",
    description:
      "An indoor hall for celebrations, functions and gatherings. Seating capacity will be confirmed by the property.",
    image: "hall",
    group: "celebration",
    hotspot: "hall",
  },
  {
    slug: "dining-area",
    name: "Dining Area",
    icon: "UtensilsCrossed",
    summary: "Shared meals together.",
    description:
      "A dining area for meals with family, friends or colleagues. Catering arrangements are discussed at the time of booking.",
    image: "dining",
    group: "dining",
    hotspot: "dining",
  },
  {
    slug: "barbecue-area",
    name: "Barbecue Area",
    icon: "Flame",
    summary: "Evening grills outdoors.",
    description: "A dedicated barbecue area for outdoor evenings.",
    image: "dining",
    group: "dining",
    hotspot: "bbq",
  },
  {
    slug: "parking",
    name: "Parking",
    icon: "CarFront",
    summary: "On-site parking.",
    description:
      "On-site parking for guests. Vehicle capacity will be confirmed by the property.",
    group: "convenience",
    hotspot: "parking",
  },
  {
    slug: "childrens-play-area",
    name: "Children's Play Area",
    icon: "ToyBrick",
    summary: "Space for the little ones.",
    description: "A play area so children have their own space on the property.",
    image: "garden",
    group: "recreation",
    hotspot: "play",
  },
  {
    slug: "campfire",
    name: "Campfire",
    icon: "Flame",
    summary: "Nights around the fire.",
    description: "A campfire setting for late conversations under an open sky.",
    image: "campfire",
    group: "outdoor",
    hotspot: "campfire",
  },
  {
    slug: "garden",
    name: "Garden",
    icon: "Leaf",
    summary: "Green all around.",
    description: "Landscaped garden areas across the property.",
    image: "garden",
    group: "outdoor",
    hotspot: "garden",
  },
  {
    slug: "wi-fi",
    name: "Wi-Fi",
    icon: "Wifi",
    summary: "Stay connected.",
    description: "Wi-Fi is available on the property.",
    group: "convenience",
  },
  {
    slug: "generator-backup",
    name: "Generator Backup",
    icon: "Zap",
    summary: "Uninterrupted evenings.",
    description: "Generator backup so celebrations are not interrupted.",
    group: "convenience",
  },
  {
    slug: "security",
    name: "Security",
    icon: "ShieldCheck",
    summary: "A private, secure setting.",
    description: "Security arrangements are in place on the property.",
    group: "convenience",
  },
];

export const facilityBySlug = (slug: string) =>
  facilities.find((f) => f.slug === slug);

export const featuredFacilitySlugs = [
  "swimming-pool",
  "lawn-area",
  "party-hall",
  "bedrooms",
  "dining-area",
  "campfire",
];
