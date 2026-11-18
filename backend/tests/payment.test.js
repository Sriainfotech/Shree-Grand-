const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

// These tests only cover the parts of the payment flow that don't require a
// live Razorpay account: server-side amount computation is rejected/accepted
// correctly before ever reaching the gateway. The gateway itself is
// exercised manually with test-mode keys (see README).
describe("Payments — order amount", () => {
  async function makeBooking(totalAmount) {
    return prisma.booking.create({
      data: {
        name: "Test Guest",
        phone: "+919876500000",
        checkIn: new Date("2026-12-28"),
        guests: 2,
        totalAmount,
        advanceAmount: totalAmount ? Math.round(totalAmount * 0.25 * 100) / 100 : null,
      },
    });
  }

  it("rejects an order for a booking with no fixed price yet", async () => {
    const booking = await makeBooking(null);

    const res = await request(app)
      .post("/api/payments/orders")
      .send({ bookingId: booking.id, paymentType: "advance" });

    // Either "price not set" (400) or "gateway not configured" (503) —
    // both are correct depending on whether RAZORPAY_* env vars are set in
    // this test run; either way it must never silently accept the order.
    expect([400, 503]).toContain(res.status);
  });

  it("rejects an invalid paymentType before touching the gateway", async () => {
    const booking = await makeBooking(4000);

    const res = await request(app)
      .post("/api/payments/orders")
      .send({ bookingId: booking.id, paymentType: "half" });

    expect(res.status).toBe(400);
  });
});
