const { ObjectId } = require("mongodb");

const STATUSES = ["want-to-read", "reading", "finished"];

function assertObjectId(id) {
  if (!ObjectId.isValid(id)) {
    const err = new Error("Invalid id");
    err.statusCode = 400;
    throw err;
  }
  return new ObjectId(id);
}

function emptyCounts() {
  return { "want-to-read": 0, reading: 0, finished: 0 };
}

async function list(collections, userId) {
  const _id = assertObjectId(userId);
  const user = await collections.users.findOne({ _id }, { projection: { shelf: 1 } });
  const shelf = Array.isArray(user?.shelf) ? user.shelf : [];
  if (shelf.length === 0) return { items: [], counts: emptyCounts() };

  const books = await collections.books
    .find({ _id: { $in: shelf.map((entry) => entry.bookId) } })
    .toArray();
  const byId = new Map(books.map((book) => [String(book._id), book]));

  const counts = emptyCounts();
  const items = [];

  for (const entry of shelf) {
    const book = byId.get(String(entry.bookId));
    if (!book) continue;
    const status = STATUSES.includes(entry.status) ? entry.status : "want-to-read";
    counts[status] += 1;
    items.push({
      ...book,
      shelf: {
        status,
        note: entry.note || "",
        addedAt: entry.addedAt,
        updatedAt: entry.updatedAt
      }
    });
  }

  items.sort((a, b) => new Date(b.shelf.updatedAt || 0) - new Date(a.shelf.updatedAt || 0));
  return { items, counts };
}

async function upsert(collections, userId, bookId, { status, note }) {
  const _id = assertObjectId(userId);
  const bookObjectId = assertObjectId(bookId);
  const book = await collections.books.findOne({ _id: bookObjectId });
  if (!book) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }

  const now = new Date();
  const trimmedNote = (note || "").trim();
  const existing = await collections.users.findOne(
    { _id, "shelf.bookId": bookObjectId },
    { projection: { _id: 1 } }
  );

  if (existing) {
    await collections.users.updateOne(
      { _id, "shelf.bookId": bookObjectId },
      { $set: { "shelf.$.status": status, "shelf.$.note": trimmedNote, "shelf.$.updatedAt": now } }
    );
  } else {
    await collections.users.updateOne(
      { _id },
      {
        $push: {
          shelf: { bookId: bookObjectId, status, note: trimmedNote, addedAt: now, updatedAt: now }
        }
      }
    );
  }

  return {
    ...book,
    shelf: { status, note: trimmedNote, addedAt: existing ? undefined : now, updatedAt: now }
  };
}

async function remove(collections, userId, bookId) {
  const _id = assertObjectId(userId);
  const bookObjectId = assertObjectId(bookId);
  const result = await collections.users.updateOne(
    { _id },
    { $pull: { shelf: { bookId: bookObjectId } } }
  );
  if (result.matchedCount === 0) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  return { success: true };
}

module.exports = { list, upsert, remove };
