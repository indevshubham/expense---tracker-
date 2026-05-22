import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model";
import { asyncHandler } from "../utils/async-handler";

export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const currency = String(req.query.currency ?? "USD");
  const year = String(req.query.year ?? new Date().getUTCFullYear());
  const userObjectId = new mongoose.Types.ObjectId(req.user!.id);
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);

  const [expenseDistribution, monthlyTrend, incomeVsExpense, categoryBreakdown, yearlyReports] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          transactionType: "expense",
          currency,
          date: { $gte: start, $lt: end },
          deletedAt: null
        }
      },
      { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $group: { _id: "$category.name", value: { $sum: "$amount" } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
      { $sort: { value: -1 } }
    ]),
    Transaction.aggregate([
      { $match: { user: userObjectId, currency, date: { $gte: start, $lt: end }, deletedAt: null } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          income: { $sum: { $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0] } },
          expense: { $sum: { $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0] } }
        }
      },
      { $project: { _id: 0, month: "$_id", income: 1, expense: 1 } },
      { $sort: { month: 1 } }
    ]),
    Transaction.aggregate([
      { $match: { user: userObjectId, currency, date: { $gte: start, $lt: end }, deletedAt: null } },
      { $group: { _id: "$transactionType", amount: { $sum: "$amount" } } },
      { $project: { _id: 0, type: "$_id", amount: 1 } }
    ]),
    Transaction.aggregate([
      { $match: { user: userObjectId, currency, date: { $gte: start, $lt: end }, deletedAt: null } },
      { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      {
        $group: {
          _id: { category: "$category.name", type: "$transactionType" },
          amount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, category: "$_id.category", type: "$_id.type", amount: 1, count: 1 } },
      { $sort: { amount: -1 } }
    ]),
    Transaction.aggregate([
      { $match: { user: userObjectId, currency, deletedAt: null } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y", date: "$date" } },
          income: { $sum: { $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0] } },
          expense: { $sum: { $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0] } }
        }
      },
      { $project: { _id: 0, year: "$_id", income: 1, expense: 1, balance: { $subtract: ["$income", "$expense"] } } },
      { $sort: { year: 1 } }
    ])
  ]);

  res.json({
    currency,
    year,
    expenseDistribution,
    monthlyTrend,
    incomeVsExpense,
    categoryBreakdown,
    yearlyReports
  });
});
