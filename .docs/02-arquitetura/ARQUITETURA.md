# Arquitetura do Sistema - Chat Interno

## 1. Visão Geral da Arquitetura

### 1.1 Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Painel     │  │    Painel    │  │   Interface  │      │
│  │ Super Admin  │  │    Admin     │  │     Chat     │      │
│  │  (Vue.js)    │  │   Cliente    │  │   Usuário    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS/WSS
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      CAMADA DE APLICAÇÃO                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            API Gateway / Load Balancer               │   │
│  │                 (Nginx - futuro)                     │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│  ┌───────────────────────┴──────────────────────────────┐   │
│  │           Node.js + Express.js + Socket.IO           │   │
│  │                                                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Auth     │  │  Business  │  │  WebSocket │    │   │
│  │  │ Middleware │  │   Logic    │  │  Handlers  │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                     CAMADA DE PERSISTÊNCIA                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │   PostgreSQL     │        │   Redis (futuro) │          │
│  │  (Dados Rel.)    │        │    (Cache/Session)│          │
│  └──────────────────┘        └──────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Padrão Arquitetural

**Arquitetura em Camadas (Layered Architecture)**

1. **Camada de Apresentação** - Frontend Vue.js
2. **Camada de Aplicação** - API REST + WebSocket
3. **Camada de Negócio** - Services e Controllers
4. **Camada de Persistência** - Database e Cache

**Padrão MVC (Model-View-Controller)** adaptado:
- **Model:** Sequelize ORM + PostgreSQL
- **View:** Vue.js Components
- **Controller:** Express Controllers + Socket Handlers

## 2. Arquitetura do Backend

### 2.1 Estrutura de Diretórios

```
backend/
├── src/
│   ├── config/                 # Configurações
│   │   ├── database.js         # Config Sequelize
│   │   ├── auth.js             # Config JWT
│   │   └── socket.js           # Config Socket.IO
│   │
│   ├── models/                 # Models Sequelize
│   │   ├── index.js            # Auto-loader
│   │   ├── Empresa.js
│   │   ├── InstanciaChat.js
│   │   ├── Usuario.js
│   │   ├── Equipe.js
│   │   ├── Conversa.js
│   │   ├── ParticipanteConversa.js
│   │   └── Mensagem.js
│   │
│   ├── controllers/            # Controladores REST
│   │   ├── superadmin/
│   │   │   ├── empresaController.js
│   │   │   └── instanciaController.js
│   │   ├── admin/
│   │   │   ├── usuarioController.js
│   │   │   ├── equipeController.js
│   │   │   └── permissaoController.js
│   │   └── chat/
│   │       └── conversaController.js
│   │
│   ├── services/               # Lógica de Negócio
│   │   ├── empresaService.js
│   │   ├── instanciaService.js
│   │   ├── usuarioService.js
│   │   ├── equipeService.js
│   │   ├── conversaService.js
│   │   ├── mensagemService.js
│   │   └── permissaoService.js
│   │
│   ├── middlewares/            # Middlewares Express
│   │   ├── auth.js             # Autenticação JWT
│   │   ├── tenantValidation.js # Validação Multi-tenant
│   │   ├── roleCheck.js        # Verificação de Permissões
│   │   ├── rateLimiter.js      # Rate Limiting
│   │   ├── errorHandler.js     # Tratamento Global de Erros
│   │   └── validator.js        # Validação de Entrada
│   │
│   ├── routes/                 # Rotas da API
│   │   ├── index.js            # Agregador de rotas
│   │   ├── superadmin.routes.js
│   │   ├── admin.routes.js
│   │   └── chat.routes.js
│   │
│   ├── sockets/                # Handlers WebSocket
│   │   ├── index.js
│   │   ├── chatHandler.js      # Eventos de chat
│   │   ├── authHandler.js      # Auth via socket
│   │   └── presenceHandler.js  # Status online/offline
│   │
│   ├── utils/                  # Utilitários
│   │   ├── logger.js           # Winston Logger
│   │   ├── emailService.js     # Envio de emails
│   │   ├── validators.js       # Validadores customizados
│   │   └── helpers.js          # Funções auxiliares
│   │
│   ├── seeders/                # Seeds para dev
│   │   └── demo.seed.js
│   │
│   └── app.js                  # Configuração Express
│   └── server.js               # Entry Point
│
├── migrations/                 # Migrações Sequelize
├── tests/                      # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .eslintrc.js
├── .gitignore
├── package.json
└── README.md
```

### 2.2 Fluxo de Requisição

```
Cliente → Nginx → Express Router → Auth Middleware → Tenant Validation
    → Controller → Service → Model → Database → Response
```

### 2.3 Camadas e Responsabilidades

#### Routes (Rotas)
- Define endpoints
- Agrupa rotas relacionadas
- Aplica middlewares

#### Middlewares
- Autenticação (JWT)
- Validação de tenant
- Verificação de permissões
- Rate limiting
- Validação de entrada
- Tratamento de erros

