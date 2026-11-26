const { MongoClient } = require("mongodb");

async function createTestDb() {
  // Tests must use a disposable MongoDB, never the production database from .env.
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/folioFind-test";
  const client = new MongoClient(uri);
  await client.connect();

  // Create a unique database name per test suite to run in absolute isolation
  const randomSuffix = Math.random().toString(36).substring(7);
  const dbName = `BookInventoryTest_${randomSuffix}`;
  const db = client.db(dbName);

  const collections = {
    books: db.collection("Books"),
    users: db.collection("users")
  };

  async function cleanup() {
    try {
      // Drop the isolated database to prevent cluttering the MongoDB cluster
      await db.dropDatabase();
    } catch (e) {
      console.warn("Failed to drop test database:", e.message);
    }
    try {
      await client.close();
    } catch (e) {}
  }

  return { collections, cleanup };
}

module.exports = { createTestDb };