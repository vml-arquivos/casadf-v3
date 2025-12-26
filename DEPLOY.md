# Guia de Deploy - Casa DF

Este guia detalha como fazer deploy do projeto em diferentes plataformas.

## 📋 Pré-requisitos

Antes de fazer deploy, certifique-se de ter:

- ✅ Código no GitHub (repositório privado ou público)
- ✅ Banco de dados MySQL configurado
- ✅ Variáveis de ambiente preparadas (veja [ENV_SETUP.md](./ENV_SETUP.md))
- ✅ Conta S3 AWS para upload de imagens (ou alternativa)

## 🚀 Opção 1: Deploy no Vercel (Recomendado)

Vercel é ideal para aplicações Next.js/React com backend serverless.

### Passo a Passo

1. **Crie uma conta no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub

2. **Importe o projeto**
   - Clique em "New Project"
   - Selecione o repositório `casadf`
   - Vercel detectará automaticamente que é um projeto Vite

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: pnpm build
   Output Directory: dist
   Install Command: pnpm install
   ```

4. **Configure Environment Variables**
   
   No painel da Vercel, adicione todas as variáveis de ambiente necessárias:
   
   ```
   DATABASE_URL=mysql://...
   JWT_SECRET=...
   OAUTH_SERVER_URL=...
   VITE_APP_ID=...
   (veja ENV_SETUP.md para lista completa)
   ```

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build (2-5 minutos)
   - Seu site estará disponível em `https://seu-projeto.vercel.app`

### Configurar Domínio Personalizado

1. No painel da Vercel, vá em "Settings" → "Domains"
2. Adicione seu domínio (ex: `casadf.com.br`)
3. Configure os DNS conforme instruções da Vercel
4. Aguarde propagação (até 48h)

### Configurar Deploy Automático

Vercel já configura deploy automático:
- ✅ Push na branch `main` → Deploy em produção
- ✅ Push em outras branches → Preview deploy
- ✅ Pull Requests → Preview deploy automático

## 🚂 Opção 2: Deploy no Railway

Railway é ideal para aplicações fullstack com banco de dados.

### Passo a Passo

