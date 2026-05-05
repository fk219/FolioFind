const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn, adminEmail, adminPassword } = require("../config");

function assertJwtSecret() {
  if (!jwtSecret) {
    const err = new Error("Server misconfigured: missing JWT_SECRET");
    err.statusCode = 500;
    throw err;
  }
}

function signToken(user) {
  assertJwtSecret();
  return jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

async function ensureUserIndexes(collections) {
  await collections.users.createIndex({ email: 1 }, { unique: true });
}

async function seedAdminIfNeeded(collections) {
  await ensureUserIndexes(collections);

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
  await ensureUserIndexes(collections);

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

  return {
    token: signToken(user),
    user: { _id: user._id, email: user.email, role: user.role }
  };
}

module.exports = { seedAdminIfNeeded, register, login };
