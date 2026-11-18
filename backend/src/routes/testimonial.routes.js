const express = require("express");
const router = express.Router();

const testimonialController = require("../controllers/testimonial.controller");
const testimonialValidator = require("../validators/testimonial.validator");
const validate = require("../middleware/validate.middleware");
const { protect, authorize } = require("../middleware/auth.middleware");
const { formLimiter } = require("../middleware/rateLimit.middleware");

// Public — published testimonials only.
router.get("/", testimonialController.listPublished);

// Public — submit a review (starts unpublished, admin approves it).
router.post(
  "/",
  formLimiter,
  testimonialValidator.create,
  validate,
  testimonialController.create,
);

// Admin — moderate.
router.get("/all", protect, authorize("admin", "editor"), testimonialController.listAll);
router.patch(
  "/:id",
  protect,
  authorize("admin", "editor"),
  testimonialValidator.update,
  validate,
  testimonialController.update,
);
router.delete("/:id", protect, authorize("admin"), testimonialController.remove);

module.exports = router;
