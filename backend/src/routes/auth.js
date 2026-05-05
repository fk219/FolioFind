const express = require("express");
const { registerSchema, loginSchema } = require("../validation/authSchemas");
const { requireAuth } = require("../middleware/auth");
const authController = require("../controllers/authController");

module.exports = function authRoutes(collections) {
  const router = express.Router();

  router.post("/register", async (req, res, next) => {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await authController.register(collections, payload);
      res.status(201).json(result);
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await authController.login(collections, payload);
      res.json(result);
    } catch (e) {
      if (e?.name === "ZodError") e.statusCode = 400;
      next(e);
    }
  });

  router.get("/me", requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });

  return router;
};
