/**
 * One-off CLI script to bootstrap the very first admin account, since
 * POST /api/auth/register requires an existing admin to already be logged
 * in. Run from backend/:
 *
 *   node scripts/createAdmin.js "Admin Name" adminUsername admin@example.com "a-strong-password"
 */
const prisma = require("../src/config/prisma");
const { hashPassword } = require("../src/utils/password");

async function main() {
  const [, , name, username, email, password] = process.argv;

  if (!name || !username || !email || !password) {
    // eslint-disable-next-line no-console
    console.error(
      'Usage: node scripts/createAdmin.js "Name" username email@example.com "password"',
    );
    process.exit(1);
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: email.toLowerCase() }, { username }] },
  });
  if (existing) {
    // eslint-disable-next-line no-console
    console.error(`An account with this email or username already exists.`);
    process.exit(1);
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email: email.toLowerCase(),
      password: await hashPassword(password),
      role: "admin",
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Admin account created: ${user.username} / ${user.email} (${user.id})`);
  process.exit(0);
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
