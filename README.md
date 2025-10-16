# Chat Interno - Plataforma Multi-tenant de Comunicação

## 📋 Visão Geral

Sistema de chat interno corporativo multi-tenant e multi-instância, projetado para permitir que múltiplas empresas contratem instâncias isoladas de chat com gestão hierárquica de usuários e permissões customizáveis.

## 🎯 Objetivo

Desenvolver uma plataforma de comunicação interna que permite:
- **Multi-tenant**: Múltiplas empresas clientes utilizando a mesma infraestrutura
- **Multi-instância**: Cada empresa pode ter várias instâncias de chat independentes
- **Isolamento total**: Dados completamente segregados entre instâncias
- **Gestão hierárquica**: Controle fino de permissões e estrutura organizacional

## 🏗️ Arquitetura

### Stack Tecnológico

**Backend:**
- Node.js + Express.js
- Socket.IO (comunicação em tempo real)
- PostgreSQL (banco de dados)
- JWT (autenticação)

**Frontend:**
- Vue.js 3
- Vuex/Pinia (gerenciamento de estado)
- Socket.IO Client
- Tailwind CSS (sugerido)

## 👥 Perfis de Usuário

### 1. Super Administrador (Dono do Sistema)
- Acesso ao painel de controle global
- Gerencia empresas clientes
- Cria e configura instâncias de chat
- Define limites de usuários por instância

### 2. Administrador do Cliente (Admin/Root)
- Gerencia instância(s) específica(s)
- Cadastra e gerencia usuários
- Define estrutura organizacional
- Configura permissões de comunicação
- Supervisiona conversas

### 3. Usuário Final (Gestor/Equipe)
- Utiliza o chat conforme permissões
- Participa de conversas autorizadas
- Comunicação hierárquica ou em grupo

## 📚 Documentação

A documentação completa do projeto está organizada da seguinte forma:

- **[REQUISITOS.md](./docs/REQUISITOS.md)** - Requisitos funcionais e não funcionais detalhados
- **[ARQUITETURA.md](./docs/ARQUITETURA.md)** - Arquitetura do sistema e decisões técnicas
- **[MODELO_DADOS.md](./docs/MODELO_DADOS.md)** - Estrutura do banco de dados
- **[FASES_DESENVOLVIMENTO.md](./docs/FASES_DESENVOLVIMENTO.md)** - Planejamento e cronograma
- **[GUIA_DESENVOLVIMENTO.md](./docs/GUIA_DESENVOLVIMENTO.md)** - Instruções para desenvolvedores

## 🚀 Quick Start

### Pré-requisitos

- Node.js >= 18.x
- PostgreSQL >= 14
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd chat-interno

# Backend
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run migrate
npm run dev

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

## 📁 Estrutura do Projeto

```
chat-interno/
├── backend/              # API Node.js + Express + Socket.IO
│   ├── src/
│   │   ├── config/      # Configurações
│   │   ├── models/      # Models do banco de dados
│   │   ├── controllers/ # Controladores
│   │   ├── routes/      # Rotas da API
│   │   ├── middlewares/ # Middlewares (auth, tenant, etc)
│   │   ├── services/    # Lógica de negócio
│   │   ├── sockets/     # Handlers do Socket.IO
│   │   └── utils/       # Utilitários
│   ├── migrations/      # Migrações do banco
│   └── tests/          # Testes
│
├── frontend/            # Aplicação Vue.js
│   ├── src/
│   │   ├── components/  # Componentes Vue
│   │   ├── views/       # Páginas/Views
│   │   ├── store/       # Gerenciamento de estado
│   │   ├── router/      # Rotas
│   │   ├── services/    # Serviços de API
│   │   ├── composables/ # Composables Vue
│   │   └── utils/       # Utilitários
│   └── public/         # Arquivos estáticos
│
└── docs/               # Documentação completa
```

## 🔐 Segurança

- Autenticação JWT
- Isolamento multi-tenant em nível de banco de dados
- Validação de permissões em todas as requisições
- Criptografia de senhas com bcrypt
- Rate limiting e proteção contra ataques

## 📊 Status do Projeto

🚧 **Em Planejamento** - Documentação sendo criada

## 📝 Licença

[Definir licença]

## 👨‍💻 Equipe

[Definir equipe]

