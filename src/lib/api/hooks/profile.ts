import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  email?: string | null;
  phone_number?: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  status: string;
  role: string;
  created_at: string;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get<Profile>("/v1/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { full_name?: string; avatar_url?: string }) =>
      api.patch<Profile>("/v1/me", data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
    },
  });
}