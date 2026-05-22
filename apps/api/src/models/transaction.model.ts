import mongoose, { Schema, type Model } from "mongoose";

export interface TransactionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  amount: number;
  transactionType: "income" | "expense";
  paymentMethod: string;
  description: string;
  notes?: string;
  date: Date;
  currency: string;
  isRecurring: boolean;
  recurrence?: {
    frequency?: "daily" | "weekly" | "monthly" | "yearly";
    interval?: number;
    nextRunAt?: Date;
    endsAt?: Date;
  };
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    amount: { type: Number, required: true, min: 0.01 },
    transactionType: { type: String, enum: ["income", "expense"], required: true, index: true },
    paymentMethod: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, required: true, trim: true, maxlength: 180 },
    notes: { type: String, trim: true, maxlength: 1000 },
    date: { type: Date, required: true, index: true },
    currency: { type: String, required: true, uppercase: true, trim: true, minlength: 3, maxlength: 3 },
    isRecurring: { type: Boolean, default: false },
    recurrence: {
      frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
      interval: { type: Number, min: 1, default: 1 },
      nextRunAt: { type: Date },
      endsAt: { type: Date }
    },
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

transactionSchema.index({ user: 1, date: -1, deletedAt: 1 });
transactionSchema.index({ user: 1, transactionType: 1, date: -1, deletedAt: 1 });
transactionSchema.index({ description: "text", notes: "text", paymentMethod: "text" });

export const Transaction: Model<TransactionDocument> =
  mongoose.models.Transaction || mongoose.model<TransactionDocument>("Transaction", transactionSchema);
