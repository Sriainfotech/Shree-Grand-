/** Wraps an async route/controller handler so a rejected promise is passed
 * to next(error) automatically, instead of needing a try/catch in every
 * controller. */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
