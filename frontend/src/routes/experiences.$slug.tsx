import { createFileRoute, notFound, redirect, Link } from "@tanstack/react-router";
import { pageMeta, canonical, jsonLd, breadcrumbSchema } from "@/lib/seo";
import { experiences, type Experience } from "@/data/experiences";
import {
  categoryBySlug,
  legacyExperienceRedirect,
  type ExperienceCategory,
} from "@/data/experience-categories";
import { facilities } from "@/data/facilities";
import { images } from "@/data/images";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, Figure, InfoNote, EmptyState } from "@/components/ui/section";
import { ActionLink } from "@/components/ui/actions";
import { whatsappMessages, PRICE_ON_REQUEST } from "@/config/site";
import { testimonialsEmptyState } from "@/data/testimonials";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/experiences/$slug")({
  loader: ({ params }) => {
    // Old individual-experience URLs (e.g. /experiences/wedding) now live as
    // a subsection of a category page — redirect straight to it.
    const legacy = legacyExperienceRedirect[params.slug];
    if (legacy) {
      throw redirect({
        to: "/experiences/$slug",
        params: { slug: legacy.category },
        hash: legacy.hash,
      });
    }
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    const members = category.members
      .map((slug) => experiences.find((e) => e.slug === slug))
      .filter((e): e is Experience => Boolean(e));
    return { category, members };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }],
      };
    }
    const { category } = loaderData;
    return {
      meta: pageMeta({
        title: `${category.name} — Shri Grand Farm Stay`,
        description: `${category.tagline} ${category.intro}`.slice(0, 155),
        path: `/experiences/${params.slug}`,
      }),
      links: canonical(`/experiences/${params.slug}`),
      scripts: jsonLd(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
          { name: category.name, path: `/experiences/${params.slug}` },
        ]),
      ),
    };
  },
  component: ExperienceCategoryPage,
});

function MemberSection({ experience, index }: { experience: Experience; index: number }) {
  const spaces = experience.spaces
    .map((slug) => facilities.find((f) => f.slug === slug))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <div
      id={experience.slug}
      className="scroll-mt-28 border-t border-border pt-14 first:border-t-0 first:pt-0"
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-20">
        <div>
          <span className="text-[0.66rem] tracking-[0.22em] text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <SectionHeader className="mt-4" title={experience.name} intro={experience.intro} />
          <p className="mt-2 text-[0.95rem] italic text-muted-foreground">{experience.tagline}</p>
          <div className="mt-8">
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
          <div className="mt-8 flex flex-wrap gap-4">
            <ActionLink to="/booking">Book this experience</ActionLink>
            <ActionLink to="/packages" variant="outline">
              {PRICE_ON_REQUEST}
            </ActionLink>
          </div>
        </div>
        <Figure src={images[experience.image]} alt={experience.name} ratio="4/3" />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow">Spaces used</p>
          <div className="mt-5 grid gap-3">
            {spaces.map((f) => (
              <Link
                key={f.slug}
                to="/facilities"
                className="border border-border bg-card px-5 py-4 text-sm transition-colors hover:bg-secondary"
              >
                <span className="font-semibold">{f.name}</span>
                <span className="mt-1 block text-muted-foreground">{f.summary}</span>
              </Link>
            ))}
          </div>
        </div>
        {experience.timeline?.length ? (
          <div>
            <p className="eyebrow">A typical day looks like this</p>
            <ol className="mt-5 space-y-3">
              {experience.timeline.map((step, i) => (
                <li key={step} className="flex gap-4 text-sm">
                  <span className="text-[0.66rem] tracking-[0.2em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <InfoNote className="mt-6">
              An indicative running order — actual timings are confirmed against your booked date.
            </InfoNote>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExperienceCategoryPage() {
  const { category, members } = Route.useLoaderData() as {
    category: ExperienceCategory;
    members: Experience[];
  };

  return (
    <>
      <PageHero
        eyebrow={category.name}
        title={category.heroTitle}
        intro={category.tagline}
        image={images[category.image]}
        imageAlt={category.name}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Experiences", to: "/experiences" },
        ]}
      />

      <section className="section-y">
        <div className="shell max-w-3xl">
          <SectionHeader eyebrow="Overview" title={category.name} intro={category.intro} />
        </div>
      </section>

      <section className="pb-[clamp(4rem,9vw,8.5rem)]">
        <div className="shell space-y-14">
          {members.map((experience, i) => (
            <MemberSection key={experience.slug} experience={experience} index={i} />
          ))}
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell max-w-3xl">
          <SectionHeader eyebrow="FAQ" title="Questions specific to this occasion" />
          <Accordion type="single" collapsible className="mt-10">
            {category.faq.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <SectionHeader eyebrow="Guest stories" title="What guests say" align="center" />
          <div className="mt-12">
            <EmptyState title={testimonialsEmptyState.title} body={testimonialsEmptyState.body} />
          </div>
        </div>
      </section>

      <CtaBand
        title={`Planning ${category.name.toLowerCase()}?`}
        body="Share your date and group size — we will confirm availability."
        whatsappMessage={whatsappMessages.experience(category.name)}
        context={`experience_category_${category.slug}`}
      />
    </>
  );
}
