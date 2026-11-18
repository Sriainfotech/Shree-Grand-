const { PrismaClient } = require("@prisma/client");
const env = require("./env");
const logger = require("../utils/logger");

/**
 * Shared Prisma client — one instance for the whole process. Every
 * service imports this instead of constructing its own PrismaClient
 * (each instance opens its own connection pool against Neon).
 */
const prisma = new PrismaClient({
  log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
});

// Neon's pooled (PgBouncer) endpoint closes idle sockets on its own schedule.
// Prisma's pool can hold a reference to one of those sockets and only find
// out it's dead when a query tries to use it, surfacing as:
//   prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
// (Prisma error code P1017). This is a transient, retryable condition, not a
// real query failure, so retry the operation a couple of times with a short
// backoff before letting the error propagate.
const RETRYABLE_CODES = new Set(["P1017", "P1001", "P1002"]);
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 200;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

prisma.$use(async (params, next) => {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await next(params);
    } catch (error) {
      const isRetryable = RETRYABLE_CODES.has(error?.code);
      if (!isRetryable || attempt >= MAX_RETRIES) {
        throw error;
      }
      attempt += 1;
      logger.warn(
        `Prisma connection dropped (${error.code}) on ${params.model ?? ""}.${params.action}; ` +
          `retrying (${attempt}/${MAX_RETRIES})`,
      );
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }
});

module.exports = prisma;
