import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { site, whatsappMessages } from "@/config/site";
import { images } from "@/data/images";
import { faqItems } from "@/data/faq";
import { facilityBySlug } from "@/data/facilities";
import { experienceCategories } from "@/data/experience-categories";
import { PageHero, CtaBand, SplitBlock } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";
import { ActionLink } from "@/components/ui/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About the Property — Shri Grand Farm Stay, Mancherial",
      description:
        "The place behind the moments. Shri Grand Farm Stay is a private farm stay and celebration venue in Vempally, Mancherial, Telangana — pool, lawn, rooms, party hall, dining, garden and campfire, all on one property.",
      path: "/about",
    }),
    links: [
      ...canonical("/about"),
      // PageHero's image is the LCP element on this page.
      { rel: "preload", as: "image", href: images.aerial, fetchPriority: "high" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    title: "Hospitality",
    body: "Attentive, unhurried and personal. Every booking is planned in conversation, not through a form alone.",
  },
  {
    title: "Celebrations",
    body: "Lawns, an indoor hall and dining that adapt to birthdays, weddings, offsites and private functions.",
  },
  {
    title: "Nature",
    body: "Garden, open sky and green space — the reason a day here feels longer than a day anywhere else.",
  },
  {
    title: "Together",
    body: "Room for families, friends and teams to spend real time with each other.",
  },
];

/**
 * The full space-by-space breakdown. Descriptions are pulled straight from
 * `facilities.ts` (already-approved copy) rather than restated, so nothing
 * new is asserted about the property here.
 */
const spaces = [
  { slug: "swimming-pool", eyebrow: "Recreation", image: images.pool },
  { slug: "lawn-area", eyebrow: "Outdoor", image: images.lawn },
  { slug: "ac-rooms", eyebrow: "Accommodation", image: images.room },
  { slug: "party-hall", eyebrow: "Celebration", image: images.hall },
  { slug: "garden", eyebrow: "Outdoor", image: images.garden },
  { slug: "dining-area", eyebrow: "Dining", image: images.dining },
  { slug: "campfire", eyebrow: "Outdoor", image: images.campfire },
] as const;

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the property"
        title="THE PLACE BEHIND THE MOMENTS"
        intro="One private property, taken over by your family, friends or team for the day or the weekend — created for moments that deserve more than an ordinary setting."
        image={images.aerial}
        imageAlt="Aerial view of a countryside farm stay with lawns and pool"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "About", to: "/about" },
        ]}
      />

      <section className="section-y">
        <div className="shell grid gap-12 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
          <img
            src="/img/logo/logo.png"
            alt="Shri Grand Farm Stay crest"
            width={320}
            height={320}
            className="mx-auto h-auto w-52 max-w-full md:mx-0 md:w-64"
          />
          <div>
            <SectionHeader
              eyebrow="Introduction"
              title="Shri Grand Farm Stay"
              intro={site.description}
            />
            <InfoNote className="mt-8 max-w-2xl">
              The line above is brand positioning, not a historical claim. Shri Grand Farm Stay's
              story, milestones and team details will be published here once shared by the property.
            </InfoNote>
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SplitBlock
            eyebrow="Our story"
            title="A setting that lifts the occasion"
            body="Shri Grand Farm Stay sits in Vempally, Mancherial — a private farm property with a swimming pool, open lawn, indoor party hall, air-conditioned rooms, dining and garden areas, so celebrations in and around Mancherial no longer have to fit into a banquet room. The property brings every space together in one private place, so a family, a couple or a company can take over the whole setting for a day or a weekend. Exact land area and building dimensions will be published once confirmed by the property."
            image={images.lawn}
            imageAlt="Open lawn used for outdoor gatherings"
          />
        </div>
      </section>

      <section className="pb-[clamp(4rem,9vw,8.5rem)]">
        <div className="shell">
          <SectionHeader
            eyebrow="Every space"
            title="Explore the property, one space at a time"
            intro="Pool, lawn, rooms, party hall, garden, dining and campfire — each part of the property, in its own words."
          />
          <div className="mt-16 space-y-16 md:space-y-20">
            {spaces.map((s, i) => {
              const facility = facilityBySlug(s.slug);
              if (!facility) return null;
              return (
                <SplitBlock
                  key={s.slug}
                  eyebrow={s.eyebrow}
                  title={facility.name}
                  body={facility.description}
                  image={s.image}
                  imageAlt={facility.name}
                  reverse={i % 2 === 1}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SectionHeader
            eyebrow="Who it's for"
            title="However you want to use it"
            intro="Every category below has its own page with occasion-specific detail — timelines, spaces used and answers to the questions people actually ask."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experienceCategories.map((cat) => (
              <Link
                key={cat.slug}
                to="/experiences/$slug"
                params={{ slug: cat.slug }}
                className="group border-t border-border pt-6 transition-colors hover:border-primary"
              >
                <h3 className="display-lg transition-colors group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cat.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell space-y-20">
          <SplitBlock
            eyebrow="Hospitality"
            title="Planned with you, not around you"
            body="Every stay and every event is confirmed in conversation — dates, group size, catering and the spaces you need. Check-in is at 12:00 PM and check-out at 10:00 AM, with 50% advance to hold a booking, online or offline."
            image={images.dining}
            imageAlt="Dining area set for a group meal"
          />
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SectionHeader eyebrow="What we care about" title="Our philosophy" />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="border-t border-border pt-6">
                <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-primary">
                  {v.title}
                </h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <ActionLink to="/facilities" variant="link">
              See every facility in detail
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell max-w-3xl">
          <SectionHeader eyebrow="Good to know" title="Common questions about staying or booking" />
          <Accordion type="single" collapsible className="mt-10">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBand
        title="Take the whole place for a weekend."
        body="Check availability for your dates and group."
        whatsappMessage={whatsappMessages.stay}
        context="about_cta"
      />
    </>
  );
}
