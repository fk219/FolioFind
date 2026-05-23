const path = require("path");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { corsOrigin } = require("./config");
const errorHandler = require("./middleware/errorHandler");

function createApp({ collections }) {
  const app = express();

  // Configure Helmet with custom Image CSP to allow OpenLibrary and curated cover assets
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "img-src": ["'self'", "data:", "https://covers.openlibrary.org", "https://picsum.photos", "https://images.unsplash.com", "https://via.placeholder.com"],
        },
      },
    })
  );
  
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  // Serve static assets from public folder
  const publicPath = path.resolve(__dirname, "..", "public");
  app.use(express.static(publicPath));

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 });
  app.use("/api/auth", authLimiter);

  app.use("/api/auth", require("./routes/auth")(collections));
  app.use("/api/books", require("./routes/books")(collections));

  // Wildcard client router fallback - routes HTML page requests to index.html
  app.get("*", (req, res, next) => {
    if (req.accepts("html") && !req.path.startsWith("/api/")) {
      res.sendFile(path.join(publicPath, "index.html"), (err) => {
        if (err) {
          // If the compiled index.html does not exist yet, fallback to status JSON
          res.status(200).json({ ok: true, message: "API server online. Frontend compiled public assets not found." });
        }
      });
    } else {
      next();
    }
  });

  app.use(errorHandler);
  return app;
}

module.exports = createApp;
