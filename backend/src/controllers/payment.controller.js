const paymentService = require("../services/payment.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/apiError");

const createOrder = asyncHandler(async (req, res) => {
  const { bookingId, paymentType } = req.body;
  if (!bookingId || !["full", "advance"].includes(paymentType)) {
    throw ApiError.badRequest("bookingId and a valid paymentType ('full' or 'advance') are required");
  }

  const result = await paymentService.createOrder(bookingId, paymentType);
  return success(res, { status: 201, message: "Order created", data: result });
});

const verify = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.body);
  return success(res, { message: "Payment verified", data: payment });
});

const status = asyncHandler(async (req, res) => {
  return success(res, { data: { configured: paymentService.isConfigured() } });
});

module.exports = { createOrder, verify, status };
