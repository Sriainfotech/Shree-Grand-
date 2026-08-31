import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { site, mailHref } from "@/config/site";
import { PageHero, CtaBand } from "@/components/ui/page";
import { InfoNote } from "@/components/ui/section";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({
    meta: pageMeta({
      title: "Cancellation Policy — Shri Grand Farm Stay, Mancherial",
      description:
        "Cancellation and refund policy for stays and events at Shri Grand Farm Stay, Vempally, Mancherial, Telangana.",
      path: "/cancellation-policy",
    }),
    links: canonical("/cancellation-policy"),
  }),
  component: CancellationPolicyPage,
});

const tiers = [
  {
    window: "15 or more days before check-in",
    refund: "Full refund of the advance paid, minus a token administration fee",
  },
  {
    window: "7 to 14 days before check-in",
    refund: "50% of the advance paid is refunded",
  },
  {
    window: "3 to 6 days before check-in",
    refund: "25% of the advance paid is refunded",
  },
  {
    window: "Within 48–72 hours of check-in, or no-show",
    refund: "No refund of the advance paid",
  },
];

function CancellationPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="CANCELLATION POLICY"
        intro="A clear, fair policy for cancelling or rescheduling a stay or event."
        image={images.lawn}
        imageAlt="Lawn area at the farm stay property"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Cancellation Policy", to: "/cancellation-policy" },
        ]}
      />

      <section className="section-y">
        <div className="shell max-w-3xl">
          <InfoNote className="mb-12">
            This policy is our suggested cancellation and refund structure, built around the{" "}
            {site.booking.advancePercentage}% advance required to confirm a booking. It is pending
            final confirmation by the property and may be adjusted before publication; the specific
            terms for your booking are always confirmed in writing at the time of booking.
          </InfoNote>

          <div className="space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            <p>
              A booking at {site.name} is confirmed once a {site.booking.advancePercentage}% advance
              payment is received, paid {site.booking.paymentMethods.join(" or ")}. If you need to
              cancel or reschedule, the following refund structure applies to that advance, based on
              how far in advance of your check-in date you notify us.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto border border-border">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/60">
                  <th className="px-6 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Cancellation window
                  </th>
                  <th className="px-6 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Refund of advance
                  </th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr key={tier.window} className="border-b border-border last:border-b-0">
                    <td className="px-6 py-5 align-top font-medium text-foreground">
                      {tier.window}
                    </td>
                    <td className="px-6 py-5 align-top text-muted-foreground">{tier.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 space-y-8">
            <div className="border-t border-border pt-8">
              <h2 className="display-lg">Rescheduling</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                If you would prefer to move your booking to a new date rather than cancel, let us
                know as early as possible. Where the new date is available, we will make reasonable
                efforts to transfer your advance to the new date instead of applying the
                cancellation refund structure above, subject to availability.
              </p>
            </div>
            <div className="border-t border-border pt-8">
              <h2 className="display-lg">How to cancel</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                Cancellations must be requested in writing, by WhatsApp, email or phone confirmed in
                writing, quoting the name and dates used for your booking. The cancellation is
                effective from the date we receive your request, not the date of your original
                enquiry.
              </p>
            </div>
            <div className="border-t border-border pt-8">
              <h2 className="display-lg">Refund timelines</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                Where a refund is due, it will be processed back to the original payment method (for
                online payments) or as agreed with you (for offline payments) within a reasonable
                time after your cancellation is confirmed.
              </p>
            </div>
            <div className="border-t border-border pt-8">
              <h2 className="display-lg">Events outside our control</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                If a stay or event cannot go ahead due to circumstances outside either party's
                reasonable control, we will work with you in good faith on a rescheduled date or an
                appropriate refund of the advance paid.
              </p>
            </div>
          </div>

          <p className="mt-12 text-[0.95rem] leading-relaxed text-muted-foreground">
            For any cancellation request or a question about this policy, write to us at{" "}
            <a href={mailHref} className="border-b border-accent">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      </section>

      <CtaBand
        title="Planning ahead helps everyone."
        body="Let us know your dates early, and we'll do everything possible to keep them flexible for you."
        primaryLabel="Contact us"
        primaryTo="/contact"
        context="cancellation_cta"
      />
    </>
  );
}
