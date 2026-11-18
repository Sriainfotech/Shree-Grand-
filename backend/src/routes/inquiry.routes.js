const express = require("express");
const router = express.Router();

const inquiryController = require("../controllers/inquiry.controller");
const inquiryValidator = require("../validators/inquiry.validator");
const validate = require("../middleware/validate.middleware");
const { protect, authorize } = require("../middleware/auth.middleware");
const { formLimiter } = require("../middleware/rateLimit.middleware");

// Public — the "inquiry form" requirement.
router.post("/", formLimiter, inquiryValidator.create, validate, inquiryController.create);

// Admin — manage inquiries.
router.get("/", protect, authorize("admin", "editor"), inquiryController.list);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "editor"),
  inquiryValidator.updateStatus,
  validate,
  inquiryController.updateStatus,
);

module.exports = router;
