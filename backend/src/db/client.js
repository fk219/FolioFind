const { MongoClient, ServerApiVersion } = require("mongodb");
const { mongoUri } = require("../config");

let client;

function ensureMongoUri() {
  if (!mongoUri) {
    const err = new Error("Missing required env var: MONGO_URI");
    err.statusCode = 500;
    throw err;
  }
}

function getClient() {
  if (!client) {
    ensureMongoUri();
    client = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
  }
  return client;
}

async function connectDb() {
  const c = getClient();
  await c.connect();
  return c;
}

function getCollections(c) {
  const db = c.db("BookInventory");
  return {
    books: db.collection("Books"),
    users: db.collection("users")
  };
}

module.exports = { connectDb, getCollections };
