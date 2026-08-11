import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { rooms, roomsPlaceholder, stayFacts } from "@/data/rooms";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, EmptyState, Figure, InfoNote } from "@/components/ui/section";
import { ActionLink, WhatsAppButton } from "@/components/ui/actions";
import { whatsappMessages, PRICE_ON_REQUEST } from "@/config/site";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: pageMeta({
      title: "Rooms & Stay — Shri Grand Farm Stay",
      description:
        "Stay a little longer. Air-conditioned rooms at Shri Grand Farm Stay, Vempally, Mancherial. Check-in 12:00 PM, check-out 10:00 AM.",
      path: "/rooms",
    }),
    links: canonical("/rooms"),
  }),
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <>
      <PageHero
        eyebrow="Rooms & stay"
        title="STAY A LITTLE LONGER"
        intro="Air-conditioned rooms on a private property, a short drive from Mancherial."
        image={images.room}
        imageAlt="Bedroom at a countryside farm stay"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Rooms", to: "/rooms" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <div className="grid gap-4 border border-border sm:grid-cols-2 lg:grid-cols-4">
            {stayFacts.map((fact) => (
              <div key={fact.label} className="border-border p-7 sm:border-r last:border-r-0">
                <p className="eyebrow">{fact.label}</p>
                <p className="display-lg mt-3">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[clamp(4rem,9vw,8.5rem)]">
        <div className="shell">
          <SectionHeader
            eyebrow="Accommodation"
            title="Our rooms"
            intro="Each room listing carries its own images, amenities, occupancy and tariff once the property confirms them."
          />

          <div className="mt-12">
            {rooms.length === 0 ? (
              <EmptyState
                title={roomsPlaceholder.title}
                body={roomsPlaceholder.body}
                action={
                  <>
                    <ActionLink to="/booking">Request availability</ActionLink>
                    <WhatsAppButton message={whatsappMessages.rooms} context="rooms" />
                  </>
                }
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <article key={room.id} className="border border-border bg-card">
                    <Figure
                      src={images[room.images[0] ?? "room"]}
                      alt={room.name}
                      ratio="4/3"
                    />
                    <div className="p-7">
                      <h3 className="display-lg">{room.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {room.description}
                      </p>
                      <p className="mt-5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {room.occupancy ?? "Occupancy on request"}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {room.amenities.map((a) => (
                          <li
                            key={a}
                            className="border border-border px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground"
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7 flex items-center justify-between gap-4">
                        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
                          {room.priceLabel || PRICE_ON_REQUEST}
                        </span>
                        <ActionLink to="/booking">Book now</ActionLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <InfoNote className="mt-12 max-w-3xl">
            Tariffs are not published yet. A 50% advance confirms a booking, and
            payment can be made online or offline. The cancellation policy is
            confirmed at the time of booking.
          </InfoNote>
        </div>
      </section>

      <CtaBand
        title="Tell us your dates."
        body="We will confirm the rooms available for your group."
        whatsappMessage={whatsappMessages.rooms}
        context="rooms_cta"
      />
    </>
  );
}
