import { Router } from "express";
import { budgetSummary, deleteBudget, listBudgets, upsertBudget } from "../controllers/budget.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { idParamsSchema } from "../validators/common.validators";
import { upsertBudgetSchema } from "../validators/budget.validators";

export const budgetRouter = Router();

budgetRouter.use(authenticate, requireVerifiedEmail);
budgetRouter.get("/", listBudgets);
budgetRouter.get("/summary", budgetSummary);
budgetRouter.post("/", validate({ body: upsertBudgetSchema }), upsertBudget);
budgetRouter.delete("/:id", validate({ params: idParamsSchema }), deleteBudget);
