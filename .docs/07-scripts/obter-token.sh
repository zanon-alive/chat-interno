#!/bin/bash

# Script para obter token JWT válido
# Uso: ./obter-token.sh [email] [senha]

EMAIL="${1:-joao.silva@empresademo.com}"
SENHA="${2:-Admin@123456}"
API_URL="${3:-http://localhost:3000}"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🔑 OBTER TOKEN JWT VÁLIDO                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🔐 Fazendo login..."
echo "   Email: $EMAIL"
echo "   API: $API_URL/api/auth/login"
echo ""

# Fazer requisição de login
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"senha\": \"$SENHA\"
  }")

# Verificar se teve sucesso
if echo "$RESPONSE" | grep -q '"token"'; then
  # Extrair token do JSON
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  
  echo "✅ Login bem-sucedido!"
  echo ""
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║                     🎉 TOKEN OBTIDO                            ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "$TOKEN"
  echo ""
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║                  📋 COMO USAR NO WIDGET                        ║"
  echo "╠════════════════════════════════════════════════════════════════╣"
  echo "║                                                                ║"
  echo "║  1. Copie o token acima (Ctrl+Shift+C)                         ║"
  echo "║                                                                ║"
  echo "║  2. Abra: exemplo-dashboard.html                               ║"
  echo "║                                                                ║"
  echo "║  3. Procure a linha:                                           ║"
  echo "║     const chatToken = 'eyJhbGc...';                            ║"
  echo "║                                                                ║"
  echo "║  4. Substitua pelo token acima                                 ║"
  echo "║                                                                ║"
  echo "║  5. Salve e recarregue a página                                ║"
  echo "║                                                                ║"
  echo "║  6. Widget funcionará com backend online! 🎉                   ║"
  echo "║                                                                ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo ""
  
  # Salvar token em arquivo
  echo "$TOKEN" > .widget-token.txt
  echo "💾 Token salvo em: .widget-token.txt"
  echo ""
  
  # Informações do usuário
  NOME=$(echo "$RESPONSE" | grep -o '"nome_completo":"[^"]*' | sed 's/"nome_completo":"//')
  NIVEL=$(echo "$RESPONSE" | grep -o '"nivel_permissao":"[^"]*' | sed 's/"nivel_permissao":"//')
  
  echo "👤 Usuário: $NOME"
  echo "🔑 Nível: $NIVEL"
  echo "⏰ Expira em: 24 horas"
  echo ""
  
else
  echo "❌ Erro ao fazer login!"
  echo ""
  echo "Resposta do servidor:"
  echo "$RESPONSE"
  echo ""
  echo "💡 Verifique:"
  echo "   • Backend está rodando? (cd backend && npm run dev)"
  echo "   • Email e senha corretos?"
  echo "   • URL da API correta?"
  echo ""
  echo "Uso: ./obter-token.sh [email] [senha] [api_url]"
  echo "Exemplo: ./obter-token.sh pedro@empresa.com User@123456 http://localhost:3000"
fi

echo ""

