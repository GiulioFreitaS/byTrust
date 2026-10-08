import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../models/prisma";
import { AppError } from "../middleware/errorHandler";

export const educationRouter = Router();

// GET /api/education — lista conteúdos publicados
educationRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.query.type as string | undefined;

      const contents = await prisma.educationalContent.findMany({
        where: {
          isPublished: true,
          ...(type ? { contentType: type as never } : {}),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          contentType: true,
          imageUrl: true,
          readTimeMin: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
      });

      res.json(contents);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/education/:slug — artigo completo
educationRouter.get(
  "/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await prisma.educationalContent.findFirst({
        where: { slug: req.params.slug, isPublished: true },
      });

      if (!content) {
        throw new AppError(404, "Conteúdo não encontrado");
      }

      res.json(content);
    } catch (err) {
      next(err);
    }
  }
);
