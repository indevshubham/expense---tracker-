import { useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// AnimatedPage wrapper for smooth route transitions
export function AnimatedPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Custom Counter component to animate numeric values smoothly
export function AnimatedNumber({ value, currency = "" }: { value: number; currency?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 800; // ms
    const startTime = performance.now();

    function updateNumber(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const current = start + (end - start) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(end);
      }
    }

    requestAnimationFrame(updateNumber);
  }, [value]);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(displayValue);

  return (
    <span>
      {currency ? `${currency} ` : ""}
      {formatted}
    </span>
  );
}

export function Card({ 
  children, 
  className, 
  hoverLift = true,
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  hoverLift?: boolean;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={hoverLift ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={clsx(
        "card p-6 card-hover",
        !hoverLift && "hover:translate-y-0 hover:shadow-soft",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      disabled={disabled}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold transition-shadow focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/10 dark:bg-brand-600 dark:hover:bg-brand-700",
        variant === "secondary" && "border border-slate-200/80 bg-white/80 text-slate-800 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800/80",
        variant === "danger" && "bg-coral text-white hover:bg-coral/90 shadow-lg shadow-coral/10",
        className
      )}
      {...props as any}
    >
      {children}
    </motion.button>
  );
}

export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <span className="label pl-1">{label}</span>
      {children}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <motion.input 
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={clsx("input", className)} 
      {...props as any} 
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <motion.select 
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={clsx("input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%209L10%2012L13%209%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[right_16px_center] bg-no-repeat pr-10", className)} 
      {...props as any} 
    />
  );
}

export function EmptyState({ 
  title, 
  body,
  icon: Icon
}: { 
  title: string; 
  body: string;
  icon?: any;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/80 p-10 text-center dark:border-slate-800/80 bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600">
        {Icon ? <Icon size={24} /> : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H15M9 13H15M9 9H10M12 21H6.2C5.0799 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V6.2C3 5.0799 3 4.51984 3.21799 4.09202C3.40973 3.71569 3.71569 3.40973 4.09202 3.21799C4.51984 3 5.0799 3 6.2 3H14.8C15.9201 3 16.4802 3 16.908 3.21799C17.2843 3.40973 17.5903 3.71569 17.782 4.09202C18 4.51984 18 5.0799 18 6.2V12M21 21L19 19M19.5 16C19.5 17.933 17.933 19.5 16 19.5C14.067 19.5 12.5 17.933 12.5 16C12.5 14.067 14.067 12.5 16 12.5C17.933 12.5 19.5 14.067 19.5 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400 dark:text-slate-500">{body}</p>
    </motion.div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(
      "relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900/60",
      "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-slate-800/40 before:to-transparent",
      className
    )} />
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "green" | "red" | "gold" | "neutral" }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold transition-all duration-300",
        tone === "green" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        tone === "red" && "bg-coral/10 text-coral dark:text-coral border border-coral/20",
        tone === "gold" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        tone === "neutral" && "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/10"
      )}
    >
      {children}
    </span>
  );
}
