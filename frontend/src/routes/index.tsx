import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { pageMeta, canonical, jsonLd, lodgingSchema } from "@/lib/seo";
import { site, PRICE_ON_REQUEST } from "@/config/site";
import { images } from "@/data/images";
import { experienceCategories } from "@/data/experience-categories";
import { facilities, featuredFacilitySlugs } from "@/data/facilities";
import { galleryItems } from "@/data/gallery";
import { packageCategories } from "@/data/packages";
import { ActionLink, ActionAnchor } from "@/components/ui/actions";
import { Eyebrow, Figure, SectionHeader, PlaceholderNote } from "@/components/ui/section";
import { CtaBand } from "@/components/ui/page";
import { ArchViz } from "@/components/explore/ArchViz";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FaqPreview } from "@/components/home/FaqPreview";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { PropertyStripScroll } from "@/components/home/PropertyStripScroll";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "Shri Grand Farm Stay — Celebrations in Mancherial",
      description:
        "A premium farm stay and celebration venue in Vempally, Mancherial, Telangana. Stays, weddings, birthdays, corporate outings and private celebrations.",
      path: "/",
    }),
    links: canonical("/"),
    scripts: jsonLd(lodgingSchema()),
  }),
  component: HomePage,
});

const pillars = [
  {
    title: "Stay",
    body: "Air-conditioned rooms for a night, a weekend or longer, on a property you don't have to share with strangers.",
  },
  {
    title: "Celebrate",
    body: "The lawn, party hall and dining areas adapt to birthdays, weddings, offsites and family functions of any format.",
  },
  {
    title: "Escape",
    body: "A day trip or a weekend away from the city, with the pool, garden and open sky doing most of the work.",
  },
  {
    title: "Connect",
    body: "Shared meals, a campfire in the evening and enough open space for a group to actually spend time together.",
  },
];

