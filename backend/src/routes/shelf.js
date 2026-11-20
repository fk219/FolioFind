const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { shelfUpdateSchema } = require("../validation/shelfSchemas");
const shelfController = require("../controllers/shelfController");

module.exports = function shelfRoutes(collections) {
  const router = express.Router();

  router.use(requireAuth);

  router.get("/", async (req, res, next) => {
    try {
      const result = await shelfController.list(collections, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:bookId", async (req, res, next) => {
    try {
      const payload = shelfUpdateSchema.parse(req.body);
      const item = await shelfController.upsert(collections, req.user.id, req.params.bookId, payload);
      res.json({ message: "Shelf updated", item });
    } catch (error) {
      if (error?.name === "ZodError") error.statusCode = 400;
      next(error);
    }
  });

  router.delete("/:bookId", async (req, res, next) => {
    try {
      const result = await shelfController.remove(collections, req.user.id, req.params.bookId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
