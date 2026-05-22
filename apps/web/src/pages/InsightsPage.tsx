import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Brain, RefreshCw, Sparkles, TrendingUp, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Card, EmptyState, Skeleton, StatusPill, AnimatedPage, Input } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import type { SpendingInsight } from "../types/api";

function toneFor(severity: SpendingInsight["severity"]) {
  if (severity === "danger") return "red" as const;
  if (severity === "warning") return "gold" as const;
  if (severity === "success") return "green" as const;
  return "neutral" as const;
}

function IconFor(severity: SpendingInsight["severity"]) {
  if (severity === "danger") return <AlertCircle className="text-coral" size={20} />;
  if (severity === "warning") return <AlertTriangle className="text-amber-500" size={20} />;
  if (severity === "success") return <CheckCircle className="text-emerald-500" size={20} />;
  return <Sparkles className="text-slate-400 dark:text-slate-600" size={20} />;
}

function BorderClassFor(severity: SpendingInsight["severity"]) {
  if (severity === "danger") return "hover:border-coral/40 hover:shadow-glow-red/5 hover:after:border-coral/20";
  if (severity === "warning") return "hover:border-yellow-500/40 hover:shadow-glow/5 hover:after:border-yellow-500/20";
  if (severity === "success") return "hover:border-emerald-500/40 hover:shadow-glow-green/5 hover:after:border-emerald-500/20";
  return "hover:border-brand-500/30 hover:shadow-glow/5 hover:after:border-brand-500/10";
}

export function InsightsPage() {
  const [currency, setCurrency] = useState("USD");
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<{ insights: SpendingInsight[] }>("/insights", { params: { currency } });
      setInsights(data.insights);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [currency]);

  if (loading && insights.length === 0) return <Skeleton className="h-[520px]" />;

  return (
    <AnimatedPage className="space-y-6">
      
      {/* Top Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="label flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
            </span>
            AI Insight Engine
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-1">Autonomous Spending Suggestions</h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-2 leading-relaxed">
            The telemetry processor scans your authenticated database logs to generate automated warnings, savings recommendations, and anomalous transaction vectors. We never inject simulated telemetry.
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-2 self-start sm:self-auto">
          <Input 
            className="max-w-28 bg-white/60 dark:bg-slate-950/60 font-bold" 
            value={currency} 
            maxLength={3} 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurrency(event.target.value.toUpperCase())} 
            placeholder="Currency"
          />
          <Button 
            variant="secondary" 
            onClick={load}
            className="flex items-center gap-2"
          >
            <RefreshCw size={15} /> Refresh Engine
          </Button>
        </div>
      </div>

      {insights.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {insights.map((insight, index) => {
              const tone = toneFor(insight.severity);
              const borderStyle = BorderClassFor(insight.severity);
              
              return (
                <Card 
                  key={`${insight.type}-${index}`} 
                  hoverLift={true}
                  delay={index * 0.05}
                  className={`min-h-60 flex flex-col justify-between relative group ${borderStyle}`}
                >
                  <div>
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150/45 dark:border-slate-850 text-slate-500 shadow-soft">
                        {IconFor(insight.severity)}
                      </div>
                      <StatusPill tone={tone}>{insight.severity.toUpperCase()}</StatusPill>
                    </div>
                    
                    {/* Title & Msg */}
                    <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight tracking-tight group-hover:text-brand-500 transition-colors">
                      {insight.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-450 dark:text-slate-400 font-medium">
                      {insight.message}
                    </p>
                  </div>

                  {/* Aesthetic Footer Sparkle */}
                  <div className="mt-6 border-t border-slate-100 dark:border-slate-800/40 pt-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <span>ANALYSIS COMPLETED</span>
                    <Sparkles size={11} className="text-slate-350" />
                  </div>
                </Card>
              );
            })}
          </AnimatePresence>
        </section>
      ) : (
        <EmptyState icon={Brain} title="AI Insight Logs Empty" body="Create and save transaction history to generate automated spending diagnostics and savings advice." />
      )}
    </AnimatedPage>
  );
}
