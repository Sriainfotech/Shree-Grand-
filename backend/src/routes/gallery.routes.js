const express = require("express");
const router = express.Router();

const galleryController = require("../controllers/gallery.controller");
const galleryValidator = require("../validators/gallery.validator");
const validate = require("../middleware/validate.middleware");
const { protect, authorize } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

// Public — the "gallery" requirement.
router.get("/", galleryController.list);

// Admin — upload/manage images.
router.get("/all", protect, authorize("admin", "editor"), galleryController.listAll);
router.post(
  "/",
  protect,
  authorize("admin", "editor"),
  uploadImage,
  galleryValidator.create,
  validate,
  galleryController.create,
);
router.patch("/:id", protect, authorize("admin", "editor"), galleryController.update);
router.delete("/:id", protect, authorize("admin"), galleryController.remove);

module.exports = router;