#### Controllers
- Recebe requisições HTTP
- Valida entrada
- Chama services
- Formata resposta
- **NÃO contém lógica de negócio**

#### Services
- **Contém toda lógica de negócio**
- Orquestra múltiplos models
- Validações complexas
- Transações
- Reutilizável

#### Models
- Definição de esquema
- Relacionamentos
- Validações básicas
- Métodos de query customizados

### 2.4 Estratégia Multi-Tenant

**Abordagem:** Database Shared, Schema Shared, Row-Level Isolation

**Implementação:**
1. Todas as tabelas principais têm coluna `id_instancia_chat`
2. Middleware `tenantValidation` injeta filtro automático
3. Models têm scope padrão com tenant
4. Queries sempre filtradas por instância

**Exemplo de Middleware:**
```javascript
// middlewares/tenantValidation.js
function tenantValidation(req, res, next) {
  const instanciaId = req.user.id_instancia_chat;
  req.instanciaId = instanciaId;
  
  // Injeta filtro em todas as queries
  req.dbScope = { where: { id_instancia_chat: instanciaId } };
  
  next();
}
```

**Exemplo de Query com Tenant:**
```javascript
// Sempre filtrado por instância
const usuarios = await Usuario.findAll({
  where: {
    id_instancia_chat: req.instanciaId,
    status: 'ativo'
  }
});
```

## 3. Arquitetura do Frontend

### 3.1 Estrutura de Diretórios

```
frontend/
├── src/
│   ├── assets/              # Imagens, fontes, etc
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── main.css
│   │
│   ├── components/          # Componentes Reutilizáveis
│   │   ├── common/          # Botões, Inputs, etc
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   └── Table.vue
│   │   ├── chat/
│   │   │   ├── MessageList.vue
│   │   │   ├── MessageInput.vue
│   │   │   ├── ConversationList.vue
│   │   │   └── UserStatus.vue
│   │   └── layout/
│   │       ├── Navbar.vue
│   │       ├── Sidebar.vue
│   │       └── Footer.vue
│   │
│   ├── views/               # Páginas/Views
│   │   ├── superadmin/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Empresas.vue
│   │   │   └── Instancias.vue
│   │   ├── admin/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Usuarios.vue
│   │   │   ├── Equipes.vue
│   │   │   ├── Permissoes.vue
│   │   │   └── Supervisao.vue
│   │   ├── chat/
│   │   │   └── Chat.vue
│   │   └── auth/
│   │       ├── Login.vue
│   │       └── RecuperarSenha.vue
│   │
│   ├── router/              # Vue Router
│   │   ├── index.js
│   │   ├── superadmin.routes.js
│   │   ├── admin.routes.js
│   │   └── chat.routes.js
│   │
│   ├── store/               # Vuex/Pinia
│   │   ├── index.js
│   │   ├── modules/
│   │   │   ├── auth.js
│   │   │   ├── chat.js
│   │   │   ├── usuarios.js
│   │   │   └── empresas.js
│   │
│   ├── services/            # Serviços de API
│   │   ├── api.js           # Axios config
│   │   ├── authService.js
│   │   ├── chatService.js
│   │   ├── usuarioService.js
│   │   └── socketService.js
│   │
│   ├── composables/         # Vue Composables
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useSocket.js
│   │
│   ├── utils/               # Utilitários
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── App.vue
│   └── main.js
│
├── public/
│   ├── favicon.ico
│   └── index.html
│
├── .env.example
├── .eslintrc.js
├── .gitignore
├── package.json
├── vite.config.js           # ou vue.config.js
└── README.md
```

### 3.2 Gerenciamento de Estado (Pinia)

**Stores Principais:**

1. **authStore**
   - Token JWT
   - Usuário logado
   - Permissões
   - Instância ativa

2. **chatStore**
   - Conversas
   - Mensagens
   - Usuários online
   - Notificações

3. **usuariosStore**
   - Lista de usuários
   - Equipes
   - Hierarquia

4. **empresasStore** (Super Admin)
   - Empresas
   - Instâncias

### 3.3 Comunicação em Tempo Real

**Socket.IO Client:**

```javascript
// services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(process.env.VUE_APP_SOCKET_URL, {
      auth: { token },
      transports: ['websocket']
    });

    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('message:new', this.handleNewMessage);
    this.socket.on('user:online', this.handleUserOnline);
    this.socket.on('user:offline', this.handleUserOffline);
  }

  sendMessage(conversaId, conteudo) {
    this.socket.emit('message:send', { conversaId, conteudo });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
```

## 4. Banco de Dados

### 4.1 Estratégia de Modelagem

- **ORM:** Sequelize
- **Convenções:**
  - Tabelas em snake_case plural
  - Colunas em snake_case
  - PKs: `id` (SERIAL PRIMARY KEY)
  - FKs: `id_[tabela]` (INTEGER REFERENCES)
  - Timestamps: `created_at`, `updated_at`
  - Soft Delete: `deleted_at` (TIMESTAMP NULL)

