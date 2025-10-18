# Guia de Desenvolvimento - Chat Interno

## 📚 Índice

1. [Introdução](#1-introdução)
2. [Setup do Ambiente](#2-setup-do-ambiente)
3. [Convenções de Código](#3-convenções-de-código)
4. [Estrutura de Branches](#4-estrutura-de-branches)
5. [Desenvolvimento Backend](#5-desenvolvimento-backend)
6. [Desenvolvimento Frontend](#6-desenvolvimento-frontend)
7. [Testes](#7-testes)
8. [Commits e Pull Requests](#8-commits-e-pull-requests)
9. [Debugging](#9-debugging)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Introdução

Este guia fornece instruções práticas para desenvolvedores trabalhando no projeto Chat Interno.

### Pré-requisitos

- **Node.js** >= 18.x (recomendado 20.x LTS)
- **PostgreSQL** >= 14
- **npm** >= 9.x ou **yarn** >= 1.22
- **Git** >= 2.30
- **Editor:** VS Code (recomendado)

### Extensões VS Code Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Vue.volar",
    "bradlc.vscode-tailwindcss",
    "christian-kohler.path-intellisense",
    "eamodio.gitlens",
    "MS-CEINTL.vscode-language-pack-pt-BR"
  ]
}
```

---

## 2. Setup do Ambiente

### 2.1 Clone do Repositório

```bash
# Clone o repositório
git clone <repository-url>
cd chat-interno

# Crie branch develop a partir de main (se não existir)
git checkout -b develop
```

### 2.2 Setup do Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações locais
nano .env
```

**Configuração `.env` (Backend):**

```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chat_interno_dev
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui_min_32_chars
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Socket.IO
SOCKET_PORT=3000

# Email (para desenvolvimento usar Mailtrap ou similar)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario
EMAIL_PASS=sua_senha
EMAIL_FROM=noreply@chatinterno.com
```

**Criar Banco de Dados:**

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco
CREATE DATABASE chat_interno_dev;
CREATE DATABASE chat_interno_test;

# Sair
\q
```

**Rodar Migrations:**

```bash
# Executar migrations
npm run migrate

# (ou com Sequelize CLI)
npx sequelize-cli db:migrate

# Seed inicial (Super Admin)
npm run seed
```

**Iniciar Backend:**

```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Modo produção
npm start
```

### 2.3 Setup do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env
nano .env
```

**Configuração `.env` (Frontend):**

```env
# API
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000

# App
VITE_APP_TITLE=Chat Interno
VITE_APP_VERSION=1.0.0
```

**Iniciar Frontend:**

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### 2.4 Verificação

**Backend rodando em:** http://localhost:3000  
**Frontend rodando em:** http://localhost:5173

**Teste a API:**

```bash
curl http://localhost:3000/api/health
# Deve retornar: {"status":"ok"}
```

---

## 3. Convenções de Código

### 3.1 JavaScript/TypeScript

**ESLint + Prettier configurados**

```javascript
// ✅ BOM
async function buscarUsuario(id) {
  try {
    const usuario = await Usuario.findByPk(id);
    return usuario;
  } catch (error) {
    logger.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

// ❌ RUIM
function buscarUsuario(id) {
  return Usuario.findByPk(id)
}
```

**Convenções:**
- **Nomeação:**
  - Variáveis/funções: `camelCase`
  - Classes: `PascalCase`
  - Constantes: `UPPER_SNAKE_CASE`
  - Arquivos: `camelCase.js` ou `PascalCase.js` (componentes)
- **Idioma:** Código em português (nomes de variáveis, funções)
- **Aspas:** Simples `'string'`
- **Ponto e vírgula:** Obrigatório
- **Indentação:** 2 espaços
- **Max line length:** 100 caracteres

### 3.2 Banco de Dados

**Convenções SQL:**
- Tabelas: `snake_case` plural (`usuarios`, `instancias_chat`)
- Colunas: `snake_case` (`nome_completo`, `id_instancia_chat`)
- Primary Keys: `id` (SERIAL)
- Foreign Keys: `id_[tabela_singular]` (`id_usuario`, `id_empresa`)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

### 3.3 Vue.js

**Estrutura de Componente:**

```vue
<template>
  <div class="nome-componente">
    <!-- Template aqui -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  titulo: {
    type: String,
    required: true
  }
});

// Emits
const emit = defineEmits(['acao']);

// State
const count = ref(0);

// Computed
const countDobrado = computed(() => count.value * 2);

// Methods
function incrementar() {
  count.value++;
  emit('acao', count.value);
}

// Lifecycle
onMounted(() => {
  console.log('Componente montado');
});
</script>

<style scoped>
.nome-componente {
  /* Estilos aqui */
}
</style>
```

**Convenções Vue:**
- Componentes: `PascalCase.vue` (`UserCard.vue`)
- Props: `camelCase`
- Eventos: `kebab-case` (`@click-item`)
- Usar Composition API (`<script setup>`)
- Componentes small e focused

### 3.4 Git

**Mensagens de Commit (Conventional Commits):**

```bash
# Formato
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de build, config, etc

**Exemplos:**

```bash
feat(auth): adicionar autenticação JWT

Implementa login com JWT incluindo:
- Middleware de autenticação
- Endpoints de login/logout
- Testes unitários

Closes #12

fix(chat): corrigir envio de mensagens duplicadas

refactor(usuarios): melhorar lógica de validação de limite

docs(readme): atualizar instruções de instalação

test(empresas): adicionar testes de CRUD
```

---

## 4. Estrutura de Branches

### 4.1 Branch Strategy (Git Flow Simplificado)

```
main (produção)
  └── develop (desenvolvimento)
        ├── feature/nome-da-feature
        ├── bugfix/nome-do-bug
        └── hotfix/nome-do-hotfix
```

**Branches Principais:**

- **`main`**: Código em produção (protegida)
- **`develop`**: Integração de features (protegida)

**Branches de Trabalho:**

- **`feature/`**: Novas funcionalidades
  - Ex: `feature/auth-jwt`, `feature/chat-grupos`
- **`bugfix/`**: Correções de bugs
  - Ex: `bugfix/limite-usuarios`
- **`hotfix/`**: Correções urgentes em produção
  - Ex: `hotfix/security-fix`

### 4.2 Workflow

```bash
# 1. Criar feature branch a partir de develop
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature

# 2. Desenvolver e commitar
git add .
git commit -m "feat(escopo): descrição"

# 3. Push para remote
git push origin feature/nome-da-feature

# 4. Abrir Pull Request para develop
# (no GitHub/GitLab)

# 5. Após aprovação e merge, deletar branch
git checkout develop
git pull origin develop
git branch -d feature/nome-da-feature
```

---

## 5. Desenvolvimento Backend

### 5.1 Estrutura de Arquivos

```
backend/src/
├── config/
│   ├── database.js         # Configuração Sequelize
│   └── auth.js             # Configuração JWT
├── models/
│   ├── index.js            # Auto-loader
│   ├── Usuario.js
│   └── Empresa.js
├── controllers/
│   └── usuarioController.js
├── services/
│   └── usuarioService.js
├── middlewares/
│   ├── auth.js
│   └── tenantValidation.js
├── routes/
│   ├── index.js
│   └── usuarios.routes.js
└── utils/
    └── logger.js
```

### 5.2 Criando uma Nova Feature (Exemplo: CRUD de Equipes)

#### Passo 1: Migration

```bash
npx sequelize-cli migration:generate --name create-equipes
```

**Migration:** `migrations/XXXXXX-create-equipes.js`

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_instancia_chat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'instancias_chat',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      nome: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });

    // Índices
    await queryInterface.addIndex('equipes', ['id_instancia_chat'], {
      name: 'idx_equipes_instancia',
      where: { deleted_at: null }
    });

    // Unique constraint
    await queryInterface.addConstraint('equipes', {
      fields: ['id_instancia_chat', 'nome', 'deleted_at'],
      type: 'unique',
      name: 'uk_equipe_instancia_nome'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('equipes');
  }
};
```

**Rodar migration:**

```bash
npm run migrate
```

#### Passo 2: Model

**`models/Equipe.js`**

```javascript
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Equipe extends Model {
    static associate(models) {
      // Relacionamentos
      Equipe.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia_chat',
        as: 'instancia'
      });

      Equipe.hasMany(models.Usuario, {
        foreignKey: 'id_equipe',
        as: 'usuarios'
      });
    }
  }

  Equipe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_instancia_chat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome é obrigatório' },
        len: {
          args: [3, 200],
          msg: 'Nome deve ter entre 3 e 200 caracteres'
        }
      }
    },
    descricao: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Equipe',
    tableName: 'equipes',
    underscored: true,
    paranoid: true, // Soft delete
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Equipe;
};
```

#### Passo 3: Service

**`services/equipeService.js`**

```javascript
'use strict';

const { Equipe, Usuario } = require('../models');
const { Op } = require('sequelize');

class EquipeService {
  async listar(idInstancia, filtros = {}) {
    const where = { id_instancia_chat: idInstancia };

    if (filtros.nome) {
      where.nome = { [Op.iLike]: `%${filtros.nome}%` };
    }

    const equipes = await Equipe.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuarios',
          attributes: ['id', 'nome_completo'],
          where: { status: 'ativo' },
          required: false
        }
      ],
      order: [['nome', 'ASC']]
    });

    return equipes;
  }

  async buscarPorId(id, idInstancia) {
    const equipe = await Equipe.findOne({
      where: { id, id_instancia_chat: idInstancia },
      include: [
        {
          model: Usuario,
          as: 'usuarios',
          attributes: ['id', 'nome_completo', 'email']
        }
      ]
    });

    if (!equipe) {
      throw new Error('Equipe não encontrada');
    }

    return equipe;
  }

  async criar(dados, idInstancia) {
    const equipe = await Equipe.create({
      ...dados,
      id_instancia_chat: idInstancia
    });

    return equipe;
  }

  async atualizar(id, dados, idInstancia) {
    const equipe = await this.buscarPorId(id, idInstancia);

    await equipe.update(dados);

    return equipe;
  }

  async deletar(id, idInstancia) {
    const equipe = await this.buscarPorId(id, idInstancia);

    // Verifica se tem usuários
    const countUsuarios = await Usuario.count({
      where: { id_equipe: id, status: 'ativo' }
    });

    if (countUsuarios > 0) {
      throw new Error('Não é possível deletar equipe com usuários ativos');
    }

    await equipe.destroy(); // Soft delete

    return { mensagem: 'Equipe deletada com sucesso' };
  }
}

module.exports = new EquipeService();
```

#### Passo 4: Controller

**`controllers/equipeController.js`**

```javascript
'use strict';

const equipeService = require('../services/equipeService');
const logger = require('../utils/logger');

class EquipeController {
  async listar(req, res, next) {
    try {
      const { id_instancia_chat: idInstancia } = req.user;
      const { nome } = req.query;

      const equipes = await equipeService.listar(idInstancia, { nome });

      return res.json({
        success: true,
        data: equipes
      });
    } catch (error) {
      logger.error('Erro ao listar equipes:', error);
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const { id_instancia_chat: idInstancia } = req.user;

      const equipe = await equipeService.buscarPorId(id, idInstancia);

      return res.json({
        success: true,
        data: equipe
      });
    } catch (error) {
      logger.error('Erro ao buscar equipe:', error);
      next(error);
    }
  }

  async criar(req, res, next) {
    try {
      const { id_instancia_chat: idInstancia } = req.user;
      const dados = req.body;

      const equipe = await equipeService.criar(dados, idInstancia);

      return res.status(201).json({
        success: true,
        data: equipe,
        mensagem: 'Equipe criada com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao criar equipe:', error);
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { id_instancia_chat: idInstancia } = req.user;
      const dados = req.body;

      const equipe = await equipeService.atualizar(id, dados, idInstancia);

      return res.json({
        success: true,
        data: equipe,
        mensagem: 'Equipe atualizada com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao atualizar equipe:', error);
      next(error);
    }
  }

  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      const { id_instancia_chat: idInstancia } = req.user;

      const resultado = await equipeService.deletar(id, idInstancia);

      return res.json({
        success: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      logger.error('Erro ao deletar equipe:', error);
      next(error);
    }
  }
}

module.exports = new EquipeController();
```

#### Passo 5: Routes

**`routes/equipes.routes.js`**

```javascript
'use strict';

const express = require('express');
const router = express.Router();
const equipeController = require('../controllers/equipeController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// Todas as rotas requerem autenticação e role admin
router.use(auth);
router.use(roleCheck('admin_cliente'));

router.get('/', equipeController.listar);
router.get('/:id', equipeController.buscarPorId);
router.post('/', equipeController.criar);
router.put('/:id', equipeController.atualizar);
router.delete('/:id', equipeController.deletar);

module.exports = router;
```

**`routes/index.js`** (adicionar):

```javascript
const equipeRoutes = require('./equipes.routes');

// ...

app.use('/api/admin/equipes', equipeRoutes);
```

#### Passo 6: Testar

```bash
# Login primeiro para obter token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"Admin@123"}'

# Resposta: { "token": "eyJhbGc..." }

# Listar equipes
curl http://localhost:3000/api/admin/equipes \
  -H "Authorization: Bearer SEU_TOKEN"

# Criar equipe
curl -X POST http://localhost:3000/api/admin/equipes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Desenvolvimento","descricao":"Equipe de dev"}'
```

### 5.3 Middlewares Importantes

#### `middlewares/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

module.exports = async function auth(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      throw new Error();
    }

    req.user = usuario.toJSON();
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Autenticação inválida' });
  }
};
```

#### `middlewares/roleCheck.js`

```javascript
module.exports = function roleCheck(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!allowedRoles.includes(req.user.nivel_permissao)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
};
```

---

## 6. Desenvolvimento Frontend

### 6.1 Criando um Componente

**`components/common/Button.vue`**

```vue
<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loader"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    { 'btn-loading': props.loading }
  ];
});

function handleClick(event) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loader {
  /* Loading spinner CSS */
}
</style>
```

### 6.2 Criando uma Store (Pinia)

**`store/auth.js`**

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '@/services/authService';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null);
  const usuario = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => {
    return usuario.value?.nivel_permissao === 'admin_cliente';
  });

  // Actions
  async function login(email, senha) {
    try {
      const response = await authService.login(email, senha);
      
      token.value = response.token;
      usuario.value = response.usuario;
      
      localStorage.setItem('token', response.token);
      
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async function logout() {
    token.value = null;
    usuario.value = null;
    localStorage.removeItem('token');
    router.push('/login');
  }

  async function fetchUsuario() {
    if (!token.value) return;

    try {
      const response = await authService.me();
      usuario.value = response.usuario;
    } catch (error) {
      logout();
    }
  }

  return {
    // State
    token,
    usuario,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    login,
    logout,
    fetchUsuario
  };
});
```

### 6.3 Service de API

**`services/api.js`** (Axios configurado)

```javascript
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

**`services/equipeService.js`**

```javascript
import api from './api';

export default {
  async listar(filtros = {}) {
    return api.get('/admin/equipes', { params: filtros });
  },

  async buscarPorId(id) {
    return api.get(`/admin/equipes/${id}`);
  },

  async criar(dados) {
    return api.post('/admin/equipes', dados);
  },

  async atualizar(id, dados) {
    return api.put(`/admin/equipes/${id}`, dados);
  },

  async deletar(id) {
    return api.delete(`/admin/equipes/${id}`);
  }
};
```

### 6.4 Usando Store e Service no Componente

**`views/admin/Equipes.vue`**

```vue
<template>
  <div class="equipes-page">
    <h1>Equipes</h1>

    <Button @click="abrirModalCriar">Nova Equipe</Button>

    <div v-if="loading">Carregando...</div>

    <table v-else>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Membros</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="equipe in equipes" :key="equipe.id">
          <td>{{ equipe.nome }}</td>
          <td>{{ equipe.usuarios?.length || 0 }}</td>
          <td>
            <Button @click="editar(equipe)" variant="secondary">Editar</Button>
            <Button @click="deletar(equipe.id)" variant="danger">Deletar</Button>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal v-model="showModal" title="Nova Equipe">
      <!-- Formulário aqui -->
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import equipeService from '@/services/equipeService';
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';

const equipes = ref([]);
const loading = ref(false);
const showModal = ref(false);

async function carregarEquipes() {
  loading.value = true;
  try {
    const response = await equipeService.listar();
    equipes.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar equipes:', error);
  } finally {
    loading.value = false;
  }
}

function abrirModalCriar() {
  showModal.value = true;
}

async function deletar(id) {
  if (!confirm('Tem certeza?')) return;

  try {
    await equipeService.deletar(id);
    await carregarEquipes();
  } catch (error) {
    alert('Erro ao deletar: ' + error.response?.data?.error);
  }
}

onMounted(() => {
  carregarEquipes();
});
</script>
```

---

## 7. Testes

### 7.1 Testes Backend (Jest)

**Instalar:**

```bash
npm install --save-dev jest supertest
```

**`package.json`:**

```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"]
  }
}
```

**`tests/unit/services/equipeService.test.js`**

```javascript
const equipeService = require('../../../src/services/equipeService');
const { Equipe } = require('../../../src/models');

