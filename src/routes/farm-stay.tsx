import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { facilities } from "@/data/facilities";
import { PageHero, CtaBand, SplitBlock } from "@/components/ui/page";
import { SectionHeader, PlaceholderNote } from "@/components/ui/section";
import { ActionLink } from "@/components/ui/actions";
import { whatsappMessages } from "@/config/site";

export const Route = createFileRoute("/farm-stay")({
  head: () => ({
    meta: pageMeta({
      title: "The Farm Stay — Shri Grand, Mancherial",
      description:
        "Your private escape in Vempally, Mancherial. Pool, lawns, party hall, AC rooms, dining, barbecue, campfire and gardens across one private property.",
      path: "/farm-stay",
    }),
    links: canonical("/farm-stay"),
  }),
  component: FarmStayPage,
});

const groups: { id: string; label: string; blurb: string }[] = [
  { id: "stay", label: "Accommodation", blurb: "Where your group sleeps." },
  { id: "outdoor", label: "Outdoor spaces", blurb: "Lawn, campfire and garden." },
  { id: "celebration", label: "Celebration spaces", blurb: "Indoors, for any occasion." },
  { id: "dining", label: "Dining", blurb: "Meals and evening grills." },
  { id: "recreation", label: "Recreation", blurb: "Pool and play." },
  { id: "convenience", label: "Convenience", blurb: "The things you shouldn't have to think about." },
];

function FarmStayPage() {
  return (
    <>
      <PageHero
        eyebrow="The farm stay"
        title="YOUR PRIVATE ESCAPE"
        intro="One property, taken over by your family, friends or team for the day or the weekend."
        image={images.hero}
        imageAlt="Countryside farm stay at dusk"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "The Farm Stay", to: "/farm-stay" },
        ]}
      />

      <section className="section-y">
        <div className="shell space-y-20">
          <SplitBlock
            eyebrow="Property overview"
            title="Green space, held privately"
            body="Shri Grand Farm Stay sits in Vempally, Mancherial — a private farm property with a swimming pool, open lawn, indoor party hall, air-conditioned rooms, dining and garden areas. Exact land area and building dimensions will be published once confirmed by the property."
            image={images.aerial}
            imageAlt="Aerial view of a farm property with lawns and pool"
          >
            <PlaceholderNote />
          </SplitBlock>
          <SplitBlock
            eyebrow="Accommodation"
            title="Air-conditioned rooms"
            body="Bedrooms and AC rooms for guests staying overnight. Room types, counts and occupancy are being finalised — share your group size and we will confirm what is available for your dates."
            image={images.room}
            imageAlt="Bedroom interior at a farm stay"
            reverse
          >
            <ActionLink to="/rooms" variant="link">
              See rooms &amp; stay
            </ActionLink>
          </SplitBlock>
          <SplitBlock
            eyebrow="Outdoor"
            title="Lawn, campfire and garden"
            body="An open lawn for ceremonies and games, a campfire setting for the evening, and landscaped garden through the property."
            image={images.lawn}
            imageAlt="Open lawn area with garden"
          />
          <SplitBlock
            eyebrow="Celebration"
            title="An indoor hall that holds the party"
            body="The party hall carries celebrations that need a roof — birthdays, functions, corporate sessions — with generator backup so an evening is never interrupted."
            image={images.hall}
            imageAlt="Indoor party hall"
            reverse
          />
          <SplitBlock
            eyebrow="Dining & recreation"
            title="Meals, grills and pool time"
            body="A dining area for shared meals, a dedicated barbecue area for outdoor evenings, and a swimming pool at the centre of the property. Catering is arranged at the time of booking."
            image={images.dining}
            imageAlt="Outdoor dining area"
          />
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SectionHeader
            eyebrow="Everything on site"
            title="Facilities by area"
            intro="Fourteen confirmed facilities across stay, outdoor, celebration, dining, recreation and convenience."
          />
          <div className="mt-14 space-y-12">
            {groups.map((group) => {
              const items = facilities.filter((f) => f.group === group.id);
              if (!items.length) return null;
              return (
                <div key={group.id} className="grid gap-6 md:grid-cols-[16rem_1fr]">
                  <div>
                    <h3 className="display-lg">{group.label}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{group.blurb}</p>
                  </div>
                  <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {items.map((f) => (
                      <li key={f.slug} className="border-t border-border pt-4">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
                          {f.name}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {f.summary}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-14 flex flex-wrap gap-4">
            <ActionLink to="/facilities">Explore facilities</ActionLink>
            <ActionLink to="/explore" variant="outline">
              Explore in 3D
            </ActionLink>
          </div>
        </div>
      </section>

      <CtaBand
        title="Take the whole place for a weekend."
        body="Check availability for your dates and group."
        whatsappMessage={whatsappMessages.stay}
        context="farmstay_cta"
      />
    </>
  );
}
