const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/property.controller");
const propertyValidator = require("../validators/property.validator");
const validate = require("../middleware/validate.middleware");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public — the single property record (name, description, photos,
// amenities, guest capacity, day price) shown before the booking form.
router.get("/", propertyController.getPublic);

// Admin — edits the same singleton row.
router.put(
  "/",
  protect,
  authorize("admin", "editor"),
  propertyValidator.update,
  validate,
  propertyController.update,
);

module.exports = router;
