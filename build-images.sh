#!/bin/bash

# Script para buildar imagens Docker para deploy no Portainer
# Uso: ./build-images.sh [tag]

set -e

TAG=${1:-latest}

echo ""
echo "████████████████████████████████████████████████████████"
echo "  🐳 Building Docker Images - Chat Interno"
echo "████████████████████████████████████████████████████████"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Carregar variáveis do stack.env
if [ -f stack.env ]; then
    echo -e "${BLUE}📋 Carregando variáveis do stack.env...${NC}"
    set -a
    source stack.env
    set +a
fi

# Build Backend
echo ""
echo -e "${BLUE}🔨 Building Backend Image...${NC}"
docker build \
    -t chat-interno-backend:${TAG} \
    -f backend/Dockerfile \
    ./backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend image built successfully!${NC}"
else
    echo "❌ Error building backend image"
    exit 1
fi

# Build Frontend
echo ""
echo -e "${BLUE}🔨 Building Frontend Image...${NC}"
docker build \
    -t chat-interno-frontend:${TAG} \
    --build-arg VITE_API_URL=${VITE_API_URL:-http://localhost:3000/api} \
    --build-arg VITE_SOCKET_URL=${VITE_SOCKET_URL:-http://localhost:3000} \
    -f frontend/Dockerfile \
    ./frontend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend image built successfully!${NC}"
else
    echo "❌ Error building frontend image"
    exit 1
fi

# Listar imagens
echo ""
echo -e "${BLUE}📦 Images built:${NC}"
docker images | grep chat-interno

echo ""
echo "████████████████████████████████████████████████████████"
echo -e "  ${GREEN}✅ Build complete!${NC}"
echo "████████████████████████████████████████████████████████"
echo ""
echo "Next steps:"
echo "1. Test locally:"
echo "   docker-compose -f docker-compose.portainer.yml up"
echo ""
echo "2. Tag for registry (if needed):"
echo "   docker tag chat-interno-backend:${TAG} your-registry/chat-interno-backend:${TAG}"
echo "   docker tag chat-interno-frontend:${TAG} your-registry/chat-interno-frontend:${TAG}"
echo ""
echo "3. Push to registry (if needed):"
echo "   docker push your-registry/chat-interno-backend:${TAG}"
echo "   docker push your-registry/chat-interno-frontend:${TAG}"
echo ""
echo "4. Deploy on Portainer:"
echo "   - Use docker-compose.portainer.yml"
echo "   - Update image names in Portainer if using a registry"
echo ""

