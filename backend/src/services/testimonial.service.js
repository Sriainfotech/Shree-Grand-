const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

/** Public — published only. Never fabricated: a testimonial only appears
 * here once an admin has explicitly set published: true. */
async function listPublished({ featuredOnly = false } = {}) {
  const where = featuredOnly ? { published: true, featured: true } : { published: true };
  return prisma.testimonial.findMany({
    where,
    orderBy: [{ featured: "desc" }, { date: "desc" }],
  });
}

/** Admin — everything, published or not. */
async function listAll({ page = 1, limit = 20 } = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
    prisma.testimonial.count(),
  ]);
  return { items, total, page: Number(page), limit: Number(limit) };
}

async function create(data) {
  // Submitted testimonials (e.g. from a "leave a review" form) start
  // unpublished until an admin reviews them.
  return prisma.testimonial.create({ data: { ...data, published: false, featured: false } });
}

async function update(id, data) {
  try {
    return await prisma.testimonial.update({ where: { id }, data });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Testimonial not found");
    throw error;
  }
}

async function remove(id) {
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Testimonial not found");
    throw error;
  }
}

module.exports = { listPublished, listAll, create, update, remove };
