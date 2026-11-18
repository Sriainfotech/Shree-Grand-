const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const ApiError = require("../utils/apiError");

/** Logs in with either the username or the email address, whichever the
 * admin finds easier to remember — both are unique identifiers. */
async function login({ login: identifier, password }) {
  const value = identifier.trim();
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: value.toLowerCase() }, { username: value }] },
  });
  if (!user || !user.active) throw ApiError.unauthorized("Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw ApiError.unauthorized("Invalid credentials");

  const token = signToken({ sub: user.id, role: user.role });
  const { password: _password, ...safeUser } = user;

  return { user: safeUser, token };
}

/**
 * Registers a new admin/editor account. In production this should only be
 * reachable by an already-authenticated admin (see auth.routes.js), except
 * for the very first account — see scripts/createAdmin.js for bootstrapping
 * that without exposing an open registration endpoint.
 */
async function register({ name, username, email, password, role = "editor" }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: email.toLowerCase() }, { username }] },
  });
  if (existing) throw ApiError.conflict("An account with this email or username already exists");

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email: email.toLowerCase(),
      password: await hashPassword(password),
      role,
    },
  });

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

module.exports = { login, register };
