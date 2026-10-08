# OriginAuth API

Backend da plataforma de verificação de produtos originais com selo digital.

## Stack

- **TypeScript** + **Express** — servidor HTTP
- **Prisma** — ORM e migrations
- **PostgreSQL** — banco de dados
- **Sharp** — geração de imagem do selo (SVG → PNG)
- **Zod** — validação de entrada
- **JWT** — autenticação

## Estrutura de pastas

```
src/
  index.ts                  # entry point, registra rotas
  middleware/
    auth.ts                 # valida JWT e injeta userId no request
    errorHandler.ts         # handler centralizado de erros
  models/
    prisma.ts               # singleton do PrismaClient
  routes/
    auth.ts                 # POST /register, POST /login, GET /me
    verification.ts         # POST / (fluxo principal), GET /histórico
    seal.ts                 # GET /meus selos, GET /public/:code
    badge.ts                # GET /minhas insígnias, GET /catálogo
    community.ts            # GET /feed, POST /post, DELETE /post
    education.ts            # GET /conteúdos, GET /:slug
  services/
    brandValidation.ts      # adapter de validação (mock + real)
    sealGenerator.ts        # renderiza SVG e converte para PNG
    badgeService.ts         # checa e concede insígnias
prisma/
  schema.prisma             # todas as entidades do banco
```

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e configurar variáveis de ambiente
cp .env.example .env
# edite .env com sua DATABASE_URL e JWT_SECRET

# 3. Gerar o Prisma Client e rodar as migrations
npm run prisma:generate
npm run prisma:migrate

# 4. Rodar em desenvolvimento
npm run dev
```

## Endpoints principais

| Método | Rota                          | Descrição                                |
|--------|-------------------------------|------------------------------------------|
| POST   | /api/auth/register            | Cadastro de usuário                      |
| POST   | /api/auth/login               | Login                                    |
| GET    | /api/auth/me                  | Perfil do usuário autenticado            |
| POST   | /api/verifications            | **Verificar produto** (fluxo principal)  |
| GET    | /api/verifications            | Histórico de verificações                |
| GET    | /api/seals                    | Selos do usuário                         |
| GET    | /api/seals/public/:code       | Validar selo publicamente (sem auth)     |
| GET    | /api/badges                   | Insígnias conquistadas                   |
| GET    | /api/community                | Feed da comunidade                       |
| POST   | /api/community                | Publicar post manual                     |
| GET    | /api/education                | Listar conteúdos educativos              |
| GET    | /api/education/:slug          | Ler artigo completo                      |

## Fluxo de verificação (POST /api/verifications)

```
1. Valida entrada com Zod
2. Busca produto + marca no banco
3. Checa duplicidade (mesmo serial já verificado pelo usuário)
4. Chama brandValidation.ts → mock ou API real da marca
5. Salva ProductVerification com status (AUTHENTIC | SUSPICIOUS)
6. Se autêntico:
   a. Gera imagem PNG do selo (SVG renderizado via Sharp)
   b. Persiste Seal no banco com URL da imagem e link público
   c. Checa e concede insígnias (BadgeService)
   d. Cria CommunityPost automático no feed
7. Retorna { verification, seal, newBadges, post }
```

## Próximos passos (pós-MVP)

- [ ] Upload de imagem de avatar (S3 ou Cloudflare R2)
- [ ] Armazenar imagens de selos em object storage ao invés de disco local
- [ ] Adapters reais por marca (Nike, Apple, etc.)
- [ ] Progresso em conteúdo educativo (tabela `user_content_progress`)
- [ ] Streak de verificações (lógica de dias consecutivos)
- [ ] Rate limiting por usuário (evitar spam de verificações)
- [ ] Testes automatizados (Jest + Supertest)
