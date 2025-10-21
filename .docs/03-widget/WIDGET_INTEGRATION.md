# 🎯 GUIA DE INTEGRAÇÃO - Chat Widget Embarcável

**Versão:** v1.2-MVP  
**Data:** 17/10/2025  
**Status:** ✅ **FUNCIONAL**

---

## 📋 **VISÃO GERAL**

O Chat Widget é uma solução embarcável que permite integrar o sistema de chat interno em qualquer aplicação web existente, sem necessidade de refatoração.

### **Características:**
- ✅ **Integração em 2 linhas** de código
- ✅ **Widget flutuante** no canto da tela
- ✅ **Totalmente responsivo** (desktop, tablet, mobile)
- ✅ **Chat em tempo real** via Socket.IO
- ✅ **Autenticação JWT** segura
- ✅ **Customizável** (cores, posição, tema)
- ✅ **Zero conflito** com sistema existente

---

## 🚀 **INTEGRAÇÃO RÁPIDA (2 LINHAS)**

### **Passo 1: Incluir o Script**

```html
<script src="https://chat.empresa.com/chat-widget.js"></script>
```

### **Passo 2: Inicializar**

```html
<script>
  ChatWidget.init({
    token: 'SEU_JWT_TOKEN_AQUI',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

**Pronto! O widget está funcionando! 🎉**

---

## 📦 **BUILD DO WIDGET**

### **Compilar o Widget:**

```bash
cd frontend
npm run build:widget
```

**Output:**
```
dist/widget/
├── chat-widget.iife.js     ← Usar este!
├── chat-widget.umd.js
├── chat-widget.css
└── chat-widget.iife.js.map
```

### **Servir o Widget:**

**Opção 1: CDN**
```html
<script src="https://cdn.empresa.com/chat-widget.js"></script>
```

**Opção 2: Self-hosted**
```html
<script src="/assets/js/chat-widget.js"></script>
```

**Opção 3: Webpack/Vite**
```javascript
import ChatWidget from '@empresa/chat-widget';
```

---

## ⚙️ **CONFIGURAÇÕES**

### **Configuração Básica:**

```javascript
ChatWidget.init({
  // ✅ Obrigatórios
  token: 'eyJhbGciOiJIUzI1NiIs...',
  
  // ⚙️ Opcionais
  apiUrl: 'http://localhost:3000',
  position: 'bottom-right',  // ou 'bottom-left'
  theme: 'light',            // ou 'dark'
  minimized: true
});
```

### **Configuração Avançada:**

```javascript
ChatWidget.init({
  // =============================
  // AUTENTICAÇÃO (obrigatório)
  // =============================
  token: 'eyJhbGciOiJIUzI1NiIs...',
  
  // =============================
  // URLs
  // =============================
  apiUrl: 'https://api.chat.empresa.com',
  socketUrl: 'wss://api.chat.empresa.com', // opcional, default: apiUrl
  
  // =============================
  // APARÊNCIA
  // =============================
  position: 'bottom-right',    // 'bottom-right' | 'bottom-left'
  theme: 'light',              // 'light' | 'dark'
  primaryColor: '#667eea',     // cor customizada
  
  // =============================
  // COMPORTAMENTO
  // =============================
  minimized: true,             // iniciar minimizado
  autoOpen: false,             // abrir automaticamente após X segundos
  showNotifications: true,     // notificações browser
  playSound: true,             // som nas mensagens
  
  // =============================
  // CALLBACKS
  // =============================
  onReady: () => {
    console.log('Widget pronto!');
  },
  
  onMessage: (mensagem) => {
    console.log('Nova mensagem:', mensagem);
    // Ex: atualizar contador no sistema legado
    updateNotificationBadge(mensagem);
  },
  
  onOpen: () => {
    console.log('Widget aberto');
    // Ex: analytics
    gtag('event', 'chat_opened');
  },
  
  onClose: () => {
    console.log('Widget fechado');
  },
  
  // =============================
  // FILTROS (opcional)
  // =============================
  department: 'TI',            // filtrar por departamento
  teamId: 5,                   // filtrar por equipe
  
  // =============================
  // DEBUG
  // =============================
  debug: false                 // modo debug (logs verbosos)
});
```

---

## 🎨 **CUSTOMIZAÇÃO**

### **1. Cores Customizadas**

```javascript
ChatWidget.init({
  token: 'xxx',
  primaryColor: '#FF5733',      // laranja
  secondaryColor: '#C70039',    // vermelho escuro
  textColor: '#FFFFFF',
  backgroundColor: '#000000'
});
```

### **2. Posição**

```javascript
// Canto inferior direito (padrão)
ChatWidget.init({ position: 'bottom-right' });

