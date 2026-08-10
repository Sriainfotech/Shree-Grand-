import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { site, whatsappHref, whatsappMessages } from "@/config/site";
import { trackWhatsApp } from "@/lib/analytics";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  solid:
    "bg-primary text-primary-foreground hover:bg-forest-deep px-7 py-3.5 rounded-sm",
  gold: "bg-accent text-accent-foreground hover:brightness-105 px-7 py-3.5 rounded-sm",
  outline:
    "border border-current text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-7 py-3.5 rounded-sm",
  ghostLight:
    "border border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary px-7 py-3.5 rounded-sm",
  link: "text-foreground border-b border-accent pb-1 hover:text-primary",
} as const;

export type ActionVariant = keyof typeof variants;

export function ActionLink({
  to,
  children,
  variant = "solid",
  className,
}: {
  to: string;
  children: React.ReactNode;
  variant?: ActionVariant | undefined;
  className?: string | undefined;
}) {
  return (
    <Link to={to} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

export function ActionAnchor({
  href,
  children,
  variant = "outline",
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ActionVariant | undefined;
  className?: string | undefined;
  onClick?: (() => void) | undefined;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </a>
  );
}

export function WhatsAppButton({
  message = whatsappMessages.general,
  label = "Chat on WhatsApp",
  variant = "outline",
  context = "generic",
  className,
}: {
  message?: string | undefined;
  label?: string | undefined;
  variant?: ActionVariant | undefined;
  context?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <ActionAnchor
      href={whatsappHref(message)}
      variant={variant}
      className={className}
      onClick={() => trackWhatsApp(context)}
    >
      {label}
    </ActionAnchor>
  );
}

export const brandPhone = site.contact.phoneDisplay;
