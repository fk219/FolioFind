const { z } = require("zod");

const shelfStatusSchema = z.enum(["want-to-read", "reading", "finished"]);

const shelfUpdateSchema = z.object({
  status: shelfStatusSchema,
  note: z.string().max(280).optional().default("")
});

module.exports = { shelfStatusSchema, shelfUpdateSchema };
