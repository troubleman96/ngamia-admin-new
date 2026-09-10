"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";

const requestSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
});

const resetSchema = z
  .object({
    identifier: z.string().min(1, "Email or phone is required"),
    otp: z
      .string()
      .length(6, "Code must be 6 digits")
      .regex(/^\d+$/, "Code must be numeric"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a digit"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type RequestForm = z.infer<typeof requestSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const requestForm = useForm<RequestForm>({ resolver: zodResolver(requestSchema) });
  const resetForm = useForm<ResetForm>({ resolver: zodResolver(resetSchema) });

  const onRequest = async (data: RequestForm) => {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await api.post("/v1/auth/password/forgot", { identifier: data.identifier });
      setNotice("If this account exists, a reset code has been sent.");
      resetForm.setValue("identifier", data.identifier);
      setStep("confirm");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (data: ResetForm) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/v1/auth/password/reset", {
        identifier: data.identifier,
        otp: data.otp,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-lockup">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              N
            </span>
            <span className="text-lg font-semibold tracking-tight">Ngamia</span>
          </div>
          <div className="callout callout-success">Password updated. Redirecting to sign in...</div>
          <div className="auth-switch">
            <Link href="/login" className="auth-text-link">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="auth-eyebrow">Account recovery</p>
          <h1 className="auth-card-heading mt-1">
            {step === "request" ? "Forgot your password?" : "Reset your password"}
          </h1>
          <p className="auth-card-subtext mt-1">
            {step === "request"
              ? "Enter your email or phone and we'll send you a reset code."
              : "Enter the code you received along with your new password."}
          </p>
        </div>

        <div className="auth-form">
          {notice && <div className="callout callout-info mb-4">{notice}</div>}
          {error && <div className="callout callout-danger mb-4">{error}</div>}

          {step === "request" ? (
            <form
              onSubmit={requestForm.handleSubmit(onRequest)}
              className="flex flex-col gap-4"
            >
              <div>
                <Label htmlFor="identifier">Email or phone</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="you@company.com or +255712345678"
                  autoComplete="email"
                  className="mt-1.5"
                  {...requestForm.register("identifier")}
                />
                {requestForm.formState.errors.identifier && (
                  <p className="mt-1 text-xs text-destructive">
                    {requestForm.formState.errors.identifier.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={loading} className="h-10 w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {loading ? "Sending code..." : "Send reset code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onReset)} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="otp">Reset code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  className="mt-1.5"
                  autoFocus
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    resetForm.setValue("otp", digits, { shouldValidate: true });
                  }}
                />
                {resetForm.formState.errors.otp && (
                  <p className="mt-1 text-xs text-destructive">
                    {resetForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="new_password">New password</Label>
                <div className="password-wrap mt-1.5">
                  <Input
                    id="new_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="pr-10"
                    {...resetForm.register("new_password")}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {resetForm.formState.errors.new_password && (
                  <p className="mt-1 text-xs text-destructive">
                    {resetForm.formState.errors.new_password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm_password">Confirm password</Label>
                <Input
                  id="confirm_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  className="mt-1.5"
                  {...resetForm.register("confirm_password")}
                />
                {resetForm.formState.errors.confirm_password && (
                  <p className="mt-1 text-xs text-destructive">
                    {resetForm.formState.errors.confirm_password.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="h-10 w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
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