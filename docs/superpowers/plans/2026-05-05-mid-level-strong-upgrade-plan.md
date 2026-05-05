# Mid-Level Strong Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the current MERN Book Store repo into a resume-ready “mid-level strong” project by removing secrets, adding local JWT auth + admin authorization, refactoring backend structure, adding validation/tests/CI, and cleaning frontend API/auth integration.

**Architecture:** Backend becomes a small layered Express app (`app.js`, routes/controllers/middleware/db) with JWT auth and admin-only write operations; frontend uses an env-based API base URL and a local auth context (no Firebase).

**Tech Stack:** Node.js, Express, MongoDB, JWT, bcrypt, Jest/Supertest; React/Vite, Tailwind, Vitest/RTL; GitHub Actions CI.

---

## Pre-flight (One-time safety)

### Task 0: Remove leaked credentials from the real services

**Files:** none

- [ ] **Step 1: Rotate MongoDB Atlas credentials**
  - Action: change the DB user password / revoke the user used in the leaked URI currently in source.
  - Expected: old connection string stops working.

- [ ] **Step 2: Rotate Firebase keys (optional)**
  - Action: since Firebase will be removed, you can delete that Firebase project or rotate keys.

---

## Target file structure (after refactor)

### Backend

- Create: `backend/src/server.js`
- Create: `backend/src/app.js`
- Create: `backend/src/config.js`
- Create: `backend/src/db/client.js`
- Create: `backend/src/routes/auth.js`
- Create: `backend/src/routes/books.js`
- Create: `backend/src/controllers/authController.js`
- Create: `backend/src/controllers/booksController.js`
- Create: `backend/src/middleware/auth.js`
- Create: `backend/src/middleware/requireAdmin.js`
- Create: `backend/src/middleware/errorHandler.js`
- Create: `backend/src/validation/authSchemas.js`
- Create: `backend/src/validation/bookSchemas.js`
- Create: `backend/jest.config.cjs`
- Create: `backend/tests/auth.test.js`
- Create: `backend/tests/books.test.js`
- Create: `backend/tests/testDb.js`
- Create: `backend/.env.example`
- Modify: `backend/package.json`
- Delete: `backend/index.js` (after cutover)

### Frontend

- Create: `frontend/src/config.js`
- Create: `frontend/src/api/http.js`
- Create: `frontend/src/api/auth.js`
- Create: `frontend/src/api/books.js`
- Modify: `frontend/src/contexts/AuthProvider.jsx`
- Modify: `frontend/src/PrivateRoute/PrivateRoute.jsx`
- Create: `frontend/src/PrivateRoute/AdminRoute.jsx`
- Modify: `frontend/src/routers/router.jsx`
- Modify: all places with hardcoded API URLs
- Delete: `frontend/src/firebase/firebase.config.js`
- Modify: `frontend/package.json` (remove firebase dependency)
- Create: `frontend/.env.example`
- Create: `frontend/vitest.config.js` (if needed)
- Create: `frontend/src/test/setupTests.js`
- Create: `frontend/src/PrivateRoute/__tests__/PrivateRoute.test.jsx`
- Create: `frontend/src/contexts/__tests__/AuthProvider.test.jsx`

### CI / Docs

- Create: `.github/workflows/ci.yml`
- Modify: `README.md` (root)

---

## Task 1: Backend dependencies + env wiring

**Files:**
- Modify: `backend/package.json`
- Create: `backend/.env.example`
- Create: `backend/src/config.js`

- [ ] **Step 1: Add backend dependencies**

Edit `backend/package.json`:

```json
{
  "name": "bookmanagerserver",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest --runInBand"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "express-rate-limit": "^7.5.0",
    "helmet": "^7.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "zod": "^3.25.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "jest": "^30.0.0",
    "supertest": "^7.1.0",
    "mongodb-memory-server": "^10.2.0"
  }
}
```

- [ ] **Step 2: Install backend deps**

Run (from repo root):

```bash
cd backend
npm install
```

Expected: `added ... packages`, exit code 0.

- [ ] **Step 3: Add `backend/.env.example`**

Create `backend/.env.example`:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/book_inventory
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=replace_me_with_long_random_string
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_me
```

- [ ] **Step 4: Add config loader**

Create `backend/src/config.js`:

```js
const dotenv = require("dotenv");

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    const err = new Error(`Missing required env var: ${name}`);
    err.statusCode = 500;
    throw err;
  }
  return value;
}

