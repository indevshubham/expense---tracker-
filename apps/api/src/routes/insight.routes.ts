import { Router } from "express";
import { z } from "zod";
import { getInsights } from "../controllers/insight.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { currencySchema } from "../validators/common.validators";

export const insightRouter = Router();

insightRouter.use(authenticate, requireVerifiedEmail);
insightRouter.get("/", validate({ query: z.object({ currency: currencySchema.default("USD") }) }), getInsights);
