import type { Request, Response } from "express";
import { parse } from "csv-parse/sync";
import { Category } from "../models/category.model";
import { Transaction } from "../models/transaction.model";
import { evaluateBudgetNotifications } from "../services/notification.service";
import { writeAuditLog } from "../services/audit.service";
import { transactionsToCsv } from "../services/export.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { createTransactionSchema } from "../validators/transaction.validators";

function buildTransactionQuery(req: Request) {
  const query: Record<string, unknown> = {
    user: req.user?.id,
    deletedAt: null
  };

  const input = req.query as Record<string, string | undefined>;
  if (input.category) query.category = input.category;
  if (input.transactionType) query.transactionType = input.transactionType;
  if (input.currency) query.currency = input.currency;
  if (input.search) query.$text = { $search: input.search };
  if (input.minAmount || input.maxAmount) {
    query.amount = {
      ...(input.minAmount ? { $gte: Number(input.minAmount) } : {}),
      ...(input.maxAmount ? { $lte: Number(input.maxAmount) } : {})
    };
  }

  if (input.month) {
    const start = new Date(`${input.month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    query.date = { $gte: start, $lt: end };
  } else if (input.year) {
    const start = new Date(`${input.year}-01-01T00:00:00.000Z`);
    const end = new Date(`${Number(input.year) + 1}-01-01T00:00:00.000Z`);
    query.date = { $gte: start, $lt: end };
  } else if (input.startDate || input.endDate) {
    query.date = {
      ...(input.startDate ? { $gte: new Date(input.startDate) } : {}),
      ...(input.endDate ? { $lte: new Date(input.endDate) } : {})
    };
  }

  return query;
}

export const listTransactions = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const query = buildTransactionQuery(req);

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate("category")
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(query)
  ]);

  res.json({
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ _id: req.body.category, user: req.user?.id, deletedAt: null });
  if (!category) throw new ApiError(422, "Category does not exist");

  const transaction = await Transaction.create({
    ...req.body,
    user: req.user?.id
  });
  await transaction.populate("category");
  await evaluateBudgetNotifications(req.user!.id, transaction.date);
  await writeAuditLog(req, { action: "transaction.create", entity: "Transaction", entityId: transaction._id });

  res.status(201).json({ transaction });
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  if (req.body.category) {
    const category = await Category.findOne({ _id: req.body.category, user: req.user?.id, deletedAt: null });
    if (!category) throw new ApiError(422, "Category does not exist");
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user?.id, deletedAt: null },
    req.body,
    { new: true, runValidators: true }
  ).populate("category");

  if (!transaction) throw new ApiError(404, "Transaction not found");
  await evaluateBudgetNotifications(req.user!.id, transaction.date);
  await writeAuditLog(req, { action: "transaction.update", entity: "Transaction", entityId: transaction._id });
  res.json({ transaction });
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user?.id, deletedAt: null });
  if (!transaction) throw new ApiError(404, "Transaction not found");

  transaction.deletedAt = new Date();
  await transaction.save();
  await writeAuditLog(req, { action: "transaction.delete", entity: "Transaction", entityId: transaction._id });
  res.status(204).send();
});

export const exportTransactionsCsv = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await Transaction.find(buildTransactionQuery(req)).sort({ date: -1 }).limit(5000);
  const csv = transactionsToCsv(transactions);
  res.header("Content-Type", "text/csv");
  res.attachment("transactions.csv");
  res.send(csv);
});

export const importTransactionsCsv = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(422, "CSV file is required");

  const rows = parse(req.file.buffer.toString("utf-8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as Array<Record<string, string>>;

  const created = [];
  const errors = [];

  for (const [index, row] of rows.entries()) {
    try {
      let categoryId = row.category;
      if (!categoryId || !/^[a-f\d]{24}$/i.test(categoryId)) {
        const category = await Category.findOne({
          user: req.user?.id,
          name: row.categoryName ?? row.category,
          deletedAt: null
        });
        if (!category) throw new Error("Category not found");
        categoryId = category._id.toString();
      }

      const parsed = createTransactionSchema.parse({
        ...row,
        category: categoryId,
        amount: Number(row.amount),
        isRecurring: row.isRecurring === "true"
      });

      const transaction = await Transaction.create({ ...parsed, user: req.user?.id });
      created.push(transaction);
    } catch (error) {
      errors.push({
        row: index + 2,
        message: error instanceof Error ? error.message : "Invalid row"
      });
    }
  }

  if (created.length) {
    await writeAuditLog(req, {
      action: "transaction.importCsv",
      entity: "Transaction",
      metadata: { created: created.length, errors: errors.length }
    });
  }

  res.status(errors.length ? 207 : 201).json({ imported: created.length, errors });
});
