const { z } = require("zod");

const bookSchema = z.object({
  bookTitle: z.string().min(1).max(200),
  authorName: z.string().min(1).max(200),
  imageURL: z.string().url(),
  category: z.string().min(1).max(100),
  bookDescription: z.string().min(1).max(5000),
  bookPDFURL: z.string().url().optional(),
  price: z.number().positive(),
  condition: z.enum(["New", "Like New", "Good", "Acceptable"])
});

const bookPatchSchema = bookSchema.partial().refine((v) => Object.keys(v).length > 0, {
  message: "At least one field must be provided"
});

const statusSchema = z.object({
  status: z.enum(["available", "sold", "pending"])
});

module.exports = { bookSchema, bookPatchSchema, statusSchema };
