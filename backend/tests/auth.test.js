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

  describe("POST /api/auth/register", () => {
    test("register returns token + user with 201 status", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "u1@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user.email).toBe("u1@example.com");
      expect(res.body.user.role).toBe("user");
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    test("register with duplicate email returns 409 conflict", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ email: "duplicate@example.com", password: "password123" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "duplicate@example.com", password: "password456" });

      expect(res.status).toBe(409);
      expect(res.body.error).toBeDefined();
    });

    test("register with invalid email returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "not-an-email", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test("register with missing password returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test("register with weak password returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com", password: "weak" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    test("login works after register", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ email: "user2@example.com", password: "password123" });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "user2@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user.email).toBe("user2@example.com");
    });

    test("login with wrong password returns 401", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ email: "user3@example.com", password: "correctPassword123" });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "user3@example.com", password: "wrongPassword123" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test("login with non-existent email returns 401", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test("login with missing email returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
    });

    test("login with missing password returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/auth/me", () => {
    test("me requires token and returns 401", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    test("me returns current user info with valid token", async () => {
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send({ email: "user4@example.com", password: "password123" });

      const token = registerRes.body.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("user4@example.com");
      expect(res.body.user.role).toBe("user");
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    test("me returns 401 with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token-xyz");

      expect(res.status).toBe(401);
    });

    test("me returns 401 with malformed auth header", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "InvalidFormat token");

      expect(res.status).toBe(401);
    });
  });
});
