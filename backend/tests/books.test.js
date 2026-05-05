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

  test("anonymous can list books", async () => {
    await collections.books.insertOne({
      bookTitle: "T1",
      authorName: "A1",
      imageURL: "https://example.com/1.jpg",
      category: "Fiction",
      bookDescription: "D1",
      bookPDFURL: "https://example.com/1.pdf"
    });

    const res = await request(app).get("/api/books");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("non-admin cannot create book", async () => {
    const token = signToken({ sub: "u1", email: "u1@example.com", role: "user" });
    const res = await request(app)
      .post("/api/books")
      .set("authorization", `Bearer ${token}`)
      .send({
        bookTitle: "T2",
        authorName: "A2",
        imageURL: "https://example.com/2.jpg",
        category: "Fiction",
        bookDescription: "D2",
        bookPDFURL: "https://example.com/2.pdf"
      });
    expect(res.status).toBe(403);
  });

  test("admin can create book", async () => {
    const token = signToken({ sub: "a1", email: "a1@example.com", role: "admin" });
    const res = await request(app)
      .post("/api/books")
      .set("authorization", `Bearer ${token}`)
      .send({
        bookTitle: "T3",
        authorName: "A3",
        imageURL: "https://example.com/3.jpg",
        category: "Fiction",
        bookDescription: "D3",
        bookPDFURL: "https://example.com/3.pdf"
      });
    expect(res.status).toBe(201);
    expect(res.body.insertedId).toBeTruthy();
  });
});

