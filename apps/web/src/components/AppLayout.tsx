import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart3, Bell, Brain, LayoutDashboard, LogOut, 
  Moon, Receipt, Tags, Target, FileText, Sun, 
  Menu, X, ChevronRight, Search, Settings, HelpCircle, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/auth-store";
import { useThemeStore } from "../store/theme-store";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/budgets", label: "Budgets", icon: Target },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/insights", label: "AI Insights", icon: Brain },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  // Get active nav item label for page headers
  const currentNav = navItems.find(item => item.to === location.pathname);
  const pageTitle = currentNav ? currentNav.label : "Finance Command";

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 transition-colors duration-300 dark:bg-[#0b0f19] dark:text-slate-100 bg-grid-pattern">
      
      {/* Background Animated Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-blob absolute -left-[10%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-brand-500/5 blur-[120px] dark:bg-brand-500/10" />
        <div className="animate-blob animation-delay-4000 absolute -right-[5%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-success-500/5 blur-[120px] dark:bg-success-500/10" />
      </div>

      {/* Floating Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden xl:block">
          <motion.aside 
            animate={{ width: sidebarExpanded ? 280 : 88 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-30 h-screen p-4"
          >
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white shadow-premium dark:border-slate-800/80 dark:bg-slate-900/90">
              
              {/* Header Brand */}
              <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-100 dark:border-slate-800/50">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500 font-black text-white shadow-lg shadow-brand-500/25"
                >
                  ET
                </motion.div>
                <AnimatePresence initial={false}>
                  {sidebarExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <p className="font-extrabold tracking-tight text-slate-800 dark:text-white">Expense Tracker</p>
                      <p className="text-[10px] font-bold text-brand-500 tracking-widest uppercase">PRO EDITION</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        clsx(
                          "group relative flex items-center rounded-2xl p-3.5 text-sm font-semibold transition-all duration-300",
                          isActive
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                            : "text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/50"
                        )
                      }
                    >
                      <item.icon size={20} className={clsx("shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200")} />
                      
                      <AnimatePresence initial={false}>
                        {sidebarExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active Indicator Bar */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white" 
                        />
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Footer Sidebar Control */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className="flex w-full items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 p-3 text-slate-500 dark:bg-slate-950/60 dark:hover:bg-slate-850 dark:text-slate-400 transition-colors duration-200"
                >
                  <ChevronRight size={18} className={clsx("transition-transform duration-300", sidebarExpanded && "rotate-180")} />
                  {sidebarExpanded && <span className="ml-2 text-xs font-bold">Collapse Sidebar</span>}
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}

      {/* Main Content Area */}
      <div 
        className={clsx(
          "transition-all duration-400 ease-[0.16,1,0.3,1] min-h-screen flex flex-col z-10 relative pl-0",
          sidebarExpanded ? "xl:pl-72" : "xl:pl-24"
        )}
      >
        
        {/* Sticky Desktop Top Navbar */}
        <header className="sticky top-0 z-20 px-4 py-3 backdrop-blur-md bg-slate-50/70 dark:bg-[#0b0f19]/70 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            
            {/* Left Header Brand & Title */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-600 xl:hidden dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300"
                aria-label="Open mobile menu"
              >
                <Menu size={20} />
              </button>
              
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Workspace</p>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-2xl">{pageTitle}</h1>
              </div>
            </div>

            {/* Middle Search Bar */}
            <div className="hidden max-w-md flex-1 md:block">
              <motion.div 
                animate={{ scale: searchFocused ? 1.01 : 1 }}
                className={clsx(
                  "relative flex items-center rounded-2xl border bg-white/60 dark:bg-slate-950/60 px-3 py-2 transition-all duration-300 backdrop-blur-sm",
                  searchFocused 
                    ? "border-brand-500 ring-4 ring-brand-500/10" 
                    : "border-slate-200/80 dark:border-slate-800/80"
                )}
              >
                <Search size={18} className="text-slate-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Quick search transactions, insights, budgets..." 
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full bg-transparent pl-3 text-xs outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 select-none">⌘K</span>
              </motion.div>
            </div>

            {/* Right Action Icons & Profile */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300 shadow-soft"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
              </motion.button>

              {/* Notification Bell Widget */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300 shadow-soft"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {/* Pulse Notification Dot */}
                  <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral"></span>
                  </span>
                </motion.button>

                {/* Notifications Glass Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 z-45 w-80 rounded-3xl border border-slate-200/60 bg-white/95 p-4 shadow-premium backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/95"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-extrabold text-slate-800 dark:text-white">Recent Updates</p>
                          <NavLink to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs font-bold text-brand-500 hover:underline">View all</NavLink>
                        </div>
                        <div className="space-y-2.5">
                          <div className="rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-950/50">
                            <p className="text-xs font-bold text-slate-800 dark:text-white">🚀 AI spending insights updated</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">We processed your latest transaction history.</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-950/50">
                            <p className="text-xs font-bold text-slate-800 dark:text-white">⚠️ Budget limit reached</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Your monthly food budget is above 85%.</p>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 pr-3 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/80"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 font-extrabold text-xs text-white">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-black text-slate-800 dark:text-white leading-none">{user?.name || "Guest Account"}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-none">Verified Premium</p>
                  </div>
                </motion.button>

                {/* Profile Glass Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 z-45 w-64 rounded-3xl border border-slate-200/60 bg-white/95 p-3 shadow-premium backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/95"
                      >
                        <div className="border-b border-slate-100 dark:border-slate-800/50 p-2 pb-3 mb-2">
                          <p className="text-xs text-slate-400 leading-none">Logged in as</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 truncate">{user?.email}</p>
                        </div>
                        <div className="space-y-1">
                          <NavLink 
                            to="/settings" 
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                          >
                            <User size={15} /> Account Settings
                          </NavLink>
                          <a 
                            href="https://github.com" 
                            target="_blank" 
                            className="flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                          >
                            <HelpCircle size={15} /> Help & Documentation
                          </a>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-semibold text-coral hover:bg-red-55/10 dark:hover:bg-red-500/10"
                          >
                            <LogOut size={15} /> Log out workspace
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Email Verification Banner */}
        {user && !user.isEmailVerified && (
          <div className="mx-auto mt-4 w-full max-w-7xl px-4 z-10">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border border-amber-200/50 bg-amber-500/5 p-4 text-xs font-semibold text-amber-600 dark:border-amber-500/20 dark:text-amber-400 backdrop-blur-sm flex items-center justify-between"
            >
              <span>Verify your email to unlock all automated insights, exports, and expense configurations. Check your inbox for details.</span>
              <button className="underline font-bold hover:text-amber-500">Resend email</button>
            </motion.div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="mx-auto w-full max-w-7xl px-4 py-6 z-10 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Drawer Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/80 xl:hidden"
            />
            {/* Sliding Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-45 w-72 bg-white p-5 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 xl:hidden shadow-premium flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-extrabold text-sm text-white">ET</div>
                    <p className="font-extrabold text-slate-800 dark:text-white">Expense Tracker</p>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          "flex items-center gap-3 rounded-2xl px-3 py-3.5 text-sm font-semibold transition-all duration-200",
                          isActive ? "bg-brand-500 text-white shadow-md shadow-brand-500/10" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        )
                      }
                    >
                      <item.icon size={18} />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-sm font-semibold text-coral hover:bg-red-55/10 dark:hover:bg-red-500/10"
                >
                  <LogOut size={18} /> Log out account
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
