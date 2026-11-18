import type { ImageKey } from "./images";

/**
 * Experiences map 1:1 to the services supplied by the business.
 * Copy is positioning language, never an invented factual claim
 * (no capacities, prices, inclusions or timings beyond what is confirmed).
 */
export type Experience = {
  slug: string;
  name: string;
  navLabel: string;
  heroTitle: string;
  tagline: string;
  intro: string;
  audience: string[];
  spaces: string[]; // facility slugs
  image: ImageKey;
  cta: string;
  featured?: boolean;
  /**
   * Indicative running order for this occasion — structural/illustrative,
   * not a confirmed schedule. Always shown on-page next to a note that
   * actual timings are confirmed against the booked date.
   */
  timeline?: string[];
};

export const experiences: Experience[] = [
  {
    slug: "family",
    name: "Family Stay",
    navLabel: "Family Stay",
    heroTitle: "ROOM FOR EVERYONE YOU LOVE",
    tagline: "Unhurried days with the whole family.",
    intro:
      "A private setting where families can spread out — lawns for the children, quiet corners for the elders, and a pool and dining area to bring everyone back together.",
    audience: ["Families", "Multi-generation groups", "Extended family gatherings"],
    spaces: [
      "bedrooms",
      "ac-rooms",
      "swimming-pool",
      "childrens-play-area",
      "dining-area",
      "garden",
    ],
    image: "room",
    cta: "Plan your family stay",
    featured: true,
    timeline: [
      "Arrival & check-in",
      "Settle in — pool and lawn time",
      "Shared meals",
      "Evening at leisure",
      "Check-out",
    ],
  },
  {
    slug: "weekend-getaway",
    name: "Weekend Getaway",
    navLabel: "Weekend Getaway",
    heroTitle: "TWO DAYS AWAY FROM EVERYTHING",
    tagline: "A short escape, close to home.",
    intro:
      "Arrive on a Saturday, slow down, swim, sit by the campfire and drive back rested. A weekend format for couples, friends and small groups.",
    audience: ["Couples", "Friends", "Small groups", "Tourists"],
    spaces: ["swimming-pool", "campfire", "lawn-area", "barbecue-area", "bedrooms"],
    image: "campfire",
    cta: "Plan your weekend",
    featured: true,
    timeline: [
      "Arrival on day one",
      "Pool, lawn and campfire through the stay",
      "Overnight stay",
      "Breakfast and wind-down",
      "Departure",
    ],
  },
  {
    slug: "birthday",
    name: "Birthday Parties",
    navLabel: "Birthday",
    heroTitle: "MAKE THIS MOMENT UNFORGETTABLE",
    tagline: "Birthdays with space to breathe.",
    intro:
      "Celebrate outdoors on the lawn or indoors in the party hall, with dining, parking and a play area for younger guests — all on one private property.",
    audience: ["Families", "Friends", "Event organisers"],
    spaces: ["party-hall", "lawn-area", "dining-area", "childrens-play-area", "parking"],
    image: "birthday",
    cta: "Plan your birthday",
    featured: true,
    timeline: [
      "Guest arrival",
      "Cake & celebrations",
      "Meal service",
      "Games and photos",
      "Wrap-up and departure",
    ],
  },
  {
    slug: "corporate",
    name: "Corporate Events",
    navLabel: "Corporate",
    heroTitle: "WORK TOGETHER. GET AWAY TOGETHER.",
    tagline: "Offsites that people actually remember.",
    intro:
      "An off-city setting for corporate days, planning sessions and celebrations, with an indoor hall, open lawn, dining, parking and generator backup.",
    audience: ["Corporate clients", "Teams", "Event organisers"],
    spaces: ["party-hall", "lawn-area", "dining-area", "parking", "generator-backup", "wi-fi"],
    image: "corporate",
    cta: "Plan your offsite",
    featured: true,
    timeline: [
      "Arrival & registration",
      "Morning session",
      "Lunch",
      "Afternoon activity or session",
      "Wrap-up and departure",
    ],
  },
  {
    slug: "team-outing",
    name: "Team Outings",
    navLabel: "Team Outing",
    heroTitle: "A DAY THAT BRINGS THE TEAM CLOSER",
    tagline: "Games, food and open air.",
    intro:
      "A relaxed day-format outing for teams — open lawn for activities, pool time, barbecue in the evening and a hall to fall back on.",
    audience: ["Corporate clients", "Teams", "Students"],
    spaces: ["lawn-area", "swimming-pool", "barbecue-area", "dining-area", "parking"],
    image: "lawn",
    cta: "Plan your team outing",
    timeline: [
      "Arrival",
      "Team activities on the lawn",
      "Lunch",
      "Pool time",
      "Evening barbecue and departure",
    ],
  },
  {
    slug: "wedding",
    name: "Destination Weddings",
    navLabel: "Wedding",
    heroTitle: "YOUR FOREVER BEGINS HERE",
    tagline: "A private setting for the day that matters most.",
    intro:
      "Ceremonies on the lawn, functions in the hall, dining for your guests and rooms for the family staying over — a single private property for the whole celebration.",
    audience: ["Couples", "Families", "Wedding planners", "Event organisers"],
    spaces: [
      "lawn-area",
      "party-hall",
      "dining-area",
      "bedrooms",
      "ac-rooms",
      "parking",
      "generator-backup",
    ],
    image: "wedding",
    cta: "Plan your wedding",
    featured: true,
    timeline: [
      "Guest arrival",
      "Ceremony on the lawn",
      "Function in the hall",
      "Dinner",
      "Departure / overnight stay for family",
    ],
  },
  {
    slug: "pre-wedding",
    name: "Pre-Wedding Shoots",
    navLabel: "Pre-Wedding",
    heroTitle: "YOUR STORY. YOUR SETTING.",
    tagline: "Green, gold and golden hour.",
    intro:
      "Lawns, garden, pool, campfire and architecture give a shoot several distinct backdrops within one location. Shoot slots and access are arranged with the property.",
    audience: ["Couples", "Photographers", "Wedding planners"],
    spaces: ["garden", "lawn-area", "swimming-pool", "campfire"],
    image: "garden",
    cta: "Plan your shoot",
    timeline: [
      "Arrival & golden-hour planning",
      "First backdrop (garden / lawn)",
      "Second backdrop (pool / campfire)",
      "Wrap-up",
    ],
  },
  {
    slug: "day-out",
    name: "Day Out Packages",
    navLabel: "Day Out",
    heroTitle: "ONE DAY. FULLY YOURS.",
    tagline: "Arrive in the morning, leave with a story.",
    intro:
      "A day-use format for families and friends who want the pool, lawn and dining without an overnight stay. Day-out timings and inclusions are confirmed at the time of booking.",
    audience: ["Families", "Friends", "Students", "Tourists"],
    spaces: ["swimming-pool", "lawn-area", "dining-area", "childrens-play-area"],
    image: "pool",
    cta: "Plan your day out",
    featured: true,
    timeline: ["Arrival", "Pool and lawn time", "Lunch", "Departure, same day"],
  },
  {
    slug: "bachelor-party",
    name: "Bachelor / Bachelorette Parties",
    navLabel: "Bachelor / Bachelorette",
    heroTitle: "THE LAST ONE BEFORE THE BIG ONE",
    tagline: "Private, loud, and entirely yours.",
    intro:
      "A private property for the send-off — pool through the day, barbecue and campfire at night, hall and rooms for everyone staying back.",
    audience: ["Friends", "Couples", "Event organisers"],
    spaces: ["swimming-pool", "barbecue-area", "campfire", "party-hall", "bedrooms"],
    image: "pool",
    cta: "Plan your party",
    timeline: [
      "Arrival",
      "Pool through the day",
      "Barbecue and campfire at night",
      "Overnight stay",
      "Departure",
    ],
  },
  {
    slug: "private-celebration",
    name: "Private Celebrations",
    navLabel: "Private Celebrations",
    heroTitle: "SOME MOMENTS DESERVE PRIVACY",
    tagline: "Anniversaries, reunions, housewarmings and more.",
    intro:
      "For the occasions that don't fit a category — a private property, indoor and outdoor spaces, dining, and the freedom to shape the evening your way.",
    audience: ["Families", "Couples", "Friends", "Event organisers"],
    spaces: ["party-hall", "lawn-area", "dining-area", "garden", "campfire"],
    image: "lawn",
    cta: "Plan your celebration",
    timeline: ["Arrival", "Celebration — indoor or outdoor", "Dining", "Departure"],
  },
];

export const experienceBySlug = (slug: string) => experiences.find((e) => e.slug === slug);

export const featuredExperiences = experiences.filter((e) => e.featured);

export const audiences = [
  "Families",
  "Couples",
  "Corporate Clients",
  "Event Organizers",
  "Wedding Planners",
  "Students",
  "Tourists",
];
