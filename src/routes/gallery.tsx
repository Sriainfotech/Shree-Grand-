import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { photoCategories, type PhotoCategoryId } from "@/data/gallery";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, Figure, Chip, PlaceholderNote, InfoNote } from "@/components/ui/section";
import { whatsappMessages } from "@/config/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: pageMeta({
      title: "Gallery — Shri Grand Farm Stay, Mancherial",
      description:
        "Pool, rooms, dining, garden, campfire, party hall and more at Shri Grand Farm Stay, Vempally, Mancherial, Telangana.",
      path: "/gallery",
    }),
    links: canonical("/gallery"),
  }),
  component: GalleryPage,
});

const chips: { id: PhotoCategoryId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...photoCategories.map((c) => ({ id: c.id, label: c.label })),
];

function GalleryPage() {
  const [category, setCategory] = useState<PhotoCategoryId | "all">("all");

  const sections =
    category === "all"
      ? photoCategories
      : photoCategories.filter((c) => c.id === category);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A LOOK AROUND THE PROPERTY"
        intro="Pool, rooms, dining, garden, campfire, party hall and more — grouped by the part of the property you want to see."
        image={images.aerial}
        imageAlt="A wide, landscape-establishing view representative of the property setting"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Gallery", to: "/gallery" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Browse by space"
            title="Filter the gallery"
            intro="Filter by the space you're planning around, or browse everything."
          />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            These reference photos are grouped by space — pool, rooms, dining, garden, campfire,
            children's play area, living spaces, party hall, parking, barbecue and weddings — so
            you can quickly picture the specific area you're planning your stay or event around.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </Chip>
            ))}
          </div>

          <div className="mt-14 space-y-16">
            {sections.map((section) => (
              <div key={section.id}>
                {category === "all" ? (
                  <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-primary">
                    {section.label}
                  </h3>
                ) : null}
                <div
                  className={
                    "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" +
                    (category === "all" ? " mt-6" : "")
                  }
                >
                  {section.photos.map((p, i) => (
                    <Figure
                      key={`${section.id}-${i}`}
                      src={p.src}
                      alt={p.caption}
                      ratio="4/3"
                      caption={p.caption}
                      priority={category === "all" && i === 0}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <PlaceholderNote className="mt-14" />
          <InfoNote className="mt-6 max-w-3xl">
            Per the property brief, no construction photography, drone footage or 3D renders have
            been supplied yet. Real property photography will replace these representative images
            once received.
          </InfoNote>
        </div>
      </section>

      <CtaBand
        title="Want to see more before you book?"
        body="Ask us for specific photos of the space you're planning around."
        whatsappMessage={whatsappMessages.gallery}
        context="gallery_cta"
      />
    </>
  );
}
