const { ObjectId } = require("mongodb");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const createApp = require("../src/app");
const { createTestDb } = require("./testDb");

const VALID_BOOK = {
  bookTitle: "Test Book",
  authorName: "Author",
  imageURL: "https://example.com/book.jpg",
  category: "Fiction",
  bookDescription: "Description",
  price: 14.99,
  condition: "New"
};

describe("books", () => {
  let app;
  let cleanup;
  let collections;

  beforeAll(async () => {
    const db = await createTestDb();
    collections = db.collections;
    cleanup = db.cleanup;
    app = createApp({ collections });
  });

  afterAll(async () => {
    await cleanup();
  });

  const { jwtSecret } = require("../src/config");

  function signToken({ sub, email, role, fullName }) {
    return jwt.sign({ sub, email, role, fullName }, jwtSecret || "test_secret", { expiresIn: "1h" });
  }

  function seedTestBook(overrides = {}) {
    return collections.books.insertOne({
      ...VALID_BOOK,
      sellerId: "a1",
      sellerEmail: "admin@test.com",
      sellerName: "Admin",
      status: "available",
      createdAt: new Date(),
      ...overrides
    });
  }

  describe("GET /api/books", () => {
    test("anonymous can list all available books", async () => {
      await seedTestBook();

      const res = await request(app).get("/api/books");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.books)).toBe(true);
      expect(res.body.books.length).toBeGreaterThan(0);
      expect(typeof res.body.pagination.total).toBe("number");
    });

    test("returns empty list when no books exist", async () => {
      const db = await createTestDb();
      const testApp = createApp({ collections: db.collections });

      const res = await request(testApp).get("/api/books");
      expect(res.status).toBe(200);
      expect(res.body.books).toEqual([]);
      expect(res.body.pagination.total).toBe(0);

      await db.cleanup();
    });

    test("filters by category", async () => {
      await seedTestBook({ bookTitle: "Cat A", category: "Fiction" });
      await seedTestBook({ bookTitle: "Cat B", category: "Science" });

      const res = await request(app).get("/api/books?category=Science");
      expect(res.status).toBe(200);
      expect(res.body.books.every(b => b.category === "Science")).toBe(true);
      expect(res.body.pagination.total).toBe(1);
    });

    test("excludes sold books", async () => {
      await seedTestBook({ bookTitle: "Available 1" });
      await seedTestBook({ bookTitle: "Sold 1", status: "sold" });

      const res = await request(app).get("/api/books");
      expect(res.status).toBe(200);
      expect(res.body.books.every(b => b.status !== "sold")).toBe(true);
    });
  });

  describe("GET /api/books/:id", () => {
    test("get single book by ID", async () => {
      const { insertedId } = await seedTestBook();
      const res = await request(app).get(`/api/books/${insertedId}`);
      expect(res.status).toBe(200);
      expect(res.body.book.bookTitle).toBe("Test Book");
    });

    test("returns 404 for non-existent book", async () => {
      const res = await request(app).get("/api/books/507f1f77bcf86cd799439999");
      expect(res.status).toBe(404);
    });

    test("returns 400 for invalid ObjectId", async () => {
      const res = await request(app).get("/api/books/invalid-id");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/books/mine", () => {
    test("returns user's own listings", async () => {
      await seedTestBook({ sellerId: "u1" });
      await seedTestBook({ sellerId: "a1" });

      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });
      const res = await request(app)
        .get("/api/books/mine")
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.books.length).toBe(1);
      expect(res.body.books[0].sellerId).toBe("u1");
    });

    test("requires authentication", async () => {
      const res = await request(app).get("/api/books/mine");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/books (Create)", () => {
    test("any authenticated user can create a book listing", async () => {
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user", fullName: "User One" });
      const res = await request(app)
        .post("/api/books")
        .set("authorization", `Bearer ${token}`)
        .send(VALID_BOOK);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Book listed");
      expect(res.body.data.id).toBeTruthy();

      const created = await collections.books.findOne({ _id: new ObjectId(res.body.data.id) });
      expect(created.sellerId).toBe("u1");
      expect(created.sellerName).toBe("User One");
      expect(created.status).toBe("available");
    });

    test("unauthenticated user returns 401", async () => {
      const res = await request(app).post("/api/books").send(VALID_BOOK);
      expect(res.status).toBe(401);
    });

    test("missing required fields returns 400", async () => {
      const token = signToken({ sub: "a1", email: "a1@test.com", role: "admin" });
      const res = await request(app)
        .post("/api/books")
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Incomplete" });
      expect(res.status).toBe(400);
    });

    test("invalid token returns 401", async () => {
      const res = await request(app)
        .post("/api/books")
        .set("authorization", "Bearer invalid-token")
        .send(VALID_BOOK);
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/books/:id (Update)", () => {
    test("seller can update their own book", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "u1" });
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });

      const res = await request(app)
        .patch(`/api/books/${insertedId}`)
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Updated Title" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Book updated");
    });

    test("non-seller non-admin cannot update - returns 403", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "a1" });
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });

      const res = await request(app)
        .patch(`/api/books/${insertedId}`)
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Hacked Title" });

      expect(res.status).toBe(403);
    });

    test("admin can update any book", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "u1" });
      const token = signToken({ sub: "a1", email: "a1@test.com", role: "admin" });

      const res = await request(app)
        .patch(`/api/books/${insertedId}`)
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Admin Updated" });

      expect(res.status).toBe(200);
    });

    test("update non-existent book returns 404", async () => {
      const token = signToken({ sub: "a1", email: "a1@test.com", role: "admin" });
      const res = await request(app)
        .patch("/api/books/507f1f77bcf86cd799439999")
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Updated" });
      expect(res.status).toBe(404);
    });

    test("unauthenticated returns 401", async () => {
      const { insertedId } = await seedTestBook();
      const res = await request(app)
        .patch(`/api/books/${insertedId}`)
        .send({ bookTitle: "No Auth" });
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/books/:id/status", () => {
    test("seller can mark book as sold", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "u1" });
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });

      const res = await request(app)
        .patch(`/api/books/${insertedId}/status`)
        .set("authorization", `Bearer ${token}`)
        .send({ status: "sold" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Status updated");

      const updated = await collections.books.findOne({ _id: insertedId });
      expect(updated.status).toBe("sold");
    });

    test("non-seller cannot change status", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "a1" });
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });

      const res = await request(app)
        .patch(`/api/books/${insertedId}/status`)
        .set("authorization", `Bearer ${token}`)
        .send({ status: "sold" });

      expect(res.status).toBe(403);
    });

    test("admin can change any book status", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "u1" });
      const token = signToken({ sub: "a1", email: "a1@test.com", role: "admin" });

      const res = await request(app)
        .patch(`/api/books/${insertedId}/status`)
        .set("authorization", `Bearer ${token}`)
        .send({ status: "pending" });

      expect(res.status).toBe(200);
    });

    test("invalid status value returns 400", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "u1" });
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });

      const res = await request(app)
        .patch(`/api/books/${insertedId}/status`)
        .set("authorization", `Bearer ${token}`)
        .send({ status: "nonexistent" });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/books/:id", () => {
    test("seller can delete their own book", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "u1" });
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });

      const res = await request(app)
        .delete(`/api/books/${insertedId}`)
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Book deleted");

      const deleted = await collections.books.findOne({ _id: insertedId });
      expect(deleted).toBeNull();
    });

    test("non-seller cannot delete - returns 403", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "a1" });
      const token = signToken({ sub: "u1", email: "u1@test.com", role: "user" });

      const res = await request(app)
        .delete(`/api/books/${insertedId}`)
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    test("admin can delete any book", async () => {
      const { insertedId } = await seedTestBook({ sellerId: "u1" });
      const token = signToken({ sub: "a1", email: "a1@test.com", role: "admin" });

      const res = await request(app)
        .delete(`/api/books/${insertedId}`)
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    test("delete non-existent book returns 404", async () => {
      const token = signToken({ sub: "a1", email: "a1@test.com", role: "admin" });
      const res = await request(app)
        .delete("/api/books/507f1f77bcf86cd799439999")
        .set("authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    test("unauthenticated returns 401", async () => {
      const { insertedId } = await seedTestBook();
      const res = await request(app).delete(`/api/books/${insertedId}`);
      expect(res.status).toBe(401);
    });
  });
});