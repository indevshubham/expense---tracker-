import PDFDocument from "pdfkit";
import { stringify } from "csv-stringify/sync";
import type { TransactionDocument } from "../models/transaction.model";

export function transactionsToCsv(transactions: TransactionDocument[]) {
  return stringify(
    transactions.map((transaction) => ({
      id: transaction._id.toString(),
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      category: String(transaction.category),
      paymentMethod: transaction.paymentMethod,
      description: transaction.description,
      notes: transaction.notes ?? "",
      date: transaction.date.toISOString(),
      currency: transaction.currency,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString()
    })),
    { header: true }
  );
}

export function reportToCsv(report: {
  periodType: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: Array<{
    categoryName: string;
    transactionType: string;
    amount: number;
    count: number;
  }>;
}) {
  return stringify(
    [
      {
        periodType: report.periodType,
        startDate: report.startDate.toISOString(),
        endDate: report.endDate.toISOString(),
        currency: report.currency,
        totalIncome: report.totalIncome,
        totalExpense: report.totalExpense,
        balance: report.balance,
        transactionCount: report.transactionCount
      },
      ...report.categoryBreakdown.map((row) => ({
        periodType: "category",
        startDate: "",
        endDate: "",
        currency: report.currency,
        totalIncome: row.transactionType === "income" ? row.amount : "",
        totalExpense: row.transactionType === "expense" ? row.amount : "",
        balance: "",
        transactionCount: row.count,
        category: row.categoryName,
        transactionType: row.transactionType
      }))
    ],
    { header: true }
  );
}

export function reportToPdfBuffer(report: {
  periodType: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: Array<{
    categoryName: string;
    transactionType: string;
    amount: number;
    count: number;
  }>;
}) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).text("Personal Expense Report", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#555").text(`${report.periodType.toUpperCase()} | ${report.startDate.toDateString()} - ${report.endDate.toDateString()}`);
    doc.moveDown(1.5);

    doc.fillColor("#111").fontSize(13).text(`Currency: ${report.currency}`);
    doc.text(`Total income: ${report.totalIncome.toFixed(2)}`);
    doc.text(`Total expense: ${report.totalExpense.toFixed(2)}`);
    doc.text(`Balance: ${report.balance.toFixed(2)}`);
    doc.text(`Transactions: ${report.transactionCount}`);
    doc.moveDown(1.5);

    doc.fontSize(16).text("Category Breakdown");
    doc.moveDown(0.5);

    if (!report.categoryBreakdown.length) {
      doc.fontSize(12).fillColor("#555").text("No transactions found for this period.");
    } else {
      report.categoryBreakdown.forEach((row) => {
        doc
          .fontSize(11)
          .fillColor("#111")
          .text(`${row.categoryName} (${row.transactionType})`, { continued: true })
          .text(`  ${row.amount.toFixed(2)} ${report.currency} | ${row.count} records`, { align: "right" });
      });
    }

    doc.end();
  });
}
