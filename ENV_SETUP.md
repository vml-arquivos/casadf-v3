# Guia de Configuração de Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configuração. Algumas são fornecidas automaticamente pela plataforma Manus, outras precisam ser configuradas manualmente.

## Variáveis Pré-Configuradas (Manus Platform)

As seguintes variáveis são injetadas automaticamente quando o projeto roda na plataforma Manus:

### Banco de Dados
- `DATABASE_URL` - URL de conexão MySQL/TiDB gerenciado

### Autenticação
- `JWT_SECRET` - Secret para tokens JWT
- `OAUTH_SERVER_URL` - URL do servidor OAuth Manus
- `VITE_OAUTH_PORTAL_URL` - URL do portal de login
- `VITE_APP_ID` - ID da aplicação Manus
- `OWNER_OPEN_ID` - Open ID do proprietário
- `OWNER_NAME` - Nome do proprietário

### APIs Internas Manus
- `BUILT_IN_FORGE_API_URL` - URL das APIs internas (LLM, Storage, etc)
- `BUILT_IN_FORGE_API_KEY` - Chave de API backend
- `VITE_FRONTEND_FORGE_API_KEY` - Chave de API frontend
- `VITE_FRONTEND_FORGE_API_URL` - URL das APIs para frontend

### Analytics
- `VITE_ANALYTICS_WEBSITE_ID` - ID do site no analytics
- `VITE_ANALYTICS_ENDPOINT` - Endpoint do analytics

### Configurações do Site
- `VITE_APP_TITLE` - Título do site
- `VITE_APP_LOGO` - URL do logo

## Variáveis Opcionais (Configurar Manualmente)

### Google Maps (Para localização de imóveis)

Se quiser usar o Google Maps para mostrar localização dos imóveis:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou selecione um existente
3. Ative a API "Maps JavaScript API"
4. Crie uma API Key em "Credentials"
5. Configure no projeto:

```env
GOOGLE_MAPS_API_KEY=sua-api-key-aqui
VITE_GOOGLE_MAPS_API_KEY=sua-api-key-aqui
```

### WhatsApp Business API (Para automação direta)

Se quiser integração direta com WhatsApp (sem N8N):

1. Acesse [Meta for Developers](https://developers.facebook.com)
2. Configure WhatsApp Business API
3. Obtenha as credenciais
4. Configure no projeto:

```env
WHATSAPP_BUSINESS_ACCOUNT_ID=seu-account-id
WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id
WHATSAPP_ACCESS_TOKEN=seu-access-token
WHATSAPP_VERIFY_TOKEN=seu-verify-token
```

### N8N Webhooks (Para automação Lívia 3.0)

Se estiver usando N8N para automação:

1. Configure seus workflows no N8N
2. Copie as URLs dos webhooks
3. Configure no projeto:

```env
N8N_WEBHOOK_BASE_URL=https://seu-n8n.com/webhook
N8N_WEBHOOK_SECRET=seu-webhook-secret
```

### Email SMTP (Para envio de notificações)

Para enviar emails de notificação:

1. Use Gmail, SendGrid, Mailgun ou outro provedor SMTP
2. Configure as credenciais:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
SMTP_FROM=Casa DF <contato@casadf.com>
```

**Nota para Gmail**: Use uma "App Password" em vez da senha normal.

### Google Analytics (Para tracking de visitantes)

Para rastrear visitantes com Google Analytics:

1. Crie uma propriedade no [Google Analytics](https://analytics.google.com)
2. Copie o Tracking ID (formato: G-XXXXXXXXXX)
3. Configure:

```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Meta Pixel (Para anúncios Facebook/Instagram)

Para rastrear conversões de anúncios:

1. Acesse [Meta Business Suite](https://business.facebook.com)
2. Crie um Pixel no Events Manager
3. Copie o Pixel ID
4. Configure:

```env
VITE_META_PIXEL_ID=seu-pixel-id
```

### Sentry (Para monitoramento de erros)

Para monitorar erros em produção:

1. Crie um projeto no [Sentry](https://sentry.io)
2. Copie o DSN
3. Configure:

```env
SENTRY_DSN=https://seu-sentry-dsn
VITE_SENTRY_DSN=https://seu-sentry-dsn
```

## Deploy em Produção

### Vercel

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático a cada push

### Railway

1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente no painel do Railway
3. Railway provê banco de dados MySQL gerenciado

### Docker / Self-Hosting

1. Crie um arquivo `.env` na raiz do projeto
2. Copie todas as variáveis necessárias
3. Execute com Docker Compose:

```bash
docker-compose up -d
```

## Variáveis Obrigatórias vs Opcionais

### ✅ Obrigatórias (Já configuradas na plataforma Manus)
- `DATABASE_URL`
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `VITE_APP_ID`
- `OWNER_OPEN_ID`
- `BUILT_IN_FORGE_API_KEY`

### 🔧 Opcionais (Configure conforme necessidade)
- `GOOGLE_MAPS_API_KEY` - Apenas se usar mapas
- `WHATSAPP_*` - Apenas para integração direta WhatsApp
- `N8N_*` - Apenas se usar N8N
- `SMTP_*` - Apenas para envio de emails
- `VITE_GA_TRACKING_ID` - Apenas para Google Analytics
- `VITE_META_PIXEL_ID` - Apenas para Meta Ads
- `SENTRY_DSN` - Apenas para monitoramento de erros

## Testando Localmente

Para rodar o projeto localmente sem a plataforma Manus:

1. Crie um arquivo `.env` na raiz
2. Configure pelo menos as variáveis obrigatórias:

```env
DATABASE_URL=mysql://root:password@localhost:3306/casadf
JWT_SECRET=seu-jwt-secret-local
NODE_ENV=development
PORT=3000
```

3. Inicie o banco de dados MySQL local
4. Execute as migrations:

```bash
pnpm db:push
```

5. Inicie o servidor:

```bash
pnpm dev
```

## Segurança

⚠️ **NUNCA** commite o arquivo `.env` no Git!

O arquivo `.gitignore` já está configurado para ignorar:
- `.env`
- `.env.local`
- `.env.*.local`

Sempre use variáveis de ambiente para informações sensíveis como:
- Senhas de banco de dados
- API keys
- Tokens de acesso
- Secrets de JWT

## Suporte

Para dúvidas sobre configuração:
- Documentação Manus: https://docs.manus.im
- Email: contato@casadf.com.br
- WhatsApp: (61) 3254-4464
