const testimonialService = require("../services/testimonial.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");

const listPublished = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.listPublished({
    featuredOnly: req.query.featured === "true",
  });
  return success(res, { data: testimonials });
});

const listAll = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await testimonialService.listAll({ page, limit });
  return success(res, {
    data: result.items,
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

const create = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.create(req.body);
  return success(res, {
    status: 201,
    message: "Thank you — your review will appear once approved.",
    data: testimonial,
  });
});

const update = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.update(req.params.id, req.body);
  return success(res, { message: "Testimonial updated", data: testimonial });
});

const remove = asyncHandler(async (req, res) => {
  await testimonialService.remove(req.params.id);
  return success(res, { message: "Testimonial deleted" });
});

module.exports = { listPublished, listAll, create, update, remove };
