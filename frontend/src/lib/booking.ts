/**
 * Booking domain model — mirrors the future database schema exactly, so the
 * move from local state to Lovable Cloud is a persistence change only.
 */

export const bookingStatuses = [
  "Pending",
  "Confirmed",
  "Partially Paid",
  "Paid",
  "Cancelled",
  "Completed",
] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export const paymentStatuses = [
  "Pending",
  "Partially Paid",
  "Paid",
  "Failed",
  "Refunded",
] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const experienceTypes = [
  "Stay",
  "Day Out",
  "Birthday",
  "Wedding",
  "Corporate",
  "Team Outing",
  "Private Celebration",
  "Other Event",
] as const;
export type ExperienceType = (typeof experienceTypes)[number];

export type Booking = {
  id: string;
  booking_reference: string;
  customer_name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  experience_type: ExperienceType;
  package_id: string | null;
  date: string;
  check_in: string | null;
  check_out: string | null;
  adults: number;
  children: number;
  total_guests: number;
  subtotal: number | null;
  advance_percentage: number;
  advance_amount: number | null;
  remaining_amount: number | null;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  special_requirements: string | null;
  created_at: string;
  updated_at: string;
};

export const leadStatuses = [
  "New",
  "Contacted",
  "Interested",
  "Quotation Sent",
  "Converted",
  "Lost",
] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  interested_in: string | null;
  preferred_date: string | null;
  guests: number | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
};

/** Human-readable, non-sequential reference. */
export function generateBookingReference(date = new Date()) {
  const y = String(date.getFullYear()).slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SG${y}${m}-${rand}`;
}

/** Returns null when no price is configured — never a guessed amount. */
export function computeAdvance(subtotal: number | null, percentage: number) {
  if (subtotal == null) return { advance: null, remaining: null };
  const advance = Math.round((subtotal * percentage) / 100);
  return { advance, remaining: subtotal - advance };
}

/**
 * Payment provider abstraction. No gateway has been selected by the business,
 * so only the offline/manual provider exists. Adding a gateway later means
 * adding an implementation here — no page changes.
 */
export type PaymentIntent = {
  reference: string;
  amount: number | null;
  method: "online" | "offline";
  status: PaymentStatus;
};

export interface PaymentProvider {
  id: string;
  label: string;
  available: boolean;
  createIntent(input: {
    reference: string;
    amount: number | null;
  }): Promise<PaymentIntent>;
}

export const offlinePaymentProvider: PaymentProvider = {
  id: "offline",
  label: "Pay offline (bank transfer / UPI / cash on arrival)",
  available: true,
  async createIntent({ reference, amount }) {
    return { reference, amount, method: "offline", status: "Pending" };
  },
};

export const onlinePaymentProvider: PaymentProvider = {
  id: "online",
  label: "Pay online",
  available: false, // no gateway selected yet
  async createIntent({ reference, amount }) {
    return { reference, amount, method: "online", status: "Pending" };
  },
};

export const paymentProviders = [offlinePaymentProvider, onlinePaymentProvider];
