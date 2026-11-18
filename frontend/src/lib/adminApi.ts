import { API_URL, ApiRequestError } from "@/config/api";

const TOKEN_KEY = "sgfs_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "editor";
  active: boolean;
};

/** Authenticated fetch — attaches the stored token, and clears it on a 401
 * so the next page check redirects back to /admin/login. Skips the default
 * JSON content-type for FormData bodies (file uploads) so the browser can
 * set its own multipart boundary. */
async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let json: { success: boolean; message: string; data: T; errors?: unknown };
  try {
    json = await res.json();
  } catch {
    throw new ApiRequestError(res.status, "The server returned an unexpected response.");
  }

  if (res.status === 401) clearToken();
  if (!res.ok || !json.success) {
    throw new ApiRequestError(res.status, json.message || "Request failed.");
  }

  return json.data;
}

/** Generic image upload — used by any admin form field that offers "upload
 * a file" as an alternative to pasting a URL. Returns the public /uploads
 * URL to store in that field. */
export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return authFetch<{ url: string }>("/api/uploads", { method: "POST", body: formData });
}

export function login(loginId: string, password: string) {
  return authFetch<{ user: AdminUser; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ login: loginId, password }),
  });
}

export function getMe() {
  return authFetch<AdminUser>("/api/auth/me");
}

export type AdminBooking = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  checkIn: string;
  checkOut: string | null;
  guests: number;
  occasion: string | null;
  message: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: string;
  totalAmount: number | null;
  advanceAmount: number | null;
  createdAt: string;
};

export function listBookings() {
  return authFetch<AdminBooking[]>("/api/bookings");
}

export function updateBookingStatus(id: string, status: AdminBooking["status"]) {
  return authFetch<AdminBooking>(`/api/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export type AdminInquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  occasion: string | null;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};

export function listInquiries() {
  return authFetch<AdminInquiry[]>("/api/inquiries");
}

export function updateInquiryStatus(id: string, status: AdminInquiry["status"]) {
  return authFetch<AdminInquiry>(`/api/inquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---------------------------------------------------------------------------
// Property — a single settings record (the whole farm stay is one bookable
// unit, never a particular room within it).
// ---------------------------------------------------------------------------

export type AdminProperty = {
  id: string;
  name: string;
  description: string;
  images: string[];
  amenities: string[];
  guestCapacity: number | null;
  pricePerDay: number | null;
  priceLabel: string;
};

export type PropertyInput = {
  name?: string;
  description?: string;
  images?: string[];
  amenities?: string[];
  guestCapacity?: number | null;
  pricePerDay?: number | null;
  priceLabel?: string;
};

export function getAdminProperty() {
  return authFetch<AdminProperty>("/api/property");
}

export function updateProperty(input: PropertyInput) {
  return authFetch<AdminProperty>("/api/property", { method: "PUT", body: JSON.stringify(input) });
}

// ---------------------------------------------------------------------------
// Gallery — full CRUD (create uploads an image file)
// ---------------------------------------------------------------------------

export const galleryCategories = [
  "pool",
  "rooms",
  "lawn",
  "party-hall",
  "garden",
  "dining",
  "campfire",
  "events",
  "drone",
] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

export type AdminGalleryImage = {
  id: string;
  title: string;
  category: GalleryCategory;
  type: "image" | "video";
  url: string;
  caption: string;
  order: number;
  published: boolean;
};

export function listAdminGallery() {
  return authFetch<AdminGalleryImage[]>("/api/gallery/all");
}

/** Pass either `file` (uploads it) or `url` (links to an existing image) —
 * whichever the admin prefers. */
export function createGalleryImage(
  source: { file: File } | { url: string },
  fields: { category: GalleryCategory; title?: string; caption?: string; order?: number },
) {
  if ("file" in source) {
    const formData = new FormData();
    formData.append("image", source.file);
    formData.append("category", fields.category);
    if (fields.title) formData.append("title", fields.title);
    if (fields.caption) formData.append("caption", fields.caption);
    if (fields.order !== undefined) formData.append("order", String(fields.order));
    return authFetch<AdminGalleryImage>("/api/gallery", { method: "POST", body: formData });
  }

  return authFetch<AdminGalleryImage>("/api/gallery", {
    method: "POST",
    body: JSON.stringify({ ...fields, url: source.url }),
  });
}

export function updateGalleryImage(
  id: string,
  input: Partial<Omit<AdminGalleryImage, "id" | "url">>,
) {
  return authFetch<AdminGalleryImage>(`/api/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteGalleryImage(id: string) {
  return authFetch<null>(`/api/gallery/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Blog — full CRUD
// ---------------------------------------------------------------------------

export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  image: string | null;
  author: string;
  status: "draft" | "published";
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type BlogPostInput = {
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  image?: string;
  status?: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
};

export function listAdminBlogPosts() {
  return authFetch<AdminBlogPost[]>("/api/blog/admin/all");
}

export function createBlogPost(input: BlogPostInput) {
  return authFetch<AdminBlogPost>("/api/blog", { method: "POST", body: JSON.stringify(input) });
}

export function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  return authFetch<AdminBlogPost>(`/api/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteBlogPost(id: string) {
  return authFetch<null>(`/api/blog/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Testimonials — full CRUD. The create endpoint always forces
// published:false/featured:false server-side (visitors can submit a review
// through the same endpoint), so publishing/featuring is always a second,
// explicit PATCH — never implicit.
// ---------------------------------------------------------------------------

export type AdminTestimonial = {
  id: string;
  name: string;
  role: string | null;
  review: string;
  rating: number | null;
  image: string | null;
  date: string;
  published: boolean;
  featured: boolean;
};

export type TestimonialInput = {
  name: string;
  review: string;
  role?: string;
  rating?: number;
  image?: string;
};

export function listAdminTestimonials() {
  return authFetch<AdminTestimonial[]>("/api/testimonials/all");
}

export function createTestimonial(input: TestimonialInput) {
  return authFetch<AdminTestimonial>("/api/testimonials", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput & { published: boolean; featured: boolean }>,
) {
  return authFetch<AdminTestimonial>(`/api/testimonials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTestimonial(id: string) {
  return authFetch<null>(`/api/testimonials/${id}`, { method: "DELETE" });
}
