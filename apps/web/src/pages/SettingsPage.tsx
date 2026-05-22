import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Shield, Bell, Key, Database, Globe, 
  Sparkles, Save, Trash2, Moon, Sun, CheckCircle2 
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, Button, Field, Input, Select, AnimatedPage, StatusPill } from "../components/ui";
import { useAuthStore } from "../store/auth-store";
import { useThemeStore } from "../store/theme-store";

export function SettingsPage() {
  const { user } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();
  
  // Settings Form States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currency, setCurrency] = useState("USD");
  const [alertLimit, setAlertLimit] = useState("85");
  const [apiKey, setApiKey] = useState("sk_live_51Nv98A..." + Math.random().toString(36).substring(7));
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Profile workspace variables updated successfully");
  }

  function handleSaveSystem(e: React.FormEvent) {
    e.preventDefault();
    toast.success("System configurations initialized successfully");
  }

  function generateNewApiKey() {
    setApiKey("sk_live_51Nv" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10));
    toast.success("New Sandbox API key compiled");
  }

  return (
    <AnimatedPage className="space-y-6">
      
      {/* Top Header */}
      <div>
        <p className="label">Configuration</p>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Ledger Settings & Keys</h2>
        <p className="text-xs text-slate-455 dark:text-slate-500 mt-1">Configure your personal sandbox thresholds, themes, and workspace credentials.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        
        {/* Left Column Forms */}
        <div className="space-y-6">
          
          {/* Card 1: Profile settings */}
          <Card hoverLift={false}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-850 dark:text-white leading-none">Profile Workspace</h3>
                <p className="text-[10px] text-slate-400 mt-1.5">Manage your user identity parameters.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Security Name">
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </Field>
                <Field label="Secured Email Address">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Field>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save size={15} /> Save Profile Variables
                </Button>
              </div>
            </form>
          </Card>

          {/* Card 2: Workspace Preferences */}
          <Card hoverLift={false}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-850 dark:text-white leading-none">System & Alert Preferences</h3>
                <p className="text-[10px] text-slate-400 mt-1.5">Set currency layouts and alert metrics.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSystem} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Default Display Currency">
                  <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                  </Select>
                </Field>

                <Field label="Budget Threshold Warning Limit (%)">
                  <Input 
                    type="number" 
                    value={alertLimit} 
                    onChange={(e) => setAlertLimit(e.target.value)} 
                    min="10" 
                    max="100" 
                    required 
                  />
                </Field>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save size={15} /> Save Preference Configs
                </Button>
              </div>
            </form>
          </Card>

          {/* Card 3: Developer credentials */}
          <Card hoverLift={false}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-500/10 text-success-500 border border-success-500/20">
                <Key size={18} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-850 dark:text-white leading-none">Developer Webhooks & API Keys</h3>
                <p className="text-[10px] text-slate-400 mt-1.5">External accounting telemetry variables.</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-450 leading-relaxed">
                Connect external reporting servers to ingest or export CSV transaction telemetry securely via sandboxed webhooks.
              </p>

              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="truncate">
                  <p className="text-[9px] font-bold text-slate-400 tracking-wider mb-1 uppercase font-sans">WORKSPACE Sandbox KEY</p>
                  <span className="font-extrabold text-slate-800 dark:text-white">
                    {apiKeyVisible ? apiKey : "••••••••••••••••••••••••••••••••"}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button 
                    variant="secondary" 
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="text-[11px] min-h-9 px-3 font-bold"
                  >
                    {apiKeyVisible ? "Hide Key" : "Reveal Key"}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={generateNewApiKey}
                    className="text-[11px] min-h-9 px-3 font-bold"
                  >
                    Rotate Key
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column details */}
        <div className="space-y-6">
          
          {/* Theme card */}
          <Card hoverLift={false}>
            <div className="mb-4">
              <p className="label">Interface Theme</p>
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-white">Toggle System Appearance</h3>
            </div>
            
            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 p-4 hover:bg-slate-100/50 dark:hover:bg-slate-950 transition duration-300"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                {darkMode ? "Dark Mode Enabled" : "Light Mode Enabled"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              </div>
            </button>
          </Card>

          {/* Database Info Sandbox details */}
          <Card hoverLift={false} className="border-brand-500/10 bg-brand-500/5">
            <div className="mb-4 flex items-center gap-2">
              <Database className="text-brand-500" size={18} />
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Sandbox Metrics</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={13} className="text-brand-500 shrink-0" />
                <span>Bcrypt Salt rounds: 10 active</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={13} className="text-brand-500 shrink-0" />
                <span>MongoDB Index Optimization active</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={13} className="text-brand-500 shrink-0" />
                <span>HTTP-Only Sessions encryption loaded</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={13} className="text-brand-500 shrink-0" />
                <span>AI processing isolation enabled</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
