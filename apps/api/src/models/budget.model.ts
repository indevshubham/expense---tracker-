import mongoose, { Schema, type Model } from "mongoose";

export interface BudgetDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  month: string;
  amount: number;
  currency: string;
  category?: mongoose.Types.ObjectId | null;
  alertThreshold: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<BudgetDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    alertThreshold: { type: Number, min: 1, max: 100, default: 80 },
    deletedAt: { type: Date, default: null, index: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj = ret as Record<string, unknown>;
        obj.id = String(obj._id);
        delete obj._id;
        delete obj.__v;
      }
    }
  }
);

budgetSchema.index({ user: 1, month: 1, category: 1, deletedAt: 1 }, { unique: true });

export const Budget: Model<BudgetDocument> =
  mongoose.models.Budget || mongoose.model<BudgetDocument>("Budget", budgetSchema);
