import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";
import { pageMeta, canonical } from "@/lib/seo";
import { images } from "@/data/images";
import { site, telHref, mailHref, whatsappHref, whatsappMessages } from "@/config/site";
import { PageHero, CtaBand } from "@/components/ui/page";
import { SectionHeader, InfoNote } from "@/components/ui/section";
import { ActionAnchor } from "@/components/ui/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trackWhatsApp, trackPhone } from "@/lib/analytics";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title: "Contact Us — Shri Grand Farm Stay, Mancherial",
      description:
        "Get in touch with Shri Grand Farm Stay, Vempally, Mancherial, Telangana — phone, WhatsApp, email, Instagram and an enquiry form.",
      path: "/contact",
    }),
    links: canonical("/contact"),
  }),
  component: ContactPage,
});

function buildEnquiryMessage(fields: {
  name: string;
  phone: string;
  occasion: string;
  message: string;
}) {
  const lines = [
    "Hi, I would like to enquire about Shri Grand Farm Stay.",
    `Name: ${fields.name}`,
    `Phone: ${fields.phone}`,
  ];
  if (fields.occasion) lines.push(`Occasion: ${fields.occasion}`);
  if (fields.message) lines.push(`Message: ${fields.message}`);
  return lines.join("\n");
}

function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    trackWhatsApp("contact_form");
    const text = buildEnquiryMessage({ name, phone, occasion, message });
    window.open(whatsappHref(text), "_blank", "noreferrer noopener");
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-occasion">Occasion</Label>
        <Input
          id="contact-occasion"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="Stay, birthday, wedding, corporate outing..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Dates, group size and anything else we should know"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-primary px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-forest-deep"
      >
        Send enquiry on WhatsApp
      </button>
      <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
        This form opens WhatsApp with your details pre-filled — there is no website booking calendar
        or payment step yet. Prefer email instead? Write to{" "}
        <a href={mailHref} className="border-b border-accent">
          {site.contact.email}
        </a>
        .
      </p>
      {submitted ? (
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-primary">
          WhatsApp opened in a new tab — send the message to reach us.
        </p>
      ) : null}
    </form>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="LET'S PLAN YOUR VISIT"
        intro="Phone, WhatsApp, email or the form below — whichever is easiest for you."
        image={images.garden}
        imageAlt="Garden path at the farm stay"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Contact", to: "/contact" },
        ]}
      />

      <section className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeader
              eyebrow="Get in touch"
              title="Reach us directly"
              intro="We respond fastest on WhatsApp and phone."
            />

            <ul className="mt-10 space-y-6">
              <li className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 text-accent" aria-hidden />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Phone &amp; WhatsApp
                  </p>
                  <a
                    href={telHref}
                    onClick={() => trackPhone("contact_page")}
                    className="mt-1 block text-lg font-medium hover:text-primary"
                  >
                    {site.contact.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 text-accent" aria-hidden />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Email
                  </p>
                  <a href={mailHref} className="mt-1 block text-lg font-medium hover:text-primary">
                    {site.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Instagram className="mt-1 h-5 w-5 text-accent" aria-hidden />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Instagram
                  </p>
                  <a
                    href={site.social.instagramUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1 block text-lg font-medium hover:text-primary"
                  >
                    @{site.social.instagram}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-accent" aria-hidden />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Location
                  </p>
                  <p className="mt-1 text-lg font-medium">{site.location.full}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{site.location.landmark}</p>
                </div>
              </li>
            </ul>

            <InfoNote className="mt-10">
              The exact street address, PIN code and a Google Maps link are not yet published —
              village, city, state and the nearest landmark above are confirmed. Ask us for
              directions when you enquire.
            </InfoNote>

            <div className="mt-8">
              <ActionAnchor
                href={whatsappHref(whatsappMessages.general)}
                variant="solid"
                onClick={() => trackWhatsApp("contact_sidebar")}
              >
                Chat on WhatsApp
              </ActionAnchor>
            </div>
          </div>

          <div className="border border-border bg-card p-8 sm:p-10">
            <h2 className="display-lg">Send an enquiry</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Fill this in and it opens a pre-filled WhatsApp message to us — nothing is stored on
              this website.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Prefer to just call?"
        body="We're happy to talk through dates, group size and occasion over the phone."
        whatsappMessage={whatsappMessages.general}
        context="contact_cta"
      />
    </>
  );
}
