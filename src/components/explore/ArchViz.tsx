import { cn } from "@/lib/utils";

/**
 * ArchViz — an architectural visualisation PLACEHOLDER.
 *
 * This is a stylised, generic massing diagram. It is NOT a render of the
 * actual Shri Grand Farm Stay building. It exists so the layout, framing and
 * controls of the future 3D experience can be designed now; when a real
 * GLB/GLTF model is supplied it is replaced by <PropertyScene />.
 *
 * The `night` prop drives a real lighting swap (sky/ground tone, sun vs.
 * moon + stars, lit window glow) rather than a blanket CSS brightness filter
 * — filtering an already-dark "day" palette left the night toggle looking
 * like a no-op.
 */
export function ArchViz({
  className,
  label = "Architectural placeholder — not the actual property",
  night = false,
}: {
  className?: string | undefined;
  label?: string | undefined;
  night?: boolean | undefined;
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
          aria-label={`Stylised architectural massing diagram of a countryside property, ${night ? "night" : "day"} lighting`}
          className="h-full w-full transition-colors duration-700"
        >
          <defs>
            <linearGradient id="sgSky" x1="0" y1="0" x2="0" y2="1">
              {night ? (
                <>
                  <stop offset="0%" stopColor="oklch(0.24 0.03 255)" />
                  <stop offset="100%" stopColor="oklch(0.16 0.02 255)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="oklch(0.86 0.045 82)" />
                  <stop offset="100%" stopColor="oklch(0.74 0.06 70)" />
                </>
              )}
            </linearGradient>
            <linearGradient id="sgGround" x1="0" y1="0" x2="0" y2="1">
              {night ? (
                <>
                  <stop offset="0%" stopColor="oklch(0.22 0.03 200)" />
                  <stop offset="100%" stopColor="oklch(0.14 0.02 200)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="oklch(0.52 0.07 152)" />
                  <stop offset="100%" stopColor="oklch(0.38 0.06 152)" />
                </>
              )}
            </linearGradient>
          </defs>

          <rect width="800" height="600" fill="url(#sgSky)" />

          {night ? (
            <>
              {/* moon */}
              <circle cx="640" cy="110" r="34" fill="oklch(0.95 0.02 90 / 0.9)" />
              {/* stars */}
              <g fill="oklch(0.98 0.01 90 / 0.8)">
                {[
                  [90, 70],
                  [180, 130],
                  [260, 60],
                  [400, 90],
                  [480, 50],
                  [560, 150],
                  [720, 60],
                  [760, 160],
                  [40, 160],
                  [340, 40],
                ].map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
                ))}
              </g>
            </>
          ) : (
            // sun
            <circle cx="640" cy="120" r="52" fill="oklch(0.9 0.12 84 / 0.9)" />
          )}

          {/* ground plane */}
          <path d="M0 430 L800 380 L800 600 L0 600 Z" fill="url(#sgGround)" />

          {/* grid */}
          <g
            stroke={night ? "oklch(0.7 0.05 220 / 0.18)" : "oklch(0.3 0.05 152 / 0.22)"}
            strokeWidth="1"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={430 + i * 19} x2="800" y2={380 + i * 24} />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 66} y1={430 - i * 6} x2={i * 66} y2="600" />
            ))}
          </g>

          {/* massing volumes */}
          <g
            fill={night ? "oklch(0.3 0.03 255 / 0.35)" : "oklch(0.95 0.012 84 / 0.5)"}
            stroke={night ? "oklch(0.88 0.045 84 / 0.6)" : "oklch(0.3 0.04 152 / 0.85)"}
            strokeWidth="1.4"
          >
            <path d="M150 430 L150 300 L330 268 L330 398 Z" />
            <path d="M330 268 L330 398 L470 372 L470 250 Z" />
            <path d="M150 300 L330 268 L470 250 L300 236 Z" />
            <path d="M500 380 L500 316 L620 300 L620 362 Z" />
            <path d="M500 316 L620 300 L570 288 L470 302 Z" />
          </g>

          {night ? (
            // lit windows — the classic architectural-viz "night mode" tell
            <g fill="oklch(0.85 0.13 82 / 0.85)">
              <rect x="185" y="340" width="14" height="18" />
              <rect x="215" y="340" width="14" height="18" />
              <rect x="245" y="340" width="14" height="18" />
              <rect x="360" y="310" width="14" height="18" />
              <rect x="390" y="310" width="14" height="18" />
              <rect x="530" y="340" width="12" height="16" />
              <rect x="560" y="340" width="12" height="16" />
            </g>
          ) : null}

          {/* pool */}
          <path
            d="M120 500 L300 470 L400 490 L210 524 Z"
            fill={night ? "oklch(0.55 0.09 220 / 0.4)" : "oklch(0.68 0.09 195 / 0.55)"}
            stroke={night ? "oklch(0.88 0.045 84 / 0.5)" : "oklch(0.3 0.04 152 / 0.6)"}
          />

          {/* trees */}
          <g fill={night ? "oklch(0.3 0.04 220 / 0.7)" : "oklch(0.32 0.07 152 / 0.85)"}>
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
