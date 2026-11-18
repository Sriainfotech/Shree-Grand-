const express = require("express");
const router = express.Router();

const { login, register, me } = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const validate = require("../middleware/validate.middleware");
const { protect, authorize } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");

router.post("/login", authLimiter, authValidator.login, validate, login);

// Registering a new admin/editor account requires an existing admin — see
// scripts/createAdmin.js to bootstrap the very first account from the CLI
// instead of exposing an open signup endpoint.
router.post(
  "/register",
  protect,
  authorize("admin"),
  authValidator.register,
  validate,
  register,
);

router.get("/me", protect, me);

module.exports = router;
