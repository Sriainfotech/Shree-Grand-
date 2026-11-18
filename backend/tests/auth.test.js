const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");
const { hashPassword } = require("../src/utils/password");

describe("Auth", () => {
  it("rejects login with an unknown identifier", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ login: "nobody@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("logs in with the email address", async () => {
    await prisma.user.create({
      data: {
        name: "Admin",
        username: "sgfs_admin",
        email: "admin@example.com",
        password: await hashPassword("supersecret123"),
        role: "admin",
      },
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ login: "admin@example.com", password: "supersecret123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("admin@example.com");
    expect(res.body.data.user.username).toBe("sgfs_admin");
  });

  it("logs in with the username", async () => {
    await prisma.user.create({
      data: {
        name: "Admin",
        username: "sgfs_admin",
        email: "admin@example.com",
        password: await hashPassword("supersecret123"),
        role: "admin",
      },
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ login: "sgfs_admin", password: "supersecret123" });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("admin@example.com");
  });

  it("rejects /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
