import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { pageMeta, canonical, jsonLd, breadcrumbSchema } from "@/lib/seo";
import { experiences } from "@/data/experiences";
import { facilities } from "@/data/facilities";
import { images } from "@/data/images";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, Figure, InfoNote } from "@/components/ui/section";
import { ActionLink } from "@/components/ui/actions";
import { whatsappMessages, PRICE_ON_REQUEST } from "@/config/site";

export const Route = createFileRoute("/experiences/$slug")({
  loader: ({ params }) => {
    const experience = experiences.find((e) => e.slug === params.slug);
    if (!experience) throw notFound();
    return { experience };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }],
      };
    }
    const { experience } = loaderData;
    return {
      meta: pageMeta({
        title: `${experience.name} — Shri Grand Farm Stay`,
        description: `${experience.tagline} ${experience.intro}`.slice(0, 155),
        path: `/experiences/${params.slug}`,
      }),
      links: canonical(`/experiences/${params.slug}`),
      scripts: jsonLd(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
          { name: experience.name, path: `/experiences/${params.slug}` },
        ]),
      ),
    };
  },
  component: ExperiencePage,
});

function ExperiencePage() {
  const { experience } = Route.useLoaderData();
  const spaces = experience.spaces
    .map((slug) => facilities.find((f) => f.slug === slug))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));
  const others = experiences.filter((e) => e.slug !== experience.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={experience.name}
        title={experience.heroTitle}
        intro={experience.tagline}
        image={images[experience.image]}
        imageAlt={experience.name}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Experiences", to: "/experiences" },
        ]}
      />

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <SectionHeader eyebrow="The experience" title={experience.name} intro={experience.intro} />
            <div className="mt-10">
              <p className="eyebrow">Ideal for</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {experience.audience.map((a) => (
                  <li
                    key={a}
                    className="border border-border px-4 py-2 text-[0.64rem] uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <ActionLink to="/booking">Book this experience</ActionLink>
              <ActionLink to="/packages" variant="outline">
                {PRICE_ON_REQUEST}
              </ActionLink>
            </div>
          </div>
          <Figure src={images[experience.image]} alt={experience.name} ratio="4/5" />
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SectionHeader
            eyebrow="Spaces used"
            title="What this experience uses"
            intro="The parts of the property most groups use for this occasion. Anything else on site can be added."
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((f) => (
              <Link
                key={f.slug}
                to="/facilities"
                className="bg-card px-7 py-8 transition-colors hover:bg-secondary"
              >
                <h3 className="display-lg">{f.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.summary}
                </p>
              </Link>
            ))}
          </div>
          <InfoNote className="mt-12 max-w-3xl">
            Inclusions, timings and pricing for this experience are confirmed at
            the time of booking. A 50% advance holds your date.
          </InfoNote>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <SectionHeader eyebrow="Also consider" title="Other experiences" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {others.map((e) => (
              <Link
                key={e.slug}
                to="/experiences/$slug"
                params={{ slug: e.slug }}
                className="group relative isolate flex min-h-[18rem] flex-col justify-end overflow-hidden bg-ink p-7 text-primary-foreground"
              >
                <img
                  src={images[e.image]}
                  alt={e.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 -z-10 overlay-scrim" />
                <h3 className="display-lg">{e.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={experience.cta}
        body="Share your date and group size — we will confirm availability."
        whatsappMessage={whatsappMessages.experience(experience.name)}
        context={`experience_${experience.slug}`}
      />
    </>
  );
}