module.exports = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  mongoUri: requireEnv("MONGO_URI"),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || ""
};
```

- [ ] **Step 5: Commit**

```bash
git add backend/package.json backend/package-lock.json backend/.env.example backend/src/config.js
git commit -m "chore(backend): add env config and core deps"
```

---

## Task 2: Backend app skeleton + DB client

**Files:**
- Create: `backend/src/db/client.js`
- Create: `backend/src/app.js`
- Create: `backend/src/server.js`

- [ ] **Step 1: Create Mongo client helper**

Create `backend/src/db/client.js`:

```js
const { MongoClient, ServerApiVersion } = require("mongodb");
const { mongoUri } = require("../config");

let client;

function getClient() {
  if (!client) {
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
```

- [ ] **Step 2: Create Express app**

Create `backend/src/app.js`:

```js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { corsOrigin } = require("./config");
const errorHandler = require("./middleware/errorHandler");

function createApp({ collections }) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ ok: true, name: "mern-book-store-api" });
  });

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 });
  app.use("/api/auth", authLimiter);

  app.use("/api/auth", require("./routes/auth")(collections));
  app.use("/api/books", require("./routes/books")(collections));

  app.use(errorHandler);
  return app;
}

module.exports = createApp;
```

- [ ] **Step 3: Create server entry**

Create `backend/src/server.js`:

```js
const createApp = require("./app");
const { connectDb, getCollections } = require("./db/client");
const { port } = require("./config");
const { seedAdminIfNeeded } = require("./controllers/authController");

async function start() {
  const client = await connectDb();
  const collections = getCollections(client);
  await seedAdminIfNeeded(collections);

  const app = createApp({ collections });
  app.listen(port, () => {
    process.stdout.write(`API listening on ${port}\n`);
  });
}

start().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`);
  process.exit(1);
});
```

- [ ] **Step 4: Run backend locally (smoke)**

```bash
cd backend
npm run dev
```

Expected: prints `API listening on 5000` (or your PORT).

- [ ] **Step 5: Commit**

```bash
git add backend/src/app.js backend/src/server.js backend/src/db/client.js
git commit -m "refactor(backend): add app/server structure and db client"
```

---

## Task 3: Auth schemas + auth middleware

**Files:**
- Create: `backend/src/validation/authSchemas.js`
- Create: `backend/src/middleware/auth.js`
- Create: `backend/src/middleware/requireAdmin.js`
- Create: `backend/src/middleware/errorHandler.js`

- [ ] **Step 1: Add auth validation schemas**

Create `backend/src/validation/authSchemas.js`:

```js
const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128)
});

module.exports = { registerSchema, loginSchema };
```

- [ ] **Step 2: Add error handler**

Create `backend/src/middleware/errorHandler.js`:

```js
module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const error = statusCode >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST";

  res.status(statusCode).json({ statusCode, error, message });
};
```

- [ ] **Step 3: Add JWT auth middleware**

Create `backend/src/middleware/auth.js`:

```js
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    const err = new Error("Missing Authorization Bearer token");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (e) {
    const err = new Error("Invalid or expired token");
    err.statusCode = 401;
    return next(err);
  }
}

module.exports = { requireAuth };
```

- [ ] **Step 4: Add admin guard**

Create `backend/src/middleware/requireAdmin.js`:

function requireAdmin(req, res, next) {
  if (!req.user) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }
  if (req.user.role !== "admin") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    return next(err);
  }
  return next();
}

module.exports = { requireAdmin };
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/validation/authSchemas.js backend/src/middleware/auth.js backend/src/middleware/requireAdmin.js backend/src/middleware/errorHandler.js
git commit -m "feat(backend): add auth middleware, admin guard, and error handling"
```

---

## Task 4: Auth controller + routes

**Files:**
- Create: `backend/src/controllers/authController.js`
- Create: `backend/src/routes/auth.js`

- [ ] **Step 1: Create auth controller**

Create `backend/src/controllers/authController.js`:

```js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn, adminEmail, adminPassword } = require("../config");

function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

async function seedAdminIfNeeded(collections) {
  if (!adminEmail || !adminPassword) return;
  const existing = await collections.users.findOne({ email: adminEmail });
  if (existing) return;

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await collections.users.insertOne({
    email: adminEmail,
    passwordHash,
    role: "admin",
    createdAt: new Date()
  });
}

