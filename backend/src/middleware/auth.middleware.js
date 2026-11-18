const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/prisma");

const SAFE_USER_FIELDS = {
  id: true,
  name: true,
  username: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
};

/** Requires a valid "Bearer <token>" Authorization header; attaches the
 * authenticated user (never the password hash) to req.user. */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw ApiError.unauthorized("Authentication required");

  const payload = verifyToken(token);
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: SAFE_USER_FIELDS,
  });
  if (!user || !user.active) throw ApiError.unauthorized("Invalid or expired session");

  req.user = user;
  next();
});

/** Restricts a route to one or more roles. Use after `protect`. */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    }
    next();
  };
}

module.exports = { protect, authorize };
