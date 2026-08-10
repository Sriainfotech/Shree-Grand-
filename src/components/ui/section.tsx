import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE_NOTE } from "@/data/images";

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
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow className={cn(align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading className="display-xl mt-5 text-balance">{title}</Heading>
      {intro ? (
        <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
          {intro}
        </p>
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
  return (
    <figure className={cn("overflow-hidden bg-secondary", className)} style={{ aspectRatio: ratio }}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover img-zoom", imgClassName)}
      />
      {caption ? (
        <figcaption className="sr-only">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** Honest note used anywhere placeholder visuals appear. */
export function PlaceholderNote({ className }: { className?: string | undefined }) {
  return (
    <p className={cn("text-[0.7rem] tracking-wide text-muted-foreground", className)}>
      {PLACEHOLDER_IMAGE_NOTE}
    </p>
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
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
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
