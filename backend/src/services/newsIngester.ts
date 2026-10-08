/**
 * newsIngester.ts
 * Caminho: backend/src/services/newsIngester.ts
 *
 * Serviço de ingestão de notícias sobre falsificação/contrafação.
 * Busca via Google News RSS, filtra, deduplica e publica no Feed (CommunityPost).
 *
 * Deploy: Railway
 * Trigger: Railway Cron Service → POST /api/admin/news-ingest
 */

import Parser from "rss-parser";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../models/prisma";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type RSSItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  pubDate?: string;
  creator?: string;
  source?: string | { _?: string; [key: string]: unknown };
  guid?: string;
  isoDate?: string;
};

export type IngestResult = {
  fetched: number;
  relevant: number;
  inserted: number;
  skipped_duplicate: number;
  skipped_filter: number;
  dry_run: boolean;
};

// ─── Configuração via env ─────────────────────────────────────────────────────

const BOT_USERNAME = "bytrust-news";
const BOT_EMAIL = "news-bot@bytrust.internal";
const BOT_NAME = "byTrust Notícias";

const MAX_POSTS_PER_RUN = parseInt(process.env.NEWS_MAX_POSTS ?? "5", 10);
const DAYS_BACK = parseInt(process.env.NEWS_DAYS_BACK ?? "2", 10);
const MAX_CONTENT_LEN = parseInt(process.env.NEWS_MAX_CONTENT_LEN ?? "800", 10);
const FEED_TIMEOUT_MS = parseInt(process.env.NEWS_FEED_TIMEOUT_MS ?? "15000", 10);

// ─── URLs dos feeds ───────────────────────────────────────────────────────────

function buildFeedUrls(): string[] {
  const now = new Date();
  const after = new Date(now);
  after.setDate(now.getDate() - DAYS_BACK);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const afterStr = fmt(after);
  const beforeStr = fmt(now);

  const BASE_QUERIES = [
    `"produtos falsificados" Brasil after:${afterStr} before:${beforeStr}`,
    `"produto falsificado" Brasil after:${afterStr} before:${beforeStr}`,
    `"falsificação de medicamentos" Brasil after:${afterStr} before:${beforeStr}`,
    `"falsificação de bebidas" Brasil after:${afterStr} before:${beforeStr}`,
    `"peças falsificadas" Brasil after:${afterStr} before:${beforeStr}`,
    `"mercadorias falsificadas" Brasil after:${afterStr} before:${beforeStr}`,
    `"contrafação" Brasil after:${afterStr} before:${beforeStr}`,
    `"apreensão" falsificados Brasil after:${afterStr} before:${beforeStr}`,
    `"falsificação" Brasil -"fraude eleitoral" -"pix" -"deepfake" after:${afterStr} before:${beforeStr}`,
    `"falsificação" "América Latina" after:${afterStr} before:${beforeStr}`,
  ];

  return BASE_QUERIES.map(
    (q) =>
      `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`
  );
}

// ─── Filtros ──────────────────────────────────────────────────────────────────

const REQUIRED_KEYWORDS: string[] = [
  "falsificação", "falsificado", "falsificada", "falsificados", "falsificadas",
  "contrafação", "produto falso", "produto falsificado", "produtos falsificados",
  "mercadoria falsificada", "mercadorias falsificadas", "peças falsificadas",
  "medicamento falsificado", "medicamentos falsificados",
  "bebida falsificada", "bebidas falsificadas",
  "pirataria", "apreensão",
];

const BLOCK_KEYWORDS: string[] = [
  "fraude eleitoral", "gastos eleitorais", "pix", "golpe do pix",
  "biometria", "deepfake", "consignado", "precatório", "precatórios",
  "licitação", "icms", "garimpo", "identidade digital", "fraude bancária",
  "empréstimo consignado", "segurança digital",
  "veneza", "hong kong", "equador", "malásia", "portugal",
  "futebol", "celebridade", "horóscopo", "culinária", "receita",
];

