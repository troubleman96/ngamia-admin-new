"use client";

import { useState } from "react";
import { Layers, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
  type Workspace,
} from "@/lib/api/hooks/workspaces";
import { formatDate } from "@/lib/utils";

function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const createWorkspace = useCreateWorkspace();

  const handleCreate = () => {
    if (!name.trim()) return;
    createWorkspace.mutate(
      {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setSlug("");
          setDescription("");
          toast.success("Workspace created");
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4" /> New workspace
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Separate API keys and usage with different workspaces.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ws-name">Name</Label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production App"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="ws-slug">Slug (optional)</Label>
            <Input
              id="ws-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="production-app"
              className="mt-1.5 font-mono text-sm"
            />
          </div>
          <div>
            <Label htmlFor="ws-description">Description (optional)</Label>
            <Input
              id="ws-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim() || createWorkspace.isPending}>
            {createWorkspace.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function WorkspacesSettingsPage() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const deleteWorkspace = useDeleteWorkspace();

  const handleDelete = (ws: Workspace) => {
    if (ws.is_default) {
      toast.error("You can't delete your default workspace.");
      return;
    }
    if (
      !confirm(
        `Delete workspace "${ws.name}"? Its API keys will move to your default workspace.`
      )
    ) {
      return;
    }
    deleteWorkspace.mutate(ws.slug, {
      onSuccess: () => toast.success("Workspace deleted"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold">Workspaces</CardTitle>
            <CardDescription className="text-sm">
              Organize your API keys and usage.
            </CardDescription>
          </div>
          <CreateWorkspaceDialog />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : workspaces && workspaces.length > 0 ? (
            <div className="divide-y">
              {workspaces.map((ws) => (
                <div key={ws.id} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {ws.name}
                      {ws.is_default && (
                        <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {ws.slug} · created {formatDate(ws.created_at)}
                    </p>
                  </div>
                  {!ws.is_default && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(ws)}
                      title="Delete workspace"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Layers className="h-5 w-5" />
              </div>
              <p className="empty-state-title">No workspaces</p>
              <p className="empty-state-description">
                Create a workspace to separate your environments.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}