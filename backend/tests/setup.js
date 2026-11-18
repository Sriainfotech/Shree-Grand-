const prisma = require("../src/config/prisma");

// The tables to truncate between tests, in an order that's safe for
// foreign keys (payments reference bookings; nothing else does).
const TABLES = [
  "payments",
  "bookings",
  "property",
  "inquiries",
  "testimonials",
  "blog_posts",
  "gallery_images",
  "users",
];

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Tests run against a real Postgres database (a disposable " +
        "Neon branch is ideal, never production) — export DATABASE_URL before running `npm test`. " +
        "See backend/README.md → Running tests.",
    );
  }
  await prisma.$connect();
  // Also clear before the very first test — afterEach only cleans up
  // between tests, so leftover rows from manual testing against this same
  // database would otherwise make the first test's assertions (e.g. a
  // fresh-date availability check) collide with real data.
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${TABLES.join(", ")} CASCADE`);
});

afterEach(async () => {
  // TRUNCATE ... CASCADE resets identity sequences and clears every table
  // between tests without needing to know per-model delete order.
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${TABLES.join(", ")} CASCADE`);
});

afterAll(async () => {
  await prisma.$disconnect();
});
