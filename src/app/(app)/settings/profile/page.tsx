"use client";

import { useState } from "react";
import { Mail, Phone, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useUpdateProfile } from "@/lib/api/hooks/profile";

export default function ProfileSettingsPage() {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");

  const handleSave = () => {
    if (!fullName.trim()) return;
    updateProfile.mutate(
      { full_name: fullName.trim() },
      {
        onSuccess: () => toast.success("Profile updated"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="callout callout-danger">{error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Profile</CardTitle>
          <CardDescription className="text-sm">
            Your personal information shown across the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {profile?.full_name?.charAt(0) ?? "U"}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="full-name">Full name</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 max-w-sm"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={!fullName.trim() || updateProfile.isPending || fullName === profile?.full_name}
              >
                {updateProfile.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Contact</CardTitle>
          <CardDescription className="text-sm">
            How we can reach you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{profile?.email ?? "No email set"}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            {profile?.email_verified ? (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                Unverified
              </span>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{profile?.phone_number ?? "No phone set"}</p>
                <p className="text-xs text-muted-foreground">Phone</p>
              </div>
            </div>
            {profile?.phone_verified ? (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                Unverified — required for top-ups
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}