const { body } = require("express-validator");

const update = [
  body("name").optional({ values: "falsy" }).trim().notEmpty(),
  body("description").optional({ values: "falsy" }).trim(),
  body("images").optional().isArray(),
  body("images.*").optional().isString(),
  body("amenities").optional().isArray(),
  body("amenities.*").optional().isString(),
  body("guestCapacity").optional({ values: "null" }).isInt({ min: 1 }),
  body("pricePerDay").optional({ values: "null" }).isFloat({ min: 0 }),
  body("priceLabel").optional({ values: "falsy" }).trim(),
];

module.exports = { update };
