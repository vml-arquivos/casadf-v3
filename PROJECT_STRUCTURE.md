# Estrutura do Projeto - Casa DF

Documentação completa da organização de arquivos e pastas do projeto.

## 📂 Visão Geral

```
casadf/
├── client/                 # Frontend React + Vite
├── server/                 # Backend Express + tRPC
├── drizzle/               # Database schema e migrations
├── shared/                # Código compartilhado (tipos, constantes)
├── scripts/               # Scripts utilitários
├── patches/               # Patches de dependências
└── [arquivos de config]   # Configurações do projeto
```

## 🎨 Frontend (`client/`)

### `client/public/`
Assets estáticos servidos diretamente na raiz do site.

```
public/
├── logo-casadf.png    # Foto do corretor
├── logo-casadf.png     # Logo da empresa
├── favicon.ico               # Ícone do site
└── robots.txt                # SEO - instruções para crawlers
```

**Nota**: Arquivos aqui são acessíveis via `/nome-do-arquivo.ext` (ex: `/logo-casadf.png`)

### `client/src/`

#### `client/src/components/`
Componentes React reutilizáveis.

```
components/
├── ui/                       # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── ... (30+ componentes)
├── Header.tsx                # Cabeçalho do site
├── Footer.tsx                # Rodapé do site
├── AdminLayout.tsx           # Layout do dashboard admin
├── DashboardLayout.tsx       # Layout alternativo
└── Map.tsx                   # Componente de mapa Google Maps
```

#### `client/src/pages/`
Páginas da aplicação (rotas).

```
pages/
├── Home.tsx                  # Página inicial (/)
├── Properties.tsx            # Listagem de imóveis (/imoveis)
├── PropertyDetail.tsx        # Página individual de imóvel (/imovel/:id)
├── Blog.tsx                  # Listagem de posts (/blog)
├── BlogPost.tsx              # Post individual (/blog/:slug)
├── About.tsx                 # Quem Somos (/quem-somos)
├── Contact.tsx               # Contato (/contato)
└── admin/                    # Dashboard administrativo
    ├── Dashboard.tsx         # Dashboard principal (/admin)
    ├── Properties.tsx        # Gestão de imóveis (/admin/properties)
    ├── PropertyNew.tsx       # Novo imóvel (/admin/property/new)
    ├── PropertyEdit.tsx      # Editar imóvel (/admin/property/:id/edit)
    ├── Leads.tsx             # Gestão de leads (/admin/leads)
    ├── LeadEdit.tsx          # Editar lead (/admin/lead/:id/edit)
    ├── ClientManagement.tsx  # Gestão de clientes (/admin/clients)
    ├── FollowUp.tsx          # Follow-up automático (/admin/followup)
    ├── BlogPosts.tsx         # Gestão de posts (/admin/blog)
    └── BlogPostEdit.tsx      # Editar post (/admin/blog/:id/edit)
```

#### `client/src/lib/`
Bibliotecas e configurações.

```
lib/
├── trpc.ts                   # Cliente tRPC (conexão com backend)
└── utils.ts                  # Funções utilitárias
```

#### `client/src/contexts/`
Contextos React (estado global).

```
contexts/
└── AuthContext.tsx           # Contexto de autenticação
```

#### `client/src/hooks/`
Custom hooks React.

```
hooks/
└── useAuth.ts                # Hook de autenticação
```

#### Arquivos Principais

- `App.tsx` - Configuração de rotas (React Router via Wouter)
- `main.tsx` - Entry point do React
- `index.css` - Estilos globais e Tailwind CSS
- `const.ts` - Constantes do frontend

## ⚙️ Backend (`server/`)

### `server/_core/`
Infraestrutura e configurações do backend.

