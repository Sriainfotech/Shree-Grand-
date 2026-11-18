/** Throw this from a service/controller to produce a specific HTTP status +
 * message via error.middleware.js, instead of a generic 500. */
class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request", errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  static serviceUnavailable(message = "Service unavailable") {
    return new ApiError(503, message);
  }
}

module.exports = ApiError;
