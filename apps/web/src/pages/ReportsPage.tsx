import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import { Button, Card, EmptyState, Field, Input, Select } from "../components/ui";
import { api, downloadBlob, errorMessage } from "../lib/api";
import { money } from "../lib/format";
import type { Report } from "../types/api";

export function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = {
      periodType: String(form.get("periodType")),
      referenceDate: String(form.get("referenceDate")),
      currency: String(form.get("currency")).toUpperCase(),
      persist: form.get("persist") === "on",
      format: "json"
    };
    setLoading(true);
    try {
      const { data } = await api.get<{ report: Report }>("/reports/generate", { params });
      setReport(data.report);
      toast.success("Report generated from database records");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function exportReport(format: "pdf" | "csv") {
    if (!report) return;
    try {
      const response = await api.get("/reports/generate", {
        params: {
          periodType: report.periodType,
          referenceDate: report.startDate,
          currency: report.currency,
          format
        },
        responseType: "blob"
      });
      downloadBlob(response.data, `${report.periodType}-report.${format}`);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <p className="label">Reports</p>
        <h2 className="mb-5 text-2xl font-black">Generate report</h2>
        <form className="grid gap-4" onSubmit={generate}>
          <Field label="Period">
            <Select name="periodType" defaultValue="monthly">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </Field>
          <Field label="Reference date">
            <Input name="referenceDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
          </Field>
          <Field label="Currency">
            <Input name="currency" defaultValue="USD" maxLength={3} required />
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input name="persist" type="checkbox" className="h-4 w-4 accent-brand-600" />
            Save report snapshot to database
          </label>
          <Button disabled={loading}>{loading ? "Generating..." : "Generate report"}</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="label">Output</p>
            <h2 className="text-2xl font-black">Monthly, weekly, yearly totals</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={!report} onClick={() => exportReport("pdf")}><Download size={16} /> PDF</Button>
            <Button variant="secondary" disabled={!report} onClick={() => exportReport("csv")}><Download size={16} /> CSV</Button>
          </div>
        </div>
        {report ? (
          <div className="grid gap-5">
            <section className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="label">Income</p>
                <p className="mt-2 font-black">{money(report.totalIncome, report.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="label">Expense</p>
                <p className="mt-2 font-black">{money(report.totalExpense, report.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="label">Balance</p>
                <p className="mt-2 font-black">{money(report.balance, report.currency)}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="label">Records</p>
                <p className="mt-2 font-black">{report.transactionCount}</p>
              </div>
            </section>
            {report.categoryBreakdown.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-3">Category</th>
                      <th>Type</th>
                      <th>Count</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.categoryBreakdown.map((row) => (
                      <tr key={`${row.categoryName}-${row.transactionType}`} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="py-3 font-bold">{row.categoryName}</td>
                        <td>{row.transactionType}</td>
                        <td>{row.count}</td>
                        <td className="text-right font-black">{money(row.amount, report.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No records in this period" body="The report is valid, but there are no matching database transactions yet." />
            )}
          </div>
        ) : (
          <EmptyState title="No report generated" body="Choose a period and generate a report from your database records." />
        )}
      </Card>
    </div>
  );
}
