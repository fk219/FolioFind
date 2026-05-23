const { ObjectId } = require("mongodb");

function assertObjectId(id) {
  if (!ObjectId.isValid(id)) {
    const err = new Error("Invalid id");
    err.statusCode = 400;
    throw err;
  }
  return new ObjectId(id);
}

async function list(collections, { category, page = 1, limit = 12 } = {}) {
  const query = { status: { $ne: "sold" } };
  if (category) query.category = category;

  const total = await collections.books.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;

  const books = await collections.books
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    books,
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 }
  };
}

async function listByUser(collections, userId) {
  const sellerId = String(userId);
  const books = await collections.books.find({ sellerId }).sort({ createdAt: -1 }).toArray();
  return { books, count: books.length };
}

async function getById(collections, id) {
  const _id = assertObjectId(id);
  const book = await collections.books.findOne({ _id });
  if (!book) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  return book;
}

async function create(collections, payload, user) {
  const doc = {
    ...payload,
    sellerId: String(user.id),
    sellerEmail: user.email,
    sellerName: user.fullName || user.email,
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const result = await collections.books.insertOne(doc);
  return { id: result.insertedId };
}

async function update(collections, id, payload, user) {
  const _id = assertObjectId(id);
  const book = await collections.books.findOne({ _id });
  if (!book) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  if (String(book.sellerId) !== String(user.id) && user.role !== "admin") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  await collections.books.updateOne(
    { _id },
    { $set: { ...payload, updatedAt: new Date() } }
  );
  return { success: true };
}

async function remove(collections, id, user) {
  const _id = assertObjectId(id);
  const book = await collections.books.findOne({ _id });
  if (!book) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  if (String(book.sellerId) !== String(user.id) && user.role !== "admin") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  await collections.books.deleteOne({ _id });
  return { success: true };
}

async function updateStatus(collections, id, status, user) {
  const _id = assertObjectId(id);
  const book = await collections.books.findOne({ _id });
  if (!book) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  if (String(book.sellerId) !== String(user.id) && user.role !== "admin") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  await collections.books.updateOne(
    { _id },
    { $set: { status, updatedAt: new Date() } }
  );
  return { success: true };
}

module.exports = { list, listByUser, getById, create, update, remove, updateStatus };