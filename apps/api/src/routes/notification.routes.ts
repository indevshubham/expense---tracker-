import { Router } from "express";
import { listNotifications, markNotificationRead } from "../controllers/notification.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { idParamsSchema } from "../validators/common.validators";

export const notificationRouter = Router();

notificationRouter.use(authenticate, requireVerifiedEmail);
notificationRouter.get("/", listNotifications);
notificationRouter.patch("/:id/read", validate({ params: idParamsSchema }), markNotificationRead);
