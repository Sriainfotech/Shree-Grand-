import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone, Instagram } from "lucide-react";
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
import { submitInquiry } from "@/lib/bookingApi";
import { ApiRequestError } from "@/config/api";

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

function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await submitInquiry({
        name,
        phone,
        email: email.trim() || undefined,
        occasion: occasion.trim() || undefined,
        message: message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setFormError(error.message);
        if (error.fieldErrors?.length) {
          const next: Record<string, string> = {};
          for (const fe of error.fieldErrors) next[fe.field] = fe.message;
          setFieldErrors(next);
        }
      } else {
        setFormError("Something went wrong. Please try again or reach us on WhatsApp.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h3 className="display-lg mt-4">Thank you for contacting us.</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          We've received your message and will reach out to you shortly on <strong>{phone}</strong>
          {email ? (
            <>
              {" "}
              — a confirmation has also been sent to <strong>{email}</strong>
            </>
          ) : null}
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setName("");
            setPhone("");
            setEmail("");
            setOccasion("");
            setMessage("");
          }}
          className="mt-6 border-b border-accent pb-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
        >
          Send another message
        </button>
      </div>
    );
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
          {fieldErrors["name"] ? (
            <p className="text-xs text-destructive">{fieldErrors["name"]}</p>
          ) : null}
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
          {fieldErrors["phone"] ? (
            <p className="text-xs text-destructive">{fieldErrors["phone"]}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email (optional)</Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {fieldErrors["email"] ? (
          <p className="text-xs text-destructive">{fieldErrors["email"]}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Share this if you'd like an emailed confirmation as well.
        </p>
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

      {formError ? (
        <p className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-primary px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send enquiry"}
      </button>
      <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
        We'll reach out on the phone number you share, usually within a few hours. Prefer WhatsApp
        or email instead? Use the links alongside this form, or write to{" "}
        <a href={mailHref} className="border-b border-accent">
          {site.contact.email}
        </a>
        .
      </p>
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
              Fill this in and we'll get back to you directly — no account or login needed.
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
