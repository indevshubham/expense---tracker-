import type { Request, Response } from "express";
import { Category } from "../models/category.model";
import { Transaction } from "../models/transaction.model";
import { writeAuditLog } from "../services/audit.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({ user: req.user?.id, deletedAt: null }).sort({ isDefault: -1, name: 1 });
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.create({
    ...req.body,
    user: req.user?.id,
    isDefault: false
  });
  await writeAuditLog(req, { action: "category.create", entity: "Category", entityId: category._id });
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user?.id, deletedAt: null },
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) throw new ApiError(404, "Category not found");
  await writeAuditLog(req, { action: "category.update", entity: "Category", entityId: category._id });
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user?.id, deletedAt: null });
  if (!category) throw new ApiError(404, "Category not found");

  const transactionCount = await Transaction.countDocuments({
    category: category._id,
    user: req.user?.id,
    deletedAt: null
  });

  if (transactionCount > 0) {
    throw new ApiError(409, "Category is used by existing transactions. Edit it instead of deleting it.");
  }

  category.deletedAt = new Date();
  await category.save();
  await writeAuditLog(req, { action: "category.delete", entity: "Category", entityId: category._id });
  res.status(204).send();
});
