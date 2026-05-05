const request = require("supertest");
const createApp = require("../src/app");
const { createTestDb } = require("./testDb");

describe("auth", () => {
  let app;
  let cleanup;

  beforeAll(async () => {
    const db = await createTestDb();
    cleanup = db.cleanup;
    app = createApp({ collections: db.collections });
  });

  afterAll(async () => {
    await cleanup();
  });

  test("register returns token + user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "u1@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("u1@example.com");
    expect(res.body.user.role).toBe("user");
  });

  test("login works after register", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "u2@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "u2@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("u2@example.com");
  });

  test("me requires token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
