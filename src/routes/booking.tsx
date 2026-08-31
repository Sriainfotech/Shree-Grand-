import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { site, whatsappMessages, PRICE_ON_REQUEST } from "@/config/site";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";
import { WhatsAppButton, ActionLink } from "@/components/ui/actions";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: pageMeta({
      title: "Book Your Stay — Shri Grand Farm Stay, Mancherial",
      description:
        "How booking works at Shri Grand Farm Stay, Vempally, Mancherial, Telangana — 50% advance, online or offline payment, 12:00 PM check-in.",
      path: "/booking",
    }),
    links: canonical("/booking"),
  }),
  component: BookingPage,
});

const steps = [
  {
    title: "Enquire",
    body: "Share your dates, group size and occasion on WhatsApp or by phone. There is no online availability calendar yet — every date is confirmed by the property directly.",
  },
  {
    title: "Confirm the plan",
    body: "We confirm the spaces, rooms and any catering or event needs for your dates, and let you know what is available.",
  },
  {
    title: "Pay the advance",
    body: `A ${site.booking.advancePercentage}% advance confirms your booking. Payment can be made online or offline — the mode is arranged directly with the property.`,
  },
  {
    title: "Check in and celebrate",
    body: `Check-in is at ${site.booking.checkIn} and check-out is at ${site.booking.checkOut}. The remaining balance is settled as agreed at the time of booking.`,
  },
];

const facts = [
  { label: "Advance payment", value: `${site.booking.advancePercentage}%` },
  { label: "Payment methods", value: site.booking.paymentMethods.join(" & ") },
  { label: "Check-in", value: site.booking.checkIn },
  { label: "Check-out", value: site.booking.checkOut },
  { label: "Guests", value: site.booking.maxGuests },
  { label: "Pricing", value: PRICE_ON_REQUEST },
];

function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="BOOK YOUR STAY OR EVENT"
        intro="No online payment gateway yet — every booking is confirmed directly with the property over WhatsApp or phone."
        image={images.room}
        imageAlt="Room prepared for a guest stay"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Booking", to: "/booking" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-card p-7">
                <p className="eyebrow">{fact.label}</p>
                <p className="display-lg mt-3">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell">
          <SectionHeader
            eyebrow="How it works"
            title="Four steps to confirm your date"
            intro="Booking today is a conversation, not a form. Here is exactly how it works."
          />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="border-t border-border pt-6">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                  Step {i + 1}
                </span>
                <h3 className="display-lg mt-3">{step.title}</h3>
                <p className="mt-4 text-[0.92rem] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="No online payment yet"
            title="Booking is confirmed with us directly"
            intro="Shri Grand Farm Stay does not have an online payment gateway or booking calendar on the website yet. Every date, room and package is checked and confirmed by the property before an advance is collected."
          />
          <InfoNote className="mt-8 max-w-3xl">
            The cancellation policy for your booking is confirmed at the time of booking. See our{" "}
            <a href="/cancellation-policy" className="border-b border-accent">
              cancellation policy
            </a>{" "}
            for the property's general terms.
          </InfoNote>
          <div className="mt-10 flex flex-wrap gap-4">
            <WhatsAppButton
              label="Start your booking on WhatsApp"
              variant="solid"
              message={whatsappMessages.booking}
              context="booking_start"
            />
            <ActionLink to="/contact" variant="outline">
              Contact us instead
            </ActionLink>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to lock in your dates?"
        body="Message us your dates, group size and occasion — we will confirm availability and the next steps."
        whatsappMessage={whatsappMessages.booking}
        context="booking_cta"
      />
    </>
  );
}
