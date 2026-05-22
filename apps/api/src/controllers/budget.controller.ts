import type { Request, Response } from "express";
import { Budget } from "../models/budget.model";
import { Transaction } from "../models/transaction.model";
import { writeAuditLog } from "../services/audit.service";
import { evaluateBudgetNotifications } from "../services/notification.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";

export const listBudgets = asyncHandler(async (req: Request, res: Response) => {
  const budgets = await Budget.find({ user: req.user?.id, deletedAt: null }).populate("category").sort({ month: -1 });
  res.json({ budgets });
});

export const upsertBudget = asyncHandler(async (req: Request, res: Response) => {
  const budget = await Budget.findOneAndUpdate(
    {
      user: req.user?.id,
      month: req.body.month,
      category: req.body.category ?? null,
      deletedAt: null
    },
    {
      ...req.body,
      category: req.body.category ?? null,
      user: req.user?.id
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate("category");

  await evaluateBudgetNotifications(req.user!.id, new Date(`${req.body.month}-01T00:00:00.000Z`));
  await writeAuditLog(req, { action: "budget.upsert", entity: "Budget", entityId: budget._id });
  res.status(201).json({ budget });
});

export const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user?.id, deletedAt: null });
  if (!budget) throw new ApiError(404, "Budget not found");
  budget.deletedAt = new Date();
  await budget.save();
  await writeAuditLog(req, { action: "budget.delete", entity: "Budget", entityId: budget._id });
  res.status(204).send();
});

export const budgetSummary = asyncHandler(async (req: Request, res: Response) => {
  const month = String(req.query.month ?? new Date().toISOString().slice(0, 7));
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);

  const budgets = await Budget.find({ user: req.user?.id, month, deletedAt: null }).populate("category");
  const summaries = [];

  for (const budget of budgets) {
    const match: Record<string, unknown> = {
      user: budget.user,
      transactionType: "expense",
      date: { $gte: start, $lt: end },
      currency: budget.currency,
      deletedAt: null
    };
    if (budget.category) match.category = budget.category;

    const [result] = await Transaction.aggregate<{ spent: number }>([
      { $match: match },
      { $group: { _id: null, spent: { $sum: "$amount" } } }
    ]);

    const spent = result?.spent ?? 0;
    summaries.push({
      budget,
      spent,
      remaining: budget.amount - spent,
      usedPercentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0
    });
  }

  res.json({ month, summaries });
});
