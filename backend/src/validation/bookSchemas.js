const { z } = require("zod");

const bookSchema = z.object({
  bookTitle: z.string().min(1).max(200),
  authorName: z.string().min(1).max(200),
  imageURL: z.union([z.string().url(), z.literal("")]).optional().default(""),
  category: z.string().min(1).max(100),
  bookDescription: z.string().min(1).max(5000),
  bookPDFURL: z.string().url().optional(),
  price: z.number().positive(),
  condition: z.enum(["New", "Like New", "Good", "Acceptable"]),
  conditionNote: z.string().max(280).optional().default(""),
  edition: z.string().max(120).optional().default(""),
  publishedYear: z.number().int().min(0).max(2100).optional(),
  pages: z.number().int().min(1).max(10000).optional(),
  isbn: z.string().max(20).optional().default("")
});

const bookPatchSchema = bookSchema.partial().refine((v) => Object.keys(v).length > 0, {
  message: "At least one field must be provided"
});

const statusSchema = z.object({
  status: z.enum(["available", "sold", "pending"])
});

module.exports = { bookSchema, bookPatchSchema, statusSchema };
