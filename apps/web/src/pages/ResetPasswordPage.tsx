import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../components/ui";
import { api, errorMessage } from "../lib/api";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = params.get("token");
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password: String(form.get("password")) });
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Choose new password" subtitle="Reset links expire after one hour.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Field label="New password">
          <Input name="password" type="password" minLength={8} required />
        </Field>
        <Button disabled={loading}>{loading ? "Saving..." : "Save password"}</Button>
      </form>
      <Link className="mt-5 inline-block text-sm font-semibold text-brand-600" to="/login">Back to login</Link>
    </AuthShell>
  );
}
