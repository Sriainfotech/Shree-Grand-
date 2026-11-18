const rateLimit = require("express-rate-limit");

/** General API limiter — generous, mainly an abuse backstop. */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

/** Tighter limiter for public form submissions (bookings, inquiries) so the
 * site can't be used to spam the admin/WhatsApp notifications. */
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions from this device — please try again in a few minutes.",
  },
});

/** Strict limiter for auth endpoints to slow down credential brute-forcing. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts — please try again later." },
});

module.exports = { apiLimiter, formLimiter, authLimiter };
