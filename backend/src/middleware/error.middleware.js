const { Prisma } = require("@prisma/client");
const env = require("../config/env");
const logger = require("../utils/logger");
const { fail } = require("../utils/response");
const ApiError = require("../utils/apiError");

/** 404 handler — mounted after all routes. */
function notFoundHandler(req, res) {
  return fail(res, { status: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/** Central error handler — every controller funnels errors here via
 * asyncHandler/next(error). Mounted last, after every other middleware. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return fail(res, { status: err.status, message: err.message, errors: err.errors });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation (e.g. duplicate email/slug).
    if (err.code === "P2002") {
      const field = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "field";
      return fail(res, { status: 409, message: `${field} already exists` });
    }
    // Record to update/delete not found.
    if (err.code === "P2025") {
      return fail(res, { status: 404, message: "Record not found" });
    }
    // Foreign key constraint failed (e.g. booking references a deleted room).
    if (err.code === "P2003") {
      return fail(res, { status: 400, message: "Referenced record does not exist" });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return fail(res, { status: 400, message: "Invalid request data" });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return fail(res, { status: 401, message: "Invalid or expired session, please log in again" });
  }

  logger.error(err.stack || err.message);
  return fail(res, {
    status: 500,
    message: env.nodeEnv === "production" ? "Something went wrong" : err.message,
  });
}

module.exports = { notFoundHandler, errorHandler };
