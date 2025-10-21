# 🔑 GERENCIAMENTO DE TOKENS DE WIDGET

**Versão:** v1.4-MVP  
**Data:** 17/10/2025  
**Status:** ✅ **IMPLEMENTADO E FUNCIONAL**

---

## 📋 **VISÃO GERAL**

Sistema completo para gerenciar tokens JWT permanentes que permitem que usuários acessem o widget de chat em sistemas legados.

### **Problema Resolvido:**
- ✅ Sistema legado não precisa gerenciar autenticação
- ✅ Token pode ser sempre válido (nunca expira)
- ✅ Admin controla tokens centralizadamente
- ✅ Fácil integração (copiar/colar)

---

## 🎯 **COMO USAR (ADMINISTRADOR)**

### **Passo 1: Acessar Gerenciamento de Usuários**

```bash
# 1. Login como Admin
http://localhost:5173/login
Email: joao.silva@empresademo.com
Senha: Admin@123456

# 2. Ir para Usuários
Menu → Gerenciar Usuários
```

### **Passo 2: Gerar Token de Widget**

```
1. Localizar usuário na tabela
   Ex: Pedro Oliveira

2. Clicar no botão: 🔑 Token Widget

3. Modal abre com opções:
   ┌────────────────────────────────┐
   │ 🔑 Token para Widget          │
   ├────────────────────────────────┤
   │                               │
   │ Gerar Novo Token:             │
   │                               │
   │ ☑ Sempre Válido               │
   │   (token nunca expira)         │
   │                               │
   │ Ou:                           │
   │ Validade: [1 ano ▼]           │
   │                               │
   │ [Gerar Token]                 │
   └────────────────────────────────┘

4. Marcar "Sempre Válido" (recomendado para widget)

5. Clicar "Gerar Token"

6. Token aparece:
   ┌────────────────────────────────┐
   │ Token Atual:                  │
   │ eyJhbGc...            📋 Copiar│
   │                               │
   │ Gerado em: 17/10/2025 10:30   │
   │ ✅ Sempre Válido              │
   └────────────────────────────────┘

7. Clicar "📋 Copiar"

8. ✅ Token copiado!
```

---

## 💻 **COMO USAR (SISTEMA LEGADO)**

### **Método 1: Token Fixo (Simples)**

```php
<!-- sistema-legado.php -->
<?php
// Token obtido do admin (nunca expira)
$widgetToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
?>

<script src="chat-widget.js"></script>
<script>
  ChatWidget.init({
    token: '<?php echo $widgetToken; ?>',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

**Vantagens:**
- ✅ Super simples
- ✅ Funciona sempre
- ✅ Apenas 2 linhas

**Desvantagens:**
- ⚠️ Todos usuários logam como mesmo user do chat
- ⚠️ Menos seguro

---

### **Método 2: Token por Usuário (Recomendado)**

```php
<!-- sistema-legado.php -->
<?php
session_start();

// Mapear usuário do sistema legado → usuário do chat
$mapeamento = [
  'joao@erp.com' => 'eyJhbGc...token_joao...',
  'maria@erp.com' => 'eyJhbGc...token_maria...',
  'pedro@erp.com' => 'eyJhbGc...token_pedro...'
];

$userEmail = $_SESSION['user_email'];
$widgetToken = $mapeamento[$userEmail] ?? null;

if (!$widgetToken) {
  die('Usuário não tem acesso ao chat');
}
?>

