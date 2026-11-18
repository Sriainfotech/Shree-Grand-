const prisma = require("../config/prisma");

/**
 * Which slots conflict with which. A `full_day` booking blocks the whole
 * day; the two half-day slots only block themselves (and full_day) — two
 * bookings on opposite halves of the same day coexist fine.
 */
const SLOT_CONFLICTS = {
  full_day: ["full_day", "half_day_morning", "half_day_evening"],
  half_day_morning: ["full_day", "half_day_morning"],
  half_day_evening: ["full_day", "half_day_evening"],
};

const ACTIVE_STATUSES = ["pending", "confirmed"];

const oneDayLater = (date) => new Date(date.getTime() + 24 * 60 * 60 * 1000);

/**
 * Checks whether the whole property is free for the requested
 * checkIn/checkOut/slot — a booking is never for "part of" the property, so
 * this checks across every active booking, not a specific room. Multi-night
 * requests (checkOut set) are always full_day and only conflict on
 * date-range overlap; single-day requests also need a slot conflict.
 *
 * `excludeBookingId` lets a booking being re-checked (e.g. during an update)
 * skip colliding with itself — unused by create() today but kept for reuse.
 */
async function isAvailable({ checkIn, checkOut, slot, excludeBookingId, client = prisma }) {
  const requestedCheckIn = new Date(checkIn);
  const requestedCheckOut = checkOut ? new Date(checkOut) : oneDayLater(requestedCheckIn);
  const effectiveSlot = checkOut ? "full_day" : slot || "full_day";

  const candidates = await client.booking.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      checkIn: { lt: requestedCheckOut },
    },
    select: { id: true, checkIn: true, checkOut: true, slot: true },
  });

  const conflicts = candidates.filter((existing) => {
    const existingEnd = existing.checkOut ?? oneDayLater(existing.checkIn);
    if (!(existing.checkIn < requestedCheckOut && existingEnd > requestedCheckIn)) return false;

    // Multi-night bookings on either side always conflict on date overlap
    // alone; only same-day, single-day bookings get the slot-level check.
    const bothSingleDay = !checkOut && !existing.checkOut;
    if (!bothSingleDay) return true;

    return SLOT_CONFLICTS[effectiveSlot]?.includes(existing.slot) ?? true;
  });

  return { available: conflicts.length === 0, conflicts };
}

module.exports = { isAvailable, SLOT_CONFLICTS };