async function register(collections, payload) {
  const exists = await collections.users.findOne({ email: payload.email });
  if (exists) {
    const err = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(payload.password, 10);
  const result = await collections.users.insertOne({
    email: payload.email,
    passwordHash,
    role: "user",
    createdAt: new Date()
  });
  const user = { _id: result.insertedId, email: payload.email, role: "user" };
  return { token: signToken(user), user };
}

async function login(collections, payload) {
  const user = await collections.users.findOne({ email: payload.email });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }
  const ok = await bcrypt.compare(payload.password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }
  return { token: signToken(user), user: { _id: user._id, email: user.email, role: user.role } };
}

module.exports = { register, login, seedAdminIfNeeded };
```

- [ ] **Step 2: Create auth routes**

Create `backend/src/routes/auth.js`:

```js
const express = require("express");
const { registerSchema, loginSchema } = require("../validation/authSchemas");
const { requireAuth } = require("../middleware/auth");
const authController = require("../controllers/authController");

module.exports = function authRoutes(collections) {
  const router = express.Router();

  router.post("/register", async (req, res, next) => {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await authController.register(collections, payload);
      res.status(201).json(result);
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await authController.login(collections, payload);
      res.json(result);
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.get("/me", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });

  return router;
};
```

- [ ] **Step 3: Smoke test auth**

```bash
cd backend
npm run dev
```

In another terminal:

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"user1@example.com","password":"password123"}' | head
```

Expected: JSON containing `token` and `user`.

- [ ] **Step 4: Commit**

```bash
git add backend/src/controllers/authController.js backend/src/routes/auth.js
git commit -m "feat(backend): add local auth routes (register/login/me)"
```

---

## Task 5: Books schemas + routes/controllers (admin-only writes)

**Files:**
- Create: `backend/src/validation/bookSchemas.js`
- Create: `backend/src/controllers/booksController.js`
- Create: `backend/src/routes/books.js`

- [ ] **Step 1: Create book schema**

Create `backend/src/validation/bookSchemas.js`:

```js
const { z } = require("zod");

const bookSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(200),
  category: z.string().min(1).max(100).optional(),
  imageURL: z.string().url().optional(),
  description: z.string().max(5000).optional(),
  pdfURL: z.string().url().optional(),
  price: z.number().nonnegative().optional()
});

const bookPatchSchema = bookSchema.partial().refine((v) => Object.keys(v).length > 0, {
  message: "At least one field must be provided"
});

module.exports = { bookSchema, bookPatchSchema };
```

- [ ] **Step 2: Create books controller**

Create `backend/src/controllers/booksController.js`:

```js
const { ObjectId } = require("mongodb");

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

async function list(collections, { category }) {
  const query = category ? { category } : {};
  return collections.books.find(query).toArray();
}

async function getById(collections, id) {
  if (!isValidObjectId(id)) {
    const err = new Error("Invalid id");
    err.statusCode = 400;
    throw err;
  }
  const book = await collections.books.findOne({ _id: new ObjectId(id) });
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
  if (!isValidObjectId(id)) {
    const err = new Error("Invalid id");
    err.statusCode = 400;
    throw err;
  }
  const result = await collections.books.updateOne(
    { _id: new ObjectId(id) },
    { $set: payload },
    { upsert: false }
  );
  if (result.matchedCount === 0) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  return result;
}

async function remove(collections, id) {
  if (!isValidObjectId(id)) {
    const err = new Error("Invalid id");
    err.statusCode = 400;
    throw err;
  }
  const result = await collections.books.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    const err = new Error("Not found");
    err.statusCode = 404;
    throw err;
  }
  return result;
}

module.exports = { list, getById, create, update, remove };
```

- [ ] **Step 3: Create books routes**

Create `backend/src/routes/books.js`:

```js
const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/requireAdmin");
const { bookSchema, bookPatchSchema } = require("../validation/bookSchemas");
const booksController = require("../controllers/booksController");

module.exports = function booksRoutes(collections) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const category = req.query?.category ? String(req.query.category) : "";
      const books = await booksController.list(collections, { category: category || undefined });
      res.json(books);
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const book = await booksController.getById(collections, req.params.id);
      res.json(book);
    } catch (e) {
      next(e);
    }
  });

  router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const payload = bookSchema.parse(req.body);
      const result = await booksController.create(collections, payload);
      res.status(201).json(result);
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.patch("/:id", requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const payload = bookPatchSchema.parse(req.body);
      const result = await booksController.update(collections, req.params.id, payload);
      res.json(result);
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const result = await booksController.remove(collections, req.params.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
};
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/validation/bookSchemas.js backend/src/controllers/booksController.js backend/src/routes/books.js
git commit -m "feat(backend): add /api/books with admin-only writes"
```

---

## Task 6: Remove legacy backend file and routes

**Files:**
- Delete: `backend/index.js`

- [ ] **Step 1: Verify no one references legacy endpoints**
  - Ensure frontend is updated in later tasks before deleting, or keep both temporarily.

- [ ] **Step 2: Delete `backend/index.js`**
- [ ] **Step 3: Commit**

```bash
git rm backend/index.js
git commit -m "chore(backend): remove legacy single-file server"
```

---

## Task 7: Backend tests (Jest + Supertest + in-memory Mongo)

**Files:**
- Create: `backend/jest.config.cjs`
- Create: `backend/tests/testDb.js`
- Create: `backend/tests/auth.test.js`
- Create: `backend/tests/books.test.js`

- [ ] **Step 1: Add Jest config**

Create `backend/jest.config.cjs`:

```js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"]
};
```

- [ ] **Step 2: Add in-memory Mongo helper**

Create `backend/tests/testDb.js`:

```js
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
```

- [ ] **Step 3: Write auth tests**

Create `backend/tests/auth.test.js`:

```js
const request = require("supertest");
const createApp = require("../src/app");
const { createTestDb } = require("./testDb");

describe("auth", () => {
  let app;
  let cleanup;

  beforeAll(async () => {
    const db = await createTestDb();
    cleanup = db.cleanup;
    app = createApp({ collections: db.collections });
  });

  afterAll(async () => {
    await cleanup();
  });

  test("register returns token + user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "u1@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("u1@example.com");
    expect(res.body.user.role).toBe("user");
  });

  test("login works after register", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "u2@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "u2@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("u2@example.com");
  });

  test("me requires token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 4: Write books authZ tests**

Create `backend/tests/books.test.js`:

```js
const request = require("supertest");
const bcrypt = require("bcryptjs");
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

  function signTestToken(user) {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
    return jwt.sign(
      { sub: String(user._id), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  test("anonymous can list books", async () => {
    await collections.books.insertOne({ title: "T1", author: "A1", category: "C1" });
    const res = await request(app).get("/api/books");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("non-admin cannot create", async () => {
    const user = { _id: "u1", email: "u1@example.com", role: "user" };
    const token = signTestToken(user);
    const res = await request(app)
      .post("/api/books")
      .set("authorization", `Bearer ${token}`)
      .send({ title: "B1", author: "A1", category: "C1" });
    expect(res.status).toBe(403);
  });

  test("admin can create", async () => {
    const admin = { _id: "a1", email: "a1@example.com", role: "admin" };
    const token = signTestToken(admin);
    const res = await request(app)
      .post("/api/books")
      .set("authorization", `Bearer ${token}`)
      .send({ title: "B2", author: "A2", category: "C2" });
    expect(res.status).toBe(201);
    expect(res.body.insertedId).toBeTruthy();
  });
});
```

- [ ] **Step 5: Run backend tests**

```bash
cd backend
JWT_SECRET=test_secret npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/jest.config.cjs backend/tests
git commit -m "test(backend): add jest/supertest coverage for auth and books"
```

---

## Task 8: Frontend env config + HTTP client

**Files:**
- Create: `frontend/.env.example`
- Create: `frontend/src/config.js`
- Create: `frontend/src/api/http.js`
- Create: `frontend/src/api/auth.js`
- Create: `frontend/src/api/books.js`

- [ ] **Step 1: Add frontend env example**

Create `frontend/.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

- [ ] **Step 2: Add config helper**

Create `frontend/src/config.js`:

```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
```

- [ ] **Step 3: Add HTTP client**

Create `frontend/src/api/http.js`:

```js
import { API_BASE_URL } from "../config";

export async function http(path, { method = "GET", token, body } = {}) {
  const headers = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (token) headers.authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "object" && data?.message ? data.message : "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
```

- [ ] **Step 4: Add auth API**

Create `frontend/src/api/auth.js`:

```js
import { http } from "./http";

export function register({ email, password }) {
  return http("/api/auth/register", { method: "POST", body: { email, password } });
}

export function login({ email, password }) {
  return http("/api/auth/login", { method: "POST", body: { email, password } });
}

export function me({ token }) {
  return http("/api/auth/me", { token });
}
```

- [ ] **Step 5: Add books API**

Create `frontend/src/api/books.js`:

import { http } from "./http";

export function listBooks({ category } = {}) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  return http(`/api/books${qs}`);
}

export function getBook(id) {
  return http(`/api/books/${id}`);
}

export function createBook({ token, book }) {
  return http("/api/books", { method: "POST", token, body: book });
}

export function updateBook({ token, id, patch }) {
  return http(`/api/books/${id}`, { method: "PATCH", token, body: patch });
}

export function deleteBook({ token, id }) {
  return http(`/api/books/${id}`, { method: "DELETE", token });
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/.env.example frontend/src/config.js frontend/src/api
git commit -m "feat(frontend): add env-based API config and API clients"
```

---

## Task 9: Replace Firebase auth with local AuthProvider

**Files:**
- Modify: `frontend/src/contexts/AuthProvider.jsx`
- Delete: `frontend/src/firebase/firebase.config.js`
- Modify: `frontend/package.json`

- [ ] **Step 1: Remove firebase dependency**

Edit `frontend/package.json` and remove `"firebase": ...` from dependencies.

- [ ] **Step 2: Replace AuthProvider implementation**

Replace `frontend/src/contexts/AuthProvider.jsx` with:

```jsx
import { createContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

export const AuthContext = createContext();

const TOKEN_KEY = "bookstore_token";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe(nextToken) {
    if (!nextToken) {
      setUser(null);
      return;
    }
    const res = await authApi.me({ token: nextToken });
    setUser(res.user);
  }

  async function login(email, password) {
    setLoading(true);
    const res = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    await refreshMe(res.token);
    setLoading(false);
    return res;
  }

  async function createUser(email, password) {
    setLoading(true);
    const res = await authApi.register({ email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    await refreshMe(res.token);
    setLoading(false);
    return res;
  }

  function logOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        if (token) {
          await refreshMe(token);
        } else {
          setUser(null);
        }
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const authInfo = useMemo(
    () => ({ user, loading, token, login, createUser, logOut }),
    [user, loading, token]
  );

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}
```

- [ ] **Step 3: Delete firebase config file**

```bash
git rm frontend/src/firebase/firebase.config.js
```

- [ ] **Step 4: Install frontend deps**

```bash
cd frontend
npm install
```

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/contexts/AuthProvider.jsx
git commit -m "refactor(frontend): replace firebase auth with local JWT auth context"
```

---

## Task 10: Route guards (PrivateRoute + AdminRoute)

**Files:**
- Modify: `frontend/src/PrivateRoute/PrivateRoute.jsx`
- Create: `frontend/src/PrivateRoute/AdminRoute.jsx`
- Modify: `frontend/src/routers/router.jsx`

- [ ] **Step 1: Update PrivateRoute**

Update `frontend/src/PrivateRoute/PrivateRoute.jsx`:

```jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
```

- [ ] **Step 2: Add AdminRoute**

Create `frontend/src/PrivateRoute/AdminRoute.jsx`:

```jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
```

- [ ] **Step 3: Guard dashboard routes**

In `frontend/src/routers/router.jsx`, wrap admin dashboard routes in `AdminRoute`:

- `/admin/dashboard`
- `/admin/dashboard/upload`
- `/admin/dashboard/manage`
- `/admin/dashboard/edit-books/:id`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/PrivateRoute/PrivateRoute.jsx frontend/src/PrivateRoute/AdminRoute.jsx frontend/src/routers/router.jsx
git commit -m "feat(frontend): enforce admin-only dashboard routes"
```

---

## Task 11: Replace all hardcoded API URLs in frontend

**Files:**
- Modify: `frontend/src/pages/Home/BestSeller.jsx`
- Modify: `frontend/src/pages/Home/OtherBooks.jsx`
- Modify: `frontend/src/pages/Shop/Shop.jsx`
- Modify: `frontend/src/routers/router.jsx`
- Modify: `frontend/src/Dashboard/EditBooks.jsx`
- Modify: `frontend/src/Dashboard/ManageBooks.jsx`
- Modify: `frontend/src/Dashboard/UploadBook.jsx`

- [ ] **Step 1: Replace `fetch("https://bookstore-server-one.vercel.app/...")` calls**
  - For listing, use `listBooks`
  - For details, use `getBook`
  - For create/update/delete, use `createBook/updateBook/deleteBook` with `token` from context

- [ ] **Step 2: Ensure admin endpoints send `Authorization` token**
  - Upload/update/delete must include token so backend can authorize

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages frontend/src/Dashboard frontend/src/routers/router.jsx
git commit -m "refactor(frontend): replace hardcoded URLs with API client usage"
```

---

## Task 12: Frontend tests (Vitest + RTL)

**Files:**
- Add dev deps: `frontend/package.json`
- Create: `frontend/src/test/setupTests.js`
- Create: `frontend/src/contexts/__tests__/AuthProvider.test.jsx`
- Create: `frontend/src/PrivateRoute/__tests__/PrivateRoute.test.jsx`

- [ ] **Step 1: Add test deps**

Add to `frontend/package.json` devDependencies:

```json
{
  "devDependencies": {
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "jsdom": "^26.0.0"
  }
}
```

Add scripts:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

- [ ] **Step 2: Add setup file**

Create `frontend/src/test/setupTests.js`:

```js
import "@testing-library/jest-dom";
```

- [ ] **Step 3: Add AuthProvider test**

Create `frontend/src/contexts/__tests__/AuthProvider.test.jsx`:

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import AuthProvider, { AuthContext } from "../AuthProvider";

function Consumer() {
  return (
    <AuthContext.Consumer>
      {(v) => <div data-testid="state">{v.loading ? "loading" : v.user ? v.user.email : "anon"}</div>}
    </AuthContext.Consumer>
  );
}

test("starts as anon when no token", async () => {
  localStorage.removeItem("bookstore_token");
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByTestId("state")).toHaveTextContent("anon");
  });
});
```

- [ ] **Step 4: Add PrivateRoute test**

Create `frontend/src/PrivateRoute/__tests__/PrivateRoute.test.jsx`:

```jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { AuthContext } from "../../contexts/AuthProvider";

function renderWithAuth(value) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <PrivateRoute>
          <div>secret</div>
        </PrivateRoute>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

test("renders children when authenticated", () => {
  renderWithAuth({ user: { email: "a@b.com" }, loading: false });
  expect(screen.getByText("secret")).toBeInTheDocument();
});
```

- [ ] **Step 5: Run frontend tests**

```bash
cd frontend
npm install
npm test
```

- [ ] **Step 6: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/test frontend/src/**/__tests__
git commit -m "test(frontend): add vitest and basic auth/route tests"
```

---

## Task 13: CI (GitHub Actions)

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Add CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
      - run: JWT_SECRET=test_secret npm test

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --run
      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add lint/test/build workflow"
```

---

## Task 14: Root README rewrite (resume-friendly)

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite README sections**
  - Overview + features
  - Architecture (frontend/backend)
  - Screenshots placeholders (actual images later)
  - Setup with `.env` instructions
  - Admin setup via env seeding
  - Scripts to run tests and dev servers
  - Deployment notes (frontend + backend)

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: upgrade README for mid-level portfolio readiness"
```

---

## Task 15: End-to-end verification (local)

**Files:** none

- [ ] **Step 1: Start backend**

```bash
cd backend
cp .env.example .env
npm run dev
```

- [ ] **Step 2: Start frontend**

```bash
cd frontend
cp .env.example .env
npm run dev
```

- [ ] **Step 3: Verify flows**
  - Register new user (should not access admin dashboard)
  - Login as seeded admin (should access dashboard and CRUD books)
  - Home/shop pages load via `VITE_API_BASE_URL`
  - API rejects book writes from non-admin

---

## Self-Review Checklist (plan vs spec coverage)

- Secrets removed from code, env-based config added
- Backend split into app/server/routes/controllers/middleware/db
- Local JWT auth implemented with admin-only book writes
- Validation added for auth and books + consistent JSON errors
- Tests added for backend and frontend
- CI added
- README and `.env.example` files added