// Mock do modelo
jest.mock('../../../src/models');

describe('EquipeService', () => {
  describe('listar', () => {
    it('deve listar equipes da instância', async () => {
      const mockEquipes = [
        { id: 1, nome: 'Dev', id_instancia_chat: 1 },
        { id: 2, nome: 'Design', id_instancia_chat: 1 }
      ];

      Equipe.findAll.mockResolvedValue(mockEquipes);

      const result = await equipeService.listar(1);

      expect(result).toEqual(mockEquipes);
      expect(Equipe.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id_instancia_chat: 1 })
        })
      );
    });
  });

  describe('criar', () => {
    it('deve criar equipe', async () => {
      const mockEquipe = { id: 1, nome: 'Nova Equipe' };
      Equipe.create.mockResolvedValue(mockEquipe);

      const result = await equipeService.criar({ nome: 'Nova Equipe' }, 1);

      expect(result).toEqual(mockEquipe);
    });
  });
});
```

**`tests/integration/equipes.test.js`**

```javascript
const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

describe('Equipes API', () => {
  let token;

  beforeAll(async () => {
    // Setup: login para obter token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', senha: 'Admin@123' });

    token = response.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/admin/equipes', () => {
    it('deve retornar lista de equipes', async () => {
      const response = await request(app)
        .get('/api/admin/equipes')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve retornar 401 sem token', async () => {
      await request(app)
        .get('/api/admin/equipes')
        .expect(401);
    });
  });

  describe('POST /api/admin/equipes', () => {
    it('deve criar equipe', async () => {
      const response = await request(app)
        .post('/api/admin/equipes')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Equipe Teste', descricao: 'Teste' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe('Equipe Teste');
    });
  });
});
```

**Rodar testes:**

```bash
npm test
```

### 7.2 Testes Frontend (Vitest)

**Instalar:**

```bash
npm install --save-dev vitest @vue/test-utils
```

**`vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
```

**`tests/components/Button.test.js`**

```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/components/common/Button.vue';

