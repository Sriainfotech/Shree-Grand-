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

module.exports = router;
