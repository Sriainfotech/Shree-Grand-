import { useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <span aria-hidden className="h-px w-8 bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string | undefined;
  title: string;
  intro?: string | undefined;
  align?: "left" | "center" | undefined;
  className?: string | undefined;
  as?: "h1" | "h2" | "h3" | undefined;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <Eyebrow className={cn(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>
      ) : null}
      <Heading className="display-xl mt-5 text-balance">{title}</Heading>
      {intro ? (
        <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">{intro}</p>
      ) : null}
    </div>
  );
}

/** Consistent image frame; keeps aspect ratio and lazy-loads by default. */
export function Figure({
  src,
  alt,
  ratio = "4/3",
  className,
  imgClassName,
  priority = false,
  caption,
}: {
  src: string;
  alt: string;
  ratio?: string | undefined;
  className?: string | undefined;
  imgClassName?: string | undefined;
  priority?: boolean | undefined;
  caption?: string | undefined;
}) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // A cached image can already be `.complete` by the time the onLoad handler
  // attaches (e.g. after hydration), which would otherwise leave the shimmer
  // stuck on-screen forever — this ref lets the callback check that.
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <figure
      className={cn("relative overflow-hidden bg-secondary", className)}
      style={{ aspectRatio: ratio }}
    >
      {broken ? (
        // Graceful fallback so a broken/missing image source leaves a
        // labelled placeholder instead of blank layout space.
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-secondary/60 px-4 text-center">
          <ImageOff className="h-5 w-5 text-muted-foreground" aria-hidden />
          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            Image unavailable
          </span>
        </div>
      ) : (
        <>
          {/* Shimmer sits behind the image (painted first in the DOM, same
              stacking context) purely as a fallback backdrop — gating the
              image's own opacity on `loaded` used to mean every image on the
              page rendered invisible in the server-rendered HTML until
              client JS hydrated, which is what was tanking Speed Index on
              image-heavy pages (Gallery, Packages, Home). The image is
              visible immediately now; `loaded` only hides the shimmer. */}
          {!loaded ? <div aria-hidden className="img-shimmer absolute inset-0" /> : null}
          <img
            ref={(el) => {
              imgRef.current = el;
              if (el?.complete && el.naturalWidth > 0) setLoaded(true);
            }}
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setBroken(true)}
            className={cn("h-full w-full object-cover img-zoom", imgClassName)}
          />
        </>
      )}
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
    </figure>
  );
}

export function InfoNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <p
      className={cn(
        "border-l-2 border-accent bg-secondary/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode | undefined;
}) {
  return (
    <div className="border border-dashed border-border bg-card px-8 py-16 text-center">
      <h3 className="display-lg">{title}</h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{body}</p>
      {action ? <div className="mt-8 flex justify-center gap-3">{action}</div> : null}
    </div>
  );
}

export function Chip({
  children,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-accent/60 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-accent-foreground/80">
      {children}
    </span>
  );
}
