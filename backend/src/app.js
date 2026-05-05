const cors = require("cors");
const express = require("express");
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
    res.json({ ok: true });
  });

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 });
  app.use("/api/auth", authLimiter);

  app.use("/api/auth", require("./routes/auth")(collections));
  app.use("/api/books", require("./routes/books")(collections));

  app.use(errorHandler);
  return app;
}

module.exports = createApp;
