/**
 * Central business configuration.
 *
 * Every value marked CONFIRMED comes from the business brief supplied by
 * Shri Grand Farm Stay. Values marked PENDING are not yet supplied by the
 * business — they must never be presented as facts in the UI. Update this
 * file (or, later, the admin `settings` table) when the business confirms.
 */

export const site = {
  name: "Shri Grand Farm Stay", // CONFIRMED
  nameUpper: "SHRI GRAND FARM STAY",
  shortName: "Shri Grand",
  tagline: "A Perfect Place for Celebrations", // CONFIRMED
  description:
    "A premium farm stay and celebration venue in Vempally, Mancherial, Telangana — for stays, weddings, birthdays, corporate outings and private celebrations.",

  // PLACEHOLDER — no production domain has been decided yet. Every canonical
  // URL, the sitemap and all schema.org "url" fields are built from this one
  // constant, so update this single value (and re-run `npm run sitemap`)
  // before launch instead of hunting for hardcoded URLs across the app.
  url: "https://www.shrigrandfarmstay.example",

  location: {
    // CONFIRMED: village, city, state and landmark only.
    village: "Vempally",
    city: "Mancherial",
    state: "Telangana",
    country: "India",
    landmark: "Near Vempally Municipality Office line",
    short: "Vempally · Mancherial · Telangana",
    full: "Vempally, Mancherial, Telangana, India",
    // PENDING: exact street address, PIN code and Google Maps coordinates.
    streetAddress: null as string | null,
    postalCode: null as string | null,
    mapsUrl: null as string | null,
    coordinates: null as { lat: number; lng: number } | null,
  },

  contact: {
    phone: "9014007174", // CONFIRMED
    phoneDisplay: "+91 90140 07174",
    whatsapp: "9014007174", // CONFIRMED
    whatsappIntl: "919014007174",
    email: "shreegrandfarmstay@gmail.com", // CONFIRMED
  },

  social: {
    instagram: "shrigrandfarmstay", // CONFIRMED (handle)
    instagramUrl: "https://www.instagram.com/shrigrandfarmstay/",
    // PENDING: not supplied by the business.
    facebook: null as string | null,
    youtube: null as string | null,
    googleBusiness: null as string | null,
  },

  booking: {
    onlineBookingEnabled: true, // CONFIRMED
    advancePercentage: 25, // CONFIRMED
    paymentMethods: ["Online", "Offline"] as const, // CONFIRMED
    checkIn: "12:00 PM", // CONFIRMED
    checkOut: "10:00 AM", // CONFIRMED
    maxGuests: "Based on party", // CONFIRMED (no numeric cap supplied)
    // PENDING — configurable, never invented:
    cancellationPolicy: null as string | null,
    cancellationPlaceholder: "Cancellation policy will be confirmed at the time of booking.",
    refundPolicy: null as string | null,
    securityDeposit: null as string | null,
    minStayNights: null as number | null,
    maxStayNights: null as number | null,
    paymentGateway: null as string | null,
  },

  analytics: {
    // PENDING: GA4 measurement ID. Events are collected and no-op until set.
    measurementId: null as string | null,
  },
} as const;

export const PRICE_ON_REQUEST = "Price on request";
export const DETAILS_ON_REQUEST = "Details on request";
export const COMING_SOON = "Coming soon";

export const telHref = `tel:+91${site.contact.phone}`;
export const mailHref = `mailto:${site.contact.email}`;

/** Contextual WhatsApp deep link with a pre-filled enquiry message. */
export function whatsappHref(message?: string) {
  const text = message ?? whatsappMessages.general;
  return `https://wa.me/${site.contact.whatsappIntl}?text=${encodeURIComponent(text)}`;
}

export const whatsappMessages = {
  general: "Hi, I would like to enquire about Shri Grand Farm Stay.",
  stay: "Hi, I would like to check availability for a weekend stay at Shri Grand Farm Stay.",
  event: "Hi, I would like to enquire about a wedding/event at Shri Grand Farm Stay.",
  packages: "Hi, I would like to know more about the packages at Shri Grand Farm Stay.",
  booking: "Hi, I would like help with a booking at Shri Grand Farm Stay.",
  gallery: "Hi, I saw your gallery and would like to enquire about Shri Grand Farm Stay.",
  rooms: "Hi, I would like to enquire about rooms at Shri Grand Farm Stay.",
  room: (name: string) =>
    `Hi, I would like to check availability for the ${name} at Shri Grand Farm Stay.`,
  experience: (name: string) =>
    `Hi, I would like to enquire about ${name} at Shri Grand Farm Stay.`,
} as const;
