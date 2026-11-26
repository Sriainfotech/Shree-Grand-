const crypto = require("crypto");
const env = require("../config/env");

/** Signed, no-login action tokens for one-click links embedded in emails
 * (e.g. "Verify payment" in the admin notification). Not a session/auth
 * token — just an HMAC-signed, expiring payload, verified without the
 * `protect` JWT-login middleware so the admin can act straight from their
 * inbox. Reuses JWT_SECRET since it's already a required, server-only
 * secret; a forged token still needs that secret to produce a valid HMAC. */

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — plenty for an admin to get to their inbox

function sign(payload, ttlMs = DEFAULT_TTL_MS) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttlMs })).toString(
    "base64url",
  );
  const signature = crypto.createHmac("sha256", env.jwtSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

/** Returns the decoded payload, or null if the token is malformed, tampered
 * with, or expired. Never throws — callers treat null as "link invalid". */
function verify(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = crypto.createHmac("sha256", env.jwtSecret).update(body).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

module.exports = { sign, verify };
