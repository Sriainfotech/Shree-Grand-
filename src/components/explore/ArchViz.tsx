import { cn } from "@/lib/utils";

/**
 * ArchViz — an architectural visualisation PLACEHOLDER.
 *
 * This is a stylised, generic massing diagram. It is NOT a render of the
 * actual Shri Grand Farm Stay building. It exists so the layout, framing and
 * controls of the future 3D experience can be designed now; when a real
 * GLB/GLTF model is supplied it is replaced by <PropertyScene />.
 */
export function ArchViz({
  className,
  label = "Architectural placeholder — not the actual property",
}: {
  className?: string | undefined;
  label?: string | undefined;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="relative overflow-hidden border border-border bg-ink"
        style={{ aspectRatio: "4/3" }}
      >
        <svg
          viewBox="0 0 800 600"
          role="img"
          aria-label="Stylised architectural massing diagram of a countryside property"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="sgSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.32 0.03 150)" />
              <stop offset="100%" stopColor="oklch(0.22 0.02 150)" />
            </linearGradient>
            <linearGradient id="sgGround" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.30 0.05 152)" />
              <stop offset="100%" stopColor="oklch(0.20 0.035 152)" />
            </linearGradient>
          </defs>

          <rect width="800" height="600" fill="url(#sgSky)" />
          <circle cx="640" cy="120" r="46" fill="oklch(0.74 0.086 82 / 0.35)" />

          {/* ground plane */}
          <path d="M0 430 L800 380 L800 600 L0 600 Z" fill="url(#sgGround)" />

          {/* grid */}
          <g stroke="oklch(0.74 0.086 82 / 0.16)" strokeWidth="1">
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={430 + i * 19}
                x2="800"
                y2={380 + i * 24}
              />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 66}
                y1={430 - i * 6}
                x2={i * 66}
                y2="600"
              />
            ))}
          </g>

          {/* massing volumes */}
          <g
            fill="oklch(0.95 0.012 84 / 0.06)"
            stroke="oklch(0.88 0.045 84 / 0.75)"
            strokeWidth="1.4"
          >
            <path d="M150 430 L150 300 L330 268 L330 398 Z" />
            <path d="M330 268 L330 398 L470 372 L470 250 Z" />
            <path d="M150 300 L330 268 L470 250 L300 236 Z" />
            <path d="M500 380 L500 316 L620 300 L620 362 Z" />
            <path d="M500 316 L620 300 L570 288 L470 302 Z" />
          </g>

          {/* pool */}
          <path
            d="M120 500 L300 470 L400 490 L210 524 Z"
            fill="oklch(0.74 0.086 200 / 0.25)"
            stroke="oklch(0.88 0.045 84 / 0.5)"
          />

          {/* trees */}
          <g fill="oklch(0.88 0.045 84 / 0.5)">
            {[
              [90, 420],
              [700, 400],
              [650, 470],
              [60, 470],
              [740, 350],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="12" />
            ))}
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-ink/60 px-5 py-3 text-[0.6rem] uppercase tracking-[0.22em] text-primary-foreground/70 backdrop-blur-sm">
          <span>Concept massing</span>
          <span>3D walkthrough coming soon</span>
        </div>
      </div>
      <p className="mt-3 text-[0.7rem] tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
