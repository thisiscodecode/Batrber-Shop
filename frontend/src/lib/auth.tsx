"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  getToken: () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("access_token");
    if (stored) setToken(stored);
    setLoading(false);
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("access_token"), []);

  return (
    <AuthContext.Provider value={{ token, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
