import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../models/prisma";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// GET /api/products — lista todos os produtos com brand (rota pública usada pelo Verificador)
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: {
          select: { id: true, name: true, logoUrl: true },
        },
      },
      orderBy: { name: "asc" },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/brands — lista marcas existentes para o dropdown
router.get("/brands", authMiddleware, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    res.json(brands);
  } catch (err) {
    next(err);
  }
});

// POST /api/products — cadastra produto (marca é criada se não existir)
router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, brandName } = req.body;

    if (!name || !brandName) {
      throw new AppError(400, "Nome e marca são obrigatórios.");
    }

    let brand = await prisma.brand.findFirst({
      where: { name: { equals: brandName, mode: "insensitive" } },
    });

    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: brandName.trim() },
      });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        brandId: brand.id,
      },
      include: { brand: true },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
