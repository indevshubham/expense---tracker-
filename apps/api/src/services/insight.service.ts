import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model";

export interface SpendingInsight {
  type: "spending_change" | "saving_opportunity" | "unusual_expense" | "category_optimization" | "insufficient_data";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger" | "success";
  metadata?: Record<string, unknown>;
}

export async function buildSpendingInsights(userId: string, currency = "USD") {
  const now = new Date();
  const currentStart = startOfMonth(now);
  const currentEnd = endOfMonth(now);
  const previousStart = startOfMonth(subMonths(now, 1));
  const previousEnd = endOfMonth(subMonths(now, 1));
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const transactionCount = await Transaction.countDocuments({
    user: userId,
    currency,
    deletedAt: null
  });

  if (transactionCount < 3) {
    return [
      {
        type: "insufficient_data",
        title: "More history needed",
        message: "Add at least three real transactions to unlock spending suggestions.",
        severity: "info"
      }
    ] satisfies SpendingInsight[];
  }

  const categoryComparison = await Transaction.aggregate<{
    categoryName: string;
    current: number;
    previous: number;
  }>([
    {
      $match: {
        user: userObjectId,
        transactionType: "expense",
        currency,
        date: { $gte: previousStart, $lte: currentEnd },
        deletedAt: null
      }
    },
    { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category.name",
        current: {
          $sum: { $cond: [{ $and: [{ $gte: ["$date", currentStart] }, { $lte: ["$date", currentEnd] }] }, "$amount", 0] }
        },
        previous: {
          $sum: { $cond: [{ $and: [{ $gte: ["$date", previousStart] }, { $lte: ["$date", previousEnd] }] }, "$amount", 0] }
        }
      }
    },
    { $project: { _id: 0, categoryName: "$_id", current: 1, previous: 1 } },
    { $sort: { current: -1 } }
  ]);

  const insights: SpendingInsight[] = [];

  for (const row of categoryComparison) {
    if (row.previous > 0 && row.current > row.previous * 1.25) {
      const increase = ((row.current - row.previous) / row.previous) * 100;
      insights.push({
        type: "spending_change",
        title: `${row.categoryName} spending increased`,
        message: `You spent ${increase.toFixed(0)}% more on ${row.categoryName.toLowerCase()} this month.`,
        severity: increase > 50 ? "danger" : "warning",
        metadata: row
      });
    }
  }

  const unusualExpenses = await Transaction.aggregate<{
    id: mongoose.Types.ObjectId;
    amount: number;
    description: string;
    date: Date;
    average: number;
    standardDeviation: number;
  }>([
    {
      $match: {
        user: userObjectId,
        transactionType: "expense",
        currency,
        date: { $gte: subMonths(now, 3), $lte: now },
        deletedAt: null
      }
    },
    {
      $setWindowFields: {
        partitionBy: "$category",
        output: {
          average: { $avg: "$amount", window: { documents: ["unbounded", "unbounded"] } },
          standardDeviation: { $stdDevPop: "$amount", window: { documents: ["unbounded", "unbounded"] } }
        }
      }
    },
    {
      $match: {
        $expr: { $gt: ["$amount", { $add: ["$average", { $multiply: [2, "$standardDeviation"] }] }] }
      }
    },
    { $project: { id: "$_id", amount: 1, description: 1, date: 1, average: 1, standardDeviation: 1 } },
    { $limit: 5 }
  ]);

  for (const expense of unusualExpenses) {
    insights.push({
      type: "unusual_expense",
      title: "Unusual expense detected",
      message: `${expense.description} was higher than your usual spending pattern in this category.`,
      severity: "warning",
      metadata: { transactionId: expense.id, amount: expense.amount, average: expense.average }
    });
  }

  const topCategory = categoryComparison[0];
  if (topCategory && topCategory.current > 0) {
    insights.push({
      type: "saving_opportunity",
      title: "Savings opportunity",
      message: `Reducing ${topCategory.categoryName.toLowerCase()} spending by 10% would save ${(topCategory.current * 0.1).toFixed(2)} ${currency} this month.`,
      severity: "success",
      metadata: topCategory
    });
  }

  return insights.slice(0, 8);
}
