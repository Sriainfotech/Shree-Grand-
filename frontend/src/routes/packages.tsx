import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";
import { ActionLink, WhatsAppButton } from "@/components/ui/actions";
import { whatsappMessages, PRICE_ON_REQUEST } from "@/config/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: pageMeta({
      title: "Packages — Shri Grand Farm Stay, Mancherial",
      description:
        "Stay, day-outing, event, wedding and corporate packages at Shri Grand Farm Stay, Vempally, Mancherial, Telangana. Enquire for pricing.",
      path: "/packages",
    }),
    links: [
      ...canonical("/packages"),
      // PageHero's image is the LCP element on this page.
      { rel: "preload", as: "image", href: images.hall, fetchPriority: "high" },
    ],
  }),
  component: PackagesPage,
});

type PackageCategory = {
  title: string;
  blurb: string;
  bullets: string[];
  experienceSlug?: string;
};

const categories: PackageCategory[] = [
  {
    title: "Stay Packages",
    blurb:
      "Overnight stays for families, couples and small groups, built around AC rooms, the pool and dining.",
    bullets: [
      "Room-only or room-with-meals formats",
      "Check-in 12:00 PM, check-out 10:00 AM",
      "Group and multi-room stays on request",
    ],
    experienceSlug: "family",
  },
  {
    title: "Day-Outing Packages",
    blurb:
      "A full day on the property without an overnight stay — pool, lawn, dining and play area.",
    bullets: [
      "Half-day and full-day formats",
      "Suited to families, friend groups and students",
      "Catering arranged at the time of booking",
    ],
    experienceSlug: "day-out",
  },
  {
    title: "Birthday & Private Celebration Packages",
    blurb:
      "Lawn or party hall setups for birthdays, anniversaries, reunions and other private celebrations.",
    bullets: [
      "Indoor hall or open lawn formats",
      "Dining, parking and a children's play area on site",
      "Décor and catering arranged on request",
    ],
    experienceSlug: "birthday",
  },
  {
    title: "Wedding Packages",
    blurb:
      "Ceremonies, functions and stays for the family, brought together on one private property.",
    bullets: [
      "Lawn ceremonies and hall functions",
      "Rooms for family staying overnight",
      "Planned closely with your wedding planner",
    ],
    experienceSlug: "wedding",
  },
  {
    title: "Corporate & Team Outing Packages",
    blurb: "Offsites, team days and corporate celebrations with indoor backup and Wi-Fi.",
    bullets: [
      "Hall for sessions, lawn for activities",
      "Generator backup and Wi-Fi on site",
      "Half-day, full-day and residential formats",
    ],
    experienceSlug: "corporate",
  },
  {
    title: "Seasonal Packages",
    blurb: "Weekend and season-specific formats — announced as the property confirms them.",
    bullets: [
      "Weekend getaway formats for couples and friends",
      "Festive-season packages announced in advance",
      "Ask us what is currently available for your dates",
    ],
    experienceSlug: "weekend-getaway",
  },
];

function PackageCard({ category }: { category: PackageCategory }) {
  return (
    <article className="flex flex-col border border-border bg-card p-8">
      <h3 className="display-lg">{category.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{category.blurb}</p>
      <ul className="mt-6 space-y-2">
        {category.bullets.map((b) => (
          <li
            key={b}
            className="border-t border-border pt-2 text-[0.82rem] leading-relaxed text-muted-foreground first:border-t-0 first:pt-0"
          >
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-1 items-end justify-between gap-4">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
          {PRICE_ON_REQUEST}
        </span>
        {category.experienceSlug ? (
          <Link
            to="/experiences/$slug"
            params={{ slug: category.experienceSlug }}
            className="group inline-flex items-center gap-1.5 border-b border-accent pb-1 text-[0.64rem] font-semibold uppercase tracking-[0.22em] transition-colors hover:text-primary hover:border-primary"
          >
            View experience
            <ArrowRight
              className="h-3 w-3 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="A FORMAT FOR EVERY OCCASION"
        intro="Stay, day-outing, celebration, wedding and corporate formats — every one of them priced on enquiry until confirmed for your dates."
        image={images.hall}
        imageAlt="Party hall set up for a celebration"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Packages", to: "/packages" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="No published price list"
            title="Every package, priced on request"
            intro="Shri Grand Farm Stay has not yet published a fixed price list. Share your dates, group size and occasion, and we will confirm a package and price for you directly."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <PackageCard key={category.title} category={category} />
            ))}
          </div>

          <InfoNote className="mt-14 max-w-3xl">
            Inclusions, capacities and tariffs for each package are confirmed in conversation, not
            on this page. A 50% advance (online or offline) confirms a booking once a package is
            finalised.
          </InfoNote>

          <div className="mt-10 flex flex-wrap gap-4">
            <ActionLink to="/experiences" variant="outline">
              See all experiences
            </ActionLink>
            <WhatsAppButton message={whatsappMessages.packages} context="packages_enquiry" />
          </div>

          <div className="mt-16 max-w-3xl">
            <SectionHeader eyebrow="Before you enquire" title="Package questions we hear often" />
            <Accordion type="single" collapsible className="mt-10">
              <AccordionItem value="why-no-price">
                <AccordionTrigger>Why isn't there a price list on this page?</AccordionTrigger>
                <AccordionContent>
                  Package cost depends on the format, guest count, catering and the spaces you book,
                  so a single published price would be misleading for most groups. Share your
                  requirements and we'll quote against them directly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mix-packages">
                <AccordionTrigger>Can I combine a stay with an event?</AccordionTrigger>
                <AccordionContent>
                  Yes — many bookings pair an overnight stay with a celebration, such as a family
                  staying over for a wedding function or a birthday. Tell us both parts when you
                  enquire so we can plan the rooms and event spaces together.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="catering">
                <AccordionTrigger>Is catering included in a package?</AccordionTrigger>
                <AccordionContent>
                  Catering is arranged at the time of booking based on your menu and guest count,
                  rather than bundled into a fixed package price. We'll confirm catering options
                  once you share your event details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <CtaBand
        title="Tell us the occasion, we'll suggest the package."
        body="Share your dates and group size on WhatsApp or by booking enquiry, and we'll confirm the right package and price."
        whatsappMessage={whatsappMessages.packages}
        context="packages_cta"
      />
    </>
  );
}
