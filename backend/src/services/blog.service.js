const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const slugify = require("../utils/slugify");

async function listPublished({ category, page = 1, limit = 20 } = {}) {
  const where = { status: "published", ...(category ? { category } : {}) };
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({ where, orderBy: { publishedAt: "desc" }, skip, take: Number(limit) }),
    prisma.blogPost.count({ where }),
  ]);
  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getPublishedBySlug(slug) {
  const post = await prisma.blogPost.findFirst({ where: { slug, status: "published" } });
  if (!post) throw ApiError.notFound("Post not found");
  return post;
}

async function listAll({ page = 1, limit = 20 } = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
    prisma.blogPost.count(),
  ]);
  return { items, total, page: Number(page), limit: Number(limit) };
}

async function create(data) {
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const toCreate = { ...data, slug };
  if (toCreate.status === "published" && !toCreate.publishedAt) {
    toCreate.publishedAt = new Date();
  }
  return prisma.blogPost.create({ data: toCreate });
}

async function update(id, data) {
  const toUpdate = { ...data };
  if (toUpdate.status === "published") {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (existing && !existing.publishedAt) toUpdate.publishedAt = new Date();
  }

  try {
    return await prisma.blogPost.update({ where: { id }, data: toUpdate });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Post not found");
    throw error;
  }
}

async function remove(id) {
  try {
    await prisma.blogPost.delete({ where: { id } });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Post not found");
    throw error;
  }
}

module.exports = { listPublished, getPublishedBySlug, listAll, create, update, remove };
