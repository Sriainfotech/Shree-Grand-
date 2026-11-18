import type { ImageKey } from "./images";

export type BlogCategory =
  | "weekend-getaways"
  | "family-experiences"
  | "events"
  | "birthdays"
  | "weddings"
  | "pre-wedding"
  | "corporate-outings"
  | "travel-mancherial";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  image: ImageKey;
  author: string;
  publishedAt: string | null;
  /** Draft posts are outlines only — they are never presented as published articles. */
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  outline: string[];
};

export const blogCategories: { id: BlogCategory; label: string }[] = [
  { id: "weekend-getaways", label: "Weekend Getaways" },
  { id: "family-experiences", label: "Family Experiences" },
  { id: "events", label: "Events" },
  { id: "birthdays", label: "Birthdays" },
  { id: "weddings", label: "Weddings" },
  { id: "pre-wedding", label: "Pre-Wedding" },
  { id: "corporate-outings", label: "Corporate Outings" },
  { id: "travel-mancherial", label: "Travel Around Mancherial" },
];

/**
 * Editorial pipeline. All entries are DRAFTS: the site shows the planned topic
 * and outline, never fabricated article content or business claims.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "planning-a-weekend-getaway-near-mancherial",
    title: "Planning a weekend getaway near Mancherial",
    excerpt:
      "What to think about when you plan a two-day escape from the city — timing, group size and what to pack.",
    category: "weekend-getaways",
    image: "campfire",
    author: "Shri Grand Farm Stay",
    publishedAt: null,
    status: "draft",
    seoTitle: "Planning a Weekend Getaway Near Mancherial | Shri Grand Farm Stay",
    seoDescription:
      "A practical guide to planning a weekend getaway near Mancherial, Telangana — timing, group size and what to expect from a private farm stay.",
    outline: [
      "Choosing your dates and travel window",
      "Planning for the size of your group",
      "What a farm stay weekend usually looks like",
      "What to carry",
    ],
  },
  {
    slug: "choosing-a-birthday-party-venue-in-mancherial",
    title: "Choosing a birthday party venue in Mancherial",
    excerpt:
      "Indoor hall or open lawn? A short guide to picking the right celebration space for your guest list.",
    category: "birthdays",
    image: "birthday",
    author: "Shri Grand Farm Stay",
    publishedAt: null,
    status: "draft",
    seoTitle: "Choosing a Birthday Party Venue in Mancherial | Shri Grand Farm Stay",
    seoDescription:
      "How to choose between an indoor party hall and an open lawn for a birthday celebration in Mancherial, Telangana.",
    outline: [
      "Indoor vs outdoor for your season and time of day",
      "Planning around children and older guests",
      "Dining, parking and power",
      "Questions to ask any venue",
    ],
  },
  {
    slug: "a-destination-wedding-close-to-home",
    title: "A destination wedding close to home",
    excerpt:
      "Why more families in Telangana are choosing private properties over banquet halls.",
    category: "weddings",
    image: "wedding",
    author: "Shri Grand Farm Stay",
    publishedAt: null,
    status: "draft",
    seoTitle: "Destination Wedding Venues Near Mancherial | Shri Grand Farm Stay",
    seoDescription:
      "What to consider when planning a destination wedding at a private farm property near Mancherial, Telangana.",
    outline: [
      "Why a single private property simplifies a multi-function wedding",
      "Planning accommodation for the immediate family",
      "Working with your planner and vendors",
      "Timelines and site visits",
    ],
  },
  {
    slug: "pre-wedding-shoot-locations-around-mancherial",
    title: "Pre-wedding shoot locations around Mancherial",
    excerpt: "Finding varied backdrops within a single location.",
    category: "pre-wedding",
    image: "garden",
    author: "Shri Grand Farm Stay",
    publishedAt: null,
    status: "draft",
    seoTitle: "Pre-Wedding Shoot Locations Around Mancherial | Shri Grand Farm Stay",
    seoDescription:
      "How to plan a pre-wedding shoot near Mancherial, Telangana, and get varied backdrops within one private property.",
    outline: [
      "Golden hour planning",
      "Getting variety without moving locations",
      "Coordinating with your photographer",
      "Permissions and slot booking",
    ],
  },
  {
    slug: "planning-a-corporate-outing-in-telangana",
    title: "Planning a corporate outing in Telangana",
    excerpt: "A checklist for HR teams organising an offsite day.",
    category: "corporate-outings",
    image: "corporate",
    author: "Shri Grand Farm Stay",
    publishedAt: null,
    status: "draft",
    seoTitle: "Planning a Corporate Outing in Telangana | Shri Grand Farm Stay",
    seoDescription:
      "A practical checklist for HR and admin teams planning a corporate outing or team offsite near Mancherial, Telangana.",
    outline: [
      "Setting the objective for the day",
      "Transport, timings and headcount",
      "Indoor backup and power",
      "Food planning",
    ],
  },
  {
    slug: "things-to-do-around-mancherial",
    title: "Things to do around Mancherial",
    excerpt: "A short travel note on the area around the property.",
    category: "travel-mancherial",
    image: "aerial",
    author: "Shri Grand Farm Stay",
    publishedAt: null,
    status: "draft",
    seoTitle: "Things To Do Around Mancherial, Telangana | Shri Grand Farm Stay",
    seoDescription:
      "A short travel guide to the area around Mancherial and Vempally in Telangana for visitors staying nearby.",
    outline: [
      "Getting to Vempally, Mancherial",
      "Nearby points of interest",
      "Best months to visit",
      "Travelling with family",
    ],
  },
];

export const postBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
