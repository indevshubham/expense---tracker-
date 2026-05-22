import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Budget } from "../models/budget.model";
import { Transaction } from "../models/transaction.model";
import { asyncHandler } from "../utils/async-handler";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const currency = String(req.query.currency ?? "USD");
  const month = String(req.query.month ?? new Date().toISOString().slice(0, 7));
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  const userObjectId = new mongoose.Types.ObjectId(req.user!.id);

  const [monthlyTotals] = await Transaction.aggregate<{
    totalIncome: number;
    totalExpense: number;
  }>([
    { $match: { user: userObjectId, currency, date: { $gte: start, $lt: end }, deletedAt: null } },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: { $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0] } },
        totalExpense: { $sum: { $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0] } }
      }
    }
  ]);

  const [allTimeTotals] = await Transaction.aggregate<{
    totalIncome: number;
    totalExpense: number;
  }>([
    { $match: { user: userObjectId, currency, deletedAt: null } },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: { $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0] } },
        totalExpense: { $sum: { $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0] } }
      }
    }
  ]);

  const trend = await Transaction.aggregate<{
    month: string;
    income: number;
    expense: number;
  }>([
    { $match: { user: userObjectId, currency, deletedAt: null } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        income: { $sum: { $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0] } },
        expense: { $sum: { $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0] } }
      }
    },
    { $project: { _id: 0, month: "$_id", income: 1, expense: 1 } },
    { $sort: { month: 1 } },
    { $limit: 12 }
  ]);

  const recentTransactions = await Transaction.find({ user: req.user?.id, currency, deletedAt: null })
    .populate("category")
    .sort({ date: -1, createdAt: -1 })
    .limit(8);

  const budgets = await Budget.find({ user: req.user?.id, month, currency, deletedAt: null });
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalIncome = monthlyTotals?.totalIncome ?? 0;
  const totalExpense = monthlyTotals?.totalExpense ?? 0;
  const currentBalance = (allTimeTotals?.totalIncome ?? 0) - (allTimeTotals?.totalExpense ?? 0);

  res.json({
    month,
    currency,
    summary: {
      totalIncome,
      totalExpense,
      currentBalance,
      savingsAmount: totalIncome - totalExpense,
      totalBudget,
      remainingBudget: totalBudget ? totalBudget - totalExpense : null
    },
    monthlyTrend: trend,
    recentTransactions
  });
});
