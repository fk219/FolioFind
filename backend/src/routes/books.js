const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/requireAdmin");
const { bookSchema, bookPatchSchema, statusSchema, inquirySchema } = require("../validation/bookSchemas");
const booksController = require("../controllers/booksController");

module.exports = function booksRoutes(collections) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const category = req.query?.category ? String(req.query.category) : "";
      const page = Math.max(1, parseInt(req.query?.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query?.limit, 10) || 12));
      const q = req.query?.q ? String(req.query.q).trim().slice(0, 120) : "";
      const minRaw = parseFloat(req.query?.minPrice);
      const maxRaw = parseFloat(req.query?.maxPrice);
      const sort = ["newest", "price-asc", "price-desc", "title"].includes(req.query?.sort)
        ? String(req.query.sort)
        : "newest";
      const result = await booksController.list(collections, {
        category: category || undefined,
        page,
        limit,
        q: q || undefined,
        minPrice: Number.isFinite(minRaw) ? minRaw : undefined,
        maxPrice: Number.isFinite(maxRaw) ? maxRaw : undefined,
        sort
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  router.get("/stats", requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const totalBooks = await collections.books.countDocuments();
      const categoryDocs = await collections.books
        .find({}, { projection: { category: 1 } })
        .toArray();
      const categoryCounts = {};
      for (const doc of categoryDocs) {
        if (!doc.category) continue;
        categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
      }
      res.json({
        totalBooks,
        totalCategories: Object.keys(categoryCounts).length,
        categoryCounts
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/mine", requireAuth, async (req, res, next) => {
    try {
      const result = await booksController.listByUser(collections, req.user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  router.get("/inquiries/mine", requireAuth, async (req, res, next) => {
    try {
      const result = await booksController.listInquiries(collections, req.user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const book = await booksController.getById(collections, req.params.id);
      res.json({ book });
    } catch (e) {
      next(e);
    }
  });

  router.post("/", requireAuth, async (req, res, next) => {
    try {
      const payload = bookSchema.parse(req.body);
      const result = await booksController.create(collections, payload, req.user);
      res.status(201).json({ message: "Book listed", data: result });
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.patch("/:id", requireAuth, async (req, res, next) => {
    try {
      const payload = bookPatchSchema.parse(req.body);
      await booksController.update(collections, req.params.id, payload, req.user);
      res.json({ message: "Book updated" });
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.patch("/:id/status", requireAuth, async (req, res, next) => {
    try {
      const { status } = statusSchema.parse(req.body);
      await booksController.updateStatus(collections, req.params.id, status, req.user);
      res.json({ message: "Status updated" });
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.post("/:id/inquiry", requireAuth, async (req, res, next) => {
    try {
      const { message } = inquirySchema.parse(req.body);
      const result = await booksController.createInquiry(collections, req.params.id, message, req.user);
      res.status(201).json({ message: "Enquiry sent", data: result });
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
      await booksController.remove(collections, req.params.id, req.user);
      res.json({ message: "Book deleted" });
    } catch (e) {
      next(e);
    }
  });

  return router;
};