import { cn } from "@/lib/utils";

/**
 * The brand loading indicator — the logo centered inside a spinning ring,
 * used anywhere the site would otherwise show a bare "Loading..." string
 * or a generic spinner icon.
 */
export function LogoSpinner({
  size = 64,
  className,
}: {
  size?: number;
  className?: string | undefined;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-spin rounded-full border-[3px] border-primary/15 border-t-accent"
      />
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        className="h-[58%] w-[58%] object-contain"
        style={{ animationDuration: "1.6s" }}
      />
    </div>
  );
}

/** Centers the spinner (optionally with a label) to fill its container —
 * drop straight into a full-page or full-section loading state. */
export function FullScreenLoader({
  label,
  className,
}: {
  label?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center gap-4 bg-background",
        className,
      )}
    >
      <LogoSpinner size={72} />
      {label ? (
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      ) : null}
    </div>
  );
}
