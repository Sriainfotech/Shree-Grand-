const { body } = require("express-validator");

// Accepts either the username or the email address in one field.
const login = [
  body("login").trim().notEmpty().withMessage("Enter your username or email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const register = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage("Username can only contain letters, numbers, underscores and dots"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

module.exports = { login, register };
