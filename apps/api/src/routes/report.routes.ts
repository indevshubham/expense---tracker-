import { Router } from "express";
import { generateReport } from "../controllers/report.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { reportQuerySchema } from "../validators/report.validators";

export const reportRouter = Router();

reportRouter.use(authenticate, requireVerifiedEmail);
reportRouter.get("/generate", validate({ query: reportQuerySchema }), generateReport);
