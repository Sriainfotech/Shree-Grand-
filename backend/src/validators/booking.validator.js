const { body } = require("express-validator");

const create = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone")
    .trim()
    .matches(/^[+\d][\d\s-]{7,}$/)
    .withMessage("Enter a valid phone number"),
  body("email").optional({ values: "falsy" }).isEmail().withMessage("Enter a valid email address"),
  body("checkIn").isISO8601().toDate().withMessage("Enter a valid check-in date"),
  body("checkOut")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate()
    .withMessage("Enter a valid check-out date"),
  body("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
  body("occasion").optional({ values: "falsy" }).trim(),
  body("slot")
    .optional({ values: "falsy" })
    .isIn(["full_day", "half_day_morning", "half_day_evening"])
    .withMessage("Invalid slot"),
  body("message").optional({ values: "falsy" }).trim().isLength({ max: 2000 }),
];

const updateStatus = [
  body("status").isIn(["pending", "confirmed", "cancelled", "completed"]),
];

module.exports = { create, updateStatus };
