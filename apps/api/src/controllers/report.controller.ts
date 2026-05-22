import type { Request, Response } from "express";
import { buildReport } from "../services/report.service";
import { reportToCsv, reportToPdfBuffer } from "../services/export.service";
import { writeAuditLog } from "../services/audit.service";
import { asyncHandler } from "../utils/async-handler";

export const generateReport = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as {
    periodType: "weekly" | "monthly" | "yearly";
    referenceDate: Date;
    currency: string;
    persist: boolean;
    format: "json" | "pdf" | "csv";
  };

  const report = await buildReport({
    userId: req.user!.id,
    periodType: query.periodType,
    referenceDate: query.referenceDate,
    currency: query.currency,
    persist: query.persist
  });

  await writeAuditLog(req, {
    action: "report.generate",
    entity: "Report",
    entityId: "id" in report ? report.id : null,
    metadata: { periodType: query.periodType, format: query.format }
  });

  if (query.format === "csv") {
    res.header("Content-Type", "text/csv");
    res.attachment(`${query.periodType}-report.csv`);
    return res.send(reportToCsv(report));
  }

  if (query.format === "pdf") {
    const buffer = await reportToPdfBuffer(report);
    res.header("Content-Type", "application/pdf");
    res.attachment(`${query.periodType}-report.pdf`);
    return res.send(buffer);
  }

  return res.json({ report });
});
