import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import mongoose from "mongoose";
import { Report } from "../models/report.model";
import { Transaction } from "../models/transaction.model";

export type ReportPeriod = "weekly" | "monthly" | "yearly";

export function resolvePeriod(periodType: ReportPeriod, referenceDate: Date) {
  if (periodType === "weekly") {
    return {
      startDate: startOfWeek(referenceDate, { weekStartsOn: 1 }),
      endDate: endOfWeek(referenceDate, { weekStartsOn: 1 })
    };
  }

  if (periodType === "yearly") {
    return {
      startDate: startOfYear(referenceDate),
      endDate: endOfYear(referenceDate)
    };
  }

  return {
    startDate: startOfMonth(referenceDate),
    endDate: endOfMonth(referenceDate)
  };
}

export async function buildReport(input: {
  userId: string;
  periodType: ReportPeriod;
  referenceDate: Date;
  currency: string;
  persist?: boolean;
}) {
  const { startDate, endDate } = resolvePeriod(input.periodType, input.referenceDate);
  const userObjectId = new mongoose.Types.ObjectId(input.userId);

  const [totals] = await Transaction.aggregate<{
    totalIncome: number;
    totalExpense: number;
    transactionCount: number;
  }>([
    {
      $match: {
        user: userObjectId,
        date: { $gte: startDate, $lte: endDate },
        currency: input.currency,
        deletedAt: null
      }
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0] }
        },
        transactionCount: { $sum: 1 }
      }
    }
  ]);

  const categoryBreakdown = await Transaction.aggregate<{
    categoryId: mongoose.Types.ObjectId;
    categoryName: string;
    transactionType: "income" | "expense";
    amount: number;
    count: number;
  }>([
    {
      $match: {
        user: userObjectId,
        date: { $gte: startDate, $lte: endDate },
        currency: input.currency,
        deletedAt: null
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: { category: "$category._id", type: "$transactionType", name: "$category.name" },
        amount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        categoryId: "$_id.category",
        categoryName: "$_id.name",
        transactionType: "$_id.type",
        amount: 1,
        count: 1
      }
    },
    { $sort: { amount: -1 } }
  ]);

  const report = {
    user: input.userId,
    periodType: input.periodType,
    startDate,
    endDate,
    currency: input.currency,
    totalIncome: totals?.totalIncome ?? 0,
    totalExpense: totals?.totalExpense ?? 0,
    balance: (totals?.totalIncome ?? 0) - (totals?.totalExpense ?? 0),
    transactionCount: totals?.transactionCount ?? 0,
    categoryBreakdown,
    filters: { referenceDate: input.referenceDate.toISOString() },
    generatedAt: new Date()
  };

  if (input.persist) {
    return Report.create(report);
  }

  return report;
}
