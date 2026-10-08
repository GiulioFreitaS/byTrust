import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../models/prisma";
import { AppError } from "../middleware/errorHandler";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";

export const sealRouter = Router();

// GET /api/seals — selos do usuário logado (requer auth)
sealRouter.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as AuthenticatedRequest;
    try {
      const seals = await prisma.seal.findMany({
        where: { userId },
        include: {
          verification: { include: { product: { include: { brand: true } } } },
        },
        orderBy: { issuedAt: "desc" },
      });
      res.json(seals);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/seals/public/:code — validação pública (sem auth)
sealRouter.get(
  "/public/:code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const seal = await prisma.seal.findUnique({
        where: { uniqueCode: req.params.code },
        include: {
          user: { select: { username: true, displayName: true } },
          verification: {
            include: { product: { include: { brand: true } } },
          },
        },
      });

      if (!seal) {
        throw new AppError(404, "Selo não encontrado ou inválido");
      }

      res.json({
        valid: true,
        seal: {
          uniqueCode: seal.uniqueCode,
          issuedAt: seal.issuedAt,
          shareableUrl: seal.shareableUrl,
        },
        product: {
          name: seal.verification.product.name,
          brand: seal.verification.product.brand.name,
        },
        verifiedBy: seal.user.displayName ?? seal.user.username,
      });
    } catch (err) {
      next(err);
    }
  }
);
