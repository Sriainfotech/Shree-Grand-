import { apiGet, apiPost } from "@/config/api";

export type PaymentType = "full" | "advance";

export function getPaymentStatus() {
  return apiGet<{ configured: boolean }>("/api/payments/status");
}

export type PaymentOrderResult = {
  order: { id: string; amount: number; currency: string };
  payment: { id: string };
  keyId: string;
};

/** Amount is always computed server-side from the room price + paymentType
 * — see backend/src/services/payment.service.js#createOrder. */
export function createPaymentOrder(input: { bookingId: string; paymentType: PaymentType }) {
  return apiPost<PaymentOrderResult>("/api/payments/orders", input);
}

export type VerifyPaymentInput = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export function verifyPayment(input: VerifyPaymentInput) {
  return apiPost<{ id: string; status: string }>("/api/payments/verify", input);
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise: Promise<void> | null = null;

/** Loads the Razorpay Checkout script once per page load and resolves once
 * window.Razorpay is available. Safe to call multiple times. */
export function loadRazorpayCheckoutScript(): Promise<void> {
  if (typeof window !== "undefined" && (window as { Razorpay?: unknown }).Razorpay) {
    return Promise.resolve();
  }
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay Checkout")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay Checkout"));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}
