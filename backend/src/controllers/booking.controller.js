const bookingService = require("../services/booking.service");
const availabilityService = require("../services/availability.service");
const paymentService = require("../services/payment.service");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/apiError");

const checkAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut, slot } = req.query;
  if (!checkIn) throw ApiError.badRequest("checkIn is required");

  const result = await availabilityService.isAvailable({
    checkIn,
    checkOut: checkOut || undefined,
    slot,
  });
  return success(res, { data: result });
});

const create = asyncHandler(async (req, res) => {
  const booking = await bookingService.create(req.body);
  return success(res, {
    status: 201,
    message: "Booking request received — we will confirm availability shortly.",
    data: booking,
  });
});

const list = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await bookingService.list({ status, page, limit });
  return success(res, {
    data: result.items,
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

const getById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getById(req.params.id);
  return success(res, { data: booking });
});

const updateStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateStatus(req.params.id, req.body.status);
  return success(res, { message: "Booking status updated", data: booking });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { booking, alreadyVerified } = await paymentService.verifyBookingPayment(req.params.id, {
    verifiedBy: "admin_panel",
  });
  return success(res, {
    message: alreadyVerified ? "Payment was already verified" : "Payment verified — guest notified",
    data: booking,
  });
});

module.exports = { checkAvailability, create, list, getById, updateStatus, verifyPayment };
