const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return success(res, { message: "Logged in", data: result });
});

/** Creates a new admin/editor account. Mounted behind `protect` +
 * `authorize("admin")` in routes — only an existing admin can create more
 * accounts (see scripts/createAdmin.js for the very first one). */
const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return success(res, { status: 201, message: "Account created", data: user });
});

const me = asyncHandler(async (req, res) => {
  return success(res, { data: req.user });
});

module.exports = { login, register, me };
