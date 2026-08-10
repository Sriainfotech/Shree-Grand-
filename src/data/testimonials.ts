/**
 * Testimonials.
 *
 * NO customer reviews have been supplied and none may be invented.
 * The array is empty on purpose; the UI shows an honest invitation to be
 * among the first guests. Real reviews arrive via the admin CMS later.
 */
export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  review: string;
  rating: number | null;
  image: string | null;
  date: string | null;
  published: boolean;
  featured: boolean;
};

export const testimonials: Testimonial[] = [];

export const testimonialsEmptyState = {
  title: "Our first stories are being written",
  body: "Shri Grand Farm Stay is new. Guest reviews will appear here as our first families, couples and teams celebrate with us — we will never publish a review we did not receive.",
};
