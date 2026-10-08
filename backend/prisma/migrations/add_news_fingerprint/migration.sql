-- Migration: add_news_fingerprint
-- Tabela de controle de deduplicação de notícias.

CREATE TABLE "news_fingerprints" (
  "id"          TEXT          NOT NULL,
  "fingerprint" CHAR(64)      NOT NULL,
  "sourceUrl"   VARCHAR(2048) NOT NULL DEFAULT '',
  "title"       VARCHAR(255)  NOT NULL DEFAULT '',
  "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "news_fingerprints_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "news_fingerprints_fingerprint_key"
  ON "news_fingerprints"("fingerprint");

CREATE INDEX "news_fingerprints_createdAt_idx"
  ON "news_fingerprints"("createdAt");
