// Funções de autenticação auxiliares — adaptadas do projeto de referência
// Usam o fetcher robusto (req) do api.ts principal via re-export do BASE

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";


async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
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

export async function solicitarRedefinicaoSenha({
  data,
}: {
  data: { email: string };
}): Promise<{ success: boolean; error: string }> {
  return post<{ success: boolean; error: string }>("/api/auth/esqueci-senha", data);
}

export async function redefinirSenha({
  data,
}: {
  data: { token: string; password: string };
}): Promise<{ success: boolean; error: string }> {
  return post<{ success: boolean; error: string }>("/api/auth/redefinir-senha", data);
}
