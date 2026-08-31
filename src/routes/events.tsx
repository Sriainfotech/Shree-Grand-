import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { experiences } from "@/data/experiences";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";
import { whatsappMessages } from "@/config/site";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: pageMeta({
      title: "Events & Celebrations — Shri Grand Farm Stay, Mancherial",
      description:
        "Birthdays, weddings, corporate events, team outings, pre-wedding shoots and private celebrations at Shri Grand Farm Stay, Vempally, Mancherial, Telangana.",
      path: "/events",
    }),
    links: canonical("/events"),
  }),
  component: EventsPage,
});

const eventSlugs = [
  "birthday",
  "wedding",
  "corporate",
  "team-outing",
  "pre-wedding",
  "bachelor-party",
  "private-celebration",
];

const eventExperiences = experiences.filter((e) => eventSlugs.includes(e.slug));

function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events & celebrations"
        title="EVERY CELEBRATION HAS A HOME HERE"
        intro="Birthdays, weddings, corporate events, team outings, pre-wedding shoots, bachelor parties and private celebrations — all on one private property."
        image={images.wedding}
        imageAlt="Celebration setup on the lawn"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Events", to: "/events" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Choose your event"
            title="Seven ways to celebrate"
            intro="Each format has its own experience page with the spaces it uses and who it suits. Open one to see more, or enquire directly for your date."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventExperiences.map((exp) => (
              <Link
                key={exp.slug}
                to="/experiences/$slug"
                params={{ slug: exp.slug }}
                className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden bg-ink p-8 text-primary-foreground"
              >
                <img
                  src={images[exp.image]}
                  alt={exp.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 -z-10 overlay-scrim" />
                <h2 className="display-lg">{exp.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
                  {exp.tagline}
                </p>
                <span className="mt-6 inline-block w-fit border-b border-accent pb-1 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-accent">
                  {exp.cta}
                </span>
              </Link>
            ))}
          </div>

          <InfoNote className="mt-14 max-w-3xl">
            Every event is planned in conversation — spaces, catering, timings and pricing are
            confirmed once you share your date and guest count. A 50% advance, online or offline,
            holds the booking.
          </InfoNote>
        </div>
      </section>

      <CtaBand
        title="Planning an event?"
        body="Tell us the occasion, the date and your guest count — we will suggest the right spaces and confirm availability."
        whatsappMessage={whatsappMessages.event}
        context="events_cta"
      />
    </>
  );
}
