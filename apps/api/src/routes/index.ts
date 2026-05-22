import { Router } from "express";
import { analyticsRouter } from "./analytics.routes";
import { authRouter } from "./auth.routes";
import { budgetRouter } from "./budget.routes";
import { categoryRouter } from "./category.routes";
import { dashboardRouter } from "./dashboard.routes";
import { insightRouter } from "./insight.routes";
import { notificationRouter } from "./notification.routes";
import { reportRouter } from "./report.routes";
import { transactionRouter } from "./transaction.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "expense-tracker-api" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/transactions", transactionRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/budgets", budgetRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/insights", insightRouter);
