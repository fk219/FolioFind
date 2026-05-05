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
