import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { site } from "@/config/site";
import { images } from "@/data/images";
import { PageHero, CtaBand, SplitBlock } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About — Shri Grand Farm Stay, Mancherial",
      description:
        "The place behind the moments. Shri Grand Farm Stay is a private farm stay and celebration venue in Vempally, Mancherial, Telangana.",
      path: "/about",
    }),
    links: canonical("/about"),
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

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="THE PLACE BEHIND THE MOMENTS"
        intro="A place created for moments that deserve more than an ordinary setting."
        image={images.garden}
        imageAlt="Garden path at a countryside farm stay"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "About", to: "/about" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Introduction"
            title="Shri Grand Farm Stay"
            intro={site.description}
          />
          <InfoNote className="mt-8 max-w-2xl">
            The line above is brand positioning, not a historical claim. Shri
            Grand Farm Stay's story, milestones and team details will be
            published here once shared by the property.
          </InfoNote>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell space-y-20">
          <SplitBlock
            eyebrow="Our vision"
            title="A setting that lifts the occasion"
            body="Shri Grand Farm Stay exists so celebrations in and around Mancherial no longer have to fit into a banquet room. The property brings the pool, lawn, hall, dining and accommodation together in one private place, so a family, a couple or a company can take over the whole setting for a day or a weekend."
            image={images.lawn}
            imageAlt="Open lawn used for outdoor gatherings"
          />
          <SplitBlock
            eyebrow="Hospitality"
            title="Planned with you, not around you"
            body="Every stay and every event is confirmed in conversation — dates, group size, catering and the spaces you need. Check-in is at 12:00 PM and check-out at 10:00 AM, with 50% advance to hold a booking, online or offline."
            image={images.dining}
            imageAlt="Dining area set for a group meal"
            reverse
          />
          <SplitBlock
            eyebrow="Celebrations"
            title="Space to gather, indoors and out"
            body="Birthdays on the lawn, weddings across the property, offsites in the hall, quiet anniversaries by the campfire. The property is used differently by every group that books it."
            image={images.hall}
            imageAlt="Indoor party hall prepared for a celebration"
          />
        </div>
      </section>

      <section className="section-y">
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
        </div>
      </section>

      <CtaBand
        title="Come see it for yourself."
        body="Tell us the occasion and we will help you plan it."
        context="about_cta"
      />
    </>
  );
}
