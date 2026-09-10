import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type Balance = {
  balance: number;
  low_balance_threshold: number;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: "topup" | "usage" | "refund" | "admin_adjustment";
  amount: number;
  balance_after: number;
  reference_type?: "payment" | "usage_log" | "admin";
  reference_id?: string;
  description?: string;
  created_at: string;
};

export type Payment = {
  id: string;
  provider: string;
  provider_reference: string;
  amount_tzs: number;
  credits_granted: number;
  status: "pending" | "completed" | "failed" | "expired" | "reversed";
  created_at: string;
  completed_at?: string;
};

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: () => api.get<Balance>("/v1/billing/balance"),
  });
}

export function useTransactions(options?: { limit?: number; offset?: number }) {
  const { limit = 50, offset = 0 } = options ?? {};
  return useQuery({
    queryKey: ["transactions", limit, offset],
    queryFn: () =>
      api.get<Transaction[]>(`/v1/billing/transactions?limit=${limit}&offset=${offset}`),
  });
}

export function usePayments(options?: { limit?: number; offset?: number }) {
  const { limit = 50, offset = 0 } = options ?? {};
  return useQuery({
    queryKey: ["payments", limit, offset],
    queryFn: () => api.get<Payment[]>(`/v1/payments?limit=${limit}&offset=${offset}`),
  });
}

export function useTopup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount_tzs: number }) =>
      api.post<Payment>("/v1/payments/topup", data, {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function usePayment(paymentId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => api.get<Payment>(`/v1/payments/${paymentId}`),
    enabled: !!paymentId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "pending") return 3000;
      return false;
    },
  });
}