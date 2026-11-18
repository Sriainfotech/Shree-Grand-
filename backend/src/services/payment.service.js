const crypto = require("crypto");
const env = require("../config/env");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const mailer = require("../utils/mailer");
const emailTemplates = require("../utils/emailTemplates");
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

/** Verifies the checkout callback signature and marks the payment + booking
 * as paid. Throws if the signature doesn't match (tampered/forged request). */
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

  const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: {
      paymentStatus: booking?.paymentType === "full" ? "paid" : "advance_paid",
      status: "confirmed",
    },
  });

  // Best-effort — never fail the (already-succeeded) payment over an email
  // hiccup.
  if (booking?.email) {
    mailer
      .confirmToSender({
        to: booking.email,
        subject: "Payment received — booking confirmed — Shri Grand Farm Stay",
        text:
          `Hi ${booking.name},\n\nWe've received your payment and your booking is now confirmed. ` +
          `Amount paid: Rs.${(updatedPayment.amount / 100).toLocaleString("en-IN")}.\n\n— Shri Grand Farm Stay`,
        html: emailTemplates.paymentConfirmationEmailHtml(
          booking,
          updatedPayment,
          updatedPayment.amount / 100,
        ),
      })
      .catch((error) => logger.error(`Payment confirmation email failed: ${error.message}`));
  }

  return updatedPayment;
}

module.exports = { isConfigured, createOrder, verifyPayment };
