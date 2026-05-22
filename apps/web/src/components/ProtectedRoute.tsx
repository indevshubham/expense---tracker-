import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";
import { Skeleton } from "./ui";

export function ProtectedRoute() {
  const { user, isBootstrapping } = useAuthStore();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
        <Skeleton className="h-[calc(100vh-48px)]" />
      </div>
    );
  }

  // Redirect to premium public landing page if not authenticated
  if (!user) return <Navigate to="/landing" replace />;
  return <Outlet />;
}
