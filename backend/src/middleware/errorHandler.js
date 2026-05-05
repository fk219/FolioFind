module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message = err && err.message ? err.message : "Internal Server Error";
  const error = statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR";

  res.status(statusCode).json({ statusCode, error, message });
};
