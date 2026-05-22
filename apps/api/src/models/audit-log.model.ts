import mongoose, { Schema, type Model } from "mongoose";

export interface AuditLogDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId | null;
  action: string;
  entity: string;
  entityId?: mongoose.Types.ObjectId | null;
  ip?: string;
  userAgent?: string;
  metadata: Record<string, unknown>;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, default: null },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

export const AuditLog: Model<AuditLogDocument> =
  mongoose.models.AuditLog || mongoose.model<AuditLogDocument>("AuditLog", auditLogSchema);
