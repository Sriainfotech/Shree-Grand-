const prisma = require("../config/prisma");

const PROPERTY_ID = "property";

/** Returns the singleton Property row, creating the default one on first
 * access if it doesn't exist yet (fresh database / before an admin has ever
 * saved settings). */
async function get() {
  return prisma.property.upsert({
    where: { id: PROPERTY_ID },
    update: {},
    create: { id: PROPERTY_ID },
  });
}

async function update(data) {
  return prisma.property.upsert({
    where: { id: PROPERTY_ID },
    update: data,
    create: { id: PROPERTY_ID, ...data },
  });
}

module.exports = { get, update, PROPERTY_ID };
