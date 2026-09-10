"use client";

import { useState } from "react";
import { Copy, Key, Plus, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  type ApiKey,
} from "@/lib/api/hooks/api-keys";
import { useActiveWorkspace } from "@/lib/auth/workspace-context";
import { formatRelativeTime } from "@/lib/utils";

function CreateKeyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const createMutation = useCreateApiKey();
  const { workspace } = useActiveWorkspace();

  const handleCreate = async () => {
    if (!name.trim()) return;
    createMutation.mutate(
      { name: name.trim(), workspace_slug: workspace?.slug },
      {
        onSuccess: (key) => {
          setCreatedKey(key);
          setName("");
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    setCreatedKey(null);
    setCopied(false);
  };

  const copyKey = () => {
    if (!createdKey?.key) return;
    navigator.clipboard.writeText(createdKey.key);
    setCopied(true);
    toast.success("API key copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleClose())}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4" /> New API key
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>API key created</DialogTitle>
              <DialogDescription>
                <span className="inline-flex w-full items-center gap-2 rounded bg-secondary px-3 py-2 font-mono text-sm">
                  <span className="flex-1 truncate">{createdKey.key}</span>
                  <button onClick={copyKey} className="text-muted-foreground hover:text-foreground">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="callout callout-warning text-sm">
              This key is shown only once. You won&apos;t be able to see it again. Store it safely.
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create a new API key</DialogTitle>
              <DialogDescription>
                Use this key to call the gateway from your applications.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="key-name">Name</Label>
              <Input
                id="key-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Production server"
                className="mt-1.5"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!name.trim() || createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create key"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ApiKeysPage() {
  const { data: apiKeys, isLoading } = useApiKeys();
  const revokeMutation = useRevokeApiKey();
  const { workspace } = useActiveWorkspace();

  const handleRevoke = (key: ApiKey) => {
    if (!confirm(`Revoke API key "${key.name}"? This cannot be undone.`)) return;
    revokeMutation.mutate(key.id, {
      onSuccess: () => toast.success("API key revoked"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            Keys for programmatic access to the Ngamia gateway.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {workspace && (
            <Badge variant="outline" className="font-mono text-xs">
              {workspace.slug}
            </Badge>
          )}
          <CreateKeyDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Your keys</CardTitle>
          <CardDescription className="text-sm">
            Each key can call the gateway. Keys are shown once at creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : apiKeys && apiKeys.length > 0 ? (
            <div className="divide-y">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{key.name}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {key.key_prefix}...
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-xs text-muted-foreground">
                      {key.last_used_at
                        ? `Used ${formatRelativeTime(key.last_used_at)}`
                        : "Never used"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatRelativeTime(key.created_at)}
                    </p>
                  </div>
                  {key.status === "active" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRevoke(key)}
                      title="Revoke key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      Revoked
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Key className="h-5 w-5" />
              </div>
              <p className="empty-state-title">No API keys yet</p>
              <p className="empty-state-description">
                Create your first key to start calling the gateway.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}