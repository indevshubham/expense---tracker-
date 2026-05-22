import { FormEvent, useEffect, useMemo, useState } from "react";
import { Upload, Download, Trash2, Pencil, X, Plus, Filter, Calendar, DollarSign, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Button, Card, EmptyState, Field, Input, Select, Skeleton, StatusPill, AnimatedPage } from "../components/ui";
import { api, downloadBlob, errorMessage } from "../lib/api";
import { currentMonth, money, shortDate } from "../lib/format";
import type { Category, Transaction, TransactionType } from "../types/api";

interface TransactionFormState {
  amount: string;
  category: string;
  transactionType: TransactionType;
  paymentMethod: string;
  description: string;
  notes: string;
  date: string;
  currency: string;
  isRecurring: boolean;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
}

const initialForm: TransactionFormState = {
  amount: "",
  category: "",
  transactionType: "expense",
  paymentMethod: "",
  description: "",
  notes: "",
  date: new Date().toISOString().slice(0, 10),
  currency: "USD",
  isRecurring: false,
  frequency: "monthly"
};

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [filterYear, setFilterYear] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | TransactionType>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  
  // Drawer UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.type === "both" || category.type === form.transactionType),
    [categories, form.transactionType]
  );

  async function load() {
    setLoading(true);
    try {
      const [categoryResponse, transactionResponse] = await Promise.all([
        api.get<{ categories: Category[] }>("/categories"),
        api.get<{ transactions: Transaction[] }>("/transactions", {
          params: {
            month: filterMonth || undefined,
            year: !filterMonth ? filterYear || undefined : undefined,
            startDate: !filterMonth && !filterYear ? startDate || undefined : undefined,
            endDate: !filterMonth && !filterYear ? endDate || undefined : undefined,
            category: categoryFilter || undefined,
            transactionType: typeFilter || undefined,
            minAmount: minAmount || undefined,
            maxAmount: maxAmount || undefined,
            limit: 100
          }
        })
      ]);
      setCategories(categoryResponse.data.categories);
      setTransactions(transactionResponse.data.transactions);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filterMonth, filterYear, startDate, endDate, categoryFilter, typeFilter, minAmount, maxAmount]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const payload = {
        amount: Number(form.amount),
        category: form.category,
        transactionType: form.transactionType,
        paymentMethod: form.paymentMethod,
        description: form.description,
        notes: form.notes || undefined,
        date: form.date,
        currency: form.currency,
        isRecurring: form.isRecurring,
        recurrence: form.isRecurring ? { frequency: form.frequency, interval: 1, nextRunAt: form.date } : undefined
      };
      if (editingId) {
        await api.patch(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      toast.success(editingId ? "Transaction updated" : "Transaction saved successfully");
      setEditingId(null);
      setForm({ ...initialForm, currency: form.currency });
      setDrawerOpen(false);
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  function startEdit(transaction: Transaction) {
    setEditingId(transaction.id);
    setForm({
      amount: String(transaction.amount),
      category: transaction.category.id,
      transactionType: transaction.transactionType,
      paymentMethod: transaction.paymentMethod,
      description: transaction.description,
      notes: transaction.notes ?? "",
      date: transaction.date.slice(0, 10),
      currency: transaction.currency,
      isRecurring: transaction.isRecurring,
      frequency: "monthly"
    });
    setDrawerOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted successfully");
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  async function exportCsv() {
    try {
      const response = await api.get("/transactions/export.csv", {
        params: {
          month: filterMonth || undefined,
          year: !filterMonth ? filterYear || undefined : undefined,
          startDate: !filterMonth && !filterYear ? startDate || undefined : undefined,
          endDate: !filterMonth && !filterYear ? endDate || undefined : undefined,
          category: categoryFilter || undefined,
          transactionType: typeFilter || undefined,
          minAmount: minAmount || undefined,
          maxAmount: maxAmount || undefined
        },
        responseType: "blob"
      });
      downloadBlob(response.data, "transactions.csv");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  async function importCsv(file: File | null) {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    try {
      await api.post("/transactions/import.csv", body, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("CSV import completed");
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading && transactions.length === 0) return <Skeleton className="h-[680px]" />;

  return (
    <AnimatedPage className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div>
          <p className="label">Transactions</p>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Ledger Database Records</h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Audit, export, or record transaction logs.</p>
        </div>
        
        {/* Actions Trigger Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={16} /> Filters
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={exportCsv}
            className="flex items-center gap-2"
          >
            <Download size={16} /> Export CSV
          </Button>
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 px-4 text-sm font-bold shadow-soft select-none hover:bg-slate-50 transition">
            <Upload size={16} /> Import CSV
            <input className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => importCsv(event.target.files?.[0] ?? null)} />
          </label>
          <Button 
            onClick={() => { setEditingId(null); setForm(initialForm); setDrawerOpen(true); }}
            className="flex items-center gap-2 shadow-lg shadow-brand-500/10"
          >
            <Plus size={16} /> Record Transaction
          </Button>
        </div>
      </div>

      {/* Advanced Filters Expandable Card */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <Card hoverLift={false} className="border-slate-200/60 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 p-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 backdrop-blur-md">
              <Field label="Month Tracker">
                <Input type="month" value={filterMonth} onChange={(event) => setFilterMonth(event.target.value)} />
              </Field>
              <Field label="Year Tracker">
                <Input placeholder="e.g. 2026" value={filterYear} onChange={(event) => setFilterYear(event.target.value)} />
              </Field>
              <Field label="Record Type">
                <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "" | TransactionType)}>
                  <option value="">All Types</option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Select>
              </Field>
              <Field label="Category Group">
                <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Min Ledger Value">
                <Input placeholder="0.00" value={minAmount} onChange={(event) => setMinAmount(event.target.value)} />
              </Field>
              <Field label="Max Ledger Value">
                <Input placeholder="10,000" value={maxAmount} onChange={(event) => setMaxAmount(event.target.value)} />
              </Field>
              
              <div className="col-span-full border-t border-slate-100 dark:border-slate-800/60 pt-3 grid grid-cols-2 gap-3">
                <Field label="Custom Start Date">
                  <Input type="date" value={startDate} onChange={(event) => { setFilterMonth(""); setFilterYear(""); setStartDate(event.target.value); }} />
                </Field>
                <Field label="Custom End Date">
                  <Input type="date" value={endDate} onChange={(event) => { setFilterMonth(""); setFilterYear(""); setEndDate(event.target.value); }} />
                </Field>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Ledger List Card */}
      <Card hoverLift={false}>
        {transactions.length ? (
          <div className="grid gap-3.5 mt-2">
            {transactions.map((transaction, index) => (
              <motion.div 
                key={transaction.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="grid gap-4 rounded-3xl border border-slate-100 p-4 sm:grid-cols-[1fr_auto] sm:items-center dark:border-slate-800 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-soft transition-all duration-300"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-slate-800 dark:text-white leading-tight">{transaction.description}</p>
                    <StatusPill tone={transaction.transactionType === "income" ? "green" : "red"}>
                      {transaction.transactionType.toUpperCase()}
                    </StatusPill>
                    {transaction.isRecurring && (
                      <span className="inline-flex rounded-full bg-indigo-500/10 text-indigo-500 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border border-indigo-500/20">
                        RECURRING
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 font-medium">
                    Category: <span className="font-bold text-slate-500">{transaction.category?.name}</span> · Account: <span className="font-bold text-slate-500">{transaction.paymentMethod}</span> · Recorded: <span className="font-bold text-slate-500">{shortDate(transaction.date)}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className={`text-lg font-black tracking-tight ${transaction.transactionType === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                    {transaction.transactionType === "income" ? "+" : "-"}
                    {money(transaction.amount, transaction.currency)}
                  </p>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button" 
                    onClick={() => startEdit(transaction)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-white text-slate-650 hover:bg-slate-55 dark:border-slate-800 dark:bg-slate-900 shadow-soft"
                    aria-label="Edit record"
                  >
                    <Pencil size={15} />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button" 
                    onClick={() => handleDelete(transaction.id)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-white text-coral hover:bg-red-50 dark:border-slate-800 dark:bg-slate-900 shadow-soft"
                    aria-label="Delete record"
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState title="No Ledger Logs Uploaded" body="There are no transaction records matching your current filter limits." />
        )}
      </Card>

      {/* Slide-In Modal Drawer for Add/Edit Form */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Slide-in Drawer Container */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white p-6 shadow-premium border-l border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-6">
                  <div>
                    <p className="label">Sandboxed Ledger</p>
                    <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                      {editingId ? "Modify Transaction" : "Record Transaction"}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setDrawerOpen(false)} 
                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Elements */}
                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Record Type">
                      <Select 
                        value={form.transactionType} 
                        onChange={(event) => setForm({ ...form, transactionType: event.target.value as TransactionType, category: "" })}
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </Select>
                    </Field>
                    <Field label="Ledger Value (Amount)">
                      <Input 
                        value={form.amount} 
                        onChange={(event) => setForm({ ...form, amount: event.target.value })} 
                        type="number" 
                        min="0.01" 
                        step="0.01" 
                        placeholder="0.00"
                        required 
                      />
                    </Field>
                  </div>

                  <Field label="Assigned Category">
                    <Select 
                      value={form.category} 
                      onChange={(event) => setForm({ ...form, category: event.target.value })} 
                      required
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </Select>
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Method of Payment">
                      <Input 
                        value={form.paymentMethod} 
                        onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })} 
                        placeholder="UPI, Card, Cash..." 
                        required 
                      />
                    </Field>
                    <Field label="Currency Code">
                      <Input 
                        value={form.currency} 
                        maxLength={3} 
                        onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase() })} 
                        required 
                      />
                    </Field>
                  </div>

                  <Field label="Short Description">
                    <Input 
                      value={form.description} 
                      onChange={(event) => setForm({ ...form, description: event.target.value })} 
                      placeholder="Enter details..."
                      required 
                    />
                  </Field>

                  <Field label="Notes (Private)">
                    <Input 
                      value={form.notes} 
                      onChange={(event) => setForm({ ...form, notes: event.target.value })} 
                      placeholder="Add supplementary context..."
                    />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Record Date">
                      <Input 
                        type="date" 
                        value={form.date} 
                        onChange={(event) => setForm({ ...form, date: event.target.value })} 
                        required 
                      />
                    </Field>
                    <Field label="Recurrent Ledger status">
                      <Select 
                        value={form.isRecurring ? form.frequency : "none"} 
                        onChange={(event) => setForm({ ...form, isRecurring: event.target.value !== "none", frequency: event.target.value === "none" ? "monthly" : (event.target.value as TransactionFormState["frequency"]) })}
                      >
                        <option value="none">No, Single Record</option>
                        <option value="daily">Daily Schedule</option>
                        <option value="weekly">Weekly Schedule</option>
                        <option value="monthly">Monthly Schedule</option>
                        <option value="yearly">Yearly Schedule</option>
                      </Select>
                    </Field>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-5 grid grid-cols-2 gap-3">
                    <Button type="button" variant="secondary" onClick={() => setDrawerOpen(false)}>
                      Close Form
                    </Button>
                    <Button>
                      {editingId ? "Update Record" : "Confirm Record"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
