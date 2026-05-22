import mongoose, { Schema, type Model } from "mongoose";

export interface NotificationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: "budget_warning" | "budget_exceeded" | "savings_reminder" | "system";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger" | "success";
  isRead: boolean;
  metadata: Record<string, unknown>;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["budget_warning", "budget_exceeded", "savings_reminder", "system"],
      required: true
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    severity: { type: String, enum: ["info", "warning", "danger", "success"], default: "info" },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
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

export const Notification: Model<NotificationDocument> =
  mongoose.models.Notification || mongoose.model<NotificationDocument>("Notification", notificationSchema);
