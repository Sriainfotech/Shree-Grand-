import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { facilities, type Facility } from "@/data/facilities";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, Figure, Chip, PlaceholderNote } from "@/components/ui/section";
import { ActionLink } from "@/components/ui/actions";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: pageMeta({
      title: "Facilities — Shri Grand Farm Stay, Mancherial",
      description:
        "Swimming pool, AC rooms, lawn, party hall, dining, barbecue, campfire, garden, parking, play area, Wi-Fi, generator backup and security.",
      path: "/facilities",
    }),
    links: canonical("/facilities"),
  }),
  component: FacilitiesPage,
});

const groups = [
  { id: "all", label: "All" },
  { id: "stay", label: "Stay" },
  { id: "outdoor", label: "Outdoor" },
  { id: "celebration", label: "Celebration" },
  { id: "dining", label: "Dining" },
  { id: "recreation", label: "Recreation" },
  { id: "convenience", label: "Convenience" },
] as const;

function FacilityIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Dot;
  return <Icon className="h-5 w-5 text-accent" aria-hidden />;
}

function FacilityCard({ facility, index }: { facility: Facility; index: number }) {
  return (
    <article className="group grid gap-8 border-t border-border pt-10 md:grid-cols-2 md:gap-14">
      <div className={index % 2 === 1 ? "md:order-2" : ""}>
        {facility.image ? (
          <Figure
            src={images[facility.image]}
            alt={facility.name}
            ratio="4/3"
          />
        ) : (
          <div
            className="flex items-center justify-center border border-dashed border-border bg-secondary/60"
            style={{ aspectRatio: "4/3" }}
          >
            <FacilityIcon name={facility.icon} />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <FacilityIcon name={facility.icon} />
          <span className="text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
            {facility.group}
          </span>
        </div>
        <h3 className="display-xl mt-5">{facility.name}</h3>
        <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
          {facility.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            to="/gallery"
            className="border-b border-accent pb-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em]"
          >
            See in gallery
          </Link>
          {facility.hotspot ? (
            <Link
              to="/explore"
              className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
            >
              View in 3D
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FacilitiesPage() {
  const [group, setGroup] = useState<string>("all");
  const list = group === "all" ? facilities : facilities.filter((f) => f.group === group);

  return (
    <>
      <PageHero
        eyebrow="Facilities"
        title="EVERYTHING, ON ONE PROPERTY"
        intro="Fourteen facilities across stay, outdoor, celebration, dining, recreation and convenience."
        image={images.pool}
        imageAlt="Swimming pool at a countryside farm stay"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Facilities", to: "/facilities" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Facility explorer"
            title="Explore each space"
            intro="Filter by the part of the property you care about."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {groups.map((g) => (
              <Chip key={g.id} active={group === g.id} onClick={() => setGroup(g.id)}>
                {g.label}
              </Chip>
            ))}
          </div>

          <div className="mt-14 space-y-14">
            {list.map((facility, i) => (
              <FacilityCard key={facility.slug} facility={facility} index={i} />
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-6">
            <ActionLink to="/explore">Explore in 3D</ActionLink>
            <PlaceholderNote />
          </div>
        </div>
      </section>

      <CtaBand
        title="Which spaces do you need?"
        body="Tell us the occasion and we will map the property to it."
        context="facilities_cta"
      />
    </>
  );
}
