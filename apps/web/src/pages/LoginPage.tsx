import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../components/ui";
import { errorMessage } from "../lib/api";
import { useAuthStore } from "../store/auth-store";

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    console.log("LOGIN CLICKED");
    console.log("EMAIL:", form.get("email"));
    console.log("PASSWORD:", form.get("password"));

    setLoading(true);

    try {
      await login(
        String(form.get("email")),
        String(form.get("password"))
      );

      console.log("LOGIN SUCCESS");

      toast.success("Welcome back to your workspace");
      navigate("/");
    } catch (error) {
      console.log("LOGIN ERROR", error);

      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Access Workspace"
      subtitle="Access your personal ledgers, automated budget targets, and AI analytics in a secured sandbox environment."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field label="Security Email">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            required
          />
        </Field>

        <Field label="Account Password">
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={8}
            placeholder="••••••••"
            required
          />
        </Field>

        <Button disabled={loading} className="w-full mt-2">
          {loading ? "Decrypting credentials..." : "Decrypt & Log In"}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-xs font-bold border-t border-slate-100 dark:border-slate-800/60 pt-5">
        <Link className="text-brand-500 hover:text-brand-600 transition-colors" to="/signup">
          Initialize Account
        </Link>
        <Link className="text-slate-400 hover:text-slate-500 transition-colors" to="/forgot-password">
          Reset Password?
        </Link>
      </div>
    </AuthShell>
  );
}