```
_core/
├── types/                    # Tipos TypeScript
├── context.ts                # Contexto tRPC (req, res, user)
├── cookies.ts                # Gerenciamento de cookies
├── dataApi.ts                # Integração com APIs de dados
├── env.ts                    # Variáveis de ambiente tipadas
├── imageGeneration.ts        # Geração de imagens com IA
├── index.ts                  # Entry point do servidor
├── llm.ts                    # Integração com LLM (GPT)
├── map.ts                    # Integração Google Maps
├── notification.ts           # Sistema de notificações
├── oauth.ts                  # Autenticação Manus OAuth
├── sdk.ts                    # SDK da plataforma Manus
├── systemRouter.ts           # Rotas do sistema
├── trpc.ts                   # Configuração tRPC
├── vite.ts                   # Integração Vite (dev server)
└── voiceTranscription.ts     # Transcrição de áudio
```

### Arquivos Principais

- `routers.ts` - **Todas as rotas tRPC da aplicação**
- `db.ts` - Query helpers e funções de banco de dados
- `storage.ts` - Helpers S3 para upload de imagens

### Testes (`server/*.test.ts`)

```
server/
├── auth.logout.test.ts       # Testes de autenticação
├── blog.test.ts              # Testes de blog
├── integration.test.ts       # Testes de webhooks N8N
├── leads.test.ts             # Testes de CRM
├── owners.test.ts            # Testes de proprietários
├── properties.test.ts        # Testes de imóveis
└── propertyImages.test.ts    # Testes de upload de imagens
```

## 🗄️ Banco de Dados (`drizzle/`)

### Estrutura

```
drizzle/
├── meta/                     # Metadados das migrations
│   ├── _journal.json         # Histórico de migrations
│   └── 0000_snapshot.json    # Snapshots do schema
├── migrations/               # SQL migrations geradas
├── schema.ts                 # **Schema principal do banco**
├── schema.js                 # Schema compilado
└── relations.ts              # Relações entre tabelas
```

### Tabelas Principais (definidas em `schema.ts`)

#### Autenticação
- `users` - Usuários do sistema

#### Imóveis
- `properties` - Imóveis cadastrados
- `property_images` - Imagens dos imóveis

#### CRM
- `leads` - Leads/clientes potenciais
- `interactions` - Histórico de interações

#### Blog
- `blog_posts` - Posts do blog
- `blog_categories` - Categorias de posts

#### Proprietários
- `owners` - Proprietários de imóveis

#### Integrações
- `message_buffer` - Buffer de mensagens WhatsApp
- `ai_context_status` - Contexto de IA
- `client_interests` - Interesses dos clientes
- `webhook_logs` - Logs de webhooks

#### Configurações
- `site_settings` - Configurações do site

## 🔗 Código Compartilhado (`shared/`)

Código usado tanto no frontend quanto no backend.

```
shared/
├── _core/
│   └── errors.ts             # Classes de erro customizadas
├── const.ts                  # Constantes compartilhadas
└── types.ts                  # Tipos TypeScript compartilhados
```

## 🛠️ Scripts (`scripts/`)

Scripts utilitários para desenvolvimento.

```
scripts/
└── seed-properties.mjs       # Seed de imóveis de exemplo
```

**Uso**:
```bash
pnpm exec tsx scripts/seed-properties.mjs
```

## 📝 Arquivos de Configuração (Raiz)

### Documentação
- `README.md` - Documentação principal do projeto
- `API_DOCUMENTATION.md` - Documentação completa da API
- `DEPLOY.md` - Guia de deploy
- `ENV_SETUP.md` - Guia de variáveis de ambiente
- `PROJECT_STRUCTURE.md` - Este arquivo
- `todo.md` - Lista de tarefas e features

### Configurações TypeScript
- `tsconfig.json` - Configuração TypeScript principal
- `tsconfig.node.json` - Config para scripts Node.js

### Configurações de Build
- `vite.config.ts` - Configuração Vite (bundler)
- `vitest.config.ts` - Configuração Vitest (testes)
- `drizzle.config.ts` - Configuração Drizzle ORM

### Dependências
- `package.json` - Dependências e scripts npm
- `pnpm-lock.yaml` - Lock file do pnpm

### UI Components
- `components.json` - Configuração shadcn/ui

### Patches
- `patches/` - Patches de dependências (pnpm patch)

