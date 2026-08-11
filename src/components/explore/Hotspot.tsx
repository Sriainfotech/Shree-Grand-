import { cn } from "@/lib/utils";
import type { Hotspot } from "./hotspots";

export function HotspotMarker({
  hotspot,
  active,
  onSelect,
}: {
  hotspot: Hotspot;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(hotspot.id)}
      aria-pressed={active}
      style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300",
          active
            ? "scale-125 border-accent bg-accent"
            : "border-primary-foreground/70 bg-primary-foreground/20 group-hover:border-accent",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
      </span>
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap bg-ink/80 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        {hotspot.label}
      </span>
    </button>
  );
}
