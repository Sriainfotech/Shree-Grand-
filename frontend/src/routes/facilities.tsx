import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";
import { pageMeta, canonical } from "@/lib/seo";
import { images, type ImageKey } from "@/data/images";
import { facilities, type Facility } from "@/data/facilities";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, Figure, Chip } from "@/components/ui/section";
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

/**
 * Descriptive alt text for the specific reference photo behind each
 * `ImageKey` used on this page (see `src/data/images.ts`), rather than the
 * bare facility name.
 */
const facilityImageAlt: Partial<Record<ImageKey, string>> = {
  pool: "Stainless-steel pool ladder curving into a kidney-shaped pool with dark blue tile edging and a thatched-roof cabana behind it",
  room: "Vaulted-ceiling bedroom with a cream four-poster bed frame, a grey knit throw and geometric pendant lights hung from the posts",
  lawn: "Adirondack chairs clustered around a small table on a lawn, framed through an arched trellis beneath a blooming frangipani tree",
  hall: "Long banquet table set with white china and lit taper candles in silver candelabras, framed by gold curtains against exposed brick",
  dining:
    "Banquet-style room with a long table of white plates loaded with salads, spring rolls and shot-glass appetizers",
  bbq: "Open-lid barrel-style charcoal grill smoking with ribs and sausages, with raw meat resting on a wooden board nearby",
  parking:
    "Aerial view of a gravel and paved parking lot with several rows of parked cars beside a corrugated-metal building",
  kidsPlay: "Child looking out from the window of a brightly painted train-shaped play structure",
  campfire:
    "Group seated around a stone fire pit at dusk roasting marshmallows, with a string-lit cabin behind them",
  garden:
    "Wheelbarrow loaded with young tomato and pepper seedlings beside a raised flowerbed of purple and yellow blooms",
};

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
            alt={facilityImageAlt[facility.image] ?? facility.name}
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
            className="group inline-flex items-center gap-1.5 border-b border-accent pb-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em] transition-colors hover:text-primary hover:border-primary"
          >
            See in gallery
            <Icons.ArrowRight
              className="h-3 w-3 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          {facility.hotspot ? (
            <Link
              to="/explore"
              className="group inline-flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
            >
              View in 3D
              <Icons.ArrowRight
                className="h-3 w-3 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
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
            intro="Filter by the part of the property you care about — stay, outdoor, celebration, dining, recreation or convenience — or leave it on All to see everything at once."
          />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every facility below can be booked on its own or combined — a wedding, for instance,
            typically uses the lawn, the party hall, the dining area and a few bedrooms together,
            while a quiet weekend might just need the pool and a room.
          </p>
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