const ALLOWED_SOURCES: string[] = [
  "g1", "cnn brasil", "agência brasil", "agencia brasil", "uol",
  "o globo", "valor econômico", "valor economico",
  "folha de s.paulo", "folha de sp", "estadão", "estadao",
  "veja", "metrópoles", "metropoles", "tecnoblog", "quatro rodas",
  "consultor jurídico", "consultor juridico", "jornal da usp",
  "gov.br", "anvisa", "inmetro",
  "portal da câmara", "portal da camara",
  "r7", "band", "terra",
];

// ─── Utilitários ──────────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function getSourceName(item: RSSItem): string {
  if (item.source && typeof item.source === "object" && item.source._) {
    return String(item.source._);
  }
  if (typeof item.source === "string" && item.source) return item.source;
  if (typeof item.creator === "string" && item.creator) return item.creator;
  return "";
}

function isAllowedSource(item: RSSItem): boolean {
  const source = normalizeText(getSourceName(item));
  if (!source) return true; // sem source identificável → deixa passar
  return ALLOWED_SOURCES.some((allowed) =>
    normalizeText(allowed).split(" ").every((word) => source.includes(word))
  );
}

function isRelevant(item: RSSItem): boolean {
  const text = normalizeText(`${item.title ?? ""} ${item.contentSnippet ?? ""}`);
  const hasPositive = REQUIRED_KEYWORDS.some((kw) => text.includes(normalizeText(kw)));
  const hasNegative = BLOCK_KEYWORDS.some((kw) => text.includes(normalizeText(kw)));
  return hasPositive && !hasNegative;
}

function getItemDate(item: RSSItem): Date {
  const raw = item.isoDate ?? item.pubDate;
  if (!raw) return new Date(0);
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function makeFingerprint(item: RSSItem): string {
  const key = item.guid ?? item.link ?? item.title ?? "";
  return crypto.createHash("sha256").update(key).digest("hex").slice(0, 64);
}

function buildContent(item: RSSItem): string {
  const title = (item.title?.trim() ?? "Sem título").slice(0, 300);
  const snippet = item.contentSnippet?.trim();
  const source = getSourceName(item) || "Google News";
  const link = item.link ?? "";
  const date = getItemDate(item);
  const dateStr =
    date.getTime() > 0
      ? date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
      : null;

  const parts: string[] = [`📰 ${title}`, ""];
  if (snippet) parts.push(snippet);
  if (dateStr) parts.push(`📅 ${dateStr}`);
  parts.push(`🔗 Fonte: ${source}`);
  if (link) parts.push(link);

  return parts.join("\n");
}

function truncateContent(content: string, link: string): string {
  if (content.length <= MAX_CONTENT_LEN) return content;
  const suffix = link ? `\n${link}` : "";
  const maxBody = MAX_CONTENT_LEN - suffix.length - 3;
  return content.slice(0, maxBody) + "..." + suffix;
}

// ─── Banco ────────────────────────────────────────────────────────────────────

async function ensureBotUser(): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { username: BOT_USERNAME },
    select: { id: true },
  });
  if (existing) return existing.id;

  const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

  const bot = await prisma.user.create({
    data: {
      username: BOT_USERNAME,
      email: BOT_EMAIL,
      displayName: BOT_NAME,
      passwordHash,
      // isBot: true,  ← descomente se seu schema tiver este campo
    },
    select: { id: true },
  });

  console.log(`[newsIngester] Bot criado: @${BOT_USERNAME} (${bot.id})`);
  return bot.id;
}

async function filterNotPosted(items: RSSItem[]): Promise<RSSItem[]> {
  if (items.length === 0) return [];
  const fps = items.map(makeFingerprint);
  const existing = await prisma.newsFingerprint.findMany({
    where: { fingerprint: { in: fps } },
    select: { fingerprint: true },
  });
  const existingSet = new Set(existing.map((r) => r.fingerprint));
  return items.filter((item) => !existingSet.has(makeFingerprint(item)));
}

// ─── Função principal ─────────────────────────────────────────────────────────

