import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  api,
  setToken,
  setUser,
  clearSession,
  getStoredUser,
  type User,
} from "../lib/api";

type AuthCtxType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<AuthCtxType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(false);
  // true enquanto a sessão persistida está sendo validada
  const [initializing, setInitializing] = useState(() => !!getStoredUser());

  // Na montagem, valida o token persistido chamando /me
  useEffect(() => {
    if (!getStoredUser()) return;
    api.auth
      .me()
      .then((u) => {
        setUserState(u);
        setUser(u);
      })
      .catch(() => {
        clearSession();
        setUserState(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: u, token } = await api.auth.login({ email, password });
      setToken(token);
      setUser(u);
      setUserState(u);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    displayName?: string
  ) => {
    setLoading(true);
    try {
      const { user: u, token } = await api.auth.register({
        email,
        username,
        password,
        displayName,
      });
      setToken(token);
      setUser(u);
      setUserState(u);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    clearSession();
    setUserState(null);
  }, []);

  const refresh = useCallback(async () => {
    const u = await api.auth.me();
    setUser(u);
    setUserState(u);
  }, []);

  // Mostra loading enquanto valida sessão inicial — evita flash de conteúdo não autenticado
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500">
        Carregando…
      </div>
    );
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = (): AuthCtxType => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return c;
};
