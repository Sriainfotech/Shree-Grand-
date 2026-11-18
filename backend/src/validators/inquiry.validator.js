const { body } = require("express-validator");

const create = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone")
    .trim()
    .matches(/^[+\d][\d\s-]{7,}$/)
    .withMessage("Enter a valid phone number"),
  body("email").optional({ values: "falsy" }).isEmail().withMessage("Enter a valid email address"),
  body("occasion").optional({ values: "falsy" }).trim(),
  body("message").optional({ values: "falsy" }).trim().isLength({ max: 2000 }),
];

const updateStatus = [body("status").isIn(["new", "contacted", "closed"])];

module.exports = { create, updateStatus };
