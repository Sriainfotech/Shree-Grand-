import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, RotateCcw } from "lucide-react";
import { ArchViz } from "./ArchViz";
import { HotspotMarker } from "./Hotspot";
import { hotspots } from "./hotspots";
import { facilities } from "@/data/facilities";
import { cn } from "@/lib/utils";

/**
 * PropertyScene — the container for the interactive property experience.
 *
 * PHASE 1: renders the architectural placeholder (<ArchViz />) with the full
 * hotspot / day-night / selection UI already wired up.
 *
 * LATER: replace the <ArchViz /> block with a React Three Fiber <Canvas>
 * mounting <PropertyModel /> (GLB/GLTF), <CameraController />,
 * <EnvironmentRig /> and projecting <HotspotMarker /> from `vector3`.
 * The surrounding UI, state and data contracts stay unchanged.
 */
export function PropertyScene() {
  const [active, setActive] = useState<string | null>(null);
  const [night, setNight] = useState(false);

  const hotspot = hotspots.find((h) => h.id === active) ?? null;
  const facility = hotspot
    ? facilities.find((f) => f.slug === hotspot.facilitySlug)
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <div
          className={cn(
            "relative transition-[filter] duration-700",
            night ? "brightness-[0.72] saturate-[0.85]" : "",
          )}
        >
          <ArchViz label="" />
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute inset-0">
              {hotspots.map((h) => (
                <HotspotMarker
                  key={h.id}
                  hotspot={h}
                  active={active === h.id}
                  onSelect={(id) => setActive(id === active ? null : id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setNight((v) => !v)}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
          >
            {night ? (
              <Sun className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Moon className="h-3.5 w-3.5" aria-hidden />
            )}
            {night ? "Day view" : "Night view"}
          </button>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset view
          </button>
          <p className="text-[0.68rem] tracking-wide text-muted-foreground">
            Architectural placeholder — not a render of the actual property.
          </p>
        </div>
      </div>

      <aside className="border border-border bg-card p-8">
        <p className="eyebrow">Hotspots</p>
        {facility ? (
          <>
            <h3 className="display-lg mt-4">{facility.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {facility.description}
            </p>
            <Link
              to="/facilities"
              className="mt-8 inline-block border-b border-accent pb-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em]"
            >
              View facility
            </Link>
          </>
        ) : (
          <>
            <h3 className="display-lg mt-4">Select a space</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Tap any marker on the scene to read about that part of the
              property.
            </p>
          </>
        )}

        <ul className="mt-8 grid grid-cols-2 gap-2">
          {hotspots.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => setActive(h.id === active ? null : h.id)}
                className={cn(
                  "w-full border px-3 py-2 text-left text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                  active === h.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {h.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
