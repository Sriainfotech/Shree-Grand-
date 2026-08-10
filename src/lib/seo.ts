import { site } from "@/config/site";

type Meta = Record<string, string>[];

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  image?: string;
};

/** Builds the per-route head() meta array. Titles stay under 60 characters. */
export function pageMeta({
  title,
  description,
  path,
  ogType = "website",
  image,
}: PageSeo): Meta {
  const meta: Meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: path },
    { property: "og:site_name", content: site.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  return meta;
}

export const canonical = (path: string) => [{ rel: "canonical", href: path }];

export function jsonLd(data: unknown) {
  return [{ type: "application/ld+json", children: JSON.stringify(data) }];
}

/**
 * LocalBusiness / LodgingBusiness schema built only from confirmed facts.
 * Missing fields (street address, geo, price range, ratings) are omitted
 * rather than guessed.
 */
export function lodgingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    telephone: `+91${site.contact.phone}`,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: `${site.location.village}, ${site.location.city}`,
      addressRegion: site.location.state,
      addressCountry: "IN",
    },
    sameAs: [site.social.instagramUrl],
    checkinTime: "12:00",
    checkoutTime: "10:00",
    amenityFeature: [
      "Swimming Pool",
      "AC Rooms",
      "Lawn Area",
      "Party Hall",
      "Dining Area",
      "Barbecue Area",
      "Parking",
      "Children's Play Area",
      "Campfire",
      "Garden",
      "Wi-Fi",
      "Generator Backup",
      "Security",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path,
    })),
  };
}
