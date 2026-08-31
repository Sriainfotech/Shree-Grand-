import { Link } from "@tanstack/react-router";
import { Eyebrow, Figure } from "@/components/ui/section";
import { WhatsAppButton, ActionLink } from "@/components/ui/actions";
import { whatsappMessages } from "@/config/site";
import { breadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Standard inner-page hero: image band + editorial title block. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  intro?: string | undefined;
  image: string;
  imageAlt: string;
  breadcrumbs?: { label: string; to: string }[] | undefined;
}) {
  return (
    <section className="relative isolate flex h-[62dvh] min-h-[32rem] items-end overflow-hidden bg-ink pt-20">
      <img
        src={image}
        alt={imageAlt}
        width={1920}
        height={1088}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
      />
      <div aria-hidden className="absolute inset-0 -z-10 overlay-scrim" />
      <div className="shell pb-14 pt-28 text-primary-foreground">
        {breadcrumbs?.length ? (
          <>
            <script
              type="application/ld+json"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(
                  breadcrumbSchema(
                    breadcrumbs.map((b) => ({ name: b.label, path: b.to })),
                  ),
                ),
              }}
            />
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-primary-foreground/70">
                {breadcrumbs.map((b, i) => (
                  <li key={b.to} className="flex items-center gap-2">
                    {i > 0 ? <span aria-hidden>/</span> : null}
                    <Link to={b.to as never} className="hover:text-accent">
                      {b.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </>
        ) : null}
        <Eyebrow className="text-primary-foreground/70">{eyebrow}</Eyebrow>
        <h1 className="display-hero mt-6 max-w-4xl text-balance">{title}</h1>
        {intro ? (
          <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-primary-foreground/80">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** Closing conversion band used across pages. */
export function CtaBand({
  title,
  body,
  primaryLabel = "Book your stay",
  primaryTo = "/booking",
  whatsappMessage = whatsappMessages.general,
  context = "cta_band",
  className,
}: {
  title: string;
  body?: string | undefined;
  primaryLabel?: string | undefined;
  primaryTo?: string | undefined;
  whatsappMessage?: string | undefined;
  context?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <section className={cn("section-y bg-forest-deep text-primary-foreground", className)}>
      <div className="shell text-center">
        <h2 className="display-xl mx-auto max-w-3xl text-balance">{title}</h2>
        {body ? (
          <p className="mx-auto mt-6 max-w-xl text-[0.98rem] leading-relaxed text-primary-foreground/75">
            {body}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ActionLink to={primaryTo as never} variant="gold">
            {primaryLabel}
          </ActionLink>
          <WhatsAppButton
            variant="ghostLight"
            message={whatsappMessage}
            context={context}
          />
        </div>
      </div>
    </section>
  );
}

/** Alternating image + text block used on content pages. */
export function SplitBlock({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  reverse = false,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  reverse?: boolean | undefined;
  children?: React.ReactNode | undefined;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Figure
        src={image}
        alt={imageAlt}
        ratio="4/3"
        className={cn(reverse && "md:order-2")}
      />
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="display-lg mt-5 text-balance">{title}</h2>
        <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">{body}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  );
}
