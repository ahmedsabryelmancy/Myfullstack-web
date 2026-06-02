import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthUser = {
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
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  signup: (payload: SignupPayload) => Promise<AuthResult>;
  logout: () => void;
};

const TOKEN_KEY = "ahmed-store-token";
const USER_KEY = "ahmed-store-user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(USER_KEY);
    if (!stored) return;
    try {
      setUser(JSON.parse(stored) as AuthUser);
    } catch {
      window.localStorage.removeItem(USER_KEY);
    }
  }, []);

  const login = async ({ email, password }: AuthCredentials): Promise<AuthResult> => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { token?: string; user?: AuthUser; message?: string };

      if (!response.ok || !data.token || !data.user) {
        return { success: false, message: data.message ?? "Invalid email or password." };
      }

      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, message: "Login successful." };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const signup = async ({ name, email, password }: SignupPayload): Promise<AuthResult> => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as { token?: string; user?: AuthUser; message?: string };

      if (!response.ok || !data.token || !data.user) {
        return { success: false, message: data.message ?? "Failed to create account." };
      }

      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, message: "Account created successfully." };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
