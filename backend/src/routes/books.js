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
