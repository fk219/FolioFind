require("dotenv").config();

function getEnv(name, fallback = "") {
  const value = process.env[name];
  return value === undefined ? fallback : value;
}

function getNumber(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

const nodeEnv = getEnv("NODE_ENV", "development");

module.exports = {
  nodeEnv,
  port: getNumber("PORT", 5000),
  mongoUri: getEnv("MONGO_URI", ""),
  corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:5173"),
  jwtSecret: getEnv("JWT_SECRET", nodeEnv === "test" ? "test_secret" : ""),
  jwtExpiresIn: getEnv("JWT_EXPIRES_IN", "7d"),
  adminEmail: getEnv("ADMIN_EMAIL", ""),
  adminPassword: getEnv("ADMIN_PASSWORD", "")
};
