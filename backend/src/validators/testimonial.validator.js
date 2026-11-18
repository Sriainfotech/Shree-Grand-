const { body } = require("express-validator");

const create = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("review").trim().isLength({ min: 10 }).withMessage("Review must be at least 10 characters"),
  body("rating").optional({ values: "falsy" }).isInt({ min: 1, max: 5 }),
  body("role").optional({ values: "falsy" }).trim(),
  body("image").optional({ values: "falsy" }).isString(),
];

const update = [
  body("name").optional().trim().notEmpty(),
  body("review").optional().trim().isLength({ min: 10 }),
  body("rating").optional({ values: "falsy" }).isInt({ min: 1, max: 5 }),
  body("published").optional().isBoolean(),
  body("featured").optional().isBoolean(),
];

module.exports = { create, update };