describe('Button', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Clique aqui'
      }
    });

    expect(wrapper.text()).toBe('Clique aqui');
  });

  it('emite evento click', async () => {
    const wrapper = mount(Button);

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('não emite click quando disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
```

**Rodar testes:**

```bash
npm run test
```

---

## 8. Commits e Pull Requests

### 8.1 Checklist Antes de Commitar

- [ ] Código funciona localmente
- [ ] Testes passam (`npm test`)
- [ ] ESLint sem erros (`npm run lint`)
- [ ] Código revisado (self-review)
- [ ] Comentários úteis adicionados
- [ ] Código desnecessário removido (console.log, debuggers)

### 8.2 Pull Request Template

```markdown
## Descrição

[Descreva brevemente o que foi feito]

## Tipo de Mudança

- [ ] feat: Nova funcionalidade
- [ ] fix: Correção de bug
- [ ] refactor: Refatoração
- [ ] docs: Documentação
- [ ] test: Testes

## Checklist

- [ ] Código testado localmente
- [ ] Testes unitários criados/atualizados
- [ ] Documentação atualizada
- [ ] Não há console.log ou código de debug
- [ ] ESLint sem erros

## Como Testar

[Passos para testar a funcionalidade]

## Screenshots (se aplicável)

[Adicionar prints]

## Issues Relacionadas

Closes #123
```

---

## 9. Debugging

### 9.1 Backend (VS Code)

**`.vscode/launch.json`**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    }
  ]
}
```

**Usar:**
- Adicionar breakpoints
- F5 para iniciar debug

### 9.2 Frontend (Browser DevTools)

**Vue DevTools:**
- Instalar extensão do Chrome/Firefox
- Inspecionar components, store, router

---

## 10. Troubleshooting

### Problema: "Port 3000 already in use"

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Problema: Erro de conexão com PostgreSQL

```bash
# Verificar se PostgreSQL está rodando
sudo service postgresql status

# Iniciar PostgreSQL
sudo service postgresql start

# Verificar conexão
psql -U postgres -c "SELECT version();"
```

### Problema: Migrations não executam

```bash
# Reverter última migration
npx sequelize-cli db:migrate:undo

# Executar novamente
npm run migrate

# Ver status
npx sequelize-cli db:migrate:status
```

### Problema: CORS error no frontend

**Backend `app.js`:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### Problema: Socket.IO não conecta

**Verificar:**
1. Backend está rodando
2. URL correta no frontend (`.env`)
3. CORS configurado para websocket
4. Porta correta

---

## 11. Recursos Úteis

### Documentação
- [Node.js](https://nodejs.org/docs)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Vue.js 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Socket.IO](https://socket.io/docs)

### Ferramentas
- [Postman](https://www.postman.com/) - Testar API
- [DBeaver](https://dbeaver.io/) - Cliente PostgreSQL
- [Mailtrap](https://mailtrap.io/) - Testar emails

---

**Última atualização:** 16/10/2025  
**Versão:** 1.0

**Dúvidas?** Entre em contato com o time!

