/** Consistent success envelope for every endpoint. */
function success(res, { status = 200, message = "OK", data = null, meta = null } = {}) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

/** Consistent error envelope — used directly, or via error.middleware.js
 * for anything thrown/passed to next(). */
function fail(res, { status = 500, message = "Something went wrong", errors = null } = {}) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
}

module.exports = { success, fail };
