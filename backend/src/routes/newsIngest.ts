/**
 * newsIngest.ts
 * Caminho: backend/src/routes/newsIngest.ts
 *
 * Rota admin para disparo da ingestão.
 * Em produção: chamada pelo Railway Cron Service.
 *
 * Endpoints:
 *   POST /api/admin/news-ingest              — dispara ingestão
 *   POST /api/admin/news-ingest?dry_run=true — simulação
 *   GET  /api/admin/news-ingest/status       — verifica se está rodando
 */

import { Router, Request, Response } from "express";
import { ingestNews } from "../services/newsIngester";

export const newsIngestRouter = Router();

let isRunning = false;

function getAdminSecret(): string | null {
  return process.env.ADMIN_SECRET ?? null;
}

function isAuthorized(req: Request): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  return req.headers["x-admin-secret"] === secret;
}

// POST /api/admin/news-ingest
newsIngestRouter.post("/news-ingest", async (req: Request, res: Response) => {
  const secret = getAdminSecret();

  if (!secret) {
    console.error("[newsIngest] ADMIN_SECRET não configurado.");
    res.status(503).json({ error: "Serviço não configurado. Defina ADMIN_SECRET." });
    return;
  }

  if (!isAuthorized(req)) {
    const ip = req.ip ?? req.socket?.remoteAddress ?? "desconhecido";
    console.warn(`[newsIngest] Acesso não autorizado de ${ip}`);
    res.status(401).json({ error: "Não autorizado." });
    return;
  }

  if (isRunning) {
    res.status(409).json({ error: "Ingestão já em andamento.", running: true });
    return;
  }

  const dryRun =
    req.query.dry_run === "true" ||
    req.query.dry_run === "1" ||
    req.body?.dry_run === true;

  isRunning = true;
  const startedAt = Date.now();

  try {
    const result = await ingestNews({ dryRun });
    res.json({ ok: true, duration_ms: Date.now() - startedAt, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[newsIngest] Erro:", message);
    res.status(500).json({ ok: false, error: message });
  } finally {
    isRunning = false;
  }
});

// GET /api/admin/news-ingest/status
newsIngestRouter.get("/news-ingest/status", (req: Request, res: Response) => {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Não autorizado." });
    return;
  }
  res.json({ running: isRunning });
});
