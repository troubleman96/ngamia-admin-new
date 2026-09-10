"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, setTokens } from "@/lib/api/client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("ngamia_verify_email") ?? "";
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const verify = async () => {
    if (!email || code.length !== 6) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{
        access_token: string;
        refresh_token: string;
      }>("/v1/auth/otp/verify", {
        identifier: email,
        channel: "email",
        purpose: "verify_email",
        code,
      });

      setTokens(res.access_token, res.refresh_token);
      localStorage.removeItem("ngamia_verify_email");
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await api.post("/v1/auth/otp/resend", {
        identifier: email,
        channel: "email",
        purpose: "verify_email",
      });
      setNotice("If the email exists, a new code has been sent.");
      setCooldown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-lockup">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            N
          </span>
          <span className="text-lg font-semibold tracking-tight">Ngamia</span>
        </div>

        <div className="text-center">
          <p className="auth-eyebrow">Account activation</p>
          <h1 className="auth-card-heading mt-1">Verify your email</h1>
          <p className="auth-card-subtext mt-1">
            We sent a 6-digit code to your email. Enter it below to activate your account.
          </p>
        </div>

        <div className="auth-form">
          {error && <div className="callout callout-danger mb-4">{error}</div>}
          {notice && <div className="callout callout-info mb-4">{notice}</div>}

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="482910"
                maxLength={6}
                autoFocus
                className="mt-1.5"
                value={code}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setCode(digits);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resend}
                disabled={cooldown > 0 || loading}
                className="h-10 w-full"
              >
                {cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : loading
                    ? "Sending..."
                    : "Resend code"}
              </Button>
              <Button
                type="button"
                onClick={verify}
                disabled={loading}
                className="h-10 w-full"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Verifying..." : "Verify email"}
              </Button>
            </div>
          </div>
        </div>

        <p className="auth-switch">
          <Link href="/login" className="auth-text-link">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}