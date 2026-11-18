const blogService = require("../services/blog.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");

const listPublished = asyncHandler(async (req, res) => {
  const { category, page, limit } = req.query;
  const result = await blogService.listPublished({ category, page, limit });
  return success(res, {
    data: result.items,
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

const getBySlug = asyncHandler(async (req, res) => {
  const post = await blogService.getPublishedBySlug(req.params.slug);
  return success(res, { data: post });
});

const listAll = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await blogService.listAll({ page, limit });
  return success(res, {
    data: result.items,
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

const create = asyncHandler(async (req, res) => {
  const post = await blogService.create(req.body);
  return success(res, { status: 201, message: "Post created", data: post });
});

const update = asyncHandler(async (req, res) => {
  const post = await blogService.update(req.params.id, req.body);
  return success(res, { message: "Post updated", data: post });
});

const remove = asyncHandler(async (req, res) => {
  await blogService.remove(req.params.id);
  return success(res, { message: "Post deleted" });
});

module.exports = { listPublished, getBySlug, listAll, create, update, remove };
