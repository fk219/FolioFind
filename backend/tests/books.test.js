const request = require("supertest");
const jwt = require("jsonwebtoken");
const createApp = require("../src/app");
const { createTestDb } = require("./testDb");

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

  function signToken({ sub, email, role }) {
    return jwt.sign({ sub, email, role }, "test_secret", { expiresIn: "1h" });
  }

  describe("GET /api/books", () => {
    test("anonymous can list all books", async () => {
      await collections.books.insertOne({
        bookTitle: "Test Book 1",
        authorName: "Author 1",
        imageURL: "https://example.com/1.jpg",
        category: "Fiction",
        bookDescription: "Description 1",
        bookPDFURL: "https://example.com/1.pdf"
      });

      const res = await request(app).get("/api/books");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("returns empty array when no books exist", async () => {
      const db = await createTestDb();
      const testApp = createApp({ collections: db.collections });

      const res = await request(testApp).get("/api/books");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);

      await db.cleanup();
    });

    test("books include all required fields", async () => {
      const res = await request(app).get("/api/books");
      expect(res.status).toBe(200);
      
      if (res.body.length > 0) {
        const book = res.body[0];
        expect(book.bookTitle).toBeDefined();
        expect(book.authorName).toBeDefined();
        expect(book.category).toBeDefined();
      }
    });
  });

  describe("GET /api/books/:id", () => {
    test("get single book by ID", async () => {
      const insertRes = await collections.books.insertOne({
        bookTitle: "Single Book",
        authorName: "Author X",
        imageURL: "https://example.com/x.jpg",
        category: "Science",
        bookDescription: "Description X",
        bookPDFURL: "https://example.com/x.pdf"
      });

      const res = await request(app).get(`/api/books/${insertRes.insertedId}`);
      expect(res.status).toBe(200);
      expect(res.body.bookTitle).toBe("Single Book");
    });

    test("returns 404 for non-existent book", async () => {
      const fakeId = "507f1f77bcf86cd799439999";
      const res = await request(app).get(`/api/books/${fakeId}`);
      expect(res.status).toBe(404);
    });

    test("returns 400 for invalid ObjectId", async () => {
      const res = await request(app).get("/api/books/invalid-id");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/books (Create)", () => {
    test("non-admin cannot create book - returns 403", async () => {
      const token = signToken({ sub: "u1", email: "u1@example.com", role: "user" });
      const res = await request(app)
        .post("/api/books")
        .set("authorization", `Bearer ${token}`)
        .send({
          bookTitle: "Unauthorized Book",
          authorName: "Hacker",
          imageURL: "https://example.com/hack.jpg",
          category: "Fiction",
          bookDescription: "Should fail",
          bookPDFURL: "https://example.com/hack.pdf"
        });
      expect(res.status).toBe(403);
    });

    test("admin can create book - returns 201", async () => {
      const token = signToken({ sub: "a1", email: "a1@example.com", role: "admin" });
      const res = await request(app)
        .post("/api/books")
        .set("authorization", `Bearer ${token}`)
        .send({
          bookTitle: "Admin Created Book",
          authorName: "Admin Author",
          imageURL: "https://example.com/admin.jpg",
          category: "Mystery",
          bookDescription: "Created by admin",
          bookPDFURL: "https://example.com/admin.pdf"
        });
      expect(res.status).toBe(201);
      expect(res.body.insertedId).toBeTruthy();
    });

    test("unauthenticated user cannot create book - returns 401", async () => {
      const res = await request(app)
        .post("/api/books")
        .send({
          bookTitle: "No Auth Book",
          authorName: "Author",
          imageURL: "https://example.com/no-auth.jpg",
          category: "Fiction",
          bookDescription: "Should fail",
          bookPDFURL: "https://example.com/no-auth.pdf"
        });
      expect(res.status).toBe(401);
    });

    test("admin create with missing fields - returns 400", async () => {
      const token = signToken({ sub: "a1", email: "a1@example.com", role: "admin" });
      const res = await request(app)
        .post("/api/books")
        .set("authorization", `Bearer ${token}`)
        .send({
          bookTitle: "Incomplete Book"
          // Missing other required fields
        });
      expect(res.status).toBe(400);
    });

    test("admin create with invalid token - returns 401", async () => {
      const res = await request(app)
        .post("/api/books")
        .set("authorization", "Bearer invalid-token")
        .send({
          bookTitle: "Book",
          authorName: "Author",
          imageURL: "https://example.com/book.jpg",
          category: "Fiction",
          bookDescription: "Desc",
          bookPDFURL: "https://example.com/book.pdf"
        });
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/books/:id (Update)", () => {
    test("non-admin cannot update book - returns 403", async () => {
      const book = await collections.books.insertOne({
        bookTitle: "Book to Update Non Admin",
        authorName: "Original Author",
        imageURL: "https://example.com/update.jpg",
        category: "Fiction",
        bookDescription: "Original",
        bookPDFURL: "https://example.com/update.pdf"
      });

      const token = signToken({ sub: "u1", email: "u1@example.com", role: "user" });
      const res = await request(app)
        .patch(`/api/books/${book.insertedId}`)
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Updated Title" });

      expect(res.status).toBe(403);
    });

    test("admin can update book - returns 200", async () => {
      const book = await collections.books.insertOne({
        bookTitle: "Book to Update Admin",
        authorName: "Original Author",
        imageURL: "https://example.com/update-admin.jpg",
        category: "Fiction",
        bookDescription: "Original",
        bookPDFURL: "https://example.com/update-admin.pdf"
      });

      const token = signToken({ sub: "a1", email: "a1@example.com", role: "admin" });
      const res = await request(app)
        .patch(`/api/books/${book.insertedId}`)
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Updated Title Admin" });

      expect(res.status).toBe(200);
      expect(res.body.modifiedCount).toBe(1);
    }, 10000);

    test("update non-existent book - returns 404", async () => {
      const token = signToken({ sub: "a1", email: "a1@example.com", role: "admin" });
      const fakeId = "507f1f77bcf86cd799439999";
      const res = await request(app)
        .patch(`/api/books/${fakeId}`)
        .set("authorization", `Bearer ${token}`)
        .send({ bookTitle: "Updated" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/books/:id (Delete)", () => {
    test("non-admin cannot delete book - returns 403", async () => {
      const book = await collections.books.insertOne({
        bookTitle: "Book to Delete",
        authorName: "Author",
        imageURL: "https://example.com/delete.jpg",
        category: "Fiction",
        bookDescription: "Will be deleted",
        bookPDFURL: "https://example.com/delete.pdf"
      });

      const token = signToken({ sub: "u1", email: "u1@example.com", role: "user" });
      const res = await request(app)
        .delete(`/api/books/${book.insertedId}`)
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    test("admin can delete book - returns 200", async () => {
      const book = await collections.books.insertOne({
        bookTitle: "Book to Delete",
        authorName: "Author",
        imageURL: "https://example.com/delete.jpg",
        category: "Fiction",
        bookDescription: "Will be deleted",
        bookPDFURL: "https://example.com/delete.pdf"
      });

      const token = signToken({ sub: "a1", email: "a1@example.com", role: "admin" });
      const res = await request(app)
        .delete(`/api/books/${book.insertedId}`)
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    test("delete non-existent book - returns 404", async () => {
      const token = signToken({ sub: "a1", email: "a1@example.com", role: "admin" });
      const fakeId = "507f1f77bcf86cd799439999";
      const res = await request(app)
        .delete(`/api/books/${fakeId}`)
        .set("authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    test("unauthenticated cannot delete - returns 401", async () => {
      const book = await collections.books.insertOne({
        bookTitle: "Book",
        authorName: "Author",
        imageURL: "https://example.com/b.jpg",
        category: "Fiction",
        bookDescription: "Desc",
        bookPDFURL: "https://example.com/b.pdf"
      });

      const res = await request(app).delete(`/api/books/${book.insertedId}`);
      expect(res.status).toBe(401);
    });
  });
});

