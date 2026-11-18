const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/apiError");

/** Generic admin image upload — takes one file (field "image") and returns
 * its public URL. Not tied to any one model (Gallery has its own create
 * endpoint that also stores metadata); this backs any admin form field that
 * wants an "upload a file" option alongside "paste a URL", e.g. Property and
 * Blog images. */
const uploadOne = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("An image file is required");

  const url = `/uploads/${path.basename(req.file.path)}`;
  return success(res, { status: 201, message: "Image uploaded", data: { url } });
});

module.exports = { uploadOne };
