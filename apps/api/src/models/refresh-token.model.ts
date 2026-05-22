import mongoose, { Schema, type Model } from "mongoose";

export interface RefreshTokenDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  createdByIp?: string;
  userAgent?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    createdByIp: { type: String },
    userAgent: { type: String },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

export const RefreshToken: Model<RefreshTokenDocument> =
  mongoose.models.RefreshToken || mongoose.model<RefreshTokenDocument>("RefreshToken", refreshTokenSchema);
