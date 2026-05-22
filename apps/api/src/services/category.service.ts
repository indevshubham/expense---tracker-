import { Category } from "../models/category.model";

const defaultCategories = [
  { name: "Food", color: "#f9735b", icon: "Utensils", type: "expense" },
  { name: "Travel", color: "#38bdf8", icon: "Plane", type: "expense" },
  { name: "Shopping", color: "#a855f7", icon: "ShoppingBag", type: "expense" },
  { name: "Bills", color: "#f59e0b", icon: "Receipt", type: "expense" },
  { name: "Salary", color: "#12b981", icon: "Wallet", type: "income" },
  { name: "Investment", color: "#22c55e", icon: "TrendingUp", type: "income" },
  { name: "Entertainment", color: "#ec4899", icon: "Music", type: "expense" },
  { name: "Healthcare", color: "#ef4444", icon: "HeartPulse", type: "expense" },
  { name: "Education", color: "#6366f1", icon: "GraduationCap", type: "expense" },
  { name: "Other", color: "#64748b", icon: "CircleDollarSign", type: "both" }
] as const;

export async function createDefaultCategories(userId: string) {
  await Category.insertMany(
    defaultCategories.map((category) => ({
      ...category,
      user: userId,
      isDefault: true
    })),
    { ordered: false }
  );
}

export async function ensureCategoryBelongsToUser(categoryId: string, userId: string) {
  return Category.findOne({ _id: categoryId, user: userId, deletedAt: null });
}
