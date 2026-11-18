const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/upload.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { uploadImage } = require("../middleware/upload.middleware");

// Admin-only — generic single-image upload, used by any admin form that
// offers "upload a file" as an alternative to pasting an image URL.
router.post("/", protect, authorize("admin", "editor"), uploadImage, uploadController.uploadOne);

module.exports = router;
