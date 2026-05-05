const { ObjectId } = require("mongodb");

function assertObjectId(id) {
  if (!ObjectId.isValid(id)) {
    const err = new Error("Invalid id");
    err.statusCode = 400;
    throw err;
  }
  return new ObjectId(id);
}

async function list(collections, { category } = {}) {
  const query = category ? { category } : {};
  return collections.books.find(query).toArray();
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

async function create(collections, payload) {
  const result = await collections.books.insertOne(payload);
  return { insertedId: result.insertedId };
}

async function update(collections, id, payload) {
  const _id = assertObjectId(id);
  const result = await collections.books.updateOne({ _id }, { $set: payload }, { upsert: false });
  if (result.matchedCount === 0) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  return result;
}

async function remove(collections, id) {
  const _id = assertObjectId(id);
  const result = await collections.books.deleteOne({ _id });
  if (result.deletedCount === 0) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  return result;
}

module.exports = { list, getById, create, update, remove };
