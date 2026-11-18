const { validationResult } = require("express-validator");
const { fail } = require("../utils/response");

/** Runs after an array of express-validator checks; short-circuits with a
 * 400 + field-level errors if any check failed. */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return fail(res, {
    status: 400,
    message: "Validation failed",
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
}

module.exports = validate;
