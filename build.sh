#!/bin/bash

# ============================================
# Script de Build - Corretor das Mansões
# ============================================

set -e  # Exit on error

echo "🏗️  Iniciando build do projeto..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm não está instalado. Instalando...${NC}"
    npm install -g pnpm
fi

# Limpar builds anteriores
echo -e "${BLUE}🧹 Limpando builds anteriores...${NC}"
rm -rf dist
rm -rf node_modules/.vite

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
pnpm install --frozen-lockfile

# Executar migrations do banco de dados
echo -e "${BLUE}🗄️  Executando migrations do banco de dados...${NC}"
pnpm db:push

# Build do cliente (frontend)
echo -e "${BLUE}⚛️  Buildando frontend...${NC}"
pnpm run build:client

# Build do servidor (backend)
echo -e "${BLUE}🚀 Buildando backend...${NC}"
pnpm run build:server

# Verificar se builds foram criados
if [ ! -d "dist/client" ]; then
    echo -e "${RED}❌ Build do cliente falhou!${NC}"
    exit 1
fi

if [ ! -d "dist/server" ]; then
    echo -e "${RED}❌ Build do servidor falhou!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
echo ""
echo -e "${BLUE}📊 Estatísticas:${NC}"
echo "  - Cliente: $(du -sh dist/client | cut -f1)"
echo "  - Servidor: $(du -sh dist/server | cut -f1)"
echo ""
echo -e "${GREEN}🎉 Projeto pronto para deploy!${NC}"
