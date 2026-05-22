import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../components/ui";
import { errorMessage } from "../lib/api";
import { useAuthStore } from "../store/auth-store";

export function SignupPage() {
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await signup({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password"))
      });
      toast.success("Account initialized! Let's verify your email to unlock all features.");
      navigate("/onboarding");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell 
      title="Initialize Ledger" 
      subtitle="Your local categories are initialized instantly. We will connect your personal sandbox securely."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Field label="Full Workspace Name">
          <Input 
            name="name" 
            autoComplete="name" 
            minLength={2} 
            placeholder="John Doe"
            required 
          />
        </Field>

        <Field label="Secure Email Address">
          <Input 
            name="email" 
            type="email" 
            autoComplete="email" 
            placeholder="name@company.com"
            required 
          />
        </Field>

        <Field label="Account Password (min 8 chars)">
          <Input 
            name="password" 
            type="password" 
            autoComplete="new-password" 
            placeholder="••••••••"
            minLength={8} 
            required 
          />
        </Field>

        <Button disabled={loading} className="w-full mt-2">
          {loading ? "Generating keys & sandbox..." : "Create Free Workspace"}
        </Button>
      </form>

      <p className="mt-6 text-xs font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-5 text-center">
        Already have a ledger?{" "}
        <Link className="text-brand-500 hover:underline" to="/login">
          Log in here
        </Link>
      </p>
    </AuthShell>
  );
}
