const paymentService = require("../services/payment.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/apiError");

const createOrder = asyncHandler(async (req, res) => {
  const { bookingId, paymentType } = req.body;
  if (!bookingId || !["full", "advance"].includes(paymentType)) {
    throw ApiError.badRequest("bookingId and a valid paymentType ('full' or 'advance') are required");
  }

  const result = await paymentService.createOrder(bookingId, paymentType);
  return success(res, { status: 201, message: "Order created", data: result });
});

const verify = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.body);
  return success(res, { message: "Payment verified", data: payment });
});

const status = asyncHandler(async (req, res) => {
  return success(res, { data: { configured: paymentService.isConfigured() } });
});

/** Renders a minimal standalone HTML page — not JSON — because this is
 * opened directly in a browser from the "Verify payment" button in the
 * admin's email, not called via fetch. */
function renderActionPage(res, { status: httpStatus, title, message }) {
  res.status(httpStatus).type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:48px 20px;background:#faf6ee;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#3a2f26;text-align:center;">
    <h1 style="font-size:22px;margin:0 0 12px;">${title}</h1>
    <p style="font-size:15px;line-height:1.6;max-width:420px;margin:0 auto;color:#8a7f6d;">${message}</p>
  </body>
</html>`);
}

// Deliberately not wrapped in asyncHandler — a thrown ApiError would reach
// error.middleware.js and render as JSON, which looks broken in a browser.
// This is opened directly from an email link, so every outcome (including
// an invalid/expired token) renders the same branded HTML page instead.
const verifyLink = async (req, res) => {
  try {
    const bookingId = paymentService.resolveVerifyToken(req.query.token);
    const { alreadyVerified } = await paymentService.verifyBookingPayment(bookingId, {
      verifiedBy: "email_link",
    });

    return renderActionPage(res, {
      status: 200,
      title: alreadyVerified ? "Already verified" : "Payment verified",
      message: alreadyVerified
        ? "This payment was already verified earlier — the booking is confirmed and the guest has already been emailed."
        : "The booking is now confirmed and the guest has been emailed.",
    });
  } catch (error) {
    const httpStatus = error instanceof ApiError ? error.status : 500;
    return renderActionPage(res, {
      status: httpStatus,
      title: "Couldn't verify this payment",
      message:
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please verify this payment from the admin panel instead.",
    });
  }
};

module.exports = { createOrder, verify, status, verifyLink };
