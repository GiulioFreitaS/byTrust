import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

const fontsDir = path.resolve(__dirname, "../../assets/fonts");
const fontsConf = path.join(fontsDir, "fonts.conf");
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

process.env.FONTCONFIG_PATH = fontsDir;
process.env.FONTCONFIG_FILE = fontsConf;

export type SealData = {
  productName: string;
  brandName: string;
  username: string;
  issuedAt: Date;
  userPhotoBuffer: Buffer;
  badgeImagePath?: string;
};

const sharpPromise = import("sharp").then((m) => m.default);

export async function generateSealImage(
  data: SealData
): Promise<{
  uniqueCode: string;
  imageUrl: string;
  shareableUrl: string;
}> {
  const sharp = await sharpPromise;

  const uniqueCode = uuidv4().slice(0, 8).toUpperCase();
  const filename = `seal-${uniqueCode}.png`;

  const outputDir = path.resolve(__dirname, "../../public/seals");
  await fs.mkdir(outputDir, { recursive: true });

  const photo = await sharp(data.userPhotoBuffer)
    .resize({
      width: 1080,
      withoutEnlargement: true,
    })
    .toBuffer();

  const meta = await sharp(photo).metadata();
  const W = meta.width!;
  const H = meta.height!;

  const date = new Date(data.issuedAt).toLocaleDateString("pt-BR");

  const overlay = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="40%" stop-color="#000" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.88"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#fade)"/>

  <rect
    x="0"
    y="${H - 200}"
    width="5"
    height="200"
    fill="#F59E0B"
  />

  <text
    x="30"
    y="${H - 140}"
    font-family="ARIAL"
    font-size="${Math.round(W * 0.058)}"
    font-weight="500"
    fill="#FFFFFF">
    ${escapeXml(data.productName)}
  </text>

  <text
    x="30"
    y="${H - 98}"
    font-family="DejaVu Sans"
    font-size="${Math.round(W * 0.034)}"
    fill="#D1D5DB">
    ${escapeXml(data.brandName)}
  </text>

  <text
    x="30"
    y="${H - 56}"
    font-family="DejaVu Sans"
    font-size="${Math.round(W * 0.026)}"
    fill="#9CA3AF">
    Verificado por @${escapeXml(data.username)} - ${date}
  </text>

  <text
    x="30"
    y="${H - 24}"
    font-family="DejaVu Sans"
    font-size="${Math.round(W * 0.020)}"
    fill="#6B7280">
    ${baseUrl}/api/seals/public/${uniqueCode}
  </text>
</svg>
`.trim();

  const layers: any[] = [
    {
      input: Buffer.from(overlay, "utf-8"),
      blend: "over",
    },
  ];

  if (data.badgeImagePath) {
    try {
      await fs.access(data.badgeImagePath);

      const badgeSize = Math.round(W * 0.22);

      const badge = await sharp(data.badgeImagePath)
        .resize({
          width: badgeSize,
          height: badgeSize,
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      layers.push({
        input: badge,
        top: 20,
        left: W - badgeSize - 20,
        blend: "over",
      });
    } catch {
      console.warn("Badge não encontrado.");
    }
  }

  await sharp(photo)
    .composite(layers)
    .png()
    .toFile(path.join(outputDir, filename));


  return {
    uniqueCode,
    imageUrl: `${baseUrl}/public/seals/${filename}`,
    shareableUrl: `${baseUrl}/api/seals/public/${uniqueCode}`,
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
