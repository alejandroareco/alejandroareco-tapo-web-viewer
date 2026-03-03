import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
} from "aws-amplify/auth";

type AuthStatus = "loading" | "authed" | "guest";

type AuthCtx = {
  status: AuthStatus;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = async () => {
    try {
      await getCurrentUser();
      await fetchAuthSession();
      setStatus("authed");
    } catch {
      setStatus("guest");
    }
  };

  const login = async (email: string, password: string) => {
    await signIn({ username: email, password });
    await refresh();
  };

  const logout = async () => {
    await signOut();
    await refresh();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Ctx.Provider value={{ status, refresh, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}