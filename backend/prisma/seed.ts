import { PrismaClient, BadgeTrigger } from "@prisma/client"

const prisma = new PrismaClient()

const badges: {
  name: string
  description: string
  imageUrl: string
  trigger: BadgeTrigger
  threshold: number
}[] = [
  {
    name: "1º Produto Original",
    description: "Você ganhou um selo por sua 1ª compra original!",
    imageUrl: "/public/badges/1-primeiro-produto-original.png",
    trigger: BadgeTrigger.FIRST_VERIFICATION,
    threshold: 1,
  },
  {
    name: "Olho de Águia",
    description: "10 verificações realizadas.",
    imageUrl: "/public/badges/2-olho-de-aguia.png",
    trigger: BadgeTrigger.VERIFICATIONS_COUNT,
    threshold: 10,
  },
  {
    name: "Mestre da Verificação",
    description: "Você verificou e escolhe a autenticidade!",
    imageUrl: "/public/badges/3-mestre-da-verificacao.png",
    trigger: BadgeTrigger.VERIFICATIONS_COUNT,
    threshold: 50,
  },
  {
    name: "Guardião da Originalidade",
    description: "Você realizou 100 verificações!",
    imageUrl: "/public/badges/4-guardiao-da-originalidade.png",
    trigger: BadgeTrigger.VERIFICATIONS_COUNT,
    threshold: 100,
  },
  {
    name: "Voz da Comunidade",
    description: "Você fez sua primeira publicação ou relato!",
    imageUrl: "/public/badges/5-voz-da-comunidade.png",
    trigger: BadgeTrigger.COMMUNITY_POST,
    threshold: 1,
  },
  {
    name: "Influência Positiva",
    description: "Seu conteúdo está inspirando outras pessoas!",
    imageUrl: "/public/badges/6-influencia-positiva.png",
    trigger: BadgeTrigger.COMMUNITY_POST,
    threshold: 10,
  },
  {
    name: "100 Compartilhamentos no Blog",
    description: "Você ajudou a espalhar conhecimento!",
    imageUrl: "/public/badges/7-100-compartilhamentos.png",
    trigger: BadgeTrigger.COMMUNITY_POST,
    threshold: 100,
  },
  {
    name: "Pensei Antes de Comprar",
    description: "Refletir antes de comprar também é uma conquista!",
    imageUrl: "/public/badges/8-pensei-antes-de-comprar.png",
    trigger: BadgeTrigger.EDUCATION_COMPLETE,
    threshold: 1,
  },
  {
    name: "Consumidor Consciente",
    description: "Você faz escolhas melhores para você e para o mundo!",
    imageUrl: "/public/badges/9-consumidor-consciente.png",
    trigger: BadgeTrigger.EDUCATION_COMPLETE,
    threshold: 5,
  },
  {
    name: "Colecionador de Selos",
    description: "Conquistar 10 selos diferentes.",
    imageUrl: "/public/badges/10-colecionador-de-selos.png",
    trigger: BadgeTrigger.VERIFICATIONS_COUNT,
    threshold: 10,
  },
  {
    name: "Embaixador byTrust",
    description: "6 meses de participação ativa. Você faz a diferença!",
    imageUrl: "/public/badges/11-embaixador-bytrust.png",
    trigger: BadgeTrigger.STREAK_DAYS,
    threshold: 180,
  },
  {
    name: "Lenda da Autenticidade",
    description: "Você conquistou todos os outros selos!",
    imageUrl: "/public/badges/12-lenda-da-autenticidade.png",
    trigger: BadgeTrigger.ALL_BADGES,
    threshold: 11,
  },
]

