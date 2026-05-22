import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { dashboardQuerySchema } from "../validators/report.validators";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate, requireVerifiedEmail);
dashboardRouter.get("/", validate({ query: dashboardQuerySchema }), getDashboard);
