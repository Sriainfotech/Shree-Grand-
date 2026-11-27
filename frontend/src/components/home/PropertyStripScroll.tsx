import { useEffect, useRef, useState } from "react";
import { images } from "@/data/images";
import { SectionHeader } from "@/components/ui/section";
import { ActionLink } from "@/components/ui/actions";
import { cn } from "@/lib/utils";

const spaces = [
  {
    key: "pool",
    label: "Pool",
    src: images.pool,
    description:
      "A full-sized pool framed by a shaded pergola, open from morning till evening. Good for a slow swim before breakfast or a splash-filled afternoon with the whole family. Loungers and changing space are steps away.",
  },
  {
    key: "lawn",
    label: "Lawn",
    src: images.lawn,
    description:
      "An open stretch of green that doubles as a games lawn, a lounging spot, or overflow seating for a celebration. Big enough for cricket, badminton, or simply laying out a mat under the sky.",
  },
  {
    key: "rooms",
    label: "Rooms",
    src: images.room,
    description:
      "Comfortable, air-conditioned rooms built for a restful stay after a day outdoors. Each one is designed to be simple, clean and quiet — a proper night's sleep between the pool and the campfire.",
  },
  {
    key: "hall",
    label: "Party Hall",
    src: images.hall,
    description:
      "A covered, open-sided pavilion built for groups — birthdays, get-togethers and family functions that need shade and space without being boxed indoors. Easily rearranged to suit the occasion.",
  },
  {
    key: "garden",
    label: "Garden",
    src: images.garden,
    description:
      "Landscaped paths and greenery that make the property feel like a working farm, not just a venue. A quiet place to walk, take photos, or let kids explore away from the main gathering spots.",
  },
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

        <div className="mt-14 grid grid-cols-[minmax(7rem,38%)_1fr] gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
          {/* Outer wrapper carries no height/sticky of its own — left with the
              grid's default stretch alignment, it naturally spans the full
              height of the row (which the tall right-hand list sets). That
              height is exactly what the inner sticky box needs to have room
              to stay pinned while the row scrolls past; sticky applied
              directly on a box sized to its own small content (as this used
              to be) runs out of room to stick within almost immediately. */}
          <div className="relative">
            <div className="sticky top-20 aspect-square overflow-hidden sm:top-28 sm:aspect-[4/3] lg:aspect-auto lg:h-[34rem]">
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
          </div>

          <ul className="flex flex-col justify-between gap-10 py-2 sm:gap-16 lg:gap-0">
            {spaces.map((s, i) => (
              <li
                key={s.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-index={i}
                className="flex min-h-[60vh] items-center lg:min-h-[70vh]"
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "group w-full border-l pl-4 text-left transition-colors sm:pl-8",
                    i === active
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-primary",
                  )}
                >
                  <span className="text-[0.66rem] tracking-[0.22em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-xl mt-3 transition-colors">{s.label}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <ActionLink to="/about">Explore the property</ActionLink>
        </div>
      </div>
    </section>
  );
}
