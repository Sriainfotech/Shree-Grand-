const { body } = require("express-validator");

const categories = [
  "pool",
  "rooms",
  "lawn",
  "party-hall",
  "garden",
  "dining",
  "campfire",
  "events",
  "drone",
];

const create = [
  body("category").trim().isIn(categories).withMessage(`Category must be one of: ${categories.join(", ")}`),
  body("title").optional({ values: "falsy" }).trim(),
  body("caption").optional({ values: "falsy" }).trim(),
  body("type").optional().isIn(["image", "video"]),
  // Only present when the admin pasted a URL instead of uploading a file —
  // whether one of these two was actually supplied is checked in the
  // controller (it needs req.file, which multer parses before this runs).
  body("url").optional({ values: "falsy" }).trim().isString(),
  // multer parses multipart fields as strings, so this must coerce to a
  // real number — Prisma's `order` column is Int and rejects a numeric
  // string outright.
  body("order").optional({ values: "falsy" }).isInt().toInt(),
];

module.exports = { create, categories };
