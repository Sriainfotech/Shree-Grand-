import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { footerLinks, legalLinks } from "./nav-config";
import { mailHref, site, telHref, whatsappHref, whatsappMessages } from "@/config/site";
import { trackPhone, trackWhatsApp } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-forest-deep text-primary-foreground">
      <div className="shell grid gap-14 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:py-20">
        <div>
          <Link to="/" aria-label={`${site.name} — home`} className="inline-block">
            <img
              src="/logo.png"
              alt={`${site.name} crest`}
              width={280}
              height={187}
              className="h-auto w-48 max-w-full"
            />
          </Link>
          <p className="mt-6 font-display text-2xl leading-snug text-primary-foreground/90">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            A premium destination for stays, celebrations, gatherings and unforgettable moments.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow text-primary-foreground/60">Explore</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {footerLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to as never}
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-primary-foreground/60">Get in touch</p>
          <ul className="mt-6 space-y-4 text-sm text-primary-foreground/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>
                {site.location.village}, {site.location.city},<br />
                {site.location.state}
                <span className="mt-1 block text-primary-foreground/60">
                  {site.location.landmark}
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a
                href={telHref}
                onClick={() => trackPhone("footer")}
                className="transition-colors hover:text-accent"
              >
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a href={mailHref} className="break-all transition-colors hover:text-accent">
                {site.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a
                href={site.social.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-accent"
              >
                @{site.social.instagram}
              </a>
            </li>
          </ul>

          <div className="mt-7 flex items-center gap-3">
            <a
              href={site.social.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Follow us on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/40 transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              <Instagram className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={whatsappHref(whatsappMessages.general)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Chat with us on WhatsApp"
              onClick={() => trackWhatsApp("footer")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/40 transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={telHref}
              aria-label="Call us"
              onClick={() => trackPhone("footer_icon")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/40 transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="shell flex flex-col gap-4 py-6 text-[0.72rem] text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-5">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to as never} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
