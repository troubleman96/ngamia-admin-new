"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useWorkspaces, type Workspace } from "@/lib/api/hooks/workspaces";

type WorkspaceContextValue = {
  workspaceId: string | null;
  setWorkspaceId: (id: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const setWorkspace = useCallback((id: string) => setWorkspaceId(id), []);

  return (
    <WorkspaceContext.Provider
      value={{ workspaceId, setWorkspaceId: setWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspaceContext must be used within WorkspaceProvider");
  return ctx;
}

export function useActiveWorkspace() {
  const { workspaceId, setWorkspaceId } = useWorkspaceContext();
  const { data: workspaces } = useWorkspaces();

  const active: Workspace | undefined =
    workspaces?.find((ws) => ws.id === workspaceId) ??
    workspaces?.find((ws) => ws.is_default) ??
    workspaces?.[0];

  return {
    workspace: active ?? null,
    workspaces: workspaces ?? [],
    setWorkspaceId,
  };
}