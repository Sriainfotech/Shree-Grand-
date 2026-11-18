const prisma = require("./prisma");
const logger = require("../utils/logger");

/** Connects to Neon (or any Postgres) via Prisma. Never points at a local
 * Postgres instance in any deployed environment — see DATABASE_URL in
 * .env.example. */
async function connectDB() {
  try {
    await prisma.$connect();
    logger.info("Connected to the database (Neon Postgres via Prisma)");
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
}

async function disconnectDB() {
  await prisma.$disconnect();
}

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
