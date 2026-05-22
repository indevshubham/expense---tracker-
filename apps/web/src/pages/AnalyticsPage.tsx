import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart as PieIcon, BarChart3, Database } from "lucide-react";
import { Card, EmptyState, Skeleton, AnimatedPage, StatusPill, Input } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { money } from "../lib/format";
import type { AnalyticsResponse } from "../types/api";

const chartColors = [
  "#2563eb", // Stripe/Brand Blue
  "#10b981", // Success Green
  "#f43f5e", // Coral Red
  "#8b5cf6", // Indigo Purple
  "#eab308", // Golden Yellow
  "#06b6d4", // Sky Blue
  "#64748b"  // Slate Muted
];

export function AnalyticsPage() {
  const [currency, setCurrency] = useState("USD");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<AnalyticsResponse>("/analytics", { params: { currency, year } })
      .then((response) => setData(response.data))
      .catch((error) => toast.error(errorMessage(error)))
      .finally(() => setLoading(false));
  }, [currency, year]);

  if (loading) {
    return (
      <AnimatedPage className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-11 w-28" />
            <Skeleton className="h-11 w-28" />
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </AnimatedPage>
    );
  }

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-2xl border border-slate-200/50 bg-white/90 p-3 shadow-premium backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/90 text-left">
          <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
            {payload[0].name}
          </p>
          <p className="text-sm font-black text-brand-500 mt-1 pl-4">
            {money(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload }: any) => {
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
      
      {/* Top Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="label">Analytics</p>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Structured Data Visualization</h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Deep visual distribution analysis generated from active database logs.</p>
        </div>
        
        {/* Year & Currency Controls */}
        <div className="flex gap-2 self-start sm:self-auto">
          <Input 
            className="max-w-28 bg-white/60 dark:bg-slate-950/60 font-bold" 
            value={year} 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setYear(event.target.value)} 
            placeholder="Year"
          />
          <Input 
            className="max-w-28 bg-white/60 dark:bg-slate-950/60 font-bold" 
            value={currency} 
            maxLength={3} 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurrency(event.target.value.toUpperCase())} 
            placeholder="Currency"
          />
        </div>
      </div>

      {/* Graphs Section */}
      <section className="grid gap-6 xl:grid-cols-2">
        
        {/* Pie Chart Card */}
        <Card hoverLift={false} className="flex flex-col justify-between">
          <div>
            <p className="label">Expense Distribution</p>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">Heuristic Category Breakdown</h3>
            <p className="text-xs text-slate-450 mt-1">Relative transaction weights per active category.</p>
          </div>
          
          {data?.expenseDistribution.length ? (
            <div className="h-80 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data.expenseDistribution} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={105} 
                    innerRadius={55}
                    paddingAngle={3}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {data.expenseDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} className="focus:outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12">
              <EmptyState icon={PieIcon} title="No expense chart yet" body="Add real expense records for this year to generate the pie chart." />
            </div>
          )}
        </Card>

        {/* Bar Chart Card */}
        <Card hoverLift={false} className="flex flex-col justify-between">
          <div>
            <p className="label">Monthly Expense Trend</p>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">Income vs Expense Growth</h3>
            <p className="text-xs text-slate-450 mt-1">Comparison metrics between cash inflow and expenditures.</p>
          </div>
          
          {data?.monthlyTrend.length ? (
            <div className="h-80 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.04)" }} />
                  <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12">
              <EmptyState icon={BarChart3} title="No monthly chart yet" body="Transactions for this year will appear here after they are saved." />
            </div>
          )}
        </Card>
      </section>

      {/* Category Breakdown Table */}
      <Card hoverLift={false}>
        <div className="mb-6">
          <p className="label">Category Breakdown</p>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">Detailed Totals</h3>
          <p className="text-xs text-slate-450 mt-1">Complete structural ledger records aggregated by categories.</p>
        </div>

        {data?.categoryBreakdown.length ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm shadow-soft">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-150/50 dark:border-slate-800/60">
                <tr>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4">Type</th>
                  <th className="py-4">Records Count</th>
                  <th className="py-4 pr-6 text-right">Aggregated Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150/45 dark:divide-slate-800/40">
                {data.categoryBreakdown.map((row, index) => (
                  <motion.tr 
                    key={`${row.category}-${row.type}`} 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all duration-150"
                  >
                    <td className="py-4 px-6 font-extrabold text-slate-850 dark:text-white">{row.category}</td>
                    <td className="py-4">
                      <StatusPill tone={row.type === "income" ? "green" : "red"}>
                        {row.type.toUpperCase()}
                      </StatusPill>
                    </td>
                    <td className="py-4 font-bold text-slate-500">{row.count} records</td>
                    <td className="py-4 pr-6 text-right font-black text-slate-900 dark:text-white text-base">
                      {money(row.amount, currency)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Database} title="No breakdown yet" body="Category analytics are generated from saved transaction records." />
        )}
      </Card>
    </AnimatedPage>
  );
}
