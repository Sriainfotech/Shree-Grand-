import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Brand mark: the same full logo lockup used in the footer (public/logo.png
 * — crest + wordmark baked into one image, genuinely transparent
 * background), just sized down for the header/mobile nav.
 */
export function Logo({
  className,
}: {
  className?: string | undefined;
  inverted?: boolean | undefined;
}) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} — home`}
      className={cn("inline-flex items-center", className)}
    >
      <img
        src="/logo.png"
        alt={`${site.name} — ${site.tagline}`}
        width={216}
        height={144}
        className="h-16 w-auto object-contain"
      />
    </Link>
  );
}
