const path = require("path");
const galleryService = require("../services/gallery.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/apiError");

const list = asyncHandler(async (req, res) => {
  const images = await galleryService.list({ category: req.query.category });
  return success(res, { data: images });
});

const listAll = asyncHandler(async (req, res) => {
  const images = await galleryService.listAll();
  return success(res, { data: images });
});

/** Expects EITHER an uploaded file on `req.file` (see upload.middleware.js)
 * OR a `url` in the body — the admin's choice — plus
 * category/title/caption/type/order in the body. */
const create = asyncHandler(async (req, res) => {
  const url = req.file ? `/uploads/${path.basename(req.file.path)}` : req.body.url;
  if (!url) throw ApiError.badRequest("An image file or URL is required");

  const image = await galleryService.create({ ...req.body, url });
  return success(res, { status: 201, message: "Image added", data: image });
});

const update = asyncHandler(async (req, res) => {
  const image = await galleryService.update(req.params.id, req.body);
  return success(res, { message: "Image updated", data: image });
});

const remove = asyncHandler(async (req, res) => {
  await galleryService.remove(req.params.id);
  return success(res, { message: "Image deleted" });
});

module.exports = { list, listAll, create, update, remove };
