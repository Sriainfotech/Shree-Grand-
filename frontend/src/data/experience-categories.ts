import type { ImageKey } from "./images";
import { experiences } from "./experiences";

/**
 * Experience categories group the ten individual occasion pages into four
 * richer pages (see /experiences/$slug). Copy here is assembled from the
 * member experiences' already-approved intros/audiences — nothing new is
 * asserted. FAQ answers reuse the site's existing "confirmed with the
 * property" / "based on the party" honesty pattern for anything not
 * already a confirmed fact.
 */
export type CategoryFaqItem = { id: string; question: string; answer: string };

export type ExperienceCategory = {
  slug: string;
  name: string;
  heroTitle: string;
  tagline: string;
  intro: string;
  image: ImageKey;
  /** Member experience slugs, in display order. */
  members: string[];
  faq: CategoryFaqItem[];
};

export const experienceCategories: ExperienceCategory[] = [
  {
    slug: "stays-family",
    name: "Stays & Family Time",
    heroTitle: "TIME TOGETHER, AT YOUR OWN PACE",
    tagline: "Family stays, weekend getaways and day trips on one private property.",
    intro:
      "Whether it's a family staying over, a weekend escape for friends, or a single day away from the city, the property adapts to how long you're staying — lawns for the children, quiet corners for the elders, a pool and dining area to bring everyone back together, and a campfire for the evenings you stay on.",
    image: "campfire",
    members: ["family", "weekend-getaway", "day-out"],
    faq: [
      {
        id: "capacity",
        question: "Is there a limit on group size for a family stay?",
        answer:
          "Capacity is based on the party and the spaces you need — there is no fixed published cap. Share your expected group size and we will confirm what fits comfortably for your dates.",
      },
      {
        id: "day-visit",
        question: "Can we visit for just a day, without staying overnight?",
        answer:
          "Yes — day-out timings and inclusions (pool, lawn and dining) are confirmed at the time of booking, without requiring an overnight stay.",
      },
      {
        id: "kids",
        question: "Is the property suitable for young children?",
        answer:
          "There's a dedicated children's play area on the property, alongside the lawn and pool, so younger guests have their own space.",
      },
    ],
  },
  {
    slug: "celebrations",
    name: "Celebrations",
    heroTitle: "MAKE THE MOMENT UNFORGETTABLE",
    tagline: "Birthdays, private celebrations and send-offs, indoors or out.",
    intro:
      "From birthdays to anniversaries, reunions and a bachelor or bachelorette send-off, the lawn, party hall and dining areas adapt to whatever the occasion calls for — outdoors when the weather is right for it, indoors when it isn't, and rooms nearby for anyone staying the night.",
    image: "hall",
    members: ["birthday", "private-celebration", "bachelor-party"],
    faq: [
      {
        id: "decor-catering",
        question: "Can we bring our own decorators or caterers?",
        answer:
          "Our policy on outside decorators and caterers is being confirmed with the property. Ask us when you enquire and we'll give you a clear answer before you book.",
      },
      {
        id: "sound",
        question: "Is a DJ or sound system allowed for a party?",
        answer:
          "Our policy on sound systems and DJs is being confirmed with the property. Ask us directly and we'll confirm exactly what's allowed for your date.",
      },
      {
        id: "indoor-outdoor",
        question: "Can we choose between the lawn and the party hall?",
        answer:
          "Yes — most celebrations use whichever combination of the lawn and party hall suits your guest list and the weather on the day; tell us your preference when you enquire.",
      },
    ],
  },
  {
    slug: "weddings",
    name: "Weddings & Pre-Wedding",
    heroTitle: "YOUR FOREVER, YOUR SETTING",
    tagline: "Ceremonies, functions and pre-wedding shoots on one private property.",
    intro:
      "Ceremonies on the lawn, functions in the hall, dining for your guests and rooms for family staying over — with the same property doubling as a location for a pre-wedding shoot, where the garden, pool and campfire give several distinct backdrops without leaving the grounds.",
    image: "wedding",
    members: ["wedding", "pre-wedding"],
    faq: [
      {
        id: "vendors",
        question: "Can we bring our own wedding planner, decorators or caterers?",
        answer:
          "Our policy on outside vendors for weddings is being confirmed with the property. Ask us when you enquire and we'll give you a clear answer before you book.",
      },
      {
        id: "shoot-slots",
        question: "How do we arrange a pre-wedding shoot slot?",
        answer:
          "Shoot slots and access are arranged directly with the property — share your preferred date and duration and we will confirm availability.",
      },
      {
        id: "guest-rooms",
        question: "Can family stay overnight for the wedding functions?",
        answer:
          "Yes — air-conditioned rooms are available for family staying over; share your numbers and we will confirm what's available for your dates.",
      },
    ],
  },
  {
    slug: "corporate-outings",
    name: "Corporate & Team Outings",
    heroTitle: "WORK TOGETHER. GET AWAY TOGETHER.",
    tagline: "Offsites and team outings, indoors and out.",
    intro:
      "An off-city setting for planning sessions, celebrations and relaxed team days alike — an indoor hall with generator backup and Wi-Fi for the parts that need structure, and open lawn, pool and barbecue for the parts that don't.",
    image: "corporate",
    members: ["corporate", "team-outing"],
    faq: [
      {
        id: "wifi-power",
        question: "Is Wi-Fi and power backup available for a corporate day?",
        answer:
          "Yes — Wi-Fi is available on the property, along with generator backup so a session or evening isn't interrupted.",
      },
      {
        id: "catering",
        question: "Can catering be arranged for a large group?",
        answer:
          "Catering is arranged at the time of booking based on your group size and preferences.",
      },
      {
        id: "half-day",
        question: "Can we book just a half-day session rather than a full day?",
        answer:
          "Half-day and full-day formats are confirmed with the property based on your group size and agenda — ask us when you enquire.",
      },
    ],
  },
];

export const categoryBySlug = (slug: string) => experienceCategories.find((c) => c.slug === slug);

/** Legacy individual-experience slug → the category page (and anchor) it now
 * lives on, so old links redirect straight to the right subsection. */
export const legacyExperienceRedirect: Record<string, { category: string; hash: string }> =
  Object.fromEntries(
    experienceCategories.flatMap((cat) =>
      cat.members.map((memberSlug) => [memberSlug, { category: cat.slug, hash: memberSlug }]),
    ),
  );

/** Sanity check, at module load, that every experience is assigned to
 * exactly one category and every category member exists. */
const assigned = new Set(experienceCategories.flatMap((c) => c.members));
if (assigned.size !== experiences.length) {
  console.warn("experience-categories: member/experience count mismatch");
}
