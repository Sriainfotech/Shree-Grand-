import { apiGet, apiPost } from "@/config/api";

export type BookingSlot = "full_day" | "half_day_morning" | "half_day_evening";

/** Matches backend/src/validators/booking.validator.js exactly. Every
 * booking is for the whole property — there is no room to choose. */
export type BookingRequestInput = {
  name: string;
  phone: string;
  email?: string | undefined;
  checkIn: string; // ISO date, e.g. "2026-12-20"
  checkOut?: string | undefined;
  guests: number;
  occasion?: string | undefined;
  message?: string | undefined;
  slot?: BookingSlot | undefined;
};

export type BookingRequestResult = {
  id: string;
  status: string;
  checkIn: string;
  checkOut: string | null;
  guests: number;
  slot: BookingSlot;
  totalAmount: number | null;
  advanceAmount: number | null;
};

/** Submits a booking request to the live backend — no account/login
 * required. Throws ApiRequestError (see @/config/api) with a message safe
 * to show the visitor directly on validation failure. */
export function submitBookingRequest(input: BookingRequestInput) {
  return apiPost<BookingRequestResult>("/api/bookings", input);
}

export type AvailabilityResult = { available: boolean };

/** Live availability check for the whole property on a date/slot — GET
 * /api/bookings/availability, public, no auth needed. */
export function checkAvailability(params: {
  checkIn: string;
  checkOut?: string | undefined;
  slot?: BookingSlot | undefined;
}) {
  const qs = new URLSearchParams({ checkIn: params.checkIn });
  if (params.checkOut) qs.set("checkOut", params.checkOut);
  if (params.slot) qs.set("slot", params.slot);
  return apiGet<AvailabilityResult>(`/api/bookings/availability?${qs.toString()}`);
}

/** Matches backend/src/validators/inquiry.validator.js exactly. */
export type InquiryRequestInput = {
  name: string;
  phone: string;
  email?: string | undefined;
  occasion?: string | undefined;
  message?: string | undefined;
};

export type InquiryRequestResult = {
  id: string;
  status: string;
};

export function submitInquiry(input: InquiryRequestInput) {
  return apiPost<InquiryRequestResult>("/api/inquiries", input);
}
