import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Temporary wordmark. The business has not supplied a logo yet — swap the
 * inner markup here (or drop in an <img>) when the final identity arrives.
 * No component renders the brand name directly.
 */
export function Logo({
  className,
  inverted = false,
}: {
  className?: string | undefined;
  inverted?: boolean | undefined;
}) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          inverted
            ? "border-primary-foreground/40 text-primary-foreground"
            : "border-primary/30 text-primary",
        )}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
          <path d="M3 11.5 12 4l9 7.5" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12 20c3-1.6 4.5-4 4.5-7.2C14.2 13.4 12 15.6 12 20Z" strokeWidth="1.2" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[1.05rem] tracking-[0.18em]",
            inverted ? "text-primary-foreground" : "text-foreground",
          )}
        >
          SHRI GRAND
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[0.56rem] font-semibold tracking-[0.34em]",
            inverted ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          FARM STAY
        </span>
      </span>
    </Link>
  );
}
