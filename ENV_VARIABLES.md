# Variáveis de Ambiente

Este documento lista todas as variáveis de ambiente necessárias para o projeto **Casa DF**.

## 📋 Variáveis Obrigatórias

### Banco de Dados

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão MySQL completa | `mysql://user:pass@host:3306/db` |
| `MYSQL_ROOT_PASSWORD` | Senha do root MySQL (Docker) | `rootpassword` |
| `MYSQL_DATABASE` | Nome do banco de dados | `casadf` |
| `MYSQL_USER` | Usuário do banco | `corretor` |
| `MYSQL_PASSWORD` | Senha do usuário | `corretorpassword` |
| `MYSQL_PORT` | Porta do MySQL | `3306` |

### Aplicação

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente de execução | `production` ou `development` |
| `PORT` | Porta da aplicação | `3000` |
| `APP_PORT` | Porta externa (Docker) | `3000` |

### Autenticação

| Variável | Descrição | Como Gerar |
|----------|-----------|------------|
| `JWT_SECRET` | Chave secreta para JWT | `openssl rand -base64 32` |

### Manus OAuth

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `VITE_APP_ID` | ID da aplicação Manus | Painel Manus |
| `OAUTH_SERVER_URL` | URL do servidor OAuth | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | URL do portal de login | `https://auth.manus.im` |

### Proprietário

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `OWNER_OPEN_ID` | OpenID do proprietário | Fornecido pela Manus |
| `OWNER_NAME` | Nome do proprietário | `Casa DF` |

### Manus Forge API (Backend)

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `BUILT_IN_FORGE_API_URL` | URL da API Forge | Painel Manus |
| `BUILT_IN_FORGE_API_KEY` | Chave de API (backend) | Painel Manus |

### Manus Forge API (Frontend)

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `VITE_FRONTEND_FORGE_API_URL` | URL da API Forge | Painel Manus |
| `VITE_FRONTEND_FORGE_API_KEY` | Chave de API (frontend) | Painel Manus |

### Analytics

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `VITE_ANALYTICS_ENDPOINT` | Endpoint de analytics | Painel Manus |
| `VITE_ANALYTICS_WEBSITE_ID` | ID do website | Painel Manus |

### Informações do Site

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_APP_TITLE` | Título da aplicação | `Casa DF - Casa DF` |
| `VITE_APP_LOGO` | URL do logo | `https://example.com/logo.png` |

## 📋 Variáveis Opcionais

### phpMyAdmin (Desenvolvimento)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PHPMYADMIN_PORT` | Porta do phpMyAdmin | `8080` |

## 🔒 Segurança

### ⚠️ IMPORTANTE:

1. **NUNCA** commite o arquivo `.env` no Git
2. Use `.env.example` como template (sem valores reais)
3. Em produção, use **secrets managers**:
   - AWS: AWS Secrets Manager
   - Azure: Azure Key Vault
   - Google Cloud: Secret Manager
   - Kubernetes: Secrets
4. Gere `JWT_SECRET` forte:
   ```bash
   openssl rand -base64 32
   ```

## 🚀 Como Configurar

### Desenvolvimento Local

1. Copie o template:
   ```bash
   cp .env.example .env
   ```

2. Preencha com valores de desenvolvimento

3. Inicie o projeto:
   ```bash
   pnpm dev
   ```

### Produção com Docker

1. Configure as variáveis no arquivo `.env`

2. Ou passe via linha de comando:
   ```bash
   docker-compose up -d
   ```

### Deploy em Servidores Cloud

Configure as variáveis de ambiente no painel do seu provedor:

- **Vercel**: Settings → Environment Variables
- **Railway**: Variables tab
- **Heroku**: Settings → Config Vars
- **AWS**: ECS Task Definitions ou Lambda Environment
- **Azure**: App Service → Configuration
- **Google Cloud**: Cloud Run → Variables

## 📚 Referências

- [Documentação Manus](https://docs.manus.im)
- [Guia de Deploy](./DEPLOY.md)
- [Configuração Docker](./DOCKER_DEPLOY.md)
