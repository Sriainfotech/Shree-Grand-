import { useEffect, useRef, useState } from "react";
import { images } from "@/data/images";
import { SectionHeader, PlaceholderNote } from "@/components/ui/section";
import { ActionLink } from "@/components/ui/actions";
import { cn } from "@/lib/utils";

const spaces = [
  { key: "pool", label: "Pool", src: images.pool },
  { key: "lawn", label: "Lawn", src: images.lawn },
  { key: "rooms", label: "Rooms", src: images.room },
  { key: "hall", label: "Party Hall", src: images.hall },
  { key: "garden", label: "Garden", src: images.garden },
] as const;

/** Sticky scroll-linked property strip: one large image pinned on one side
 * swaps as the visitor scrolls past the list of space names on the other. */
export function PropertyStripScroll() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset["index"]);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      // A thin horizontal band through the vertical middle of the viewport —
      // whichever list item crosses it becomes the active space.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-y bg-secondary/50">
      <div className="shell">
        <SectionHeader
          eyebrow="The property"
          title="Explore the farmstay"
          intro="Pool, lawn, rooms, party hall and garden — spaces that work as easily for a quiet weekend as for a full celebration."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden lg:sticky lg:top-28 lg:aspect-auto lg:h-[34rem]">
            {spaces.map((s, i) => (
              <img
                key={s.key}
                src={s.src}
                alt={`${s.label} at a countryside farm stay`}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>

          <ul className="flex flex-col justify-between gap-16 py-2 lg:gap-0">
            {spaces.map((s, i) => (
              <li
                key={s.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-index={i}
                className="lg:flex lg:min-h-[6.8rem] lg:items-center"
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "group w-full border-t pt-6 text-left transition-colors lg:pt-0 lg:border-t-0 lg:border-l lg:pl-8",
                    i === active
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-primary",
                  )}
                >
                  <span className="text-[0.66rem] tracking-[0.22em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-xl mt-3 transition-colors">{s.label}</h3>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <ActionLink to="/about">Explore the property</ActionLink>
          <PlaceholderNote />
        </div>
      </div>
    </section>
  );
}
