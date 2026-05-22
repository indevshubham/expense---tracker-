import { z } from "zod";
import { currencySchema, objectIdSchema } from "./common.validators";

export const upsertBudgetSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().nonnegative(),
  currency: currencySchema,
  category: objectIdSchema.nullish(),
  alertThreshold: z.coerce.number().min(1).max(100).default(80)
});
