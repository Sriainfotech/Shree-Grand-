import { Instagram } from "lucide-react";
import { images } from "@/data/images";
import { site } from "@/config/site";
import { SectionHeader, Figure } from "@/components/ui/section";
import { ActionAnchor } from "@/components/ui/actions";

/**
 * "Follow us on Instagram" grid near the footer. There is no connected
 * Instagram API/token to pull a live feed from, so this links out to the
 * real @Shreegrandfarmstay profile rather than presenting these tiles as
 * actual Instagram posts.
 */
const tiles = [
  images.poolBright,
  images.diningOutdoor,
  images.roomPalmWall,
  images.campfirePit,
  images.playgroundSlide,
  images.pergolaMural,
] as const;

export function InstagramFeed() {
  return (
    <section className="section-y">
      <div className="shell">
        <SectionHeader
          eyebrow="Social"
          title="Follow us on Instagram"
          intro={`More of the property, celebrations and behind-the-scenes moments on @${site.social.instagram}.`}
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((src, i) => (
            <a
              key={src}
              href={site.social.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative block"
              aria-label={`Open @${site.social.instagram} on Instagram`}
            >
              <Figure src={src} alt="" ratio="1/1" />
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/40"
              >
                <Instagram
                  className="h-5 w-5 text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
              </div>
              {i === 0 ? <span className="sr-only">Instagram photo grid</span> : null}
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <ActionAnchor href={site.social.instagramUrl} variant="outline">
            Follow @{site.social.instagram}
          </ActionAnchor>
        </div>
      </div>
    </section>
  );
}
