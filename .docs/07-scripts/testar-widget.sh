#!/bin/bash

# Script de teste do Widget de Chat
# Autor: Chat Interno
# Data: 17/10/2025

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          🧪 TESTE AUTOMÁTICO DO WIDGET DE CHAT                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de verificação
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2 - Arquivo não encontrado: $1"
        return 1
    fi
}

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅${NC} $1 instalado"
        return 0
    else
        echo -e "${RED}❌${NC} $1 não encontrado"
        return 1
    fi
}

echo -e "${BLUE}[1/5]${NC} Verificando dependências..."
echo ""

check_command "node"
check_command "npm"
check_command "python3"

echo ""
echo -e "${BLUE}[2/5]${NC} Verificando arquivos do projeto..."
echo ""

check_file "frontend/package.json" "package.json existe"
check_file "frontend/src/widget/index.js" "Widget index.js existe"
check_file "frontend/vite.config.widget.js" "Vite config widget existe"
check_file "exemplo-dashboard.html" "Dashboard exemplo existe"

echo ""
echo -e "${BLUE}[3/5]${NC} Verificando build do widget..."
echo ""

if [ -f "frontend/dist/widget/chat-widget.iife.js" ]; then
    SIZE=$(du -h frontend/dist/widget/chat-widget.iife.js | cut -f1)
    echo -e "${GREEN}✅${NC} Widget já compilado (${SIZE})"
else
    echo -e "${YELLOW}⚠️${NC}  Widget não compilado. Compilando agora..."
    echo ""
    cd frontend
    npm run build:widget
    cd ..
    echo ""
    
    if [ -f "frontend/dist/widget/chat-widget.iife.js" ]; then
        SIZE=$(du -h frontend/dist/widget/chat-widget.iife.js | cut -f1)
        echo -e "${GREEN}✅${NC} Widget compilado com sucesso! (${SIZE})"
    else
        echo -e "${RED}❌${NC} Falha ao compilar widget"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}[4/5]${NC} Verificando se backend está rodando..."
echo ""

if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Backend está ONLINE (http://localhost:3000)"
    BACKEND_STATUS="online"
else
    echo -e "${YELLOW}⚠️${NC}  Backend está OFFLINE"
    echo -e "${YELLOW}💡${NC}  Widget funcionará em modo offline (demonstração)"
    BACKEND_STATUS="offline"
fi

echo ""
echo -e "${BLUE}[5/5]${NC} Iniciando servidor HTTP..."
echo ""

# Verificar se porta 8080 está livre
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️${NC}  Porta 8080 já está em uso"
    echo -e "${YELLOW}💡${NC}  Usando porta 8081"
    PORT=8081
else
    PORT=8080
fi

echo -e "${GREEN}✅${NC} Iniciando servidor na porta ${PORT}..."
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     🎉 TUDO PRONTO!                            ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  🌐 Abra no navegador:                                         ║"
echo "║     http://localhost:${PORT}/exemplo-dashboard.html              ║"
echo "║                                                                ║"
if [ "$BACKEND_STATUS" = "online" ]; then
echo "║  ✅ Backend: ONLINE                                            ║"
echo "║     Widget funcionará NORMALMENTE                              ║"
else
echo "║  ⚠️  Backend: OFFLINE                                          ║"
echo "║     Widget mostrará estado offline                             ║"
echo "║                                                                ║"
echo "║  💡 Para testar online, em outro terminal:                     ║"
echo "║     cd backend && npm run dev                                  ║"
fi
echo "║                                                                ║"
echo "║  🛑 Para parar: Ctrl+C                                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Iniciar servidor
python3 -m http.server $PORT

