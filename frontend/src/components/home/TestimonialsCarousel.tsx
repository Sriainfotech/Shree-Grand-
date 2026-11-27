import { useEffect, useState } from "react";
import { testimonials, testimonialsEmptyState } from "@/data/testimonials";
import { SectionHeader, EmptyState } from "@/components/ui/section";
import { WhatsAppButton } from "@/components/ui/actions";
import { whatsappMessages } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

/**
 * Carousel shell (arrows, dot pagination, quote + name + source tag) built
 * now so no redesign is needed once real reviews arrive — only `testimonials`
 * in `@/data/testimonials` needs to change. Until then this renders the same
 * honest empty state as before; fabricated reviews are never shown.
 */
export function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="section-y">
      <div className="shell">
        <SectionHeader eyebrow="Guest stories" title="What our guests say" align="center" />
        <div className="mt-12">
          {testimonials.length === 0 ? (
            <EmptyState
              title={testimonialsEmptyState.title}
              body={testimonialsEmptyState.body}
              action={
                <WhatsAppButton message={whatsappMessages.general} context="home_testimonials" />
              }
            />
          ) : (
            <>
              <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: testimonials.length > 1 }}
                className="px-1"
              >
                <CarouselContent>
                  {testimonials.map((t) => (
                    <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                      <blockquote className="flex h-full flex-col border border-border bg-card p-8">
                        <p className="text-[0.98rem] leading-relaxed">{t.review}</p>
                        <footer className="mt-6 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                          {t.name}
                          {t.role ? (
                            <span className="text-muted-foreground"> · {t.role}</span>
                          ) : null}
                        </footer>
                      </blockquote>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {testimonials.length > 1 ? (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                ) : null}
              </Carousel>
              {count > 1 ? (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: count }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show testimonial ${i + 1}`}
                      aria-current={i === selected}
                      onClick={() => api?.scrollTo(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === selected
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-border hover:bg-muted-foreground/50",
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
