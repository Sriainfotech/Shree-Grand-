const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const { formLimiter } = require("../middleware/rateLimit.middleware");

// The "payment gateway" requirement. Returns 503 with a clear message from
// payment.service.js until RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET are set —
// see .env.example. No fake/placeholder payment is ever accepted.
router.get("/status", paymentController.status);
router.post("/orders", formLimiter, paymentController.createOrder);
router.post("/verify", formLimiter, paymentController.verify);

// Public, no-login — the one-click "Verify payment" link in the admin's
// notification email. Protected by a signed, expiring token
// (utils/actionToken.js) rather than the usual JWT admin login, since it's
// meant to be opened straight from a mail app. See payment.controller.js.
router.get("/verify-link", paymentController.verifyLink);

module.exports = router;
