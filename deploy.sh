#!/bin/bash

# ============================================
# Script de Deploy - Corretor das Mansões
# ============================================

set -e  # Exit on error

echo "🚀 Iniciando deploy do projeto..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}📝 Copie .env.example para .env e configure as variáveis${NC}"
    exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    exit 1
fi

# Parar containers existentes
echo -e "${BLUE}🛑 Parando containers existentes...${NC}"
docker-compose down

# Remover imagens antigas (opcional - descomente se necessário)
# echo -e "${BLUE}🗑️  Removendo imagens antigas...${NC}"
# docker-compose rm -f
# docker rmi casadf-app:latest || true

# Build das imagens
echo -e "${BLUE}🏗️  Buildando imagens Docker...${NC}"
docker-compose build --no-cache

# Iniciar containers
echo -e "${BLUE}🚀 Iniciando containers...${NC}"
docker-compose up -d

# Aguardar containers ficarem saudáveis
echo -e "${BLUE}⏳ Aguardando containers ficarem saudáveis...${NC}"
sleep 10

# Verificar status dos containers
echo -e "${BLUE}📊 Status dos containers:${NC}"
docker-compose ps

# Verificar logs
echo -e "${BLUE}📝 Últimos logs:${NC}"
docker-compose logs --tail=50

# Verificar se aplicação está respondendo
echo -e "${BLUE}🔍 Verificando aplicação...${NC}"
if curl -f http://localhost:5001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Aplicação está rodando!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}📍 URLs:${NC}"
    echo "  - Aplicação: http://localhost:5001"
    echo "  - "
    echo ""
    echo -e "${BLUE}📝 Comandos úteis:${NC}"
    echo "  - Ver logs: docker-compose logs -f"
    echo "  - Parar: docker-compose down"
    echo "  - Reiniciar: docker-compose restart"
else
    echo -e "${RED}❌ Aplicação não está respondendo!${NC}"
    echo -e "${YELLOW}📝 Verifique os logs: docker-compose logs${NC}"
    exit 1
fi