function HomePage() {
  const spaces = featuredFacilitySlugs
    .map((slug) => facilities.find((f) => f.slug === slug))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  const galleryPreview = galleryItems.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-dvh items-end overflow-hidden bg-ink">
        <HeroCarousel />
        <div aria-hidden className="absolute inset-0 -z-10 overlay-scrim" />

        {/* pointer-events-none so the carousel's arrows/dots (positioned
            behind this block in the DOM) stay clickable through it; the
            interactive controls below opt back in with pointer-events-auto. */}
        <div className="shell pointer-events-none w-full pb-16 pt-36 text-primary-foreground sm:pb-24">
          <p className="reveal text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-primary-foreground/75">
            {site.nameUpper}
          </p>
          <h1 className="display-hero reveal mt-6 max-w-4xl text-balance">
            A Perfect Place
            <br />
            for Celebrations
          </h1>
          <p className="reveal mt-7 max-w-lg text-[1rem] leading-relaxed text-primary-foreground/80">
            A beautiful destination for stays, celebrations, gatherings and memorable experiences.
          </p>
          <div className="reveal pointer-events-auto mt-10 flex flex-wrap gap-4">
            <ActionLink to="/about" variant="gold">
              Explore the farmstay
            </ActionLink>
            <ActionLink to="/booking" variant="ghostLight">
              Book your stay
            </ActionLink>
          </div>
          <p className="mt-12 flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
            Vempally · Mancherial · Telangana
          </p>
        </div>
      </section>

      {/* SECTION 2 — EDITORIAL INTRO */}
      <section className="section-y">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow>{site.tagline}</Eyebrow>
            <h2 className="display-xl mt-6 text-balance">More than a stay.</h2>
            <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-muted-foreground">
              A place to stay, celebrate, gather and create memories.
            </p>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              Shri Grand Farm Stay is a private property in Vempally, Mancherial — open lawns, a
              swimming pool, an indoor party hall and air-conditioned rooms, held together by quiet
              green space.
            </p>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              Whether you're booking a weekend for the family, a milestone birthday, a wedding
              function or a day away from work with your team, the whole property is yours for the
              duration — no shared lobbies, no other bookings running alongside yours.
            </p>
            <div className="mt-10">
              <ActionLink to="/about" variant="link">
                About the property
              </ActionLink>
            </div>
          </div>
          <Figure
            src={images.aerial}
            alt="Aerial view of open lawns, garden and a pool at a countryside property"
            ratio="5/4"
          />
        </div>
      </section>

      {/* SECTION 3 — EXPLORE THE FARMSTAY (scroll-linked sticky gallery) */}
      <PropertyStripScroll />

      {/* SECTION 4 — CHOOSE YOUR EXPERIENCE */}
      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Experiences"
            title="Choose your experience"
            intro="Every visit is planned around the occasion — a family weekend, a birthday, an offsite or a wedding."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {experienceCategories.map((cat) => (
              <Link
                key={cat.slug}
                to="/experiences/$slug"
                params={{ slug: cat.slug }}
                className="group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden bg-ink p-7 text-primary-foreground"
              >
                <img
                  src={images[cat.image]}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 -z-10 overlay-scrim" />
                <h3 className="display-lg">{cat.name}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
                  {cat.tagline}
                </p>
                <span className="mt-6 inline-block w-fit border-b border-accent pb-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-accent">
                  Discover
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <ActionLink to="/experiences" variant="outline">
              All experiences
            </ActionLink>
          </div>
        </div>
      </section>

      {/* SECTION 5 — SPACES */}
      <section className="section-y bg-forest-deep text-primary-foreground">
        <div className="shell">
          <Eyebrow className="text-primary-foreground/70">Facilities</Eyebrow>
          <h2 className="display-xl mt-6 max-w-2xl text-balance">
            The spaces that make the moments
          </h2>
          <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((facility, i) => (
              <Link
                key={facility.slug}
                to="/facilities"
                className="group border-t border-primary-foreground/20 pt-6"
              >
                <span className="text-[0.66rem] tracking-[0.22em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display-lg mt-3 transition-colors group-hover:text-accent">
                  {facility.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                  {facility.summary}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-14">
            <ActionLink to="/facilities" variant="ghostLight">
              View all facilities
            </ActionLink>
          </div>
        </div>
      </section>

      {/* SECTION 6 — 3D TEASER */}
      <section className="section-y">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Explore in 3D</Eyebrow>
            <h2 className="display-xl mt-6 text-balance">Step inside Shri Grand</h2>
            <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              Explore the property before you arrive.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              An interactive walkthrough is being prepared. The visual below is an architectural
              placeholder, not a render of the actual farmhouse.
            </p>
            <div className="mt-10">
              <ActionLink to="/explore">Explore in 3D</ActionLink>
            </div>
          </div>
          <ArchViz className="w-full" />
        </div>
      </section>

      {/* SECTION 7 — GALLERY PREVIEW */}
      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SectionHeader
            eyebrow="Gallery"
            title="A look around"
            intro="Property, rooms, pool, events and the outdoors."
          />
          <div className="mt-12 grid auto-rows-[10rem] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[12rem]">
            {galleryPreview.map((item, i) => (
              <Link
                key={item.id}
                to="/gallery"
                className={
                  i === 0
                    ? "col-span-2 row-span-2 overflow-hidden"
                    : i === 3
                      ? "col-span-2 overflow-hidden"
                      : "overflow-hidden"
                }
              >
                <img
                  src={images[item.image]}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover img-zoom"
                />
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <ActionLink to="/gallery" variant="outline">
              View full gallery
            </ActionLink>
            <PlaceholderNote />
          </div>
        </div>
      </section>

      {/* SECTION 8 — PACKAGES PREVIEW */}
      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="Packages"
            title="Formats for every occasion"
            intro="Pricing is confirmed against your dates, group size and requirements."
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {packageCategories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to="/packages"
                className="group bg-card px-7 py-10 transition-colors hover:bg-secondary"
              >
                <h3 className="display-lg">{cat.label}</h3>
                <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent-foreground/80">
                  {PRICE_ON_REQUEST}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <ActionLink to="/packages">View packages</ActionLink>
          </div>
        </div>
      </section>

      <TrustStrip />
      <FaqPreview />

      {/* SECTION 9 — WHY */}
      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SectionHeader eyebrow="Why Shri Grand?" title="Four reasons to visit" />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="border-t border-border pt-6">
                <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-primary">
                  {p.title}
                </h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — TESTIMONIALS */}
      <TestimonialsCarousel />

      {/* SECTION 10b — INSTAGRAM */}
      <InstagramFeed />

      {/* SECTION 11 — LOCATION */}
      <section className="section-y bg-secondary/50">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Location</Eyebrow>
            <h2 className="display-xl mt-6">Vempally, Mancherial</h2>
            <dl className="mt-8 space-y-5 text-[0.95rem]">
              <div>
                <dt className="eyebrow">Village</dt>
                <dd className="mt-1">{site.location.village}</dd>
              </div>
              <div>
                <dt className="eyebrow">City</dt>
                <dd className="mt-1">{site.location.city}</dd>
              </div>
              <div>
                <dt className="eyebrow">State</dt>
                <dd className="mt-1">{site.location.state}</dd>
              </div>
              <div>
                <dt className="eyebrow">Landmark</dt>
                <dd className="mt-1">{site.location.landmark}</dd>
              </div>
            </dl>
            <div className="mt-10">
              <ActionAnchor
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  "Vempally Municipality Office, Mancherial, Telangana",
                )}`}
                variant="outline"
              >
                Get directions
              </ActionAnchor>
            </div>
          </div>
          <div className="flex min-h-[20rem] flex-col items-center justify-center border border-dashed border-border bg-card p-10 text-center">
            <MapPin className="h-6 w-6 text-accent" aria-hidden />
            <p className="display-lg mt-5">Map coming soon</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The exact pin and street address will be published once confirmed by the property.
              Call or message us and we will share directions.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Your next memory starts here."
        body="Share your dates and the occasion — we will plan the rest with you."
        context="home_final_cta"
      />
    </>
  );
}
