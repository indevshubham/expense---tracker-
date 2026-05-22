import { Router } from "express";
import { z } from "zod";
import { getAnalytics } from "../controllers/analytics.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { currencySchema } from "../validators/common.validators";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate, requireVerifiedEmail);
analyticsRouter.get(
  "/",
  validate({
    query: z.object({
      currency: currencySchema.default("USD"),
      year: z.string().regex(/^\d{4}$/).optional()
    })
  }),
  getAnalytics
);
