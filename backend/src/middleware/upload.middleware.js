const fs = require("fs");
const path = require("path");
const multer = require("multer");
const env = require("../config/env");
const config = require("../config/config");
const ApiError = require("../utils/apiError");

const uploadsPath = path.join(process.cwd(), env.uploadsDir);
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 60);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (config.uploads.allowedImageTypes.includes(file.mimetype)) return cb(null, true);
  cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
}

/** Single-image upload middleware, field name "image". Used by the gallery
 * (and could back a room-photo/testimonial-avatar upload the same way). */
const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadSizeMb * 1024 * 1024 },
}).single("image");

module.exports = { uploadImage, uploadsPath };
