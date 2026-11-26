const crypto = require("crypto");
const env = require("../config/env");
const config = require("../config/config");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const mailer = require("../utils/mailer");
const emailTemplates = require("../utils/emailTemplates");
const actionToken = require("../utils/actionToken");
const logger = require("../utils/logger");

const isConfigured = () => Boolean(env.razorpayKeyId && env.razorpayKeySecret);

/** Razorpay SDK is only required (and instantiated) once the gateway is
 * actually configured, so the app boots fine without it during development
 * or before the business has a merchant account. */
function getClient() {
  if (!isConfigured()) {
    throw ApiError.serviceUnavailable(
      "Online payment is not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.",
    );
  }
  // eslint-disable-next-line global-require
  const Razorpay = require("razorpay");
  return new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret });
}

/** Creates a Razorpay order for a booking. The amount always comes from the
 * price snapshot (`totalAmount`/`advanceAmount`) taken on the booking at
 * creation time — never trust a client-supplied amount, or a visitor could
 * pay whatever they like. */
async function createOrder(bookingId, paymentType) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw ApiError.notFound("Booking not found");
  if (!booking.totalAmount) {
    throw ApiError.badRequest(
      "This booking doesn't have a fixed price yet — please contact us to arrange payment.",
    );
  }

  const amountInRupees = paymentType === "full" ? booking.totalAmount : booking.advanceAmount;

  const client = getClient();
  const amountInPaise = Math.round(amountInRupees * 100);

  const order = await client.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `booking_${booking.id}`,
  });

  const [payment] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: amountInPaise,
        currency: "INR",
        gatewayOrderId: order.id,
        status: "created",
      },
    }),
    prisma.booking.update({ where: { id: booking.id }, data: { paymentType } }),
  ]);

  return { order, payment, keyId: env.razorpayKeyId };
}

/** Verifies the checkout callback signature and marks the payment as paid.
 * This is only step one of confirmation — Razorpay's signature proves the
 * charge is genuine, but the booking stays `pending_verification` until an
 * admin double-checks it (via the admin panel or the link in their
 * notification email; see `verifyBookingPayment` below) and the guest gets a
 * "we're verifying" email, not a final confirmation.
 * Throws if the signature doesn't match (tampered/forged request). */
async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!isConfigured()) throw ApiError.serviceUnavailable("Online payment is not configured yet.");

  const payment = await prisma.payment.findFirst({ where: { gatewayOrderId: razorpay_order_id } });
  if (!payment) throw ApiError.notFound("Payment record not found for this order");

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
    throw ApiError.badRequest("Payment verification failed");
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      gatewayPaymentId: razorpay_payment_id,
      gatewaySignature: razorpay_signature,
      status: "paid",
    },
  });

  const booking = await prisma.booking.update({
    where: { id: payment.bookingId },
    data: { paymentStatus: "pending_verification" },
  });

  const amountInRupees = updatedPayment.amount / 100;

  // Best-effort — never fail the (already-succeeded) payment over an email
  // hiccup.
  if (booking.email) {
    mailer
      .confirmToSender({
        to: booking.email,
        subject: "Payment received — verifying now — Shri Grand Farm Stay",
        text:
          `Hi ${booking.name},\n\nWe've received your payment and are verifying it now. ` +
          `You'll get another email once your booking is confirmed. ` +
          `Amount paid: Rs.${amountInRupees.toLocaleString("en-IN")}.\n\n— Shri Grand Farm Stay`,
        html: emailTemplates.paymentPendingVerificationEmailHtml(booking, amountInRupees),
      })
      .catch((error) => logger.error(`Payment pending-verification email failed: ${error.message}`));
  }

  const verifyUrl = `${env.apiBaseUrl}${config.api.prefix}/payments/verify-link?token=${encodeURIComponent(
    actionToken.sign({ bookingId: booking.id, purpose: "verify_payment" }),
  )}`;

  mailer
    .notifyAdmin(
      `Payment awaiting verification — ${booking.name}`,
      {
        Guest: booking.name,
        Phone: booking.phone,
        Email: booking.email,
        "Amount paid": `₹${amountInRupees.toLocaleString("en-IN")}`,
        "Payment ID": updatedPayment.gatewayPaymentId,
        "Verify link": verifyUrl,
      },
      emailTemplates.paymentVerificationAdminEmailHtml(
        booking,
        updatedPayment,
        amountInRupees,
        verifyUrl,
      ),
    )
    .catch((error) => logger.error(`Payment verification admin email failed: ${error.message}`));

  return updatedPayment;
}

/** The admin-verification step — called from the authenticated admin-panel
 * "Verify payment" button (`verifiedBy: "admin_panel"`) and from the
 * no-login signed link in the admin notification email
 * (`verifiedBy: "email_link"`). Idempotent: verifying an already-confirmed
 * booking is a harmless no-op (so clicking a stale email link, or using
 * both the email and the panel, never double-sends the guest's
 * confirmation email). */
async function verifyBookingPayment(bookingId, { verifiedBy }) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw ApiError.notFound("Booking not found");

  if (booking.paymentStatus === "paid" || booking.paymentStatus === "advance_paid") {
    return { booking, alreadyVerified: true };
  }

  if (booking.paymentStatus !== "pending_verification") {
    throw ApiError.conflict("This booking has no payment awaiting verification.");
  }

  const payment = await prisma.payment.findFirst({
    where: { bookingId, status: "paid" },
    orderBy: { createdAt: "desc" },
  });

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: booking.paymentType === "full" ? "paid" : "advance_paid",
      status: "confirmed",
      paymentVerifiedAt: new Date(),
      paymentVerifiedBy: verifiedBy,
    },
  });

  if (updatedBooking.email && payment) {
    const amountInRupees = payment.amount / 100;
    mailer
      .confirmToSender({
        to: updatedBooking.email,
        subject: "Payment verified — booking confirmed — Shri Grand Farm Stay",
        text:
          `Hi ${updatedBooking.name},\n\nYour payment is verified and your booking is now confirmed. ` +
          `Amount paid: Rs.${amountInRupees.toLocaleString("en-IN")}.\n\n— Shri Grand Farm Stay`,
        html: emailTemplates.paymentVerifiedEmailHtml(updatedBooking, payment, amountInRupees),
      })
      .catch((error) => logger.error(`Payment verified email failed: ${error.message}`));
  }

  return { booking: updatedBooking, alreadyVerified: false };
}

/** Decodes a signed "verify payment" email link. Returns the bookingId, or
 * throws a 401 if the link is missing, tampered with, or expired. */
function resolveVerifyToken(token) {
  const payload = actionToken.verify(token);
  if (!payload || payload.purpose !== "verify_payment" || !payload.bookingId) {
    throw ApiError.unauthorized("This verification link is invalid or has expired.");
  }
  return payload.bookingId;
}

module.exports = {
  isConfigured,
  createOrder,
  verifyPayment,
  verifyBookingPayment,
  resolveVerifyToken,
};
