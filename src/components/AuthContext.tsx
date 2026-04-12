import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAccessToken,
  getStoredUser,
  saveTokens,
  saveUser,
  clearAuth,
  isAuthenticated,
} from '../lib/auth';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  authenticated: boolean;
  login: (access: string, refresh: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  authenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getAccessToken();
    const u = getStoredUser();
    if (t) setToken(t);
    if (u) setUser(u);
  }, []);

  const login = (access: string, refresh: string, u: AuthUser) => {
    saveTokens(access, refresh);
    saveUser(u);
    setToken(access);
    setUser(u);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, authenticated: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
