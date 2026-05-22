import mongoose, { Schema, type Model } from "mongoose";

export interface CategoryDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
  type: "income" | "expense" | "both";
  isDefault: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    color: { type: String, required: true, trim: true, default: "#12b981" },
    icon: { type: String, trim: true, default: "CircleDollarSign" },
    type: { type: String, enum: ["income", "expense", "both"], default: "both" },
    isDefault: { type: Boolean, default: false },
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

categorySchema.index({ user: 1, name: 1, deletedAt: 1 }, { unique: true });

export const Category: Model<CategoryDocument> =
  mongoose.models.Category || mongoose.model<CategoryDocument>("Category", categorySchema);
