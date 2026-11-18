import { Home, MessagesSquare, Percent, ShieldCheck } from "lucide-react";

/**
 * Short assurance row — every line here restates a claim the site already
 * makes elsewhere (index.tsx's "whole property is yours" copy, booking.tsx's
 * "a conversation, not a form", site.booking.advancePercentage, and
 * testimonials.ts's no-fake-reviews line). Nothing new is asserted here.
 */
const items = [
  {
    icon: Home,
    label: "Whole property, privately yours",
    body: "No shared lobbies and no other bookings running alongside yours.",
  },
  {
    icon: MessagesSquare,
    label: "Planned in conversation, not a form",
    body: "Every stay and event is confirmed by talking through your dates and needs.",
  },
  {
    icon: Percent,
    label: "50% advance to confirm",
    body: "Payable online or offline — the rest is settled once your booking is finalised.",
  },
  {
    icon: ShieldCheck,
    label: "We never publish a review we didn't receive",
    body: "Guest stories on this site are real, or the section says so plainly.",
  },
];

export function TrustStrip() {
  return (
    // A compact strip, not a full section — deliberately less padding than
    // section-y so it reads as a divider between Packages and the FAQ,
    // rather than a section of its own with its own big gaps on both sides.
    <section className="pb-12 sm:pb-16">
      <div className="shell">
        <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <item.icon className="h-5 w-5 text-accent" aria-hidden />
              <h3 className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary">
                {item.label}
              </h3>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
