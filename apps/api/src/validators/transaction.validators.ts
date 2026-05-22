import { z } from "zod";
import { currencySchema, dateStringSchema, objectIdSchema } from "./common.validators";

const transactionBaseSchema = z.object({
    amount: z.coerce.number().positive(),
    category: objectIdSchema,
    transactionType: z.enum(["income", "expense"]),
    paymentMethod: z.string().trim().min(2).max(60),
    description: z.string().trim().min(2).max(180),
    notes: z.string().trim().max(1000).optional(),
    date: dateStringSchema.transform((value) => new Date(value)),
    currency: currencySchema,
    isRecurring: z.boolean().default(false),
    recurrence: z
      .object({
        frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
        interval: z.coerce.number().int().positive().default(1),
        nextRunAt: dateStringSchema.optional().transform((value) => (value ? new Date(value) : undefined)),
        endsAt: dateStringSchema.optional().transform((value) => (value ? new Date(value) : undefined))
      })
      .optional()
  });

function validateRecurrence(value: { isRecurring?: boolean; recurrence?: unknown }, ctx: z.RefinementCtx) {
  if (value.isRecurring && !value.recurrence) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "recurrence is required for recurring transactions" });
  }
}

export const createTransactionSchema = transactionBaseSchema.superRefine(validateRecurrence);

export const updateTransactionSchema = transactionBaseSchema.partial().superRefine(validateRecurrence);

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  category: objectIdSchema.optional(),
  transactionType: z.enum(["income", "expense"]).optional(),
  minAmount: z.coerce.number().nonnegative().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  year: z.string().regex(/^\d{4}$/).optional(),
  search: z.string().trim().max(80).optional(),
  currency: currencySchema.optional()
});
