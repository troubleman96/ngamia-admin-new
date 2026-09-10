"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { clearTokens, getAccessToken, setTokens } from "@/lib/api/client";

type AuthContextValue = {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (access: string, refresh: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    getAccessToken()
  );

  const login = useCallback((access: string, refresh: string) => {
    setTokens(access, refresh);
    setAccessToken(access);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}