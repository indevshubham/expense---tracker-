import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthShell } from "./AuthShell";
import { Button } from "../components/ui";
import { api, errorMessage } from "../lib/api";

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("Verification token is missing.");
      return;
    }
    api
      .post("/auth/verify-email", { token })
      .then(() => setMessage("Email verified. You can now use expense features."))
      .catch((error) => setMessage(errorMessage(error)));
  }, [params]);

  return (
    <AuthShell title="Email verification" subtitle={message}>
      <Link to="/login">
        <Button className="w-full">Go to login</Button>
      </Link>
    </AuthShell>
  );
}
