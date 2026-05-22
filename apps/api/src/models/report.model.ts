import mongoose, { Schema, type Model } from "mongoose";

export interface ReportDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  periodType: "weekly" | "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: Array<{
    categoryId?: mongoose.Types.ObjectId;
    categoryName: string;
    transactionType: "income" | "expense";
    amount: number;
    count: number;
  }>;
  filters: Record<string, unknown>;
  generatedAt: Date;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    periodType: { type: String, enum: ["weekly", "monthly", "yearly"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
    totalIncome: { type: Number, required: true, default: 0 },
    totalExpense: { type: Number, required: true, default: 0 },
    balance: { type: Number, required: true, default: 0 },
    transactionCount: { type: Number, required: true, default: 0 },
    categoryBreakdown: [
      {
        categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
        categoryName: { type: String, required: true },
        transactionType: { type: String, enum: ["income", "expense"], required: true },
        amount: { type: Number, required: true },
        count: { type: Number, required: true }
      }
    ],
    filters: { type: Schema.Types.Mixed, default: {} },
    generatedAt: { type: Date, default: Date.now },
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

export const Report: Model<ReportDocument> =
  mongoose.models.Report || mongoose.model<ReportDocument>("Report", reportSchema);
