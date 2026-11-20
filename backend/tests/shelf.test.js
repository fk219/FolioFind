const { ObjectId } = require("mongodb");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const createApp = require("../src/app");
const { createTestDb } = require("./testDb");

describe("reading room shelf", () => {
  let app;
  let cleanup;
  let collections;
  let userId;
  let token;
  let bookId;

  const { jwtSecret } = require("../src/config");

  beforeAll(async () => {
    const db = await createTestDb();
    collections = db.collections;
    cleanup = db.cleanup;
    app = createApp({ collections });
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await collections.users.deleteMany({});
    await collections.books.deleteMany({});

    const user = await collections.users.insertOne({
      email: "reader@example.com",
      passwordHash: "hash",
      fullName: "Reader",
      role: "user",
      createdAt: new Date()
    });
    userId = user.insertedId;
    token = jwt.sign(
      { sub: String(userId), email: "reader@example.com", role: "user", fullName: "Reader" },
      jwtSecret || "test_secret",
      { expiresIn: "1h" }
    );

    const book = await collections.books.insertOne({
      bookTitle: "The Great Gatsby",
      authorName: "F. Scott Fitzgerald",
      category: "Fiction",
      bookDescription: "Description",
      imageURL: "https://example.com/gatsby.jpg",
      price: 12.99,
      condition: "Good",
      status: "available",
      sellerId: "seed",
      sellerEmail: "seller@example.com",
      sellerName: "Seller",
      createdAt: new Date()
    });
    bookId = String(book.insertedId);
  });

  test("requires authentication", async () => {
    const res = await request(app).get("/api/shelf");
    expect(res.status).toBe(401);
  });

  test("starts empty for a new reader", async () => {
    const res = await request(app).get("/api/shelf").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.counts).toEqual({ "want-to-read": 0, reading: 0, finished: 0 });
  });

  test("adds and groups a book on the shelf", async () => {
    const put = await request(app)
      .put(`/api/shelf/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "reading", note: "Halfway through chapter three." });

    expect(put.status).toBe(200);
    expect(put.body.item.shelf.status).toBe("reading");

    const get = await request(app).get("/api/shelf").set("Authorization", `Bearer ${token}`);
    expect(get.status).toBe(200);
    expect(get.body.items).toHaveLength(1);
    expect(get.body.items[0].bookTitle).toBe("The Great Gatsby");
    expect(get.body.items[0].shelf.note).toBe("Halfway through chapter three.");
    expect(get.body.counts.reading).toBe(1);
    expect(get.body.counts["want-to-read"]).toBe(0);
  });

  test("updates the status without duplicating the entry", async () => {
    await request(app)
      .put(`/api/shelf/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "want-to-read" });

    await request(app)
      .put(`/api/shelf/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "finished", note: "Finished on the train." });

    const get = await request(app).get("/api/shelf").set("Authorization", `Bearer ${token}`);
    expect(get.body.items).toHaveLength(1);
    expect(get.body.items[0].shelf.status).toBe("finished");
    expect(get.body.counts.finished).toBe(1);

    const user = await collections.users.findOne({ _id: userId });
    expect(user.shelf).toHaveLength(1);
  });

  test("removes a book from the shelf", async () => {
    await request(app)
      .put(`/api/shelf/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "want-to-read" });

    const remove = await request(app)
      .delete(`/api/shelf/${bookId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(remove.status).toBe(200);

    const get = await request(app).get("/api/shelf").set("Authorization", `Bearer ${token}`);
    expect(get.body.items).toEqual([]);
  });

  test("rejects an invalid status and unknown book", async () => {
    const invalid = await request(app)
      .put(`/api/shelf/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "reading-later" });
    expect(invalid.status).toBe(400);

    const missing = await request(app)
      .put(`/api/shelf/${new ObjectId()}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "reading" });
    expect(missing.status).toBe(404);
  });
});
