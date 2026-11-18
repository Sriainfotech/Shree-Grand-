import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";
import { FallbackScene } from "@/components/explore/FallbackScene";

/** Heavy scene is code-split — it never ships with the homepage bundle. */
const PropertyScene = lazy(() =>
  import("@/components/explore/PropertyScene").then((m) => ({
    default: m.PropertyScene,
  })),
);

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: pageMeta({
      title: "Explore Shri Grand — 3D Property Walkthrough",
      description:
        "Step inside Shri Grand Farm Stay before you arrive. An interactive walkthrough of the pool, lawn, rooms, party hall and gardens in Vempally, Mancherial.",
      path: "/explore",
    }),
    links: canonical("/explore"),
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setInteractive(wide && !reduced);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Explore 3D"
        title="EXPLORE SHRI GRAND"
        intro="Step inside before you arrive."
        image={images.aerial}
        imageAlt="Aerial view of a countryside property at golden hour"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Explore 3D", to: "/explore" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Interactive"
            title="The property, space by space"
            intro="Select a hotspot to move through the pool, rooms, lawn, party hall, dining, barbecue, campfire, garden, parking and play area."
          />

          <div className="mt-12">
            {interactive ? (
              <Suspense
                fallback={
                  <div className="flex h-[28rem] items-center justify-center border border-border bg-secondary/40 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Preparing the scene…
                  </div>
                }
              >
                <PropertyScene />
              </Suspense>
            ) : (
              <FallbackScene />
            )}
          </div>

          <InfoNote className="mt-12 max-w-3xl">
            The visual on this page is an architectural placeholder and does not
            represent the actual buildings at Shri Grand Farm Stay. A measured
            3D model with camera movement, rotation, zoom and day/night lighting
            will replace it once the property survey is complete.
          </InfoNote>
        </div>
      </section>

      <CtaBand
        title="Prefer to see it in person?"
        body="Arrange a visit or ask us anything about the property."
        primaryLabel="Plan a visit"
        primaryTo="/contact"
        context="explore_cta"
      />
    </>
  );
}
