import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { experienceCategories } from "@/data/experience-categories";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader } from "@/components/ui/section";

export const Route = createFileRoute("/experiences/")({
  head: () => ({
    meta: pageMeta({
      title: "Experiences — Shri Grand Farm Stay",
      description:
        "Family stays, celebrations, weddings and pre-wedding shoots, and corporate outings — every occasion planned around a single private property in Vempally, Mancherial.",
      path: "/experiences",
    }),
    links: canonical("/experiences"),
  }),
  component: ExperiencesPage,
});

function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Experiences"
        title="MAKE IT YOUR MOMENT"
        intro="Four ways to use the property — every one of them private, and planned around your occasion."
        image={images.wedding}
        imageAlt="Celebration setup on a lawn at a farm stay"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Experiences", to: "/experiences" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Choose yours"
            title="Every occasion has a format"
            intro="Each page covers the occasions grouped under it, the spaces they use, a typical timeline and occasion-specific answers."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {experienceCategories.map((cat) => (
              <Link
                key={cat.slug}
                to="/experiences/$slug"
                params={{ slug: cat.slug }}
                className="group relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden bg-ink p-8 text-primary-foreground"
              >
                <img
                  src={images[cat.image]}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 -z-10 overlay-scrim" />
                <h2 className="display-xl">{cat.name}</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
                  {cat.tagline}
                </p>
                <span className="mt-6 inline-block w-fit border-b border-accent pb-1 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-accent">
                  Explore
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure which format fits?"
        body="Tell us the occasion, the date and how many people — we will suggest the right one."
        context="experiences_cta"
      />
    </>
  );
}