1. **Crie uma conta no Railway**
   - Acesse [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Crie um novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `casadf`

3. **Adicione MySQL Database**
   - No projeto, clique em "New"
   - Selecione "Database" → "MySQL"
   - Railway criará um banco gerenciado
   - Copie a `DATABASE_URL` gerada

4. **Configure Environment Variables**
   
   Na aba "Variables" do serviço, adicione:
   
   ```
   DATABASE_URL=${{MySQL.DATABASE_URL}}
   JWT_SECRET=...
   NODE_ENV=production
   (veja ENV_SETUP.md para lista completa)
   ```

5. **Configure Build Settings**
   
   Railway detecta automaticamente, mas você pode customizar:
   
   ```
   Build Command: pnpm install && pnpm build
   Start Command: pnpm start
   ```

6. **Deploy**
   - Railway fará deploy automaticamente
   - Aguarde o build (3-7 minutos)
   - Acesse a URL pública gerada

### Configurar Domínio Personalizado

1. Na aba "Settings" do serviço
2. Clique em "Generate Domain" para domínio Railway gratuito
3. Ou adicione domínio personalizado em "Custom Domain"

## 🐳 Opção 3: Deploy com Docker

Para self-hosting em seu próprio servidor.

### Dockerfile

Crie um `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependências
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build
RUN pnpm build

# Imagem de produção
FROM node:22-alpine

WORKDIR /app

# Copiar dependências de produção
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Copiar build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/drizzle ./drizzle

# Expor porta
EXPOSE 3000

# Iniciar aplicação
CMD ["node", "server/index.js"]
```

### Docker Compose

Crie um `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/casadf
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=casadf
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

### Deploy

```bash
# Build e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## ☁️ Opção 4: Deploy em VPS (DigitalOcean, AWS EC2, etc)

Para controle total do servidor.

### Passo a Passo

1. **Provisionar servidor**
   - Ubuntu 22.04 LTS
   - Mínimo 2GB RAM
   - 20GB SSD

2. **Instalar dependências**
   ```bash
   # Atualizar sistema
   sudo apt update && sudo apt upgrade -y

   # Instalar Node.js 22
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs

   # Instalar pnpm
   npm install -g pnpm

   # Instalar MySQL
   sudo apt install -y mysql-server
   sudo mysql_secure_installation

   # Instalar Nginx
   sudo apt install -y nginx

   # Instalar PM2 (process manager)
   npm install -g pm2
   ```

3. **Configurar banco de dados**
   ```bash
   sudo mysql -u root -p
   ```
   ```sql
   CREATE DATABASE casadf;
   CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'senha-segura';
   GRANT ALL PRIVILEGES ON casadf.* TO 'appuser'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Clonar e configurar projeto**
   ```bash
   # Criar usuário para aplicação
   sudo adduser --disabled-password --gecos "" appuser
   sudo su - appuser

   # Clonar repositório
   git clone https://github.com/seu-usuario/casadf.git
   cd casadf

   # Instalar dependências
   pnpm install

   # Criar arquivo .env
   nano .env
   # (cole as variáveis de ambiente)

   # Executar migrations
   pnpm db:push

   # Build
   pnpm build
   ```

5. **Configurar PM2**
   ```bash
   # Iniciar aplicação
   pm2 start npm --name "casadf" -- start

   # Configurar auto-start
   pm2 startup
   pm2 save

   # Ver logs
   pm2 logs casadf
   ```

6. **Configurar Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/casadf
   ```

   ```nginx
   server {
       listen 80;
       server_name casadf.com.br www.casadf.com.br;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   ```bash
   # Ativar site
   sudo ln -s /etc/nginx/sites-available/casadf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Configurar SSL com Let's Encrypt**
   ```bash
   # Instalar Certbot
   sudo apt install -y certbot python3-certbot-nginx

   # Obter certificado
   sudo certbot --nginx -d casadf.com.br -d www.casadf.com.br

   # Renovação automática já configurada
   ```

## 🔄 CI/CD com GitHub Actions

Automatize deploy a cada push.

### Criar `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📊 Monitoramento Pós-Deploy

Após o deploy, configure:

### 1. Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com) - Gratuito
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

### 2. Error Tracking
- [Sentry](https://sentry.io) - Monitoramento de erros
- Configure DSN nas variáveis de ambiente

### 3. Analytics
- Google Analytics - Tráfego do site
- Manus Analytics - Métricas internas

### 4. Performance
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)

## 🔒 Checklist de Segurança

Antes de colocar em produção:

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] `NODE_ENV=production` está definido
- [ ] Banco de dados tem backup automático
- [ ] SSL/HTTPS está ativo
- [ ] Firewall está configurado (apenas portas 80, 443, 22)
- [ ] Senhas fortes em todos os serviços
- [ ] Rate limiting está ativo
- [ ] CORS está configurado corretamente
- [ ] Logs estão sendo coletados
- [ ] Monitoramento de uptime está ativo

## 🆘 Troubleshooting

### Build falha com erro de memória
```bash
# Aumentar limite de memória do Node
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

### Banco de dados não conecta
- Verifique se `DATABASE_URL` está correta
- Teste conexão: `mysql -h host -u user -p`
- Verifique firewall/security groups

### Imagens não aparecem
- Verifique credenciais S3
- Confirme que bucket é público
- Teste upload manual

### Webhooks N8N não funcionam
- Verifique URLs dos webhooks
- Teste com Postman/curl
- Confira logs do N8N

## 📞 Suporte

Problemas com deploy?

- 📧 Email: contato@casadf.com.br
- 📱 WhatsApp: (61) 3254-4464
- 📚 Documentação: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

**Última atualização**: Janeiro 2025
