import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { X, Phone, MessageCircle, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { experienceCategories } from "@/data/experience-categories";
import { site, telHref, whatsappHref, whatsappMessages } from "@/config/site";
import { trackPhone, trackWhatsApp } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const primary = [
  { label: "Home", to: "/" },
  { label: "About the Property", to: "/about" },
  { label: "Facilities", to: "/facilities" },
];

const secondary = [
  { label: "Gallery", to: "/gallery" },
  { label: "Packages", to: "/packages" },
  // Explore 3D and Events left out to match the header nav — see
  // nav-config.tsx. Blog left out for the same reason.
  { label: "Contact", to: "/contact" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Rendered via a portal straight onto <body> (see below) — the header this
  // component is invoked from has `backdrop-blur-sm`, and any ancestor with
  // an active filter/backdrop-filter becomes the containing block for
  // `position: fixed` descendants. Left inline inside <header>, this overlay
  // was confined to the header's own 80px height instead of the viewport,
  // which is why the panel looked broken/see-through with squashed content.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal={open}
        aria-label="Menu"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-6">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="space-y-1">
            {primary.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to as never}
                  tabIndex={open ? 0 : -1}
                  className="block py-2.5 font-display text-2xl text-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-9">Experiences</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {experienceCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/experiences/$slug"
                  params={{ slug: c.slug }}
                  tabIndex={open ? 0 : -1}
                  className="block py-1.5 text-[0.85rem] text-muted-foreground transition-colors hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-9 space-y-1 border-t border-border pt-7">
            {secondary.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to as never}
                  tabIndex={open ? 0 : -1}
                  className="block py-2 font-display text-xl text-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 space-y-4 border-t border-border px-6 py-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
              {site.location.full}
              <span className="block text-muted-foreground/70">{site.location.landmark}</span>
            </p>
          </div>
          <a
            href={telHref}
            tabIndex={open ? 0 : -1}
            onClick={() => trackPhone("mobile_nav")}
            className="flex items-center gap-3 text-[0.95rem] font-medium text-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            {site.contact.phoneDisplay}
          </a>

          <Link
            to="/booking"
            tabIndex={open ? 0 : -1}
            className="flex w-full items-center justify-center rounded-sm bg-primary px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Book Your Stay
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappHref(whatsappMessages.general)}
              target="_blank"
              rel="noreferrer noopener"
              tabIndex={open ? 0 : -1}
              onClick={() => trackWhatsApp("mobile_nav")}
              className="flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
            <a
              href={telHref}
              tabIndex={open ? 0 : -1}
              onClick={() => trackPhone("mobile_nav")}
              className="flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
            >
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
