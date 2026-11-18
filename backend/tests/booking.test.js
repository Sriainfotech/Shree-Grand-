const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Bookings", () => {
  it("creates a booking from valid public input", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        name: "Priya Sharma",
        phone: "+919876543210",
        checkIn: "2026-12-20",
        guests: 4,
        occasion: "Family Stay",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("pending");

    const stored = await prisma.booking.findUnique({ where: { id: res.body.data.id } });
    expect(stored).not.toBeNull();
  });

  it("rejects a booking missing required fields", async () => {
    const res = await request(app).post("/api/bookings").send({ name: "No Phone" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("blocks unauthenticated access to the admin booking list", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.status).toBe(401);
  });

  describe("whole-property slot availability", () => {
    async function setPropertyPrice(pricePerDay = 5000) {
      return prisma.property.upsert({
        where: { id: "property" },
        update: { pricePerDay },
        create: { id: "property", pricePerDay },
      });
    }

    it("reports a fresh date/slot as available", async () => {
      await setPropertyPrice();
      const res = await request(app).get(
        "/api/bookings/availability?checkIn=2026-12-25&slot=full_day",
      );
      expect(res.status).toBe(200);
      expect(res.body.data.available).toBe(true);
    });

    it("computes a 25% advanceAmount from the property's day rate", async () => {
      await setPropertyPrice(4000);
      const res = await request(app).post("/api/bookings").send({
        name: "Asha Rao",
        phone: "+919876500000",
        checkIn: "2026-12-25",
        guests: 2,
        slot: "full_day",
      });

      expect(res.status).toBe(201);
      expect(res.body.data.totalAmount).toBe(4000);
      expect(res.body.data.advanceAmount).toBe(1000);
    });

    it("blocks a second full_day booking for the same date", async () => {
      await setPropertyPrice();
      const first = await request(app).post("/api/bookings").send({
        name: "Asha Rao",
        phone: "+919876500000",
        checkIn: "2026-12-26",
        guests: 2,
        slot: "full_day",
      });
      expect(first.status).toBe(201);

      const second = await request(app).post("/api/bookings").send({
        name: "Rohit Verma",
        phone: "+919876500001",
        checkIn: "2026-12-26",
        guests: 3,
        slot: "half_day_morning",
      });
      expect(second.status).toBe(409);
    });

    it("allows two half-day bookings on opposite halves of the same day", async () => {
      await setPropertyPrice();
      const morning = await request(app).post("/api/bookings").send({
        name: "Asha Rao",
        phone: "+919876500000",
        checkIn: "2026-12-27",
        guests: 2,
        slot: "half_day_morning",
      });
      expect(morning.status).toBe(201);

      const evening = await request(app).post("/api/bookings").send({
        name: "Rohit Verma",
        phone: "+919876500001",
        checkIn: "2026-12-27",
        guests: 2,
        slot: "half_day_evening",
      });
      expect(evening.status).toBe(201);
    });

    it("scales the total amount by the number of nights for multi-night stays", async () => {
      await setPropertyPrice(3000);
      const res = await request(app).post("/api/bookings").send({
        name: "Asha Rao",
        phone: "+919876500000",
        checkIn: "2026-12-28",
        checkOut: "2026-12-31",
        guests: 2,
      });

      expect(res.status).toBe(201);
      expect(res.body.data.totalAmount).toBe(9000);
    });
  });
});
