const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");
const bookingValidator = require("../validators/booking.validator");
const validate = require("../middleware/validate.middleware");
const { protect, authorize } = require("../middleware/auth.middleware");
const { formLimiter } = require("../middleware/rateLimit.middleware");

// Public — the "online booking integration" requirement.
router.post("/", formLimiter, bookingValidator.create, validate, bookingController.create);
router.get("/availability", bookingController.checkAvailability);

// Admin — manage bookings.
router.get("/", protect, authorize("admin", "editor"), bookingController.list);
router.get("/:id", protect, authorize("admin", "editor"), bookingController.getById);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "editor"),
  bookingValidator.updateStatus,
  validate,
  bookingController.updateStatus,
);
router.patch(
  "/:id/verify-payment",
  protect,
  authorize("admin", "editor"),
  bookingController.verifyPayment,
);

module.exports = router;
