const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Testimonials", () => {
  it("never returns an unpublished testimonial on the public endpoint", async () => {
    await prisma.testimonial.create({
      data: { name: "Real Guest", review: "Wonderful stay!", published: false },
    });

    const res = await request(app).get("/api/testimonials");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("returns a testimonial once published", async () => {
    await prisma.testimonial.create({
      data: { name: "Real Guest", review: "Wonderful stay!", published: true },
    });

    const res = await request(app).get("/api/testimonials");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Real Guest");
  });

  it("submitted reviews start unpublished, never shown immediately", async () => {
    const createRes = await request(app)
      .post("/api/testimonials")
      .send({ name: "New Guest", review: "Loved the pool and the lawn." });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.published).toBe(false);

    const publicRes = await request(app).get("/api/testimonials");
    expect(publicRes.body.data).toHaveLength(0);
  });
});
