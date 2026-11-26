import { site } from "@/config/site";

/**
 * Analytics event layer, GA4-ready.
 *
 * No measurement ID is configured yet (site.analytics.measurementId === null),
 * so events are queued to window.dataLayer only. Nothing is fabricated and no
 * third-party script loads until the business supplies a GA4 ID.
 */
export type AnalyticsEvent =
  | "page_view"
  | "view_experience"
  | "view_package"
  | "explore_3d"
  | "3d_hotspot_click"
  | "gallery_view"
  | "booking_start"
  | "booking_step_complete"
  | "booking_submit"
  | "booking_request_submitted"
  | "payment_start"
  | "payment_success"
  | "payment_received_pending_verification"
  | "booking_confirmed"
  | "whatsapp_click"
  | "phone_click"
  | "contact_submit"
  | "map_click";

type Params = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
  if (site.analytics.measurementId && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

export const trackWhatsApp = (context: string) =>
  track("whatsapp_click", { context });
export const trackPhone = (context: string) => track("phone_click", { context });
