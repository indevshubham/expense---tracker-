import { FormEvent, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Card, EmptyState, Field, Input, Select, Skeleton } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { currentMonth, money } from "../lib/format";
import type { Budget, Category } from "../types/api";

interface BudgetSummary {
  budget: Budget;
  spent: number;
  remaining: number;
  usedPercentage: number;
}

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summaries, setSummaries] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentMonth());

  async function load() {
    setLoading(true);
    try {
      const [budgetResponse, categoryResponse, summaryResponse] = await Promise.all([
        api.get<{ budgets: Budget[] }>("/budgets"),
        api.get<{ categories: Category[] }>("/categories"),
        api.get<{ summaries: BudgetSummary[] }>("/budgets/summary", { params: { month } })
      ]);
      setBudgets(budgetResponse.data.budgets);
      setCategories(categoryResponse.data.categories);
      setSummaries(summaryResponse.data.summaries);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [month]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.post("/budgets", {
        month: String(form.get("month")),
        amount: Number(form.get("amount")),
        currency: String(form.get("currency")).toUpperCase(),
        category: String(form.get("category")) || null,
        alertThreshold: Number(form.get("alertThreshold"))
      });
      toast.success("Budget saved");
      event.currentTarget.reset();
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  async function deleteBudget(id: string) {
    try {
      await api.delete(`/budgets/${id}`);
      toast.success("Budget deleted");
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading) return <Skeleton className="h-[580px]" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <Card>
        <p className="label">Budget management</p>
        <h2 className="mb-5 text-2xl font-black">Set monthly budget</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Field label="Month">
            <Input name="month" type="month" defaultValue={month} required />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Amount">
              <Input name="amount" type="number" min="0" step="0.01" required />
            </Field>
            <Field label="Currency">
              <Input name="currency" defaultValue="USD" maxLength={3} required />
            </Field>
          </div>
          <Field label="Category optional">
            <Select name="category">
              <option value="">Overall budget</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Alert threshold">
            <Input name="alertThreshold" type="number" min="1" max="100" defaultValue="80" required />
          </Field>
          <Button>Save budget</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="label">Tracking</p>
            <h2 className="text-2xl font-black">Remaining amount</h2>
          </div>
          <Input className="max-w-44" type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </div>

        {summaries.length ? (
          <div className="grid gap-4">
            {summaries.map((summary) => (
              <div key={summary.budget.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black">{summary.budget.category?.name ?? "Overall budget"}</p>
                    <p className="text-sm text-slate-500">
                      Spent {money(summary.spent, summary.budget.currency)} of {money(summary.budget.amount, summary.budget.currency)}
                    </p>
                  </div>
                  <Button type="button" variant="danger" onClick={() => deleteBudget(summary.budget.id)}><Trash2 size={16} /></Button>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={summary.usedPercentage >= 100 ? "h-full bg-red-500" : "h-full bg-brand-500"}
                    style={{ width: `${Math.min(summary.usedPercentage, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-bold">
                  Remaining: {money(summary.remaining, summary.budget.currency)}
                </p>
              </div>
            ))}
          </div>
        ) : budgets.length ? (
          <EmptyState title="No budget summary for this month" body="Choose a month that has a saved budget." />
        ) : (
          <EmptyState title="No budgets yet" body="Create a monthly budget to enable spending warnings and budget alerts." />
        )}
      </Card>
    </div>
  );
}
