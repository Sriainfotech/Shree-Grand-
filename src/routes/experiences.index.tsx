import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { experiences } from "@/data/experiences";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader } from "@/components/ui/section";

// Registered as the index route (trailing slash, and this file lives at
// experiences.index.tsx) rather than a bare "/experiences" file — with both
// this hub page and experiences.$slug.tsx present, a bare "experiences.tsx"
// is treated by TanStack Router as a LAYOUT route for everything under
// /experiences/*, which requires an <Outlet /> to render children. This
// page has no outlet (it's a complete standalone hub page), so every
// /experiences/$slug page was silently rendering this hub's own content
// instead of its own — the index-route form makes /experiences and
// /experiences/$slug independent sibling routes instead.
export const Route = createFileRoute("/experiences/")({
  head: () => ({
    meta: pageMeta({
      title: "Experiences — Shri Grand Farm Stay",
      description:
        "Family stays, weekend getaways, birthdays, corporate offsites, weddings, pre-wedding shoots, day outs and private celebrations in Vempally, Mancherial.",
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
        intro="Ten ways to use the property — every one of them private, and planned around your occasion."
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
            intro="Each experience has its own page with the spaces it uses and who it suits."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp) => (
              <Link
                key={exp.slug}
                to="/experiences/$slug"
                params={{ slug: exp.slug }}
                className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden bg-ink p-8 text-primary-foreground"
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
