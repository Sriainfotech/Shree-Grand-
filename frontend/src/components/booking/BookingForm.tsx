import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  submitBookingRequest,
  checkAvailability,
  type BookingRequestInput,
  type BookingRequestResult,
  type BookingSlot,
} from "@/lib/bookingApi";
import {
  getPaymentStatus,
  createPaymentOrder,
  verifyPayment,
  loadRazorpayCheckoutScript,
  type PaymentType,
} from "@/lib/paymentApi";
import { getProperty } from "@/lib/propertyApi";
import { ApiRequestError } from "@/config/api";
import { site } from "@/config/site";

const emptyForm: BookingRequestInput = {
  name: "",
  phone: "",
  email: "",
  checkIn: "",
  checkOut: "",
  guests: 2,
  occasion: "",
  message: "",
  slot: "full_day",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const SLOT_LABELS: Record<BookingSlot, string> = {
  full_day: "Full day",
  half_day_morning: "Half day — morning",
  half_day_evening: "Half day — evening",
};

const formatInr = (amount: number) =>
  amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const nightsBetween = (checkIn: string, checkOut: string) =>
  Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (24 * 60 * 60 * 1000));

type AvailabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available" }
  | { status: "unavailable" }
  | { status: "error"; message: string };

type PaymentStep = { booking: BookingRequestResult; razorpayConfigured: boolean };

/**
 * Real booking-request form — submits straight to the backend
 * (POST /api/bookings), no login required. Every booking is for the whole
 * property (never a particular room within it), for however many days the
 * guest wants. Checks live availability for the chosen date(s)/slot before
 * letting the visitor submit, then offers a full-vs-25%-advance online
 * payment step once the booking is confirmed.
 */