### Git
- `.gitignore` - Arquivos ignorados pelo Git

## 🎯 Fluxo de Dados

### Frontend → Backend

```
Componente React
    ↓ (chama)
trpc.properties.list.useQuery()
    ↓ (HTTP request)
/api/trpc/properties.list
    ↓ (executa)
server/routers.ts → properties.list
    ↓ (consulta)
server/db.ts → listProperties()
    ↓ (query)
MySQL Database
    ↓ (retorna)
Dados → Frontend
```

### Upload de Imagens

```
Formulário (Frontend)
    ↓ (envia arquivo)
trpc.properties.uploadImage.useMutation()
    ↓ (HTTP request)
server/routers.ts → properties.uploadImage
    ↓ (chama)
server/storage.ts → storagePut()
    ↓ (upload)
AWS S3
    ↓ (retorna URL)
URL salva no banco → properties.mainImage
```

### Webhooks N8N

```
N8N Workflow
    ↓ (POST request)
/api/trpc/integration.whatsappWebhook
    ↓ (processa)
server/routers.ts → integration.whatsappWebhook
    ↓ (salva)
server/db.ts → createMessageBuffer()
    ↓ (insere)
MySQL → message_buffer table
    ↓ (log)
webhook_logs table
```

## 📦 Principais Dependências

### Frontend
- `react` (19.x) - UI library
- `wouter` (3.x) - Roteamento
- `@tanstack/react-query` (5.x) - Data fetching
- `@trpc/client` (11.x) - Cliente tRPC
- `tailwindcss` (4.x) - CSS framework
- `lucide-react` - Ícones

### Backend
- `express` (4.x) - Web framework
- `@trpc/server` (11.x) - API framework
- `drizzle-orm` (0.44.x) - ORM
- `mysql2` (3.x) - Driver MySQL
- `zod` (3.x) - Validação de schemas
- `superjson` (2.x) - Serialização

### Dev Tools
- `typescript` (5.x) - Type checking
- `vite` (6.x) - Build tool
- `vitest` (2.x) - Test runner
- `drizzle-kit` (0.31.x) - Database migrations

## 🔍 Como Encontrar Código

### "Onde está a lógica de autenticação?"
→ `server/_core/oauth.ts` e `server/_core/context.ts`

### "Onde estão as rotas da API?"
→ `server/routers.ts` (TODAS as rotas tRPC)

### "Onde está o schema do banco?"
→ `drizzle/schema.ts`

### "Onde estão os componentes de UI?"
→ `client/src/components/ui/` (shadcn/ui)

### "Onde está a página inicial?"
→ `client/src/pages/Home.tsx`

### "Onde está o dashboard admin?"
→ `client/src/pages/admin/Dashboard.tsx`

### "Como adicionar uma nova rota?"
→ 1. Adicionar em `server/routers.ts`
   2. Usar no frontend com `trpc.nomeDoRouter.nomeDaRota.useQuery()`

### "Como adicionar uma nova tabela?"
→ 1. Adicionar em `drizzle/schema.ts`
   2. Executar `pnpm db:push`
   3. Adicionar helpers em `server/db.ts`

## 📊 Estatísticas do Projeto

- **Total de arquivos**: ~200+
- **Linhas de código**: ~15,000+
- **Componentes React**: 50+
- **Rotas tRPC**: 80+
- **Tabelas no banco**: 15+
- **Testes unitários**: 40+

## 🚀 Próximos Passos

Para adicionar novas funcionalidades:

1. **Nova página pública**: Criar em `client/src/pages/`
2. **Nova página admin**: Criar em `client/src/pages/admin/`
3. **Nova rota API**: Adicionar em `server/routers.ts`
4. **Nova tabela**: Adicionar em `drizzle/schema.ts`
5. **Novo componente**: Criar em `client/src/components/`

## 📞 Suporte

Dúvidas sobre a estrutura?

- 📧 Email: contato@casadf.com.br
- 📱 WhatsApp: (61) 3254-4464

---

**Última atualização**: Janeiro 2025
