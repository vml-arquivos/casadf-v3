# ============================================
# STAGE 1: Build do Frontend (Client)
# ============================================
FROM node:22-alpine AS client-builder

WORKDIR /app

# Copiar package.json e lock files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Instalar pnpm e dependências
RUN npm install -g pnpm@latest && \
    pnpm install --no-frozen-lockfile

# Copiar código fonte do cliente
COPY client ./client
COPY shared ./shared
COPY tsconfig.json ./
COPY vite.config.ts ./

# Build do frontend
RUN pnpm run build:client

# ============================================
# STAGE 2: Build do Backend (Server)
# ============================================
FROM node:22-alpine AS server-builder

WORKDIR /app

# Copiar package.json e lock files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Instalar pnpm e dependências
RUN npm install -g pnpm@latest && \
    pnpm install --no-frozen-lockfile

# Copiar código fonte do servidor
COPY server ./server
COPY drizzle ./drizzle
COPY shared ./shared
COPY storage ./storage
COPY tsconfig.json ./
COPY vite.config.ts ./

# Build do backend
RUN pnpm run build:server

# ============================================
# STAGE 3: Imagem Final de Produção
# ============================================
FROM node:22-alpine

WORKDIR /app

# Instalar apenas dependências de produção
RUN npm install -g pnpm@latest

# Copiar package.json e instalar apenas prod dependencies
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --prod --no-frozen-lockfile

# Copiar builds do frontend e backend
COPY --from=client-builder /app/dist/public ./dist/public
COPY --from=server-builder /app/dist/server ./dist/server

# Copiar arquivos necessários
COPY drizzle ./drizzle
COPY shared ./shared
COPY storage ./storage
COPY server/_core ./server/_core

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expor porta
EXPOSE 5001

# Variáveis de ambiente padrão
ENV NODE_ENV=production \
    PORT=5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["node", "dist/server/index.js"]
