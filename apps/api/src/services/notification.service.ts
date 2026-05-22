import { startOfMonth, endOfMonth } from "date-fns";
import mongoose from "mongoose";
import { Budget } from "../models/budget.model";
import { Notification } from "../models/notification.model";
import { Transaction } from "../models/transaction.model";

export async function evaluateBudgetNotifications(userId: string, date = new Date()) {
  const month = date.toISOString().slice(0, 7);
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const budgets = await Budget.find({ user: userId, month, deletedAt: null });
  for (const budget of budgets) {
    const match: Record<string, unknown> = {
      user: budget.user,
      transactionType: "expense",
      date: { $gte: startOfMonth(date), $lte: endOfMonth(date) },
      deletedAt: null
    };

    if (budget.category) match.category = budget.category;

    const [result] = await Transaction.aggregate<{ total: number }>([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const spent = result?.total ?? 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

    if (percentage >= 100) {
      await upsertMonthlyNotification(userId, "budget_exceeded", month, String(budget._id), {
        title: "Budget exceeded",
        message: `You have spent ${percentage.toFixed(0)}% of your ${month} budget.`,
        severity: "danger",
        metadata: { budgetId: budget._id, month, spent, budget: budget.amount }
      });
    } else if (percentage >= budget.alertThreshold) {
      await upsertMonthlyNotification(userId, "budget_warning", month, String(budget._id), {
        title: "Budget warning",
        message: `You have used ${percentage.toFixed(0)}% of your ${month} budget.`,
        severity: "warning",
        metadata: { budgetId: budget._id, month, spent, budget: budget.amount }
      });
    }
  }

  const [monthlyTotals] = await Transaction.aggregate<{ income: number; expense: number }>([
    {
      $match: {
        user: userObjectId,
        date: { $gte: startOfMonth(date), $lte: endOfMonth(date) },
        deletedAt: null
      }
    },
    {
      $group: {
        _id: null,
        income: { $sum: { $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0] } },
        expense: { $sum: { $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0] } }
      }
    }
  ]);

  if (monthlyTotals?.income && monthlyTotals.income > 0) {
    const savingsRate = ((monthlyTotals.income - monthlyTotals.expense) / monthlyTotals.income) * 100;
    if (savingsRate < 10) {
      await upsertMonthlyNotification(userId, "savings_reminder", month, "monthly", {
        title: "Savings reminder",
        message: `Your savings rate is ${savingsRate.toFixed(0)}% this month. Review flexible spending to improve it.`,
        severity: "info",
        metadata: { month, savingsRate, income: monthlyTotals.income, expense: monthlyTotals.expense }
      });
    }
  }
}

async function upsertMonthlyNotification(
  userId: string,
  type: "budget_warning" | "budget_exceeded" | "savings_reminder",
  month: string,
  key: string,
  notification: {
    title: string;
    message: string;
    severity: "info" | "warning" | "danger" | "success";
    metadata: Record<string, unknown>;
  }
) {
  await Notification.findOneAndUpdate(
    { user: userId, type, "metadata.month": month, "metadata.key": key, deletedAt: null },
    {
      user: userId,
      type,
      ...notification,
      metadata: { ...notification.metadata, key },
      isRead: false
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
