# 🏰 Casa DF - Casa DF

Sistema completo de consultoria imobiliária de luxo em Brasília com CRM integrado, automação via WhatsApp e gestão de imóveis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-22.x-green.svg)
![React](https://img.shields.io/badge/react-19.x-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)

## ✨ Funcionalidades

### 🏠 Gestão de Imóveis
- Cadastro completo de imóveis (casas, apartamentos, coberturas, terrenos)
- Upload múltiplo de fotos com integração S3
- Filtros avançados (tipo, bairro, preço, características)
- Página de detalhes com galeria e localização no mapa
- Sistema de destaque para imóveis premium
- Vitrine pública com busca e ordenação

### 👥 CRM Completo
- Gestão de leads e clientes
- Funil de vendas visual (Kanban)
- Qualificação automática (Quente/Morno/Frio)
- Histórico completo de interações
- Sistema de follow-up automático
- Dashboard com métricas e analytics
- Segmentação por perfil de cliente

### 💬 Automação WhatsApp
- Integração com N8N para automação
- Atendente IA (Lívia 3.0)
- Histórico de mensagens no CRM
- Webhooks para receber e enviar mensagens
- Agendamento automático de visitas
- Qualificação de leads via conversa

### 📝 Blog Imobiliário
- Sistema completo de blog
- Categorias e tags
- Busca por palavras-chave
- Compartilhamento social
- SEO otimizado

### 📊 Analytics e Relatórios
- Dashboard de vendas
- Métricas de conversão
- Análise de origem de leads
- Relatórios de performance
- Integração com Manus Analytics

## 🚀 Tecnologias

### Frontend
- **React 19** - Interface moderna e responsiva
- **Tailwind CSS 4** - Estilização com design system personalizado
- **shadcn/ui** - Componentes de UI de alta qualidade
- **Wouter** - Roteamento leve e eficiente
- **tRPC Client** - Type-safe API calls

### Backend
- **Node.js 22** - Runtime JavaScript
- **Express 4** - Framework web
- **tRPC 11** - Type-safe API com contratos end-to-end
- **Drizzle ORM** - ORM TypeScript-first para MySQL
- **Superjson** - Serialização avançada (Date, Map, Set)

### Banco de Dados
- **MySQL 8** / **TiDB** - Banco de dados relacional
- **Drizzle Kit** - Migrations e schema management

### Autenticação
- **Manus OAuth** - Sistema de autenticação integrado
- **JWT** - Tokens seguros para sessões

### Storage
- **AWS S3** - Armazenamento de imagens de imóveis

### Integrações
- **N8N Webhooks** - Automação de workflows
- **WhatsApp Business API** - Comunicação com clientes
- **Google Maps API** - Localização de imóveis

## 📁 Estrutura do Projeto

```
casadf/
├── client/                    # Frontend React
│   ├── public/               # Assets estáticos
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── Properties.tsx
│   │   │   ├── PropertyDetail.tsx
│   │   │   ├── Blog.tsx
│   │   │   └── admin/       # Páginas administrativas
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitários
│   │   │   └── trpc.ts      # Cliente tRPC
│   │   ├── App.tsx          # Rotas e layout
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Estilos globais
├── server/                   # Backend Node.js
│   ├── _core/               # Infraestrutura
│   │   ├── context.ts       # Contexto tRPC
│   │   ├── env.ts           # Variáveis de ambiente
│   │   ├── llm.ts           # Integração LLM
│   │   └── oauth.ts         # Autenticação OAuth
│   ├── db.ts                # Query helpers
│   ├── routers.ts           # Rotas tRPC
│   └── index.ts             # Entry point
├── drizzle/                 # Banco de dados
│   ├── schema.ts            # Schema das tabelas
│   └── migrations/          # Migrations SQL
├── shared/                  # Código compartilhado
│   ├── types.ts             # Tipos TypeScript
│   └── constants.ts         # Constantes
├── storage/                 # Helpers S3
│   └── index.ts
├── Dockerfile               # Build Docker
├── docker-compose.yml       # Orquestração
├── build.sh                 # Script de build
├── deploy.sh                # Script de deploy
├── package.json             # Dependências
└── tsconfig.json            # Config TypeScript
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js 22+
- pnpm 9+
- MySQL 8+ (ou Docker)

### Desenvolvimento Local

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/casadf.git
cd casadf
```

2. **Instale as dependências:**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
nano .env  # Configure suas variáveis
```

Veja [ENV_VARIABLES.md](./ENV_VARIABLES.md) para lista completa de variáveis.

4. **Execute as migrations:**
```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
```

6. **Acesse a aplicação:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

## 🐳 Deploy com Docker

### Deploy Rápido

```bash
# Configure variáveis
cp .env.example .env
nano .env

# Execute deploy
./deploy.sh
```

### Manual

```bash
# Build e start
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

Veja [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md) para guia completo.

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                    # Inicia dev server (frontend + backend)
pnpm dev:client            # Apenas frontend
pnpm dev:server            # Apenas backend

# Build
pnpm build                 # Build completo
pnpm build:client          # Build frontend
pnpm build:server          # Build backend

# Banco de Dados
pnpm db:push               # Executar migrations
pnpm db:studio             # Interface visual do banco

# Testes
pnpm test                  # Executar todos os testes
pnpm test:watch            # Testes em modo watch

# Linting
pnpm lint                  # Verificar código
pnpm lint:fix              # Corrigir automaticamente

# Type checking
pnpm type-check            # Verificar tipos TypeScript
```

## 🧪 Testes

O projeto inclui 28+ testes unitários cobrindo:

- Autenticação e autorização
- CRUD de imóveis
- Gestão de leads
- Webhooks N8N
- Rotas tRPC

```bash
# Executar testes
pnpm test

# Com coverage
pnpm test:coverage

# Modo watch
pnpm test:watch
```

## 🔐 Segurança

- ✅ Autenticação JWT com Manus OAuth
- ✅ Proteção CSRF
- ✅ Rate limiting
- ✅ Sanitização de inputs
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection
- ✅ HTTPS em produção
- ✅ Secrets em variáveis de ambiente

## 🌐 Deploy em Produção

### Opções de Deploy

1. **VPS/Cloud (Recomendado)**
   - DigitalOcean
   - AWS EC2
   - Google Cloud Compute
   - Azure VM

2. **Platform as a Service**
   - Railway
   - Render
   - Fly.io
   - Heroku

3. **Containers**
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances
   - Kubernetes

### Checklist de Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Gerar JWT_SECRET forte
- [ ] Configurar banco de dados MySQL
- [ ] Configurar S3 para uploads
- [ ] Configurar domínio e DNS
- [ ] Configurar SSL/HTTPS
- [ ] Configurar backup automático
- [ ] Configurar monitoramento
- [ ] Testar aplicação
- [ ] Configurar CI/CD

## 📊 Banco de Dados

### Tabelas Principais

- `users` - Usuários e autenticação
- `properties` - Imóveis cadastrados
- `leads` - Leads e clientes
- `interactions` - Histórico de interações
- `messages` - Mensagens WhatsApp
- `blog_posts` - Artigos do blog
- `blog_categories` - Categorias do blog
- `site_settings` - Configurações do site

### Migrations

```bash
# Criar migration
pnpm db:generate

# Aplicar migrations
pnpm db:push

# Rollback (manual)
# Edite drizzle/migrations e execute novamente
```

## 🔧 Configuração

### Variáveis de Ambiente Principais

```env
# Banco de Dados
DATABASE_URL=mysql://user:pass@host:3306/db

# Autenticação
JWT_SECRET=your-secret-key

# Manus OAuth
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im

# Storage S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
```

Veja [ENV_VARIABLES.md](./ENV_VARIABLES.md) para lista completa.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Casa DF**
- CRECI: 17921-DF
- Email: contato@casadf.com.br
- Telefone: (61) 3254-4464
- Instagram: [@casadf](https://instagram.com/casadf)

## 🆘 Suporte

- **Issues:** https://github.com/seu-usuario/casadf/issues
- **Email:** suporte@casadf.com.br
- **Documentação:** https://docs.casadf.com.br

## 📚 Documentação Adicional

- [Guia de Deploy Docker](./DOCKER_DEPLOY.md)
- [Variáveis de Ambiente](./ENV_VARIABLES.md)
- [TODO List](./todo.md)

---

Desenvolvido com ❤️ por [Manus AI](https://manus.im)
