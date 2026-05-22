import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Skeleton } from "./components/ui";
import { useAuthStore } from "./store/auth-store";
import { useThemeStore } from "./store/theme-store";

const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import("./pages/SignupPage").then((module) => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage })));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage").then((module) => ({ default: module.VerifyEmailPage })));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage").then((module) => ({ default: module.ResetPasswordPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage").then((module) => ({ default: module.TransactionsPage })));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage").then((module) => ({ default: module.CategoriesPage })));
const BudgetsPage = lazy(() => import("./pages/BudgetsPage").then((module) => ({ default: module.BudgetsPage })));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage").then((module) => ({ default: module.NotificationsPage })));
const ReportsPage = lazy(() => import("./pages/ReportsPage").then((module) => ({ default: module.ReportsPage })));
const InsightsPage = lazy(() => import("./pages/InsightsPage").then((module) => ({ default: module.InsightsPage })));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage").then((module) => ({ default: module.AnalyticsPage })));

// New Premium Pages
const LandingPage = lazy(() => import("./pages/LandingPage").then((module) => ({ default: module.LandingPage })));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage").then((module) => ({ default: module.OnboardingPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));

export default function App() {
  const refresh = useAuthStore((state) => state.refresh);
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950"><Skeleton className="h-[calc(100vh-48px)]" /></div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Onboarding outside of AppLayout for clean dedicated setup wizard */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
