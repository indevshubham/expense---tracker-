import { z } from "zod";
import { currencySchema, dateStringSchema } from "./common.validators";

export const reportQuerySchema = z.object({
  periodType: z.enum(["weekly", "monthly", "yearly"]).default("monthly"),
  referenceDate: dateStringSchema.optional().transform((value) => (value ? new Date(value) : new Date())),
  currency: currencySchema.default("USD"),
  persist: z.coerce.boolean().default(false),
  format: z.enum(["json", "pdf", "csv"]).default("json")
});

export const dashboardQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  currency: currencySchema.default("USD")
});
