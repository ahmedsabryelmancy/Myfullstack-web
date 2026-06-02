import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type StoredUser = {
  name: string;
  email: string;
  password: string;
};

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

type AuthContextValue = {
  user: AuthUser | null;
  login: (credentials: AuthCredentials) => { success: boolean; message: string };
  signup: (payload: SignupPayload) => { success: boolean; message: string };
  logout: () => void;
};

const USERS_STORAGE_KEY = "ahmed-store-users";
const CURRENT_USER_STORAGE_KEY = "ahmed-store-current-user";

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(user: StoredUser): AuthUser {
  return {
    name: user.name,
    email: user.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!storedUser) {
      return;
    }

    try {
      setUser(JSON.parse(storedUser) as AuthUser);
    } catch {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, []);

  const login = ({ email, password }: AuthCredentials) => {
    const users = readStoredUsers();
    const matchedUser = users.find(
      (storedUser) => storedUser.email.toLowerCase() === email.toLowerCase() && storedUser.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const nextUser = toAuthUser(matchedUser);
    setUser(nextUser);
    window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(nextUser));

    return {
      success: true,
      message: "Login successful.",
    };
  };

  const signup = ({ name, email, password }: SignupPayload) => {
    const users = readStoredUsers();
    const userExists = users.some(
      (storedUser) => storedUser.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser: StoredUser = {
      name,
      email,
      password,
    };

    const nextUsers = [...users, newUser];
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));

    const nextUser = toAuthUser(newUser);
    setUser(nextUser);
    window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(nextUser));

    return {
      success: true,
      message: "Account created successfully.",
    };
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

function readStoredUsers(): StoredUser[] {
  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers) as StoredUser[];
  } catch {
    window.localStorage.removeItem(USERS_STORAGE_KEY);
    return [];
  }
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}