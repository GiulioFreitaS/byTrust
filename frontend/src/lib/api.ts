// ── Base URL via env (com fallback para dev local)
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// ── Helpers de sessão com tratamento seguro de JSON corrompido
export const getToken = (): string | null => localStorage.getItem("bt_token");
export const setToken = (t: string): void => { localStorage.setItem("bt_token", t); };
export const clearSession = (): void => {
  localStorage.removeItem("bt_token");
  localStorage.removeItem("bt_user");
};

export const setUser = (u: User): void => {
  try {
    localStorage.setItem("bt_user", JSON.stringify(u));
  } catch (err) {
    console.error("[setUser] falha ao salvar usuário:", err);
  }
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem("bt_user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    // JSON corrompido — limpa silenciosamente
    localStorage.removeItem("bt_user");
    return null;
  }
};

// ── Types — espelham exatamente o que o backend retorna

export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  _count?: { verifications: number; userBadges: number };
};

export type Brand = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  brand: Brand;
};

export type Seal = {
  id: string;
  uniqueCode: string;
  imageUrl: string;
  shareableUrl: string;
  issuedAt: string;
};

export type Verification = {
  id: string;
  status: string;
  createdAt: string;
  serialCode: string | null;
  product: { name: string; brand: { name: string } };
  seal: Seal | null;
};

export type Badge = {
  id: string;
  earnedAt: string;
  badge: { name: string; description: string; imageUrl: string };
};

export type BadgeCatalog = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trigger: string;
  threshold: number;
};

export type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  sealCode: string | null;
  isAuto: boolean;
  createdAt: string;
  user: { username: string; displayName: string | null; avatarUrl: string | null };
};

export type EducationItem = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  imageUrl: string | null;
  readTimeMin: number | null;
  publishedAt: string | null;
};

export type VerifyResult = {
  authentic: boolean;
  message: string;
  verification: { id: string; status: string; createdAt: string };
  seal: Seal | null;
  newBadges: { id: string; name: string; imageUrl: string }[];
  post: { id: string; content: string } | null;
};

// ── Fetcher robusto
async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers: {
        ...(opts.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opts.headers,
      },
    });
  } catch (err) {
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
  }

  // Detecta resposta HTML (erro de servidor/proxy sem JSON)
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    throw new Error(`Resposta inesperada do servidor (${res.status}). Tente novamente.`);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Resposta inválida do servidor (${res.status}).`);
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : "Erro desconhecido";
    throw new Error(msg);
  }

  return data as T;
}

// ── API client
export const api = {
  auth: {
    register: (b: { email: string; username: string; password: string; displayName?: string }) =>
      req<{ user: User; token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(b),
      }),
    login: (b: { email: string; password: string }) =>
      req<{ user: User; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(b),
      }),
    me: () => req<User>("/api/auth/me"),
  },

  products: {
    list: () => req<Product[]>("/api/products"),
  },

  verifications: {
    create: (form: FormData) =>
      req<VerifyResult>("/api/verifications", { method: "POST", body: form }),
    list: () => req<Verification[]>("/api/verifications"),
  },

  seals: {
    mine: () =>
      req<(Seal & { verification: { product: { name: string; brand: { name: string } } } })[]>(
        "/api/seals"
      ),
    publicCheck: (code: string) =>
      req<{
        valid: boolean;
        seal: { uniqueCode: string; issuedAt: string };
        product: { name: string; brand: string };
        verifiedBy: string;
      }>(`/api/seals/public/${code}`),
  },

  badges: {
    mine: () => req<Badge[]>("/api/badges"),
    all: () => req<BadgeCatalog[]>("/api/badges/all"),
  },

  community: {
    feed: (page = 1) => req<Post[]>(`/api/community?page=${page}`),
    post: (content: string) =>
      req<Post>("/api/community", { method: "POST", body: JSON.stringify({ content }) }),
    delete: (id: string) => req<void>(`/api/community/${id}`, { method: "DELETE" }),
  },

  education: {
    list: () => req<EducationItem[]>("/api/education"),
    get: (slug: string) => req<EducationItem & { body: string }>(`/api/education/${slug}`),
  },
};

// ── Utilitário para construir URLs de assets do backend
export const assetUrl = (path: string): string =>
  path.startsWith("http") ? path : `${BASE}${path}`;
