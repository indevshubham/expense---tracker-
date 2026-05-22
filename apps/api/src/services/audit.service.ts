import type { Request } from "express";
import mongoose from "mongoose";
import { AuditLog } from "../models/audit-log.model";

export async function writeAuditLog(
  req: Request,
  input: {
    action: string;
    entity: string;
    entityId?: string | mongoose.Types.ObjectId | null;
    metadata?: Record<string, unknown>;
  }
) {
  await AuditLog.create({
    user: req.user?.id ?? null,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId ?? null,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    metadata: input.metadata ?? {}
  });
}
