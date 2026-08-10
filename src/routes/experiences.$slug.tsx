import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { experiences } from "@/data/experiences";

export const Route = createFileRoute("/experiences/$slug")({
  loader: ({ params }) => {
    const experience = experiences.find((e) => e.slug === params.slug);
    if (!experience) throw notFound();
    return { experience };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: pageMeta({
        title: `${loaderData.experience.name} — Shri Grand Farm Stay`,
        description: loaderData.experience.tagline,
        path: `/experiences/${params.slug}`,
      }),
      links: canonical(`/experiences/${params.slug}`),
    };
  },
  component: ExperiencePage,
});

function ExperiencePage() {
  const { experience } = Route.useLoaderData();
  return (
    <div className="section-y pt-40">
      <div className="shell">
        <p className="eyebrow">Experience</p>
        <h1 className="display-xl mt-5">{experience.heroTitle}</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">{experience.intro}</p>
      </div>
    </div>
  );
}
