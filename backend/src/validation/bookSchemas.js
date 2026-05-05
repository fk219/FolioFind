const { z } = require("zod");

const bookSchema = z.object({
  bookTitle: z.string().min(1).max(200),
  authorName: z.string().min(1).max(200),
  imageURL: z.string().url(),
  category: z.string().min(1).max(100),
  bookDescription: z.string().min(1).max(5000),
  bookPDFURL: z.string().url().optional()
});

const bookPatchSchema = bookSchema.partial().refine((v) => Object.keys(v).length > 0, {
  message: "At least one field must be provided"
});

module.exports = { bookSchema, bookPatchSchema };
