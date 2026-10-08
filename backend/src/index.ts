import express from "express";
import cors from "cors";
import path from "path";
import { authRouter } from "./routes/auth";
import { verificationRouter } from "./routes/verification";
import { sealRouter } from "./routes/seal";
import { badgeRouter } from "./routes/badge";
import { communityRouter } from "./routes/community";
import { educationRouter } from "./routes/education";
import { newsIngestRouter } from "./routes/newsIngest";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";
import productRouter from "./routes/product";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());

// ── Serve imagens estáticas (selos gerados + badges)
app.use("/public", express.static(path.join(process.cwd(), "public")));

// ── Rotas públicas
app.use("/api/auth", authRouter);
app.use("/api/education", educationRouter);
app.use("/api/products", productRouter);

// ── Selos: GET /public/:code é público; GET / usa authMiddleware interno
app.use("/api/seals", sealRouter);

// ── Rotas autenticadas
app.use("/api/verifications", authMiddleware, verificationRouter);
app.use("/api/badges", authMiddleware, badgeRouter);
app.use("/api/community", authMiddleware, communityRouter);

// ── Admin (sem authMiddleware — protegida por ADMIN_SECRET no header)
app.use("/api/admin", newsIngestRouter);

// ── Healthcheck
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`OriginAuth API rodando na porta ${PORT}`);
});
