import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import path from "path";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { prisma } from "../models/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../middleware/auth";
import { validateWithBrand } from "../services/brandValidation";
import { generateSealImage } from "../services/sealGenerator";
import { checkAndAwardBadges } from "../services/badgeService";

export const verificationRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Apenas imagens são permitidas"));
      return;
    }
    cb(null, true);
  },
});

const VerifyProductSchema = z.object({
  productId: z.string().uuid(),
  serialCode: z.string().optional(),
  qrCode: z.string().optional(),
  authCode: z.string().optional(),
  sourceType: z.enum(["manual", "qr", "nfc"]).default("manual"),
});

// Mapeia cada badge para o arquivo de imagem correspondente
function badgeImagePath(badgeName: string): string {
  const map: Record<string, string> = {
    "1º Produto Original":           "1-primeiro-produto-original.png",
    "Olho de Águia":                 "2-olho-de-aguia.png",
    "Mestre da Verificação":         "3-mestre-da-verificacao.png",
    "Guardião da Originalidade":     "4-guardiao-da-originalidade.png",
    "Voz da Comunidade":             "5-voz-da-comunidade.png",
    "Influência Positiva":           "6-influencia-positiva.png",
    "100 Compartilhamentos no Blog": "7-100-compartilhamentos.png",
    "Pensei Antes de Comprar":       "8-pensei-antes-de-comprar.png",
    "Consumidor Consciente":         "9-consumidor-consciente.png",
    "Colecionador de Selos":         "10-colecionador-de-selos.png",
    "Embaixador byTrust":            "11-embaixador-bytrust.png",
    "Lenda da Autenticidade":        "12-lenda-da-autenticidade.png",
  };
  const file = map[badgeName] ?? "1-primeiro-produto-original.png";
  return path.join(process.cwd(), "public", "badges", file);
}

// Busca o badge mais recente do usuário (fallback quando não ganha badge novo)
async function getLatestUserBadgePath(userId: string): Promise<string | undefined> {
  const latest = await prisma.userBadge.findFirst({
    where: { userId },
    orderBy: { earnedAt: "desc" },
    include: { badge: true },
  });
  if (!latest) return undefined;
  return badgeImagePath(latest.badge.name);
}

// ── POST /api/verifications
verificationRouter.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as AuthenticatedRequest;
    try {
      if (!req.file) {
        throw new AppError(400, "Envie uma foto do produto no campo 'photo'");
      }

      const body = VerifyProductSchema.parse(req.body);

      const product = await prisma.product.findUnique({
        where: { id: body.productId },
        include: { brand: true },
      });
      if (!product) throw new AppError(404, "Produto não encontrado");

      if (body.serialCode) {
        const duplicate = await prisma.productVerification.findUnique({
          where: { userId_serialCode: { userId, serialCode: body.serialCode } },
        });
        if (duplicate) throw new AppError(409, "Você já verificou este produto com este código serial");
      }

      const validationResult = await validateWithBrand(product.brand, {
        serialCode: body.serialCode,
        qrCode: body.qrCode,
        authCode: body.authCode,
      });

      const status = validationResult.isAuthentic ? "AUTHENTIC" : "SUSPICIOUS";

      const verification = await prisma.productVerification.create({
        data: {
          userId,
          productId: product.id,
          serialCode: body.serialCode,
          qrCode: body.qrCode,
          authCode: body.authCode,
          sourceType: body.sourceType,
          status,
          rawResponse: validationResult.rawResponse as Prisma.InputJsonValue,
        },
      });

      if (!validationResult.isAuthentic) {
        return res.status(200).json({
          authentic: false,
          message: validationResult.message,
          verification,
          seal: null,
          newBadges: [],
          post: null,
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });

      // Checa badges ANTES de gerar o selo para saber qual mostrar na foto
      const newBadges = await checkAndAwardBadges(userId);

      // Escolhe qual badge aparece na foto:
      // 1. Se ganhou badge novo → mostra o primeiro badge novo
      // 2. Se não ganhou → mostra o badge mais recente do usuário
      let badgePath: string | undefined;
      if (newBadges.length > 0) {
        badgePath = badgeImagePath(newBadges[0].name);
      } else {
        badgePath = await getLatestUserBadgePath(userId);
      }

      const sealData = await generateSealImage({
        productName: product.name,
        brandName: product.brand.name,
        username: user!.username,
        issuedAt: new Date(),
        userPhotoBuffer: req.file.buffer,
        badgeImagePath: badgePath,
      });

      const seal = await prisma.seal.create({
        data: {
          userId,
          verificationId: verification.id,
          uniqueCode: sealData.uniqueCode,
          imageUrl: sealData.imageUrl,
          shareableUrl: sealData.shareableUrl,
        },
      });

      const post = await prisma.communityPost.create({
        data: {
          userId,
          content: `Acabei de verificar e autenticar o meu ${product.name} da ${product.brand.name}! ✅`,
          imageUrl: seal.imageUrl,
          sealCode: seal.uniqueCode,
          isAuto: true,
        },
      });

      return res.status(201).json({
        authentic: true,
        message: validationResult.message,
        verification: {
          id: verification.id,
          status: verification.status,
          createdAt: verification.createdAt,
        },
        seal: {
          id: seal.id,
          uniqueCode: seal.uniqueCode,
          imageUrl: seal.imageUrl,
          shareableUrl: seal.shareableUrl,
        },
        newBadges,
        post: {
          id: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/verifications
verificationRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as AuthenticatedRequest;
    try {
      const verifications = await prisma.productVerification.findMany({
        where: { userId },
        include: { product: { include: { brand: true } }, seal: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      res.json(verifications);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/verifications/:id
verificationRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as AuthenticatedRequest;
    try {
      const verification = await prisma.productVerification.findFirst({
        where: { id: req.params.id, userId },
        include: { product: { include: { brand: true } }, seal: true },
      });
      if (!verification) throw new AppError(404, "Verificação não encontrada");
      res.json(verification);
    } catch (err) {
      next(err);
    }
  }
);
