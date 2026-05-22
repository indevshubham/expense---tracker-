import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet, Calendar, DollarSign } from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { currentMonth, money, shortDate } from "../lib/format";
import type { DashboardResponse } from "../types/api";
import { Card, EmptyState, Skeleton, StatusPill, AnimatedNumber, AnimatedPage } from "../components/ui";

function StatCard({
  title,
  valueNum,
  currency,
  icon: Icon,
  tone,
  gradientClass,
  delay
}: {
  title: string;
  valueNum: number;
  currency: string;
  icon: typeof Wallet;
  tone: "green" | "red" | "gold" | "neutral";
  gradientClass: string;
  delay: number;
}) {
  return (
    <Card hoverLift={true} delay={delay} className="relative overflow-hidden group">
      {/* Decorative Gradient Background Blur */}
      <div className={`absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-10 blur-xl transition-all duration-500 group-hover:scale-125 ${gradientClass}`} />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="label">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            <AnimatedNumber value={valueNum} currency={currency} />
          </p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 ${gradientClass}`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="mt-5 flex items-center gap-1.5">
        <StatusPill tone={tone}>Database live total</StatusPill>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const [month, setMonth] = useState(currentMonth());
  const [currency, setCurrency] = useState("USD");
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<DashboardResponse>("/dashboard", { params: { month, currency } })
      .then((response) => setData(response.data))
      .catch((error) => toast.error(errorMessage(error)))
      .finally(() => setLoading(false));
  }, [month, currency]);

  if (loading) {
    return (
      <AnimatedPage className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-11 w-44" />
            <Skeleton className="h-11 w-28" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </AnimatedPage>
    );
  }

  // Custom Glassmorphic Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-2xl border border-slate-200/50 bg-white/90 p-4 shadow-premium backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/90 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Month: {payload[0].payload.month}</p>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Income: <span className="font-extrabold">{money(payload[0].value, currency)}</span>
            </p>
            {payload[1] && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Expense: <span className="font-extrabold">{money(payload[1].value, currency)}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatedPage className="grid gap-6">
      
      {/* Header controls block */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="label">Dashboard</p>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Your Financial Command Center</h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Telemetry overview compiled automatically from authenticated database transactions.</p>
        </div>
        
        {/* Controls inputs */}
        <div className="flex gap-2 self-start sm:self-auto">
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              className="input pl-10 max-w-44 bg-white/60 dark:bg-slate-950/60" 
              type="month" 
              value={month} 
              onChange={(event) => setMonth(event.target.value)} 
            />
          </div>
          <div className="relative flex items-center">
            <DollarSign className="absolute left-3 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              className="input pl-10 max-w-28 bg-white/60 dark:bg-slate-950/60 font-bold" 
              value={currency} 
              maxLength={3} 
              onChange={(event) => setCurrency(event.target.value.toUpperCase())} 
            />
          </div>
        </div>
      </div>

      {data ? (
        <>
          {/* Stats grid cards */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard 
              title="Total Income" 
              valueNum={data.summary.totalIncome} 
              currency={data.currency} 
              icon={ArrowUpRight} 
              tone="green" 
              gradientClass="bg-gradient-to-tr from-emerald-500 to-teal-400"
              delay={0}
            />
            <StatCard 
              title="Total Expense" 
              valueNum={data.summary.totalExpense} 
              currency={data.currency} 
              icon={ArrowDownRight} 
              tone="red" 
              gradientClass="bg-gradient-to-tr from-coral to-rose-400"
              delay={0.1}
            />
            <StatCard 
              title="Current Balance" 
              valueNum={data.summary.currentBalance} 
              currency={data.currency} 
              icon={Wallet} 
              tone="neutral" 
              gradientClass="bg-gradient-to-tr from-brand-500 to-indigo-400"
              delay={0.2}
            />
            <StatCard 
              title="Savings Amount" 
              valueNum={data.summary.savingsAmount} 
              currency={data.currency} 
              icon={PiggyBank} 
              tone="gold" 
              gradientClass="bg-gradient-to-tr from-yellow-500 to-amber-400"
              delay={0.3}
            />
          </section>

          {/* Monthly charts vs Recent items */}
          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            
            {/* Recharts Area card */}
            <Card hoverLift={false} className="flex flex-col justify-between">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="label">Monthly Trend</p>
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">Income vs Expense</h3>
                  <p className="text-xs text-slate-450 mt-1">Graphical projection of monthly inflow telemetry.</p>
                </div>
              </div>
              
              {data.monthlyTrend.length ? (
                <div className="h-80 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} 
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(148, 163, 184, 0.15)", strokeWidth: 1.5 }} />
                      <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)" />
                      <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#expenseGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState title="No trend data yet" body="Add real income or expense records and the monthly trend will appear here." />
              )}
            </Card>

            {/* Recent records list card */}
            <Card hoverLift={false} className="flex flex-col">
              <div className="mb-4">
                <p className="label">Recent Transactions</p>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">Latest Ledger Logs</h3>
                <p className="text-xs text-slate-450 mt-1">Instant database records uploaded in sandbox.</p>
              </div>

              {data.recentTransactions.length ? (
                <div className="grid gap-3 overflow-y-auto max-h-[340px] pr-1 mt-4">
                  {data.recentTransactions.map((transaction, index) => (
                    <motion.div 
                      key={transaction.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between rounded-2xl border border-slate-150/45 dark:border-slate-800/40 bg-white/20 dark:bg-slate-900/20 p-3.5 backdrop-blur-sm hover:border-slate-350 dark:hover:border-slate-700 transition duration-300"
                    >
                      <div className="flex items-center gap-3">
                        {/* Transaction specific icon tone */}
                        <div className={`grid h-10 w-10 place-items-center rounded-xl font-extrabold text-white text-xs ${transaction.transactionType === 'income' ? 'bg-gradient-to-tr from-emerald-500 to-teal-400' : 'bg-gradient-to-tr from-coral to-rose-450'}`}>
                          {transaction.transactionType === 'income' ? 'IN' : 'EX'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{transaction.description}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {transaction.category?.name} · {shortDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <p className={`font-black text-sm ${transaction.transactionType === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                        {transaction.transactionType === "income" ? "+" : "-"}
                        {money(transaction.amount, transaction.currency)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No transactions yet" body="Your dashboard stays empty until you add real transactions." />
              )}
            </Card>
          </section>
        </>
      ) : (
        <EmptyState title="Dashboard unavailable" body="Connect the API and database, then sign in with a verified account." />
      )}
    </AnimatedPage>
  );
}