### 4.2 Índices Importantes

```sql
-- Isolamento Multi-tenant
CREATE INDEX idx_usuarios_instancia ON usuarios(id_instancia_chat);
CREATE INDEX idx_mensagens_instancia ON mensagens(id_instancia_chat);

-- Performance de Chat
CREATE INDEX idx_mensagens_conversa_timestamp 
  ON mensagens(id_conversa, created_at DESC);

-- Busca de Usuários
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_equipe ON usuarios(id_equipe);

-- Hierarquia
CREATE INDEX idx_usuarios_supervisor ON usuarios(id_supervisor);
```

### 4.3 Estratégia de Backup

- Backup completo diário (off-peak)
- Backup incremental a cada 6 horas
- Retenção: 30 dias
- Restore testado semanalmente

## 5. Segurança

### 5.1 Autenticação

**JWT (JSON Web Tokens)**

```javascript
// Payload do Token
{
  id: 123,
  email: 'user@example.com',
  nivel_permissao: 'admin_cliente',
  id_instancia_chat: 456,
  iat: 1634567890,
  exp: 1634654290  // 24h
}
```

**Refresh Token (futuro):**
- Access Token: 15 minutos
- Refresh Token: 7 dias

### 5.2 Autorização

**Middleware de Permissões:**

```javascript
// middlewares/roleCheck.js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.nivel_permissao)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}

// Uso:
router.get('/usuarios', 
  auth, 
  requireRole('super_admin', 'admin_cliente'),
  usuarioController.list
);
```

### 5.3 Validação de Entrada

**Joi para Validação:**

```javascript
const Joi = require('joi');

const usuarioSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).required(),
  id_equipe: Joi.number().integer().required(),
  nivel_permissao: Joi.string().valid('gestor', 'equipe').required()
});
```

### 5.4 Proteção XSS

- Sanitização de input com `xss-clean`
- Content Security Policy headers
- Escape de output no frontend

### 5.5 Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente mais tarde.'
});

router.post('/login', loginLimiter, authController.login);
```

## 6. Escalabilidade

### 6.1 Horizontal Scaling

**Preparação para múltiplas instâncias:**

1. **Sessões:** JWT stateless (não em memória)
2. **Socket.IO:** Redis Adapter (futuro)
3. **Upload de Arquivos:** S3/MinIO (futuro)
4. **Cache:** Redis compartilhado

### 6.2 Database Optimization

- Connection Pooling (Sequelize)
- Query Optimization
- Índices estratégicos
- Particionamento (mensagens antigas)

### 6.3 Caching Strategy (Futuro)

```
┌─────────┐    ┌─────────┐    ┌──────────────┐
│ Client  │───▶│ Backend │───▶│  PostgreSQL  │
└─────────┘    └────┬────┘    └──────────────┘
                    │
                    ▼
               ┌─────────┐
               │  Redis  │
               │ (Cache) │
               └─────────┘
```

**Cache de:**
- Dados de usuários (5 minutos)
- Estrutura de equipes (10 minutos)
- Permissões (5 minutos)
- Sessões Socket.IO

## 7. Monitoramento e Logs

### 7.1 Logging

**Winston Logger:**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

**Níveis:**
- `error`: Erros críticos
- `warn`: Avisos (limite atingido, etc)
- `info`: Informações gerais (login, ações admin)
- `debug`: Debug detalhado

### 7.2 Métricas (Futuro)

- Prometheus + Grafana
- Métricas:
  - Requisições/segundo
  - Tempo de resposta
  - Erros 5xx
  - Usuários conectados
  - Mensagens/segundo

## 8. Deployment

### 8.1 Ambientes

1. **Development** - Local
2. **Staging** - Testes antes de produção
3. **Production** - Ambiente real

### 8.2 CI/CD (Sugestão)

```
GitHub → GitHub Actions → Docker Build → Deploy
```

### 8.3 Docker (Futuro)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

## 9. Tecnologias e Bibliotecas

### Backend
- **Node.js** 18+ LTS
- **Express.js** 4.x
- **Socket.IO** 4.x
- **Sequelize** 6.x (ORM)
- **PostgreSQL** 14+
- **jsonwebtoken** (JWT)
- **bcrypt** (hash de senhas)
- **joi** (validação)
- **winston** (logging)
- **helmet** (segurança)
- **cors**
- **dotenv**

### Frontend
- **Vue.js** 3.x
- **Vue Router** 4.x
- **Pinia** 2.x (state management)
- **Axios** (HTTP client)
- **Socket.IO Client** 4.x
- **Tailwind CSS** 3.x (sugerido)
- **Vite** (build tool)

### DevOps (Futuro)
- **Docker** + **Docker Compose**
- **Nginx** (reverse proxy)
- **Redis** (cache/sessions)
- **PM2** (process manager)

---

**Última atualização:** 16/10/2025  
**Versão:** 1.0

