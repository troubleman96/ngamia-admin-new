"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";

type NotificationPreferences = {
  email_enabled: boolean;
  low_balance_alerts: boolean;
};

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    email_enabled: true,
    low_balance_alerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<NotificationPreferences>("/v1/me/notification-preferences")
      .then((data) => setPrefs(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updatePref = async (key: keyof NotificationPreferences, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      await api.patch("/v1/me/notification-preferences", next);
    } catch (err: unknown) {
      setPrefs(prefs);
      setError(err instanceof Error ? err.message : "Failed to update preferences");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Notifications</CardTitle>
          <CardDescription className="text-sm">
            Control what notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && <div className="callout callout-danger">{error}</div>}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading preferences...</p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div>
                  <Label htmlFor="email-enabled" className="text-sm font-medium">
                    Email notifications
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Receive important account updates via email.
                  </p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={prefs.email_enabled}
                  onCheckedChange={(v) => updatePref("email_enabled", v)}
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div>
                  <Label htmlFor="low-balance" className="text-sm font-medium">
                    Low balance alerts
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Get notified when your credit balance drops below your threshold.
                  </p>
                </div>
                <Switch
                  id="low-balance"
                  checked={prefs.low_balance_alerts}
                  onCheckedChange={(v) => updatePref("low_balance_alerts", v)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}