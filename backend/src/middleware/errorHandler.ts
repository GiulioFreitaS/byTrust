import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Erros de validação Zod → 400
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    res.status(400).json({ error: `Dados inválidos: ${messages}` });
    return;
  }

  // Erros de negócio conhecidos
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Erros desconhecidos — loga server-side, nunca expõe stack ao cliente
  console.error("[Erro não tratado]", err);
  res.status(500).json({ error: "Erro interno do servidor" });
}
