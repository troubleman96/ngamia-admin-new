import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export type RegisterResponse = {
  user_id: string;
  status: string;
  pending_verifications: string[];
};

export function useLogin() {
  return useMutation({
    mutationFn: (data: { identifier: string; password: string }) =>
      api.post<LoginResponse>("/v1/auth/login", data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: {
      full_name: string;
      email?: string;
      phone_number?: string;
      password: string;
      confirm_password: string;
    }) => api.post<RegisterResponse>("/v1/auth/register", data),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: {
      identifier: string;
      channel: "email" | "phone";
      purpose: "verify_email" | "verify_phone";
      code: string;
    }) => api.post<LoginResponse>("/v1/auth/otp/verify", data),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: {
      identifier: string;
      channel: "email" | "phone";
      purpose: "verify_email" | "verify_phone" | "forgot_password";
    }) => api.post<{ sent: boolean }>("/v1/auth/otp/resend", data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { identifier: string }) =>
      api.post<Record<string, never>>("/v1/auth/password/forgot", data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: {
      identifier: string;
      otp: string;
      new_password: string;
      confirm_password: string;
    }) => api.post<{ reset: boolean }>("/v1/auth/password/reset", data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (refreshToken: string) =>
      api.post<Record<string, never>>(
        "/v1/auth/logout",
        { refresh_token: refreshToken },
        { auth: true }
      ),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}