import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { blogPosts, blogCategories } from "@/data/blog";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, Figure, Chip, InfoNote } from "@/components/ui/section";
import { COMING_SOON, whatsappMessages } from "@/config/site";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: pageMeta({
      title: "Journal — Shri Grand Farm Stay, Mancherial",
      description:
        "Notes on stays, celebrations and travel around Vempally, Mancherial, Telangana from Shri Grand Farm Stay.",
      path: "/blog",
    }),
    links: canonical("/blog"),
  }),
  component: BlogPage,
});

function BlogPage() {
  const [category, setCategory] = useState<string>("all");
  const list = category === "all" ? blogPosts : blogPosts.filter((p) => p.category === category);

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="STORIES FROM THE PROPERTY"
        intro="Notes on stays, celebrations and travel around Mancherial — published as they're written."
        image={images.campfire}
        imageAlt="Campfire setting in the evening"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Journal", to: "/blog" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Reading list"
            title="Planned articles"
            intro="Our journal is just getting started. Every topic below is planned; articles marked coming soon are outlines waiting to be written."
          />

          <div className="mt-10 flex flex-wrap gap-2">
            <Chip active={category === "all"} onClick={() => setCategory("all")}>
              All
            </Chip>
            {blogCategories.map((c) => (
              <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </Chip>
            ))}
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((post) => (
              <article key={post.slug} className="flex flex-col border border-border bg-card">
                <Figure src={images[post.image]} alt={post.title} ratio="4/3" />
                <div className="flex flex-1 flex-col p-7">
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent">
                    {post.status === "published" ? "Article" : COMING_SOON}
                  </span>
                  <h3 className="display-lg mt-3">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <ul className="mt-5 space-y-1.5">
                    {post.outline.slice(0, 3).map((point) => (
                      <li
                        key={point}
                        className="text-[0.76rem] leading-relaxed text-muted-foreground before:mr-2 before:text-accent before:content-['—']"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <InfoNote className="mt-14 max-w-3xl">
            These are editorial outlines, not published articles — no dates, statistics or claims
            are published here until an article is actually written and confirmed by the property.
          </InfoNote>
        </div>
      </section>

      <CtaBand
        title="Have a question we should answer here?"
        body="Tell us what you'd like to read about stays or celebrations at Shri Grand Farm Stay."
        whatsappMessage={whatsappMessages.general}
        context="blog_cta"
      />
    </>
  );
}
