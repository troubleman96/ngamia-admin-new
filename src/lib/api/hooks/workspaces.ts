import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => api.get<Workspace[]>("/v1/workspaces"),
  });
}

export function useWorkspace(slug: string | undefined) {
  return useQuery({
    queryKey: ["workspaces", slug],
    queryFn: () => api.get<Workspace>(`/v1/workspaces/${slug}`),
    enabled: !!slug,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      slug?: string;
      description?: string;
    }) => api.post<Workspace>("/v1/workspaces", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useUpdateWorkspace(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; description?: string }) =>
      api.patch<Workspace>(`/v1/workspaces/${slug}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => api.delete<{ status: string }>(`/v1/workspaces/${slug}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}