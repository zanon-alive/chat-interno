# 🔑 COMO GERAR TOKEN VÁLIDO PARA O WIDGET

**Versão:** v1.3-MVP  
**Data:** 17/10/2025

---

## 🎯 **MÉTODOS PARA OBTER TOKEN**

### **Método 1: Script Automatizado (MAIS FÁCIL)** ⭐

```bash
./obter-token.sh
```

**O que faz:**
- ✅ Faz login automaticamente
- ✅ Obtém token JWT válido
- ✅ Mostra o token no terminal
- ✅ Salva em `.widget-token.txt`
- ✅ Mostra instruções de uso

**Usuário padrão:** pedro.oliveira@empresademo.com / User@123456

**Para outro usuário:**
```bash
./obter-token.sh admin@chatinterno.com Admin@123456
```

**Output:**
```
✅ Login bem-sucedido!

╔════════════════════════════════════════════════════════════════╗
║                     🎉 TOKEN OBTIDO                            ║
╚════════════════════════════════════════════════════════════════╝

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mix...

👤 Usuário: Pedro Oliveira
🔑 Nível: usuario
⏰ Expira em: 24 horas
```

---

### **Método 2: cURL Manual**

```bash
# Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pedro.oliveira@empresademo.com",
    "senha": "User@123456"
  }'

# Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... }
}
```

**Copie o valor de `token`**

---

### **Método 3: Frontend (Navegador)**

```bash
# 1. Abra o sistema principal
http://localhost:5173

# 2. Faça login
pedro.oliveira@empresademo.com / User@123456

# 3. Abra Console (F12)
localStorage.getItem('token')

# 4. Copie o token exibido
```

---

### **Método 4: Postman/Insomnia**

**Request:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "pedro.oliveira@empresademo.com",
  "senha": "User@123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc..."
}
```

---

## 🔧 **COMO USAR O TOKEN NO WIDGET**

### **Opção 1: Atualizar exemplo-dashboard.html**

```javascript
// 1. Abra: exemplo-dashboard.html

// 2. Procure a linha (~536):
const chatToken = 'eyJhbGc...ANTIGO...';

// 3. Substitua pelo novo token:
const chatToken = 'eyJhbGc...NOVO_TOKEN_AQUI...';

// 4. Salve e recarregue a página
```

---

### **Opção 2: Token Dinâmico (Produção)**

```php
<!-- sistema-legado.php -->
<?php
// Seu sistema faz login e obtém token
$chat_token = obter_token_chat($_SESSION['user_id']);
?>

<script>
  ChatWidget.init({
    token: '<?php echo $chat_token; ?>',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

---

## 🧪 **TESTE COMPLETO (Backend Online)**

### **Passo a Passo:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Obter Token
./obter-token.sh

# Copie o token exibido

# Terminal 3 - Servidor HTTP
python3 -m http.server 8080
```

**Edite exemplo-dashboard.html:**
1. Abra o arquivo
2. Linha ~536: `const chatToken = '...'`
3. Cole o novo token
4. Salve

**Abra navegador:**
```
http://localhost:8080/exemplo-dashboard.html
```

**Resultado:**
```
✅ Widget aparece
✅ Conecta ao backend
✅ Carrega conversas
✅ Preview funciona
✅ Chat completo funciona
✅ Mensagens tempo real
```

---

## 👥 **TOKENS DISPONÍVEIS**

| Usuário | Email | Senha | Nível |
|---------|-------|-------|-------|
| Super Admin | admin@chatinterno.com | Admin@123456 | super_admin |
| Admin Cliente | joao.silva@empresademo.com | Admin@123456 | admin_cliente |
| Gestor | maria.santos@empresademo.com | User@123456 | gestor |
| Pedro | pedro.oliveira@empresademo.com | User@123456 | usuario |
| Ana | ana.costa@empresademo.com | User@123456 | usuario |

**Para obter token de qualquer um:**
```bash
./obter-token.sh EMAIL SENHA
```

---

## 🔄 **RENOVAR TOKEN EXPIRADO**

Token expira em **24 horas**. Para renovar:

```bash
# Opção 1: Script
./obter-token.sh

# Opção 2: Login novamente
# Frontend: http://localhost:5173
# Faça login e copie novo token

# Opção 3: API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "pedro@...", "senha": "..."}'
```

---

## 💡 **DICAS**

### **1. Salvar Token para Reutilizar**

```bash
# O script já salva automaticamente
./obter-token.sh

# Token salvo em:
cat .widget-token.txt
```

### **2. Usar em Variável de Ambiente**

```bash
# Exportar
export CHAT_TOKEN=$(./obter-token.sh | grep eyJ)

# Usar
echo $CHAT_TOKEN
```

### **3. Automatizar Atualização**

```javascript
// exemplo-dashboard.html
// Buscar token do sistema
fetch('/api/obter-token-chat')
  .then(res => res.json())
  .then(data => {
    ChatWidget.init({
      token: data.token,
      apiUrl: 'http://localhost:3000'
    });
  });
```

---

## 🚨 **TROUBLESHOOTING**

### **Erro: "Token inválido"**

**Causas:**
1. Token expirou (> 24h)
2. Token está incorreto
3. Usuário foi deletado
4. Instância mudou

**Solução:**
```bash
# Gerar novo token
./obter-token.sh
```

---

### **Erro: "invalid signature"**

**Causa:** Token foi gerado com outro `JWT_SECRET`

**Solução:**
1. Verificar `.env` do backend
2. Gerar novo token com backend atual
3. Usar `./obter-token.sh`

---

### **Backend não responde**

```bash
# Verificar se está rodando
curl http://localhost:3000/api/health

# Se não responder:
cd backend && npm run dev
```

---

## 📋 **RESUMO**

### **Para Token Válido:**

**1 comando:**
```bash
./obter-token.sh
```

**3 passos:**
1. Copie o token
2. Cole em `exemplo-dashboard.html` (linha ~536)
3. Recarregue a página

**Resultado:**
```
✅ Widget funciona com backend online
✅ Preview de conversas
✅ Chat completo
✅ Mensagens tempo real
```

---

## 🎯 **EXEMPLO COMPLETO**

### **Terminal:**
```bash
# 1. Backend
cd backend && npm run dev

# 2. Obter token (em outro terminal)
cd /home/zanonr/desenvolvimento/chat-interno
./obter-token.sh

# Output:
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mix...
```

### **exemplo-dashboard.html:**
```javascript
// Linha ~536
const chatToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mix...'; // ← Cole aqui
```

### **Teste:**
```bash
python3 -m http.server 8080
# Abra: http://localhost:8080/exemplo-dashboard.html
```

**Pronto!** ✅

---

**Última Atualização:** 17/10/2025  
**Status:** ✅ **TOKEN VÁLIDO OBTIDO**

🔑 **Use:** `./obter-token.sh`

