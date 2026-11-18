const inquiryService = require("../services/inquiry.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");

const create = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.create(req.body);
  return success(res, {
    status: 201,
    message: "Thanks for reaching out — we'll get back to you shortly.",
    data: inquiry,
  });
});

const list = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await inquiryService.list({ status, page, limit });
  return success(res, {
    data: result.items,
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
  return success(res, { message: "Inquiry status updated", data: inquiry });
});

module.exports = { create, list, updateStatus };
