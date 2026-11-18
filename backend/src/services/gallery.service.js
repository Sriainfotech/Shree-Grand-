const fs = require("fs/promises");
const path = require("path");
const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const { uploadsPath } = require("../middleware/upload.middleware");
const logger = require("../utils/logger");

async function list({ category } = {}) {
  const where = { published: true, ...(category ? { category } : {}) };
  return prisma.galleryImage.findMany({
    where,
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

async function listAll() {
  return prisma.galleryImage.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

async function create(data) {
  return prisma.galleryImage.create({ data });
}

async function update(id, data) {
  try {
    return await prisma.galleryImage.update({ where: { id }, data });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Gallery image not found");
    throw error;
  }
}

async function remove(id) {
  let deleted;
  try {
    deleted = await prisma.galleryImage.delete({ where: { id } });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Gallery image not found");
    throw error;
  }

  // Best-effort file cleanup — only for files this app actually stored
  // locally (skips any external/legacy URLs) and never fails the delete
  // itself if the file is already gone or unreadable.
  if (deleted.url?.startsWith("/uploads/")) {
    const filePath = path.join(uploadsPath, path.basename(deleted.url));
    await fs.unlink(filePath).catch((error) => {
      logger.warn(`Could not remove gallery file ${filePath}: ${error.message}`);
    });
  }
}

module.exports = { list, listAll, create, update, remove };
