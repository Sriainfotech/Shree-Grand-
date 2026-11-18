const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const whatsapp = require("../utils/whatsapp");
const mailer = require("../utils/mailer");
const emailTemplates = require("../utils/emailTemplates");
const config = require("../config/config");
const logger = require("../utils/logger");
const availabilityService = require("./availability.service");
const propertyService = require("./property.service");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

async function create(data) {
  // Multi-night stays always occupy the full day for every night booked;
  // only a single-day booking can be a half-day slot.
  const slot = data.checkOut ? "full_day" : data.slot || "full_day";

  // Pricing isn't concurrency-sensitive (unlike availability), so it's
  // fetched before opening the transaction — keeps the transaction's DB
  // round trips to just the availability check + insert, well within its
  // timeout even against a remote (Neon) connection.
  const property = await propertyService.get();
  const nights = data.checkOut
    ? Math.round((new Date(data.checkOut) - new Date(data.checkIn)) / MS_PER_DAY)
    : 1;
  const dayFraction = data.checkOut || slot === "full_day" ? 1 : 0.5;

  const totalAmount = property.pricePerDay
    ? Math.round(property.pricePerDay * nights * dayFraction * 100) / 100
    : null;
  const advanceAmount = totalAmount
    ? Math.round(totalAmount * config.booking.advancePercentage) / 100
    : null;

  const booking = await prisma.$transaction(async (tx) => {
    const { available } = await availabilityService.isAvailable({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      slot,
      client: tx,
    });
    if (!available) {
      throw ApiError.conflict(
        "This slot is already booked for the selected date(s). Please choose another date or slot.",
      );
    }

    return tx.booking.create({
      data: { ...data, slot, totalAmount, advanceAmount, source: "website" },
    });
  });

  // Best-effort notifications — never block or fail the booking itself if
  // WhatsApp/SMTP aren't configured or a send fails.
  whatsapp
    .notifyAdmin(
      `New booking request on the website:\n` +
        `Name: ${booking.name}\nPhone: ${booking.phone}\n` +
        `Check-in: ${booking.checkIn.toDateString()}\nGuests: ${booking.guests}\n` +
        `Occasion: ${booking.occasion || "-"}\n` +
        `Advance required: ${config.booking.advancePercentage}%`,
    )
    .catch((error) => logger.error(`Booking WhatsApp notification failed: ${error.message}`));

  const advanceLabel = `${config.booking.advancePercentage}%`;

  mailer
    .notifyAdmin(
      `New booking request — ${booking.name}`,
      {
        Name: booking.name,
        Phone: booking.phone,
        Email: booking.email,
        "Check-in": booking.checkIn.toDateString(),
        "Check-out": booking.checkOut ? booking.checkOut.toDateString() : null,
        Guests: booking.guests,
        Occasion: booking.occasion,
        Message: booking.message,
        "Advance required": advanceLabel,
      },
      emailTemplates.bookingAdminEmailHtml(booking, { advanceLabel }),
    )
    .catch((error) => logger.error(`Booking email notification failed: ${error.message}`));

  mailer
    .confirmToSender({
      to: booking.email,
      subject: "We've received your booking request — Shri Grand Farm Stay",
      text:
        `Hi ${booking.name},\n\nThanks for your booking request for ${booking.checkIn.toDateString()}. ` +
        `We'll confirm availability and get back to you shortly on ${booking.phone}.\n\n` +
        `— Shri Grand Farm Stay`,
      html: emailTemplates.bookingConfirmationEmailHtml(booking, { advanceLabel }),
    })
    .catch((error) => logger.error(`Booking confirmation email failed: ${error.message}`));

  return booking;
}

async function list({ status, page = 1, limit = 20 }) {
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.booking.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.booking.count({ where: filter }),
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getById(id) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw ApiError.notFound("Booking not found");
  return booking;
}

async function updateStatus(id, status) {
  try {
    return await prisma.booking.update({ where: { id }, data: { status } });
  } catch (error) {
    if (error.code === "P2025") throw ApiError.notFound("Booking not found");
    throw error;
  }
}

module.exports = { create, list, getById, updateStatus };
