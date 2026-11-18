import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { site, mailHref } from "@/config/site";
import { PageHero, CtaBand } from "@/components/ui/page";
import { InfoNote } from "@/components/ui/section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta({
      title: "Terms & Conditions — Shri Grand Farm Stay, Mancherial",
      description:
        "Terms and conditions for using the Shri Grand Farm Stay website and booking a stay or event in Vempally, Mancherial, Telangana.",
      path: "/terms",
    }),
    links: canonical("/terms"),
  }),
  component: TermsPage,
});

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Acceptance of these terms",
    body: (
      <p>
        These Terms &amp; Conditions govern your use of the {site.name} website and any enquiry,
        booking or communication made through it, by phone, WhatsApp or email. By using this website
        or making a booking with us, you agree to these terms.
      </p>
    ),
  },
  {
    title: "2. Use of this website",
    body: (
      <p>
        This website is provided for the purpose of learning about Shri Grand Farm Stay and
        enquiring about or booking a stay or event. You agree not to misuse the website, attempt to
        gain unauthorised access to it, or use it in any way that could damage, disable or impair
        it.
      </p>
    ),
  },
  {
    title: "3. Enquiries and bookings",
    body: (
      <>
        <p>
          This website does not currently offer real-time availability or online payment. All
          bookings are confirmed directly with the property, by phone, WhatsApp or email, subject to
          availability.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            A booking is confirmed only once an advance payment of {site.booking.advancePercentage}%
            of the agreed amount has been received.
          </li>
          <li>
            Payment can be made {site.booking.paymentMethods.join(" or ")}, as agreed with the
            property at the time of booking.
          </li>
          <li>
            Check-in is at {site.booking.checkIn} and check-out is at {site.booking.checkOut},
            unless otherwise agreed in writing.
          </li>
          <li>
            Guest capacity is confirmed based on your specific group and occasion at the time of
            booking.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Cancellations and refunds",
    body: (
      <p>
        Cancellations and refunds are governed by our{" "}
        <a href="/cancellation-policy" className="border-b border-accent">
          Cancellation Policy
        </a>
        , which forms part of these terms. Please review it before confirming a booking.
      </p>
    ),
  },
  {
    title: "5. Pricing and availability",
    body: (
      <p>
        Package inclusions, tariffs and availability are confirmed directly with the property at the
        time of enquiry and are subject to change without prior notice until confirmed in writing
        for your specific dates. Content, pricing indications and package descriptions on this
        website are illustrative and subject to confirmation.
      </p>
    ),
  },
  {
    title: "6. Guest conduct and property rules",
    body: (
      <p>
        Guests are expected to treat the property, its facilities and staff with respect, and to
        comply with any reasonable instructions given by the property regarding safety and use of
        the pool, party hall, lawn and other shared spaces. The property reserves the right to
        refuse or discontinue service to any guest whose conduct endangers others or damages
        property.
      </p>
    ),
  },
  {
    title: "7. Intellectual property",
    body: (
      <p>
        All content on this website — including text, images, layout and the
        {site.name} name and branding — belongs to {site.name} or its licensors and may not be
        copied, reproduced or used without prior written permission, except for personal,
        non-commercial reference.
      </p>
    ),
  },
  {
    title: "8. Third-party links",
    body: (
      <p>
        This website may link to third-party platforms such as WhatsApp, Instagram or map services.
        We are not responsible for the content, accuracy or privacy practices of any third-party
        website or platform, and your use of them is subject to their own terms.
      </p>
    ),
  },
  {
    title: "9. Limitation of liability",
    body: (
      <p>
        While we take reasonable care to keep this website accurate and available, {site.name} makes
        no warranty that the website will be error-free or uninterrupted, and shall not be liable
        for any indirect or consequential loss arising from your use of the website, to the extent
        permitted by applicable law.
      </p>
    ),
  },
  {
    title: "10. Changes to these terms",
    body: (
      <p>
        We may update these Terms &amp; Conditions from time to time. The updated version will be
        posted on this page, and continued use of the website after changes are posted constitutes
        acceptance of the revised terms.
      </p>
    ),
  },
  {
    title: "11. Contact us",
    body: (
      <p>
        For any questions about these Terms &amp; Conditions, write to us at{" "}
        <a href={mailHref} className="border-b border-accent">
          {site.contact.email}
        </a>
        .
      </p>
    ),
  },
];

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="TERMS & CONDITIONS"
        intro="The terms that govern using this website and booking with us."
        image={images.hall}
        imageAlt="Party hall at the farm stay property"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Terms & Conditions", to: "/terms" },
        ]}
      />

      <section className="section-y">
        <div className="shell max-w-3xl">
          <InfoNote className="mb-12">
            This is general guidance appropriate to a small hospitality business and does not
            constitute legal advice. No registration number or legal entity details are stated here
            beyond what is confirmed in our business information.
          </InfoNote>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.title} className="border-t border-border pt-8">
                <h2 className="display-lg">{section.title}</h2>
                <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {section.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Questions before you book?"
        body="We're happy to talk through anything in these terms."
        primaryLabel="Contact us"
        primaryTo="/contact"
        context="terms_cta"
      />
    </>
  );
}
