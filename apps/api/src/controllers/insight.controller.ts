import type { Request, Response } from "express";
import { buildSpendingInsights } from "../services/insight.service";
import { asyncHandler } from "../utils/async-handler";

export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const currency = String(req.query.currency ?? "USD");
  const insights = await buildSpendingInsights(req.user!.id, currency);
  res.json({ currency, insights });
});
