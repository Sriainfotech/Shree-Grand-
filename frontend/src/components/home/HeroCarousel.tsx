import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";

const slides = [
  { src: images.hero, alt: "Evening view of a countryside farm stay with lawns and warm lighting" },
  { src: images.aerial, alt: "Aerial view of open lawns, garden and a pool at the property" },
  { src: images.pool, alt: "Swimming pool at the farm stay" },
  { src: images.garden, alt: "Garden path at the farm stay" },
] as const;

const AUTOPLAY_MS = 6000;

/** Subtle rotating/crossfade background for the hero. Headline, subtext and
 * CTAs stay fixed in the markup above this — only the background rotates. */
export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, []);

  function go(delta: number) {
    setActive((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <>
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          width={1920}
          height={1088}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding="async"
          className={cn(
            "absolute inset-0 -z-10 h-full w-full object-cover opacity-75 transition-opacity duration-[1400ms] ease-out",
            i === active ? "opacity-75" : "opacity-0",
          )}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 -z-10 flex items-center justify-between px-4 pb-6 sm:px-8">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/40 text-primary-foreground backdrop-blur-sm transition-colors hover:border-primary-foreground hover:bg-primary-foreground/10"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <div className="flex gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "pointer-events-auto h-1.5 rounded-full transition-all",
                i === active
                  ? "w-6 bg-accent"
                  : "w-1.5 bg-primary-foreground/50 hover:bg-primary-foreground/80",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/40 text-primary-foreground backdrop-blur-sm transition-colors hover:border-primary-foreground hover:bg-primary-foreground/10"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </>
  );
}
