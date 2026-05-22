import type { Request, Response } from "express";
import { Notification } from "../models/notification.model";
import { asyncHandler } from "../utils/async-handler";

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ user: req.user?.id, deletedAt: null })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ notifications });
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user?.id, deletedAt: null },
    { isRead: true },
    { new: true }
  );
  res.json({ notification });
});
