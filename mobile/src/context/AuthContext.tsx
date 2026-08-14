import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from '../api/auth.api';
import { usersApi } from '../api/users.api';
import { tokenStorage } from '../api/tokenStorage';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapSession();
  }, []);

  async function bootstrapSession() {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      const profile = await usersApi.getMe();
      setUser(profile);
    } catch {
      await tokenStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const { user: loggedUser, tokens } = await authApi.login({
      email,
      password,
    });
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setUser(loggedUser);
  }

  async function register(name: string, email: string, password: string) {
    const { user: newUser, tokens } = await authApi.register({
      name,
      email,
      password,
    });
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setUser(newUser);
  }

  async function logout() {
    await tokenStorage.clear();
    setUser(null);
  }

  async function refreshProfile() {
    const profile = await usersApi.getMe();
    setUser(profile);
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