export async function ingestNews(options: { dryRun?: boolean } = {}): Promise<IngestResult> {
  const dryRun = options.dryRun ?? process.env.NEWS_DRY_RUN === "true";
  if (dryRun) console.log("[newsIngester] DRY RUN — nenhum dado será gravado.");

  const parser = new Parser<object, RSSItem>({
    timeout: FEED_TIMEOUT_MS,
    headers: { "User-Agent": "byTrust-NewsBot/1.0 (+https://bytrust.com.br)" },
  });

  const feedUrls = buildFeedUrls();
  console.log(`[newsIngester] Buscando ${feedUrls.length} feeds...`);

  const feedResults = await Promise.allSettled(feedUrls.map((url) => parser.parseURL(url)));

  const allItems: RSSItem[] = [];
  let failedFeeds = 0;
  for (const result of feedResults) {
    if (result.status === "fulfilled") {
      allItems.push(...(result.value.items as RSSItem[]));
    } else {
      failedFeeds++;
      console.warn("[newsIngester] Feed falhou:", result.reason?.message ?? String(result.reason));
    }
  }

  console.log(`[newsIngester] ${allItems.length} itens brutos (${failedFeeds} feeds falharam)`);

  // Dedup em memória
  const seen = new Set<string>();
  const uniqueItems = allItems.filter((item) => {
    const key = item.guid ?? item.link ?? item.title ?? "";
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const relevantItems = uniqueItems
    .filter(isRelevant)
    .filter(isAllowedSource)
    .sort((a, b) => getItemDate(b).getTime() - getItemDate(a).getTime());

  const skippedFilter = uniqueItems.length - relevantItems.length;
  console.log(`[newsIngester] Relevantes: ${relevantItems.length}, descartados: ${skippedFilter}`);

  if (relevantItems.length === 0) {
    return { fetched: uniqueItems.length, relevant: 0, inserted: 0, skipped_duplicate: 0, skipped_filter: skippedFilter, dry_run: dryRun };
  }

  const notPosted = await filterNotPosted(relevantItems);
  const skippedDuplicate = relevantItems.length - notPosted.length;
  console.log(`[newsIngester] Novos: ${notPosted.length}, duplicados: ${skippedDuplicate}`);

  const toPost = notPosted.slice(0, MAX_POSTS_PER_RUN);

  if (toPost.length === 0) {
    console.log("[newsIngester] Nada novo para publicar.");
    return { fetched: uniqueItems.length, relevant: relevantItems.length, inserted: 0, skipped_duplicate: skippedDuplicate, skipped_filter: skippedFilter, dry_run: dryRun };
  }

  if (dryRun) {
    console.log(`[newsIngester] DRY RUN — publicaria ${toPost.length}:`);
    toPost.forEach((item, i) => console.log(`  ${i + 1}. [${getSourceName(item) || "?"}] ${item.title}`));
    return { fetched: uniqueItems.length, relevant: relevantItems.length, inserted: 0, skipped_duplicate: skippedDuplicate, skipped_filter: skippedFilter, dry_run: true };
  }

  const botUserId = await ensureBotUser();
  let inserted = 0;

  for (const item of toPost) {
    if (!item.title) continue;

    const content = truncateContent(buildContent(item), item.link ?? "");
    const fingerprint = makeFingerprint(item);

    try {
      await prisma.$transaction([
        prisma.communityPost.create({
          data: { userId: botUserId, content, isAuto: true },
        }),
        prisma.newsFingerprint.create({
          data: {
            fingerprint,
            sourceUrl: (item.guid ?? item.link ?? "").slice(0, 2048),
            title: item.title.slice(0, 255),
          },
        }),
      ]);
      inserted++;
      console.log(`[newsIngester] ✅ ${item.title.slice(0, 80)}`);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "P2002") {
        console.warn(`[newsIngester] Duplicata (race): ${item.title?.slice(0, 80)}`);
      } else {
        console.error(`[newsIngester] ❌ "${item.title?.slice(0, 80)}":`, err);
      }
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(
    `[newsIngester] Fim — buscados: ${uniqueItems.length}, relevantes: ${relevantItems.length}, ` +
    `inseridos: ${inserted}, duplicados: ${skippedDuplicate}, descartados: ${skippedFilter}`
  );

  return { fetched: uniqueItems.length, relevant: relevantItems.length, inserted, skipped_duplicate: skippedDuplicate, skipped_filter: skippedFilter, dry_run: false };
}
