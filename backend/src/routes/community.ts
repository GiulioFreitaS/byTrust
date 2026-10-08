import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../models/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../middleware/auth";

export const communityRouter = Router();

const PostSchema = z.object({
  content: z.string().min(1).max(500),
  imageUrl: z.string().url().optional(),
});

// GET /api/community — feed geral (paginado)
communityRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page ?? 1));
      const limit = 20;

      const posts = await prisma.communityPost.findMany({
        include: {
          user: {
            select: { username: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });

      res.json(posts);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/community — post manual do usuário
communityRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as AuthenticatedRequest;
    try {
      const body = PostSchema.parse(req.body);

      const post = await prisma.communityPost.create({
        data: {
          userId,
          content: body.content,
          imageUrl: body.imageUrl,
          isAuto: false,
        },
        include: {
          user: { select: { username: true, displayName: true, avatarUrl: true } },
        },
      });

      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/community/:id — o próprio usuário pode deletar seu post
communityRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as AuthenticatedRequest;
    try {
      const post = await prisma.communityPost.findFirst({
        where: { id: req.params.id, userId },
      });

      if (!post) throw new AppError(404, "Post não encontrado");

      await prisma.communityPost.delete({ where: { id: post.id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);
