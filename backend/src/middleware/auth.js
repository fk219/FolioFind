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

  if (!jwtSecret) {
    const err = new Error("Server misconfigured: missing JWT_SECRET");
    err.statusCode = 500;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { id: String(payload.sub), email: payload.email, role: payload.role, fullName: payload.fullName || "" };
    return next();
  } catch (e) {
    const err = new Error("Invalid or expired token");
    err.statusCode = 401;
    return next(err);
  }
}

module.exports = { requireAuth };
