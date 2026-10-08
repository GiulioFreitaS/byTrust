import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../models/prisma";
import { AppError } from "../middleware/errorHandler";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";

export const authRouter = Router();

// ── Schemas de validação
const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  displayName: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// ── POST /api/auth/register
authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RegisterSchema.parse(req.body);

      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ email: body.email }, { username: body.username }],
        },
      });

      if (existing) {
        throw new AppError(409, "Email ou username já em uso");
      }

      const passwordHash = await bcrypt.hash(body.password, 12);

      const user = await prisma.user.create({
        data: {
          email: body.email,
          username: body.username,
          passwordHash,
          displayName: body.displayName ?? body.username,
        },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
        },
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/login
authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = LoginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        throw new AppError(401, "Credenciais inválidas");
      }

      const passwordMatch = await bcrypt.compare(body.password, user.passwordHash);

      if (!passwordMatch) {
        throw new AppError(401, "Credenciais inválidas");
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/auth/me
authRouter.get(
  "/me",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as AuthenticatedRequest).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: {
              verifications: { where: { status: "AUTHENTIC" } },
              userBadges: true,
            },
          },
        },
      });

      if (!user) throw new AppError(404, "Usuário não encontrado");

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);