const catalog = [
  { brand: "Nike", product: "Air Jordan 1 High OG", category: "Sneakers" },
  { brand: "Nike", product: "Nike Dunk Low Panda", category: "Sneakers" },
  { brand: "Nike", product: "Air Force 1 '07", category: "Sneakers" },
  { brand: "Adidas", product: "Yeezy Boost 350 V2", category: "Sneakers" },
  { brand: "Adidas", product: "Campus 00s", category: "Sneakers" },
  { brand: "Jordan", product: "Jordan 4 Retro Bred", category: "Sneakers" },
  { brand: "Jordan", product: "Jordan 1 Chicago", category: "Sneakers" },
  { brand: "New Balance", product: "550", category: "Sneakers" },
  { brand: "New Balance", product: "9060", category: "Sneakers" },
  { brand: "Balenciaga", product: "Triple S", category: "Sneakers" },

  { brand: "Louis Vuitton", product: "Neverfull MM", category: "Bolsas" },
  { brand: "Louis Vuitton", product: "Speedy 25", category: "Bolsas" },
  { brand: "Gucci", product: "GG Marmont", category: "Bolsas" },
  { brand: "Prada", product: "Re-Edition 2005", category: "Bolsas" },
  { brand: "Chanel", product: "Classic Flap Bag", category: "Bolsas" },
  { brand: "Hermès", product: "Birkin 30", category: "Bolsas" },

  { brand: "Rolex", product: "Submariner Date", category: "Relógios" },
  { brand: "Rolex", product: "Daytona", category: "Relógios" },
  { brand: "Rolex", product: "GMT Master II", category: "Relógios" },
  { brand: "Omega", product: "Speedmaster Moonwatch", category: "Relógios" },
  { brand: "Tag Heuer", product: "Carrera", category: "Relógios" },

  { brand: "Apple", product: "AirPods Pro 2", category: "Eletrônicos" },
  { brand: "Apple", product: "iPhone 15 Pro Max", category: "Smartphones" },
  { brand: "Apple", product: "Apple Watch Ultra 2", category: "Smartwatch" },
  { brand: "Samsung", product: "Galaxy S24 Ultra", category: "Smartphones" },
  { brand: "Samsung", product: "Galaxy Buds2 Pro", category: "Eletrônicos" },
  { brand: "Sony", product: "WH-1000XM5", category: "Fones" },
  { brand: "Sony", product: "DualSense", category: "Games" },

  { brand: "Ray-Ban", product: "Aviator Classic", category: "Óculos" },
  { brand: "Oakley", product: "Holbrook", category: "Óculos" },

  { brand: "Dior", product: "Sauvage", category: "Perfumes" },
  { brand: "Chanel", product: "Bleu de Chanel", category: "Perfumes" },
  { brand: "Creed", product: "Aventus", category: "Perfumes" },
  { brand: "Tom Ford", product: "Oud Wood", category: "Perfumes" },
  { brand: "Paco Rabanne", product: "1 Million", category: "Perfumes" },

  { brand: "LEGO", product: "Millennium Falcon UCS", category: "Colecionáveis" },
  { brand: "Funko", product: "Freddy Funko Limited Edition", category: "Colecionáveis" },
  { brand: "Pokémon", product: "Charizard Base Set", category: "Cartas" },
  { brand: "Pokémon", product: "Pikachu Illustrator", category: "Cartas" },

  { brand: "Supreme", product: "Box Logo Hoodie", category: "Streetwear" },
  { brand: "BAPE", product: "Shark Hoodie", category: "Streetwear" },
  { brand: "Moncler", product: "Maya Jacket", category: "Roupas" },
  { brand: "Off-White", product: "Industrial Belt", category: "Acessórios" },
  { brand: "Versace", product: "Medusa Chain", category: "Acessórios" },
  { brand: "Dyson", product: "Airwrap Complete", category: "Beleza" }
]

async function main() {
  console.log("🌱 Cadastrando badges...")

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {
        description: badge.description,
        imageUrl: badge.imageUrl,
        trigger: badge.trigger,
        threshold: badge.threshold,
      },
      create: badge,
    })

    console.log(`✅ ${badge.name}`)
  }

  console.log("\n🌱 Cadastrando marca...")

console.log("\n🌱 Cadastrando marcas e produtos...")

for (const item of catalog) {
  let brand = await prisma.brand.findUnique({
    where: {
      name: item.brand,
    },
  })

  if (!brand) {
    brand = await prisma.brand.create({
      data: {
        name: item.brand,
        isActive: true,
      },
    })
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      name: item.product,
      brandId: brand.id,
    },
  })

  if (!existingProduct) {
    await prisma.product.create({
      data: {
        brandId: brand.id,
        name: item.product,
        description: `${item.product} - Produto frequentemente falsificado.`,
        category: item.category,
      },
    })

    console.log(`✅ ${item.brand} - ${item.product}`)
  } else {
    console.log(`ℹ️ ${item.brand} - ${item.product} já existe`)
  }
}

console.log("\n✨ Seed concluído com sucesso!")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })