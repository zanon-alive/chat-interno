# 🚀 Como Rodar o Projeto Chat Interno

## 📋 Pré-requisitos

- **Node.js** >= 18.0 (v20+ recomendado)
- **npm** >= 9.0
- **Git**

---

## 🔧 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/zanon-alive/chat-interno.git
cd chat-interno
git checkout develop
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Executar migrations (criar banco de dados)
npm run migrate

# Popular banco com dados de teste
npm run seed
```

✅ **Banco criado:** `backend/database.sqlite`

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependências
npm install
```

---

## ▶️ Iniciar o Sistema

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

✅ **Backend rodando em:** http://localhost:3000  
✅ **Socket.IO rodando em:** ws://localhost:3000

**Logs aparecerão no terminal!**

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

✅ **Frontend rodando em:** http://localhost:5173

**Acesse no navegador:** http://localhost:5173

---

## 👤 Usuários de Teste

### Super Administrador
- **Email:** `admin@chatinterno.com`
- **Senha:** `Admin@123456`
- **Acesso:** Painel de Super Admin
- **Pode:** Criar empresas, criar instâncias, ver tudo

### Admin Cliente (Instância 1 - Chat Matriz)
- **Email:** `joao.silva@empresademo.com`
- **Senha:** `Admin@123456`
- **Acesso:** Painel Administrativo
- **Pode:** Gerenciar equipes, usuários, ver conversas

### Gestor de Desenvolvimento
- **Email:** `maria.santos@empresademo.com`
- **Senha:** `User@123456`
- **Acesso:** Chat
- **Pode:** Usar o chat, gerenciar equipe

### Usuário de Equipe
- **Email:** `pedro.oliveira@empresademo.com`
- **Senha:** `User@123456`
- **Acesso:** Chat
- **Pode:** Usar o chat

### Outro Usuário de Equipe
- **Email:** `ana.costa@empresademo.com`
- **Senha:** `User@123456`
- **Acesso:** Chat
- **Pode:** Usar o chat

---

## 🧪 Testando o Sistema

### Cenário 1: Fazer Login

1. Acesse http://localhost:5173
2. Use um dos usuários acima
3. Será redirecionado automaticamente para seu painel

### Cenário 2: Chat em Tempo Real

1. Abra duas janelas/abas do navegador
2. **Aba 1:** Login como `pedro.oliveira@empresademo.com`
3. **Aba 2:** Login como `ana.costa@empresademo.com`
4. Na Aba 1: Clique na conversa com Ana
5. Digite e envie uma mensagem
6. **Veja aparecer em tempo real na Aba 2!** ⚡

### Cenário 3: Testar API com cURL

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chatinterno.com","senha":"Admin@123456"}'

# Copie o token retornado

# 2. Listar empresas
curl http://localhost:3000/api/superadmin/empresas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 3. Listar usuários (como admin cliente)
curl http://localhost:3000/api/admin/usuarios \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE"
```

Consulte **backend/API_TESTS.md** para todos os 40 endpoints!

---

## 📂 Estrutura do Projeto

```
chat-interno/
├── backend/ (Node.js + Express + Socket.IO)
│   ├── src/
│   ├── migrations/ (8 migrations)
│   ├── seeders/ (dados de teste)
│   ├── database.sqlite (criado ao rodar migrate)
│   └── package.json
│
├── frontend/ (Vue.js 3 + Vite)
│   ├── src/
│   │   ├── views/ (Login, Dashboards, Chat)
│   │   ├── store/ (Pinia - auth, chat)
│   │   ├── services/ (API, Socket.IO)
│   │   └── router/
│   └── package.json
│
└── docs/ (Documentação técnica completa)
```

---

## 🔑 Endpoints Disponíveis

### Health Check
- `GET /api/health` - Status do servidor

### Autenticação (4 endpoints)
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/trocar-senha`
- `POST /api/auth/logout`

### Super Admin (12 endpoints)
- Empresas: GET, POST, PUT, DELETE, STATS (6)
- Instâncias: GET, POST, PUT, DELETE, STATS (6)

### Admin Cliente (14 endpoints)
- Equipes: GET, POST, PUT, DELETE, STATS (6)
- Usuários: GET, POST, PUT, DELETE, HIERARQUIA, STATS (8)

### Chat (10 endpoints)
- Conversas: GET, CREATE (individual/grupo), ADD participante (5)
- Mensagens: GET histórico, BUSCAR, EDITAR, DELETAR (5)

