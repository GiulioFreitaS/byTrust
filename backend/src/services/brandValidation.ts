import { Brand } from "@prisma/client";

export type ValidationResult = {
  isAuthentic: boolean;
  confidence: number; // 0–1
  rawResponse: Record<string, unknown>;
  message: string;
};

// ─────────────────────────────────────────────
// MVP: mock de validação por marca
// Em produção, cada marca teria seu próprio adapter
// ─────────────────────────────────────────────

export async function validateWithBrand(
  brand: Brand,
  params: {
    serialCode?: string;
    qrCode?: string;
    authCode?: string;
  }
): Promise<ValidationResult> {
  // Se a marca tem endpoint real, chamar a API dela
  if (brand.apiEndpoint && brand.apiKey) {
    return callRealBrandApi(brand, params);
  }

  // Fallback: validação mock para MVP
  return mockValidation(params);
}

// ── Adapter real (para quando a marca tiver API)
async function callRealBrandApi(
  brand: Brand,
  params: {
    serialCode?: string;
    qrCode?: string;
    authCode?: string;
  }
): Promise<ValidationResult> {
  const response = await fetch(brand.apiEndpoint!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${brand.apiKey}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    return {
      isAuthentic: false,
      confidence: 0,
      rawResponse: { status: response.status },
      message: "Erro ao consultar API da marca",
    };
  }

  const data = (await response.json()) as Record<string, unknown>;

  // Normaliza a resposta da marca para nosso formato padrão
  // Cada marca pode ter schema diferente — aqui você adicionaria adapters específicos
  return {
    isAuthentic: Boolean(data.authentic ?? data.valid ?? data.isOriginal),
    confidence: Number(data.confidence ?? 1),
    rawResponse: data,
    message: String(data.message ?? "Validação concluída"),
  };
}

// ── Mock para MVP (simula lógica de validação)
async function mockValidation(params: {
  serialCode?: string;
  qrCode?: string;
  authCode?: string;
}): Promise<ValidationResult> {
  // Simula latência de API externa
  await new Promise((resolve) => setTimeout(resolve, 200));

  const code = params.serialCode ?? params.qrCode ?? params.authCode ?? "";

  // Regras simples do mock:
  // - código vazio → suspeito
  // - começa com "FAKE" → falso
  // - qualquer outro → autêntico
  if (!code) {
    return {
      isAuthentic: false,
      confidence: 0.3,
      rawResponse: { mock: true, reason: "no_code" },
      message: "Nenhum código fornecido",
    };
  }

  if (code.toUpperCase().startsWith("FAKE")) {
    return {
      isAuthentic: false,
      confidence: 0.95,
      rawResponse: { mock: true, reason: "fake_prefix_detected" },
      message: "Produto identificado como falsificado",
    };
  }

  return {
    isAuthentic: true,
    confidence: 0.98,
    rawResponse: { mock: true, reason: "valid_serial" },
    message: "Produto autenticado com sucesso",
  };
}