// Canto inferior esquerdo
ChatWidget.init({ position: 'bottom-left' });
```

### **3. Tema Escuro**

```javascript
ChatWidget.init({
  token: 'xxx',
  theme: 'dark',
  primaryColor: '#1e1e1e',
  textColor: '#ffffff'
});
```

---

## 🔧 **API JAVASCRIPT**

### **Métodos Disponíveis:**

```javascript
// Inicializar widget
ChatWidget.init({ token: 'xxx' });

// Abrir widget
ChatWidget.open();

// Fechar/minimizar widget
ChatWidget.close();

// Destruir widget (remover completamente)
ChatWidget.destroy();

// Obter instância atual
const instance = ChatWidget.getInstance();

// Verificar se está aberto
const isOpen = instance.isExpanded;

// Obter total de mensagens não lidas
const unread = instance.totalNaoLidas;
```

---

## 🔐 **AUTENTICAÇÃO**

### **Como Obter o Token JWT?**

**Opção 1: Endpoint Dedicado (Recomendado)**

```php
// sistema-legado.php
<?php
session_start();

// Fazer request ao backend do chat
$response = file_get_contents('https://api.chat.empresa.com/api/auth/generate-widget-token', [
  'http' => [
    'method' => 'POST',
    'header' => 'Content-Type: application/json',
    'content' => json_encode([
      'user_id' => $_SESSION['user_id'],
      'email' => $_SESSION['email'],
      'api_key' => 'SUA_API_KEY_SECRETA'
    ])
  ]
]);

$data = json_decode($response, true);
$jwt_token = $data['token'];
?>

<script>
  ChatWidget.init({
    token: '<?php echo $jwt_token; ?>',
    apiUrl: 'https://api.chat.empresa.com'
  });
