import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import { AnimatedPage } from "../components/ui";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <AnimatedPage className="grid min-h-screen grid-cols-1 bg-[#070b12] text-white lg:grid-cols-[1.1fr_0.9fr] overflow-hidden relative">
      
      {/* Background blobs in left side */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-blob absolute -left-[10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="animate-blob animation-delay-2000 absolute -right-[15%] top-[25%] h-[35rem] w-[35rem] rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      <div className="bg-grid-pattern absolute inset-0 opacity-20 pointer-events-none" />

      {/* Left Sidebar Content */}
      <section className="relative hidden overflow-hidden p-12 lg:flex flex-col justify-between z-10 border-r border-white/5 bg-slate-950/20 backdrop-blur-sm">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 font-black text-white shadow-lg shadow-brand-500/25"
          >
            ET
          </motion.div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Expense Tracker
          </span>
        </div>

        {/* Feature Visual Details */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-3 py-1 text-[11px] font-bold text-brand-500 mb-6">
            <Sparkles size={12} />
            <span>Secure Banking Telemetry</span>
          </div>
          
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-white">
            Secure ledger. <br />
            Isolated local environment.
          </h1>
          
          <p className="mt-6 text-sm leading-relaxed text-slate-400">
            Secure session encryption, fully authenticated MongoDB Atlas transactions, customizable budgets, and structured finance reporting outputs. We never use static mock transactions or generated numbers.
          </p>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 max-w-sm backdrop-blur-sm">
            <ShieldCheck className="text-success-500 shrink-0" size={24} />
            <div>
              <p className="text-xs font-bold text-white">Sandboxed Finance Protection</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Salted client bcrypt algorithms & HTTP-only sessions.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-medium text-slate-650">
          Powered by safe REST architectures. All databases isolated.
        </div>
      </section>

      {/* Right Form Shell */}
      <section className="relative z-10 flex items-center justify-center bg-slate-50 p-6 dark:bg-[#0c101c] text-slate-900 dark:text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="card w-full max-w-md p-8 border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/60 shadow-premium backdrop-blur-md"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-450 dark:text-slate-500">{subtitle}</p>
          </div>
          
          {children}
        </motion.div>
      </section>
    </AnimatedPage>
  );
}