**Total:** 40 endpoints REST + 10 eventos Socket.IO = **50 funcionalidades!**

---

## 🔍 Comandos Úteis

### Backend

```bash
cd backend

# Desenvolvimento (com hot reload)
npm run dev

# Migrations
npm run migrate        # Executar migrations
npm run migrate:undo   # Desfazer última

# Seeds
npm run seed           # Popular banco
npm run seed:undo      # Limpar banco

# Testes
npm test               # Rodar testes (quando implementados)

# Lint
npm run lint           # Verificar código
npm run lint:fix       # Corrigir automaticamente
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev            # Servidor dev (http://localhost:5173)

# Build
npm run build          # Build para produção
npm run preview        # Preview do build
```

### Git

```bash
# Status
git status

# Ver commits
git log --oneline

# Atualizar
git pull origin develop

# Nova branch
git checkout -b feature/nome-feature
```

---

## 🐛 Troubleshooting

### Porta 3000 em uso

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Banco de dados corrompido

```bash
cd backend

# Resetar banco completamente
rm -f database.sqlite

# Recriar
npm run migrate
npm run seed
```

### Frontend não conecta ao backend

1. Verifique se backend está rodando
2. Verifique URL em `.env` (ou use padrão)
3. Verifique CORS no backend (deve permitir localhost:5173)

### Socket.IO não conecta

1. Backend deve estar rodando
2. Token JWT deve estar válido
3. Verifique console do navegador para erros

---

## 📝 Dados no Banco (Seeder)

### Estrutura Criada

**2 Empresas:**
1. Empresa Demo LTDA (CNPJ: 12.345.678/0001-90)
2. Tech Solutions SA (CNPJ: 98.765.432/0001-10)

**3 Instâncias:**
1. Chat Matriz (Empresa Demo) - 50 usuários
2. Chat Filial SP (Empresa Demo) - 30 usuários
3. Tech Chat (Tech Solutions) - 100 usuários

**4 Equipes (Instância 1):**
1. Desenvolvimento
2. Suporte
3. Vendas
4. Engineering (Instância 3)

**8 Usuários:**
- 1 Super Admin
- 2 Admins Cliente
- 2 Gestores
- 3 Usuários de Equipe

**3 Conversas com mensagens de teste**

---

## 🎯 Funcionalidades Testáveis

### ✅ Login e Autenticação
- Login com diferentes usuários
- Redirecionamento automático por nível
- Logout
- Trocar senha

### ✅ Chat em Tempo Real
- Ver lista de conversas
- Enviar mensagens
- Receber mensagens instantaneamente
- Ver usuários online
- Indicador "digitando..."

### ✅ API REST (com cURL/Postman)
- Todos os 40 endpoints funcionando
- Ver backend/API_TESTS.md para exemplos

---

## 📚 Documentação

**Documentos Principais:**
- **RELATORIO_FINAL_MVP.md** - Relatório completo
- **RESUMO_DESENVOLVIMENTO.md** - O que foi desenvolvido
- **backend/API_TESTS.md** - Exemplos de todos os endpoints
- **docs/** - Documentação técnica completa (150+ páginas)

---

## ⚡ Quick Start (Passo a Passo)

```bash
# 1. Clone e instale
git clone https://github.com/zanon-alive/chat-interno.git
cd chat-interno

# 2. Backend
cd backend
npm install
npm run migrate
npm run seed

# 3. Abrir novo terminal - Frontend
cd ../frontend
npm install

# 4. Rodar (2 terminais)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# 5. Acessar
# Abrir navegador: http://localhost:5173
# Login: pedro.oliveira@empresademo.com / User@123456
```

**Tempo total:** 5-10 minutos ⏱️

---

## 🎉 Pronto!

Agora você tem:

✅ **Backend rodando** em http://localhost:3000  
✅ **Frontend rodando** em http://localhost:5173  
✅ **Chat em tempo real** funcionando  
✅ **40 endpoints REST** disponíveis  
✅ **Dados de teste** no banco  

**Comece a explorar o sistema!** 🚀

---

## 📞 Suporte

**Problemas?** Consulte:
1. **DECISOES_TECNICAS.md** - Decisões e alternativas
2. **docs/GUIA_DESENVOLVIMENTO.md** - Troubleshooting
3. **backend/logs/** - Logs do servidor

**GitHub:** https://github.com/zanon-alive/chat-interno  
**Branch:** develop

---

**Última atualização:** 16/10/2025 - 22:50  
**Versão:** 1.0-MVP

