const propertyService = require("../services/property.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");

const getPublic = asyncHandler(async (req, res) => {
  const property = await propertyService.get();
  return success(res, { data: property });
});

const update = asyncHandler(async (req, res) => {
  const property = await propertyService.update(req.body);
  return success(res, { message: "Property updated", data: property });
});

module.exports = { getPublic, update };
