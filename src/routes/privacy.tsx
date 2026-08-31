import { createFileRoute } from "@tanstack/react-router";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { site, mailHref } from "@/config/site";
import { PageHero, CtaBand } from "@/components/ui/page";
import { InfoNote } from "@/components/ui/section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta({
      title: "Privacy Policy — Shri Grand Farm Stay, Mancherial",
      description:
        "How Shri Grand Farm Stay, Vempally, Mancherial, Telangana collects and uses information from enquiries, bookings and WhatsApp messages.",
      path: "/privacy",
    }),
    links: canonical("/privacy"),
  }),
  component: PrivacyPage,
});

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Introduction",
    body: (
      <p>
        This Privacy Policy explains how {site.name} ("we", "us", "our") collects, uses and protects
        information you share with us through this website, our contact and enquiry forms, WhatsApp,
        phone and email, and our Instagram page. By using this website or contacting us through it,
        you agree to the practices described here.
      </p>
    ),
  },
  {
    title: "2. Information we collect",
    body: (
      <>
        <p>We collect information you choose to share with us, such as:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            Your name, phone number and email address, when provided through the contact or enquiry
            form, by phone, email or WhatsApp.
          </li>
          <li>
            Details you share about your stay or event — dates, group size, occasion and any special
            requests.
          </li>
          <li>
            Basic technical information collected automatically by the website (such as browser type
            and pages visited) for the purpose of running and improving the site. This website does
            not currently use analytics that are active by default; if analytics are enabled in
            future, this policy will be updated.
          </li>
        </ul>
        <p className="mt-4">
          We do not currently operate an online payment gateway or user accounts on this website, so
          we do not collect or store payment card details or login credentials through the site.
        </p>
      </>
    ),
  },
  {
    title: "3. How we use your information",
    body: (
      <>
        <p>We use the information you share with us only to:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Respond to your enquiry and confirm availability for stays and events.</li>
          <li>Process and manage your booking, including advance payment arrangements.</li>
          <li>
            Communicate with you about your booking, before and after your visit, by phone, WhatsApp
            or email.
          </li>
          <li>Improve our services and this website.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. How we share your information",
    body: (
      <p>
        We do not sell, rent or trade your personal information to third parties. We may share
        information with vendors or service providers directly involved in fulfilling your booking
        (for example, catering or event partners you have asked us to coordinate with), and only to
        the extent necessary. We may also disclose information if required to do so by law or by a
        competent government authority.
      </p>
    ),
  },
  {
    title: "5. WhatsApp and third-party platforms",
    body: (
      <p>
        When you contact us via WhatsApp, Instagram or a similar third-party platform, that
        platform's own privacy policy also applies to your use of it. We use these channels only to
        communicate with you about your enquiry or booking.
      </p>
    ),
  },
  {
    title: "6. Data retention",
    body: (
      <p>
        We retain enquiry and booking information for as long as reasonably necessary to fulfil your
        booking, respond to related questions, and meet any legal, accounting or record-keeping
        requirements, after which it is deleted or anonymised where practical.
      </p>
    ),
  },
  {
    title: "7. Data security",
    body: (
      <p>
        We take reasonable steps to protect the information you share with us. However, no method of
        transmission over the internet or mobile networks is completely secure, and we cannot
        guarantee absolute security.
      </p>
    ),
  },
  {
    title: "8. Your choices",
    body: (
      <p>
        You may ask us at any time about what information we hold about you, request that it be
        corrected, or ask us to delete it, subject to any booking or legal records we are required
        to keep. Contact us using the details below to make such a request.
      </p>
    ),
  },
  {
    title: "9. Children's privacy",
    body: (
      <p>
        This website and our enquiry channels are intended for use by adults making bookings on
        behalf of themselves, their families or their organisations. We do not knowingly collect
        personal information directly from children.
      </p>
    ),
  },
  {
    title: "10. Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time as our services, or applicable law,
        change. The updated version will be posted on this page.
      </p>
    ),
  },
  {
    title: "11. Contact us",
    body: (
      <p>
        For any questions about this Privacy Policy or how your information is handled, write to us
        at{" "}
        <a href={mailHref} className="border-b border-accent">
          {site.contact.email}
        </a>
        .
      </p>
    ),
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="PRIVACY POLICY"
        intro="How we collect, use and protect the information you share with us."
        image={images.garden}
        imageAlt="Garden at the farm stay property"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Privacy Policy", to: "/privacy" },
        ]}
      />

      <section className="section-y">
        <div className="shell max-w-3xl">
          <InfoNote className="mb-12">
            This policy is general guidance for a small hospitality business with no online payment
            gateway or user accounts, and does not constitute legal advice. The property should have
            this policy reviewed by a qualified professional as the business grows.
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
        title="Questions about your data?"
        body="Reach out and we'll be glad to explain how we handle your information."
        primaryLabel="Contact us"
        primaryTo="/contact"
        context="privacy_cta"
      />
    </>
  );
}
