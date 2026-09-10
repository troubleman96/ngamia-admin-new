"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setTokens } from "@/lib/api/client";

type CallbackResult =
  | { ok: true; accessToken: string; refreshToken: string }
  | { ok: false; message: string };

function parseCallback(): CallbackResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Loading..." };
  }
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const errorParam = params.get("error");
  const message = params.get("message");

  if (errorParam) {
    return { ok: false, message: message ?? "Authentication failed. Please try again." };
  }
  if (accessToken && refreshToken) {
    return { ok: true, accessToken, refreshToken };
  }
  return { ok: false, message: "Authentication failed. Missing tokens in the response." };
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [result] = useState<CallbackResult>(parseCallback);

  useEffect(() => {
    if (result.ok) {
      setTokens(result.accessToken, result.refreshToken);
      router.replace("/dashboard");
    }
    requestAnimationFrame(() => {
      window.history.replaceState(null, "", window.location.pathname);
    });
  }, [result, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background">
      <div className="auth-lockup">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          N
        </span>
        <span className="text-lg font-semibold tracking-tight">Ngamia</span>
      </div>

      {result.ok ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Completing sign in...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="callout callout-danger max-w-md">{result.message}</p>
          <Button render={<Link href="/login" />} variant="outline">
            Return to sign in
          </Button>
        </div>
      )}
    </div>
  );
}