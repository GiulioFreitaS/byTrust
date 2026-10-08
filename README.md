# byTrust — Protegendo sua confiança

> Plataforma de verificação de autenticidade de produtos, combate à falsificação e educação do consumidor no Brasil e América Latina.

🔗 **[Acessar o projeto](https://bytrust.vercel.app)**

**Desenvolvido em parceria com [J.A-Brasil (Junior Activist)](https://ja-brasil.org) e [Mercado Livre](https://mercadolivre.com.br).**

---

## Sobre o projeto

O byTrust é uma plataforma que conecta consumidores, marcas e autoridades no combate à falsificação de produtos. Permite verificar a autenticidade de itens, reportar suspeitas, acompanhar alertas do mercado e acessar conteúdo educativo sobre como identificar produtos falsificados.

O projeto nasce da necessidade de proteger consumidores brasileiros e latino-americanos de prejuízos causados por produtos falsos — que vão de roupas e eletrônicos a medicamentos e peças automotivas.

---

## Funcionalidades

- **Verificação de produto** — consulta de autenticidade via código e fotos do produto
- **Feed de notícias** — publicação automática de alertas e notícias sobre falsificação no Brasil e América Latina, atualizado a cada 6 horas
- **Denúncias** — canal para reportar produtos suspeitos
- **Conteúdo educativo** — artigos e guias para identificar falsificações
- **Comunidade** — espaço para troca de experiências entre consumidores
- **Autenticação segura** — login com JWT, rotas protegidas

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Banco de dados | PostgreSQL + Prisma ORM |
| Autenticação | JWT |
| Ingestão de notícias | Google News RSS + Node.js |
| Deploy frontend | Vercel |
| Deploy backend | Railway |
| Cron de notícias | Railway Cron Service (Docker/Alpine) |

---

## Estrutura do repositório

```
/
├── frontend/               # Aplicação React
│   └── src/
│       ├── pages/          # Feed, Aprender, Verificar, Denúncias...
│       ├── components/     # Componentes reutilizáveis
│       └── lib/            # Configuração de API
│
├── backend/                # API Express
│   ├── src/
│   │   ├── routes/         # Rotas: auth, community, education, newsIngest
│   │   ├── services/       # newsIngester (ingestão automática de notícias)
│   │   ├── middleware/     # Autenticação JWT
│   │   └── models/         # Prisma client
│   └── prisma/
│       └── schema.prisma   # Schema do banco de dados
│
└── cron-ingest/            # Serviço de cron (Docker Alpine + curl)
    ├── Dockerfile
    └── entrypoint.sh
```

---

## Ingestão automática de notícias

O Feed é alimentado automaticamente por um serviço que busca notícias sobre falsificação e contrafação no Brasil e América Latina via Google News RSS.

- **Frequência:** a cada 6 horas
- **Fonte:** Google News RSS (10 queries específicas)
- **Filtros:** palavras-chave positivas, termos bloqueados, fontes confiáveis
- **Deduplicação:** fingerprint SHA-256 por notícia, salvo no banco
- **Publicação:** posts automáticos no Feed como `@byTrust Notícias`

---

## Parcerias

| Parceiro | Contribuição |
|---|---|
| **J.A-Brasil (Junior Activist)** | Parceria institucional, mobilização e comunicação com consumidores jovens |
| **Mercado Livre** | Parceria patrocinadora do evento |

---

## Time

| Nome | GitHub |
|---|---|
| Guilherme Izidio Nogueira |  [@Guilhermezi](https://github.com/Guilhermezi) |
| Luis Guilherme | [@Luis-Guilherme17](https://github.com/Luis-Guilherme17) |
| Rafael Nunes Cardoso | [@RafaelNunesCard](https://github.com/RafaelNunesCard) |
| Giulio Freitas | [@GiulioFreitaS](https://github.com/GiulioFreitaS) |
| Pedro Rodrigues Pimentel | [@pedrorgdss](https://github.com/pedrorgdss) |
| Mariana Queiroz | [@queirozmariana](https://github.com/queirozmariana) |
| Renato Aparecido da Silva | [@Renato1909](https://github.com/Renato1909) |
| Julia Bergstron | [@Juliabergstron](https://github.com/Juliabergstron) |

---

## Contato

Tem interesse no projeto ou quer saber mais? Me chame no LinkedIn:

**👉 [Guilherme Izidio Nogueira](https://www.linkedin.com/in/guilherme-izidio-nogueira-7ab1ab370)**

---

## Licença

Todos os direitos reservados © byTrust 2026.