</script>
```

**Opção 2: SSO/OAuth**

```javascript
// Após login no sistema legado
fetch('https://sso.empresa.com/chat-token', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${systemToken}` }
})
.then(res => res.json())
.then(data => {
  ChatWidget.init({
    token: data.chat_token,
    apiUrl: 'https://api.chat.empresa.com'
  });
});
```

**Opção 3: Token Existente**

```javascript
// Se o sistema já usa JWT
const chatToken = localStorage.getItem('auth_token');

ChatWidget.init({
  token: chatToken,
  apiUrl: 'https://api.chat.empresa.com'
});
```

---

## 🌐 **EXEMPLOS DE INTEGRAÇÃO**

### **1. PHP Legacy**

```php
<!DOCTYPE html>
<html>
<head>
  <title>ERP Empresa</title>
</head>
<body>
  <!-- Conteúdo do ERP -->
  <h1>Bem-vindo ao ERP</h1>
  
  <!-- Widget de Chat -->
  <script src="https://cdn.empresa.com/chat-widget.js"></script>
  <script>
    ChatWidget.init({
      token: '<?php echo $_SESSION['chat_token']; ?>',
      apiUrl: 'https://api.chat.empresa.com',
      position: 'bottom-right',
      onMessage: function(msg) {
        // Atualizar badge no menu do ERP
        updateChatBadge(msg);
      }
    });
  </script>
</body>
</html>
```

### **2. WordPress**

```php
// functions.php
function add_chat_widget() {
  if (is_user_logged_in()) {
    $user = wp_get_current_user();
    $token = generate_chat_token($user->ID);
    ?>
    <script src="https://cdn.empresa.com/chat-widget.js"></script>
    <script>
      ChatWidget.init({
        token: '<?php echo $token; ?>',
        apiUrl: 'https://api.chat.empresa.com'
      });
    </script>
    <?php
  }
}
add_action('wp_footer', 'add_chat_widget');
```

### **3. React/Vue/Angular**

```javascript
// App.jsx (React)
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Carregar script dinamicamente
    const script = document.createElement('script');
    script.src = 'https://cdn.empresa.com/chat-widget.js';
    script.onload = () => {
      window.ChatWidget.init({
        token: localStorage.getItem('token'),
        apiUrl: 'https://api.chat.empresa.com',
        onMessage: (msg) => {
          console.log('Nova mensagem:', msg);
        }
      });
    };
    document.body.appendChild(script);
    
    return () => {
      window.ChatWidget?.destroy();
    };
  }, []);
  
  return <div className="app">...</div>;
}
```

### **4. HTML Estático**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Portal Intranet</title>
</head>
<body>
  <h1>Portal Interno</h1>
  
  <!-- Chat Widget -->
  <script src="https://cdn.empresa.com/chat-widget.js"></script>
  <script>
    ChatWidget.init({
      token: 'TOKEN_ESTATICO_DEMO', // Não fazer em produção!
      apiUrl: 'https://api.chat.empresa.com'
    });
  </script>
</body>
</html>
```

---

## 🔒 **SEGURANÇA**

### **CORS - Whitelist de Domínios**

```javascript
// backend/.env
CORS_ORIGIN=https://erp.empresa.com,https://portal.empresa.com,https://intranet.empresa.com
```

### **Validação de Token**

O backend valida automaticamente:
- ✅ Assinatura JWT
- ✅ Expiração
- ✅ Issuer
- ✅ User ID
- ✅ Instância ID

### **Boas Práticas**

❌ **NÃO FAZER:**
```javascript
// Token hardcoded no código
ChatWidget.init({ token: 'eyJhbGc...' });
```

✅ **FAZER:**
```javascript
// Token gerado dinamicamente no servidor
ChatWidget.init({ token: '<?php echo $dynamic_token; ?>' });
```

---

## 📱 **RESPONSIVIDADE**

O widget se adapta automaticamente:

- **Desktop (> 768px):**
  - Width: 400px
  - Height: 600px
  - Posição: canto inferior

- **Tablet (768px - 1024px):**
  - Width: 90%
  - Height: 80%
  - Centralizado

- **Mobile (< 768px):**
  - Width: 100%
  - Height: 100%
  - Tela cheia

---

## 🐛 **TROUBLESHOOTING**

### **Widget não aparece**

```javascript
// 1. Verificar console
console.log(window.ChatWidget); // Deve estar definido

// 2. Verificar token
console.log('Token:', token);

// 3. Verificar CORS
// Abrir Network tab e procurar erros CORS
```

### **Erro de CORS**

```
Access-Control-Allow-Origin error
```

**Solução:** Adicionar domínio no backend `.env`:
```
CORS_ORIGIN=https://seu-dominio.com
```

### **Token Inválido**

```
401 Unauthorized
```

**Solução:** Verificar:
- Token está correto
- Token não expirou
- Usuário existe no sistema

### **Socket.IO não conecta**

```
WebSocket connection failed
```

**Solução:**
- Verificar firewall
- Verificar se backend está rodando
- Verificar URL do Socket.IO

---

## 📊 **PERFORMANCE**

### **Tamanho do Bundle:**

- `chat-widget.iife.js`: ~150KB (minificado)
- `chat-widget.css`: ~10KB
- **Total:** ~160KB

### **Otimizações:**

- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minificação
- ✅ Gzip/Brotli
- ✅ Lazy loading de componentes

---

## 📚 **RECURSOS**

- **Documentação Completa:** [README.md](./README.md)
- **API Reference:** [API_TESTS.md](./backend/API_TESTS.md)
- **Demo:** [widget-demo.html](./frontend/public/widget-demo.html)
- **GitHub:** https://github.com/zanon-alive/chat-interno

---

## 🆘 **SUPORTE**

**Dúvidas?**
- Email: suporte@empresa.com
- Slack: #chat-widget
- GitHub Issues: https://github.com/zanon-alive/chat-interno/issues

---

**Desenvolvido:** 17/10/2025  
**Versão:** v1.2-MVP  
**Status:** ✅ **PRONTO PARA USO!**

🎉 **Integração simplificada, chat profissional!** 🎉

