import { images } from "@/data/images";
import { site, whatsappMessages } from "@/config/site";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";
import { WhatsAppButton, ActionLink } from "@/components/ui/actions";
import { BookingForm } from "@/components/booking/BookingForm";
import { PropertyDetails } from "@/components/booking/PropertyDetails";

const steps = [
  {
    title: "Pick your dates",
    body: "Choose your check-in date, how many days you want (or a half-day slot for a day visit) on the form below — we check live availability right there before you submit.",
  },
  {
    title: "Confirm the plan",
    body: "Once your slot is confirmed as available, we submit your request — no more waiting on a manual check for the essentials.",
  },
  {
    title: "Pay the advance or in full",
    body: `Pay a ${site.booking.advancePercentage}% advance or the full amount online right after your booking is confirmed. Prefer offline? That's arranged directly with the property.`,
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
];

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="BOOK YOUR STAY OR EVENT"
        intro="Request your slot below — no account or login needed. We confirm availability and the advance details directly with you."
        image={images.room}
        imageAlt="Room prepared for a guest stay"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Booking", to: "/booking" },
        ]}
      />

      <section className="section-y">
        <div className="shell">
          <SectionHeader
            eyebrow="What you're booking"
            title="The whole property, for your dates"
            intro="A booking is always for the entire farm stay — never a particular room or space within it. Here's what's included."
          />
          <div className="mt-10">
            <PropertyDetails />
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Request a booking"
              title="Tell us your dates"
              intro="We check availability and get back to you on the phone number you share — usually within a few hours."
            />
            <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-card p-6">
                  <p className="eyebrow">{fact.label}</p>
                  <p className="display-lg mt-2 text-2xl">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
          <BookingForm />
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
            eyebrow="Prefer to talk first?"
            title="WhatsApp or a phone call works too"
            intro="The form above isn't the only way to book. Either way, every date and package is checked and confirmed by the property directly before an advance is collected."
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
              label="Chat on WhatsApp instead"
              variant="outline"
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