export function BookingForm() {
  const [form, setForm] = useState<BookingRequestInput>(emptyForm);
  const [hasPrice, setHasPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ checkIn: string } | null>(null);
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "idle" });
  const [paymentStep, setPaymentStep] = useState<PaymentStep | null>(null);
  const [payingType, setPayingType] = useState<PaymentType | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    getProperty()
      .then((p) => setHasPrice(Boolean(p.pricePerDay)))
      .catch(() => setHasPrice(false));
  }, []);

  const isMultiNight = Boolean(form.checkOut);

  // Live availability check whenever dates/slot change.
  useEffect(() => {
    if (!form.checkIn) {
      setAvailability({ status: "idle" });
      return;
    }
    setAvailability({ status: "checking" });
    const timer = setTimeout(() => {
      checkAvailability({
        checkIn: form.checkIn,
        checkOut: form.checkOut || undefined,
        slot: isMultiNight ? undefined : form.slot,
      })
        .then((res) => setAvailability({ status: res.available ? "available" : "unavailable" }))
        .catch(() =>
          setAvailability({ status: "error", message: "Couldn't check availability — try again." }),
        );
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.checkIn, form.checkOut, form.slot]);

  function update<K extends keyof BookingRequestInput>(key: K, value: BookingRequestInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (availability.status === "unavailable") return;

    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      const payload: BookingRequestInput = {
        ...form,
        email: form.email?.trim() || undefined,
        checkOut: form.checkOut?.trim() || undefined,
        occasion: form.occasion?.trim() || undefined,
        message: form.message?.trim() || undefined,
        guests: Number(form.guests),
      };
      const result = await submitBookingRequest(payload);
      setConfirmed({ checkIn: result.checkIn });

      if (result.totalAmount) {
        const { configured } = await getPaymentStatus().catch(() => ({ configured: false }));
        setPaymentStep({ booking: result, razorpayConfigured: configured });
      }

      setForm(emptyForm);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setFormError(error.message);
        if (error.fieldErrors?.length) {
          const next: Record<string, string> = {};
          for (const fe of error.fieldErrors) next[fe.field] = fe.message;
          setFieldErrors(next);
        }
      } else {
        setFormError("Something went wrong. Please try again or reach us on WhatsApp.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay(paymentType: PaymentType) {
    if (!paymentStep) return;
    setPayingType(paymentType);
    setFormError(null);

    try {
      const { order, keyId } = await createPaymentOrder({
        bookingId: paymentStep.booking.id,
        paymentType,
      });
      await loadRazorpayCheckoutScript();

      const RazorpayCtor = (
        window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }
      ).Razorpay;
      const checkout = new RazorpayCtor({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: site.name,
        description: `${paymentType === "full" ? "Full payment" : "Advance payment"} — booking`,
        order_id: order.id,
        prefill: { name: form.name, contact: form.phone, email: form.email || undefined },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment(response);
            setPaymentDone(true);
          } catch {
            setFormError(
              "We couldn't confirm your payment automatically. If money was deducted, contact us with your booking details.",
            );
          } finally {
            setPayingType(null);
          }
        },
        modal: { ondismiss: () => setPayingType(null) },
      });
      checkout.open();
    } catch (error) {
      setPayingType(null);
      setFormError(
        error instanceof ApiRequestError
          ? error.message
          : "Couldn't start the payment. Please try again or contact us directly.",
      );
    }
  }

  if (confirmed) {
    if (paymentStep && !paymentDone) {
      const { booking, razorpayConfigured } = paymentStep;
      const total = booking.totalAmount ?? 0;
      const advance =
        booking.advanceAmount ?? Math.round(total * (site.booking.advancePercentage / 100));
      const nights = booking.checkOut ? nightsBetween(booking.checkIn, booking.checkOut) : 1;
      const durationLabel = booking.checkOut
        ? `${nights} night${nights === 1 ? "" : "s"}`
        : SLOT_LABELS[booking.slot].toLowerCase();

      return (
        <div className="border border-border bg-card p-8 text-center sm:p-10">
          <CheckCircle2 className="mx-auto h-8 w-8 text-primary" aria-hidden />
          <h3 className="display-lg mt-4">Your dates are confirmed available.</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {formatInr(total)} for {durationLabel}. Choose how you'd like to pay to lock in your
            booking.
          </p>

          {razorpayConfigured ? (
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
              <button
                type="button"
                disabled={payingType !== null}
                onClick={() => handlePay("full")}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {payingType === "full" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Pay full amount — {formatInr(total)}
              </button>
              <button
                type="button"
                disabled={payingType !== null}
                onClick={() => handlePay("advance")}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-primary px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {payingType === "advance" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Pay {site.booking.advancePercentage}% advance — {formatInr(advance)}
              </button>
            </div>
          ) : (
            <p className="mx-auto mt-6 max-w-sm text-sm text-muted-foreground">
              Online payment isn't set up yet — we'll reach out on {form.phone || "your phone"} to
              arrange the {site.booking.advancePercentage}% advance directly.
            </p>
          )}

          {formError ? (
            <p className="mx-auto mt-4 max-w-sm border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-left text-sm text-destructive">
              {formError}
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <div className="border border-border bg-card p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h3 className="display-lg mt-4">
          {paymentDone ? "Payment received — booking confirmed!" : "Your booking request is in."}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          We've received your request for{" "}
          <strong>
            {new Date(confirmed.checkIn).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
          .{" "}
          {paymentDone
            ? "We'll see you then!"
            : "We'll confirm availability and next steps on the phone number you shared, usually within a few hours."}
        </p>
        <button
          type="button"
          onClick={() => {
            setConfirmed(null);
            setPaymentStep(null);
            setPaymentDone(false);
          }}
          className="mt-6 border-b border-accent pb-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] hover:text-primary hover:border-primary"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-border bg-card p-8 sm:p-10">
      <div>
        <h3 className="display-lg">Book the whole property</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No account needed. You get the whole place for your dates — we check live availability
          right here before you submit.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bk-name">Name</Label>
          <Input
            id="bk-name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
          />
          {fieldErrors["name"] ? (
            <p className="text-xs text-destructive">{fieldErrors["name"]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bk-phone">Phone</Label>
          <Input
            id="bk-phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 90000 00000"
          />
          {fieldErrors["phone"] ? (
            <p className="text-xs text-destructive">{fieldErrors["phone"]}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bk-email">Email (optional)</Label>
        <Input
          id="bk-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
        />
        {fieldErrors["email"] ? (
          <p className="text-xs text-destructive">{fieldErrors["email"]}</p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="bk-checkin">Check-in date</Label>
          <Input
            id="bk-checkin"
            required
            type="date"
            min={todayIso()}
            value={form.checkIn}
            onChange={(e) => update("checkIn", e.target.value)}
          />
          {fieldErrors["checkIn"] ? (
            <p className="text-xs text-destructive">{fieldErrors["checkIn"]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bk-checkout">Check-out date (optional)</Label>
          <Input
            id="bk-checkout"
            type="date"
            min={form.checkIn || todayIso()}
            value={form.checkOut}
            onChange={(e) => update("checkOut", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bk-guests">Guests</Label>
          <Input
            id="bk-guests"
            required
            type="number"
            min={1}
            value={form.guests}
            onChange={(e) => update("guests", Number(e.target.value))}
          />
          {fieldErrors["guests"] ? (
            <p className="text-xs text-destructive">{fieldErrors["guests"]}</p>
          ) : null}
        </div>
      </div>

      {!isMultiNight ? (
        <div className="space-y-2">
          <Label htmlFor="bk-slot">Slot</Label>
          <Select
            {...(form.slot ? { value: form.slot } : {})}
            onValueChange={(value) => update("slot", value as BookingSlot)}
          >
            <SelectTrigger id="bk-slot">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SLOT_LABELS) as BookingSlot[]).map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {SLOT_LABELS[slot]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {form.checkIn ? (
        <p
          className={
            "text-xs font-medium " +
            (availability.status === "available"
              ? "text-primary"
              : availability.status === "unavailable"
                ? "text-destructive"
                : "text-muted-foreground")
          }
        >
          {availability.status === "checking" && "Checking availability…"}
          {availability.status === "available" &&
            `✓ The property is available for your selected date${isMultiNight ? " range" : ""}.`}
          {availability.status === "unavailable" &&
            "✕ Not available for this date/slot — please try another."}
          {availability.status === "error" && availability.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="bk-occasion">Occasion</Label>
        <Input
          id="bk-occasion"
          value={form.occasion}
          onChange={(e) => update("occasion", e.target.value)}
          placeholder="Family stay, birthday, wedding, corporate outing..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bk-message">Anything else we should know?</Label>
        <Textarea
          id="bk-message"
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Special requests, arrival time, group composition..."
        />
      </div>

      {formError ? (
        <p className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || availability.status === "unavailable"}
        className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-primary px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Sending your request..." : "Request this booking"}
      </button>
      <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
        {hasPrice
          ? `Once confirmed, you can pay the full amount or a ${site.booking.advancePercentage}% advance online — nothing is charged by submitting this form.`
          : `We'll confirm availability and the ${site.booking.advancePercentage}% advance details by phone or WhatsApp — nothing is charged by submitting this form.`}
      </p>
    </form>
  );
}
