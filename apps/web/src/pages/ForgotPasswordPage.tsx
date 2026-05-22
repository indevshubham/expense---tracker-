import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../components/ui";
import { api, errorMessage } from "../lib/api";

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: String(form.get("email")) });
      toast.success("If the account exists, a reset email was sent");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset password" subtitle="We send a secure reset link to the email on your account.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Field label="Email">
          <Input name="email" type="email" required />
        </Field>
        <Button disabled={loading}>{loading ? "Sending..." : "Send reset link"}</Button>
      </form>
      <Link className="mt-5 inline-block text-sm font-semibold text-brand-600" to="/login">Back to login</Link>
    </AuthShell>
  );
}