<script src="chat-widget.js"></script>
<script>
  ChatWidget.init({
    token: '<?php echo $widgetToken; ?>',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

**Vantagens:**
- ✅ Cada usuário logado com sua conta
- ✅ Histórico individualizado
- ✅ Mais seguro

**Desvantagens:**
- ⚠️ Precisa mapear usuários
- ⚠️ Gerar token para cada um

---

### **Método 3: Token Dinâmico (Avançado)**

```php
<!-- sistema-legado.php -->
<?php
// Buscar token do banco de dados
$userId = $_SESSION['user_id'];
$token = buscarTokenWidget($userId); // Sua função

if (!$token) {
  // Gerar token via API
  $token = gerarTokenViaAPI($userId);
}
?>

<script src="chat-widget.js"></script>
<script>
  ChatWidget.init({
    token: '<?php echo $token; ?>',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

---

## 🔧 **API ENDPOINTS**

### **1. Gerar Token**

```http
POST /api/admin/usuarios/:id/gerar-token-widget
Authorization: Bearer {token_admin}

Body:
{
  "sempre_valido": true,
  "dias_expiracao": 365
}

Response:
{
  "success": true,
  "message": "Token de widget gerado com sucesso",
  "data": {
    "token": "eyJhbGc...",
    "expira_em": "2026-10-17T10:30:00.000Z",
    "sempre_valido": true,
    "gerado_em": "2025-10-17T10:30:00.000Z"
  }
}
```

---

### **2. Obter Token Existente**

```http
GET /api/admin/usuarios/:id/token-widget
Authorization: Bearer {token_admin}

Response (com token):
{
  "success": true,
  "data": {
    "tem_token": true,
    "token": "eyJhbGc...",
    "expira_em": null,
    "sempre_valido": true,
    "gerado_em": "2025-10-17T10:30:00.000Z"
  }
}

Response (sem token):
{
  "success": true,
  "data": {
    "tem_token": false
  }
}
```

---

### **3. Revogar Token**

```http
DELETE /api/admin/usuarios/:id/token-widget
Authorization: Bearer {token_admin}

Response:
{
  "success": true,
  "message": "Token revogado com sucesso"
}
```

---

## 📊 **OPÇÕES DE VALIDADE**

| Opção | Dias | Uso Recomendado |
|-------|------|-----------------|
| 7 dias | 7 | Testes rápidos |
| 30 dias | 30 | Testes prolongados |
| 90 dias | 90 | Homologação |
| **1 ano** | 365 | **Produção normal** |
| 2 anos | 730 | Produção longo prazo |
| **Sempre Válido** | ∞ | **Widget em sistema legado** ⭐ |

---

## 🔒 **SEGURANÇA**

### **Boas Práticas:**

✅ **FAZER:**
- Usar "Sempre Válido" apenas para widgets em sistemas legados controlados
- Gerar 1 token por usuário/sistema
- Revogar tokens não utilizados
- Monitorar uso de tokens

❌ **NÃO FAZER:**
- Compartilhar token entre múltiplos usuários
- Enviar token por email sem criptografia
- Hardcode token em código público
- Deixar tokens antigos ativos

### **Revogar Token:**

Quando revogar:
- ✅ Usuário saiu da empresa
- ✅ Sistema legado não usa mais
- ✅ Suspeita de vazamento
- ✅ Trocar por token novo

---

## 📖 **EXEMPLOS DE USO**

### **Exemplo 1: Portal Intranet**

```html
<!-- intranet.html -->
<script src="https://cdn.empresa.com/chat-widget.js"></script>
<script>
  // Token sempre válido gerado para usuário "portal"
  ChatWidget.init({
    token: 'eyJhbGc...token_portal_sempre_valido...',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

---

### **Exemplo 2: ERP com Múltiplos Usuários**

```php
<?php
// Mapear usuário ERP → Token Chat
$tokens = [
  1 => 'eyJhbGc...token_joao...',    // João
  2 => 'eyJhbGc...token_maria...',   // Maria
  3 => 'eyJhbGc...token_pedro...'    // Pedro
];

$userId = $_SESSION['user_id'];
$token = $tokens[$userId];
?>

<script src="chat-widget.js"></script>
<script>
  ChatWidget.init({
    token: '<?php echo $token; ?>',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

---

### **Exemplo 3: Banco de Dados**

```php
<?php
// Buscar token do banco
$sql = "SELECT widget_token FROM usuarios_chat WHERE erp_user_id = ?";
$token = $db->query($sql, [$_SESSION['user_id']])->widget_token;

if (!$token) {
  echo "Usuário não tem acesso ao chat";
  exit;
}
?>

<script src="chat-widget.js"></script>
<script>
  ChatWidget.init({
    token: '<?php echo $token; ?>',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

---

## 🧪 **TESTE COMPLETO**

### **Teste 1: Gerar Token**

```bash
# 1. Login como Admin
http://localhost:5173

# 2. Usuários → 🔑 Token Widget (Pedro)

# 3. Marcar "Sempre Válido"

# 4. Gerar Token

# 5. Copiar token

# ✅ Token copiado!
```

---

### **Teste 2: Usar Token no Widget**

```bash
# 1. Cole token em exemplo-dashboard.html (linha 536)

# 2. python3 -m http.server 8080

# 3. http://localhost:8080/exemplo-dashboard.html

# ✅ Widget funciona!
```

---

### **Teste 3: Revogar Token**

```bash
# 1. Admin → Usuários → 🔑 Token Widget

# 2. Clicar "🗑️ Revogar Token"

# 3. Confirmar

# 4. Recarregar exemplo-dashboard.html

# ✅ Widget mostra "Token inválido"
```

---

## 📊 **BANCO DE DADOS**

### **Tabela `usuarios`:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `widget_token` | VARCHAR(500) | Token JWT |
| `widget_token_expira_em` | TIMESTAMP | Data expiração (null = nunca) |
| `widget_token_sempre_valido` | BOOLEAN | Se nunca expira |
| `widget_token_gerado_em` | TIMESTAMP | Quando foi gerado |

### **Exemplo de Registro:**

```sql
UPDATE usuarios SET
  widget_token = 'eyJhbGc...',
  widget_token_expira_em = NULL,
  widget_token_sempre_valido = 1,
  widget_token_gerado_em = '2025-10-17 10:30:00'
WHERE id = 2;
```

---

## ✅ **RESUMO**

### **Funcionalidades:**

✅ Gerar token via interface  
✅ Configurar expiração (7 dias a sempre)  
✅ Checkbox "Sempre Válido"  
✅ Visualizar token gerado  
✅ Copiar com 1 clique  
✅ Revogar token  
✅ Validação automática  
✅ Instruções de uso  

### **Arquivos:**

**Backend (4 novos):**
- migrations/20251017020000-add-user-widget-token.js
- services/widgetTokenService.js
- controllers/admin/usuarioWidgetController.js
- routes/admin.routes.js (atualizado)

**Frontend (2 novos):**
- components/admin/TokenWidgetModal.vue
- views/admin/Usuarios.vue (atualizado)

---

## 🎯 **PRÓXIMO PASSO**

### **Para Administradores:**
```bash
# 1. Acesse sistema
http://localhost:5173

# 2. Login Admin
joao.silva@empresademo.com / Admin@123456

# 3. Usuários → 🔑 Token Widget

# 4. Gere tokens!
```

### **Para Desenvolvedores:**
```
Integre tokens gerados em seus sistemas legados!
```

---

**Commits:** 55  
**Status:** ✅ **FUNCIONAL**

🔑 **Gerenciamento completo de tokens de widget!** 🔑

