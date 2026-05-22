import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Sparkles, Check, Target 
} from "lucide-react";
import { Button, Card, Field, Input, Select, AnimatedPage } from "../components/ui";
import { useAuthStore } from "../store/auth-store";
import { useThemeStore } from "../store/theme-store";
import toast from "react-hot-toast";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();
  const [step, setStep] = useState(1);
  
  // State for onboarding form
  const [currency, setCurrency] = useState("USD");
  const [monthlyBudget, setMonthlyBudget] = useState("1000");
  const [savingsTarget, setSavingsTarget] = useState("20");

  const steps = [
    { title: "Workspace Settings", desc: "Choose currency & theme settings" },
    { title: "Financial Goals", desc: "Establish your saving thresholds" },
    { title: "Review & Launch", desc: "Initialize your secure sandbox" }
  ];

  function nextStep() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success("Workspace loaded successfully");
      navigate("/");
    }
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <AnimatedPage className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between py-12 px-6 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-blob absolute -left-[10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="animate-blob animation-delay-2000 absolute -right-[10%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      <div className="bg-grid-pattern absolute inset-0 opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-2xl w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-black text-white text-xs shadow-lg shadow-brand-500/25">
            ET
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            Expense Tracker
          </span>
        </div>
        <div className="text-xs font-bold text-slate-500">
          Step {step} of 3
        </div>
      </div>

      {/* Main Form Area */}
      <div className="relative z-10 mx-auto max-w-xl w-full my-auto py-8">
        
        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{ width: step > i ? "100%" : step === i + 1 ? "50%" : "0%" }}
                className="h-full bg-brand-500"
              />
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <Card hoverLift={false} className="border-white/5 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* Step 1: Workspace Settings */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20 mb-3">
                      <Sparkles size={16} />
                    </span>
                    <h2 className="text-xl font-extrabold text-white">Configure Workspace</h2>
                    <p className="text-xs text-slate-400 mt-1">Initialize your primary accounting variables and interface preferences.</p>
                  </div>

                  <div className="space-y-4">
                    <Field label="Primary Ledger Currency">
                      <Select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-slate-950/80 border-white/5 text-white"
                      >
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="JPY">JPY (¥) - Japanese Yen</option>
                      </Select>
                    </Field>

                    <div className="pt-2">
                      <p className="label pl-1 mb-2">Display Theme Preference</p>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-xs font-bold text-white hover:bg-slate-950/90 transition"
                      >
                        <span>{darkMode ? "Dark Theme Enabled" : "Light Theme Enabled"}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                          {darkMode ? "🌙" : "☀️"}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Financial Goals */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                      <Target size={16} />
                    </span>
                    <h2 className="text-xl font-extrabold text-white">Establish Milestones</h2>
                    <p className="text-xs text-slate-400 mt-1">Set monthly budget recommendations to power active AI alerts.</p>
                  </div>

                  <div className="space-y-4">
                    <Field label={`Expected Monthly Budget Limit (${currency})`}>
                      <Input
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        placeholder="1000"
                        className="bg-slate-950/80 border-white/5 text-white"
                        required
                      />
                    </Field>

                    <Field label="Target Savings Ratio (%)">
                      <Select 
                        value={savingsTarget} 
                        onChange={(e) => setSavingsTarget(e.target.value)}
                        className="bg-slate-950/80 border-white/5 text-white"
                      >
                        <option value="10">10% - Moderate Saver</option>
                        <option value="20">20% - Balanced Goals</option>
                        <option value="30">30% - High Saver Target</option>
                        <option value="50">50% - Intense Growth Target</option>
                      </Select>
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Launch */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-success-500/10 text-success-500 border border-success-500/20 mb-3">
                      <Check size={16} />
                    </span>
                    <h2 className="text-xl font-extrabold text-white">Initialize Ledger Sandbox</h2>
                    <p className="text-xs text-slate-400 mt-1">Review your starting parameters. The system is ready to compile your financial command center.</p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-4 space-y-3.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">ACCOUNT EMAIL</span>
                      <span className="font-extrabold text-white">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">PRIMARY CURRENCY</span>
                      <span className="font-extrabold text-white">{currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">MONTHLY LIMIT BUDGET</span>
                      <span className="font-extrabold text-brand-500">{currency} {monthlyBudget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">TARGET SAVINGS percentage</span>
                      <span className="font-extrabold text-success-500">{savingsTarget}% Target</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="mt-8 flex gap-3 border-t border-white/5 pt-6 justify-between">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={prevStep}
                className="bg-transparent border-white/10 text-white hover:bg-white/5"
              >
                Back
              </Button>
            ) : <div />}

            <Button 
              type="button" 
              onClick={nextStep}
              className="ml-auto"
            >
              {step === 3 ? "Launch Sandbox workspace" : "Save & Continue"}
              {step < 3 && <ArrowRight size={16} className="ml-1" />}
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="relative z-10 mx-auto max-w-2xl w-full text-center text-[10px] text-slate-650">
        platform security protocols operational. database endpoints isolated.
      </div>
    </AnimatedPage>
  );
}
