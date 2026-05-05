const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

async function createTestDb() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("BookInventory");
  const collections = {
    books: db.collection("Books"),
    users: db.collection("users")
  };

  async function cleanup() {
    await client.close();
    await mongod.stop();
  }

  return { collections, cleanup };
}

module.exports = { createTestDb };
