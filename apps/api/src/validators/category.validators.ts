import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  color: z.string().trim().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).default("#12b981"),
  icon: z.string().trim().min(2).max(40).default("CircleDollarSign"),
  type: z.enum(["income", "expense", "both"]).default("both")
});

export const updateCategorySchema = createCategorySchema.partial();
