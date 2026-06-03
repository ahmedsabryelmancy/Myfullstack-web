import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api, tokenStorage } from "../lib/api";

// ── Types ─────────────────────────────────────────────────
export type AuthUser = {
  name: string;
  email: string;
};

type AuthCredentials = {
  email: string;
  password: string;
};

type SignupPayload = AuthCredentials & {
  name: string;
};

type AuthResult = {
  success: boolean;
  message: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  signup: (payload: SignupPayload) => Promise<AuthResult>;
  logout: () => void;
};

// ── Backend response shapes ───────────────────────────────
type AuthApiResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
  message?: string;
};

type MeApiResponse = {
  success: boolean;
  user: AuthUser;
};

// ── Context ───────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    api
      .get<MeApiResponse>("/api/auth/me")
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          tokenStorage.clear();
        }
      })
      .catch(() => {
        tokenStorage.clear();
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  // Clear user if any API call returns 401 (token expired)
  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const login = async ({ email, password }: AuthCredentials): Promise<AuthResult> => {
    try {
      const data = await api.post<AuthApiResponse>("/api/auth/login", {
        email,
        password,
      });
      tokenStorage.set(data.token);
      setUser(data.user);
      return { success: true, message: "Login successful." };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Login failed.",
      };
    }
  };

  const signup = async ({
    name,
    email,
    password,
  }: SignupPayload): Promise<AuthResult> => {
    try {
      const data = await api.post<AuthApiResponse>("/api/auth/register", {
        name,
        email,
        password,
      });
      tokenStorage.set(data.token);
      setUser(data.user);
      return { success: true, message: "Account created successfully." };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Signup failed.",
      };
    }
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
