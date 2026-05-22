import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Shield, Activity, Brain, PieChart, 
  Sparkles, DollarSign, Users, Award, CheckCircle2 
} from "lucide-react";
import { AnimatedPage } from "../components/ui";

export function LandingPage() {
  return (
    <AnimatedPage className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-blob absolute -left-[10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="animate-blob animation-delay-2000 absolute -right-[10%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="animate-blob animation-delay-4000 absolute left-[30%] -top-[10%] h-[30rem] w-[30rem] rounded-full bg-success-500/5 blur-[120px]" />
      </div>

      <div className="bg-grid-pattern absolute inset-0 opacity-40 pointer-events-none" />

      {/* Landing Header */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-sm bg-[#070b12]/50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 font-black text-white shadow-lg shadow-brand-500/25">
            ET
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Expense Tracker
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-350 hover:text-white transition-colors duration-200">
            Log in
          </Link>
          <Link to="/signup">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#070b12] shadow-lg shadow-white/5"
            >
              Get Started
            </motion.div>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-xs font-bold text-brand-500 mb-6">
            <Sparkles size={13} />
            <span>Introducing Real Money Analytics v2.0</span>
          </div>

          <h1 className="text-5xl font-black tracking-tight leading-[1.1] sm:text-7xl bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent">
            Track real cash flow. <br />
            No simulated mock data.
          </h1>
          
          <p className="mt-8 text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto">
            A production-oriented personal workspace with enterprise-grade security, automated budgets, PDF exports, and AI-driven insights generated solely from your real transaction logs.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-8 text-sm font-bold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-650 transition-all duration-200"
              >
                Start free workspace <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-8 text-sm font-bold text-white transition-all duration-200"
              >
                Sign in to tracker
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Visual Hero Dashboard Mock */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 relative mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-slate-900/40 p-3 shadow-2xl shadow-brand-500/5 backdrop-blur-md"
        >
          <div className="overflow-hidden rounded-[24px] border border-white/5 bg-[#090e1a]/80 aspect-[16/9] shadow-inner p-6 flex flex-col justify-between">
            {/* Header controls bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 px-6 py-1 text-[11px] font-semibold text-slate-500 tracking-wider">
                workspace.expensetracker.so
              </div>
              <div className="h-4 w-4 bg-transparent" />
            </div>

            {/* Simulated UI layout */}
            <div className="flex-1 grid grid-cols-[160px_1fr] gap-6 text-left">
              {/* Left sidebar mock */}
              <div className="border-r border-white/5 pr-4 space-y-3 hidden sm:block">
                <div className="h-8 rounded-xl bg-brand-500/10 border border-brand-500/20" />
                <div className="h-8 rounded-xl bg-white/5" />
                <div className="h-8 rounded-xl bg-white/5" />
                <div className="h-8 rounded-xl bg-white/5" />
              </div>
              
              {/* Dashboard Content Mock */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">BALANCE</p>
                    <p className="text-xl font-extrabold text-white mt-1">$14,528.00</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">SPENT</p>
                    <p className="text-xl font-extrabold text-coral mt-1">$2,840.40</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">BUDGET</p>
                    <p className="text-xl font-extrabold text-success-500 mt-1">82.4% Used</p>
                  </div>
                </div>
                
                {/* Simulated Chart area */}
                <div className="rounded-2xl border border-white/5 bg-[#0b1326] p-4 flex-1 h-36 flex flex-col justify-end">
                  <div className="flex items-end justify-between h-20 gap-2">
                    <div className="w-full bg-brand-500/20 hover:bg-brand-500 rounded-t-lg h-[40%] transition-all duration-300" />
                    <div className="w-full bg-brand-500/20 hover:bg-brand-500 rounded-t-lg h-[65%] transition-all duration-300" />
                    <div className="w-full bg-brand-500/20 hover:bg-brand-500 rounded-t-lg h-[50%] transition-all duration-300" />
                    <div className="w-full bg-brand-500/20 hover:bg-brand-500 rounded-t-lg h-[80%] transition-all duration-300" />
                    <div className="w-full bg-brand-500/20 hover:bg-brand-500 rounded-t-lg h-[70%] transition-all duration-300" />
                    <div className="w-full bg-brand-500/20 hover:bg-brand-500 rounded-t-lg h-[95%] transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 bg-slate-950/40 border-y border-white/5 py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500">ENGINE DETAILS</p>
            <h2 className="text-3xl font-black text-white mt-2 leading-tight">Advanced finance controls.</h2>
            <p className="text-sm text-slate-400 mt-3">A clean, focused environment engineered to manage and report transaction telemetry seamlessly.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-white/5 bg-[#0b101c]/60 p-8 shadow-inner"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/20 mb-6">
                <Shield size={20} />
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">Secure Sandbox Auth</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Salted bcrypt password hashing and stateful HTTP-only refresh tokens. Safe, isolated workspace credentials.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-white/5 bg-[#0b101c]/60 p-8 shadow-inner"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <Brain size={20} />
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">AI insight Engine</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Automated heuristic logic parsing only real saved logs. Alerts on spending anomalies and generates savings indicators.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-white/5 bg-[#0b101c]/60 p-8 shadow-inner"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-500/10 text-success-500 border border-success-500/20 mb-6">
                <PieChart size={20} />
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">Export Telemetry</h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Assemble detailed PDF budgets or download structured CSV logs with a single click. Ready for accounting integration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Mock */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">PRICING PLANS</p>
          <h2 className="text-3xl font-black text-white mt-2 leading-tight">Simple transparent plans</h2>
          <p className="text-sm text-slate-400 mt-3">Select the scope that fits your personal or organizational tracking limits.</p>
        </div>

        <div className="grid gap-8 max-w-3xl mx-auto md:grid-cols-2">
          {/* Plan 1 */}
          <div className="rounded-3xl border border-white/5 bg-[#0b101c]/60 p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">STARTER EDITION</p>
              <p className="text-3xl font-black text-white mt-3">$0 <span className="text-xs font-normal text-slate-400">/ forever free</span></p>
              <p className="text-xs text-slate-400 mt-2">Essential spending controls with real local database persistence.</p>
              <ul className="mt-8 space-y-3.5">
                {["Manual Transaction Entry", "Up to 5 Categories", "Basic Budget Warning Indicator", "Local Web Browser Storage"].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-xs text-slate-300">
                    <CheckCircle2 size={14} className="text-brand-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/signup" className="mt-8">
              <button className="w-full inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all duration-200">
                Register Free Workspace
              </button>
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="rounded-3xl border border-brand-500/20 bg-brand-500/5 p-8 flex flex-col justify-between shadow-lg shadow-brand-500/5 relative">
            <span className="absolute top-4 right-4 bg-brand-500 text-[9px] font-bold text-white px-2 py-0.5 rounded-lg tracking-wider">POPULAR</span>
            <div>
              <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">PRO WORKSPACE</p>
              <p className="text-3xl font-black text-white mt-3">$9 <span className="text-xs font-normal text-slate-400">/ monthly billing</span></p>
              <p className="text-xs text-slate-350 mt-2">Unlimited power tracking with real cloud integrations and telemetry.</p>
              <ul className="mt-8 space-y-3.5">
                {["Unlimited Transactions & Categories", "Dynamic AI Insight Analyzer", "Structured PDF/CSV Exporting", "Unlimited Active Budget Thresholds", "Advanced Recharts Analytics Widgets", "24/7 Slack/Discord Priority Support"].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-xs text-slate-200">
                    <CheckCircle2 size={14} className="text-brand-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/signup" className="mt-8">
              <button className="w-full inline-flex h-11 items-center justify-center rounded-2xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white shadow-md shadow-brand-500/10 transition-all duration-200">
                Unlock Pro Workspace
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="relative z-10 mx-auto max-w-7xl px-6 py-12 border-t border-white/5 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Expense Tracker Inc. All rights reserved. Platform logs are encrypted and subject to sandboxed security parameters.</p>
      </footer>
    </AnimatedPage>
  );
}
