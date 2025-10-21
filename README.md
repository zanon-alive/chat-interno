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

> **📖 [ÍNDICE COMPLETO DA DOCUMENTAÇÃO](.docs/INDEX.md)** - Navegue por toda a documentação organizada

A documentação está organizada em **7 categorias** para facilitar a navegação:

### 🚀 Início Rápido
- **[🚀 COMECE AQUI](.docs/01-inicio/🚀_COMECE_AQUI.md)** ⭐ - **START HERE!** (5 min)
- **[Como Rodar](.docs/01-inicio/02-COMO_RODAR.md)** - Setup completo (10 min)

### 🔌 Widget Embarcável
- **[Guia de Integração](.docs/03-widget/WIDGET_INTEGRATION.md)** - Como integrar o widget
- **[Gerar Token](.docs/03-widget/GERAR_TOKEN.md)** - Autenticação do widget
- **[Exemplo Prático](.docs/07-scripts/exemplo-dashboard.html)** - Dashboard de exemplo

### 🏗️ Arquitetura e Desenvolvimento
- **[Arquitetura do Sistema](.docs/02-arquitetura/ARQUITETURA.md)** - Visão técnica completa
- **[Modelo de Dados](.docs/02-arquitetura/MODELO_DADOS.md)** - Estrutura do banco
- **[Decisões Técnicas](.docs/05-desenvolvimento/09-DECISOES_TECNICAS.md)** - ADRs

### 📊 Relatórios e Entregas
- **[Entrega v1.4](.docs/06-entregas/15-ENTREGA_FINAL_v1.4.md)** - Última versão
- **[Resumo Final](.docs/06-entregas/RESUMO_FINAL_v1.4.txt)** - Quick overview

### 📁 Estrutura Completa
```
.docs/
├── 01-inicio/          # Guias de quick start e setup
├── 02-arquitetura/     # Documentação técnica
├── 03-widget/          # Widget embarcável
├── 04-features/        # Funcionalidades específicas
├── 05-desenvolvimento/ # Processo e decisões
├── 06-entregas/        # Relatórios de versões
└── 07-scripts/         # Scripts e exemplos
```

**👉 Veja o [ÍNDICE COMPLETO](.docs/INDEX.md) para navegação detalhada**

## 🚀 Quick Start

**📖 Guia Completo:** [02-COMO_RODAR.md](.docs/01-inicio/02-COMO_RODAR.md)

### **🎨 Novo: Widget Embarcável**

Integre o chat em sistemas legados com apenas 2 linhas:

```html
<script src="https://chat.empresa.com/chat-widget.js"></script>
<script>
  ChatWidget.init({
    token: 'SEU_JWT_TOKEN',
    apiUrl: 'http://localhost:3000'
  });
</script>
```

**🧪 Testar Widget:**
```bash
.docs/07-scripts/testar-widget.sh
# Abrirá: http://localhost:8080/exemplo-dashboard.html
```

**📖 Documentação:** 
- [WIDGET_INTEGRATION.md](.docs/03-widget/WIDGET_INTEGRATION.md) - Guia de integração
- [TESTE_WIDGET.md](.docs/03-widget/TESTE_WIDGET.md) - Guia de testes
- [GERAR_TOKEN.md](.docs/03-widget/GERAR_TOKEN.md) - Como gerar tokens

### Instalação Rápida (5 minutos)

```bash
# 1. Clone
git clone https://github.com/zanon-alive/chat-interno.git
cd chat-interno

# 2. Backend
cd backend
npm install
npm run migrate  # Criar banco
npm run seed     # Popular com dados de teste

# 3. Frontend (novo terminal)
cd ../frontend
npm install

# 4. Rodar
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

# 5. Acessar: http://localhost:5173
# Login: pedro.oliveira@empresademo.com / User@123456
```

**✅ Chat funcionando em 5 minutos!**

### Usuários de Teste

- **Super Admin:** admin@chatinterno.com / Admin@123456
- **Admin Cliente:** joao.silva@empresademo.com / Admin@123456
- **Usuário:** pedro.oliveira@empresademo.com / User@123456

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
│   │   ├── widget/      # Widget embarcável
│   │   └── utils/       # Utilitários
│   └── public/         # Arquivos estáticos
│
└── .docs/              # Documentação organizada
    ├── 01-inicio/          # Guias de setup
    ├── 02-arquitetura/     # Docs técnicos
    ├── 03-widget/          # Widget embarcável
    ├── 04-features/        # Funcionalidades
    ├── 05-desenvolvimento/ # Processo de dev
    ├── 06-entregas/        # Relatórios
    └── 07-scripts/         # Scripts auxiliares
```

## 🔐 Segurança

- Autenticação JWT
- Isolamento multi-tenant em nível de banco de dados
- Validação de permissões em todas as requisições
- Criptografia de senhas com bcrypt
- Rate limiting e proteção contra ataques

## 📊 Status do Projeto

✅ **MVP FUNCIONAL** - Backend 100% + Frontend 30%

**Progresso Geral:**

```
Backend MVP:     ████████████████████ 100% ✅
Frontend MVP:    ██████░░░░░░░░░░░░░░  30% 🔄
Documentação:    ████████████████████ 100% ✅
Testes:          ░░░░░░░░░░░░░░░░░░░░   0% ⏳
Deploy:          ░░░░░░░░░░░░░░░░░░░░   0% ⏳

Total:           ████████████░░░░░░░░  65%
```

### 🎯 Funcionalidades Implementadas

- ✅ **40 endpoints REST** funcionando
- ✅ **10 eventos Socket.IO** em tempo real
- ✅ **Chat funcionando** com mensagens instantâneas
- ✅ **Multi-tenancy** seguro
- ✅ **Autenticação JWT** robusta
- ✅ **Banco de dados** completo
- ✅ **Login + Interface** de chat

### 🚀 Pode Usar Agora!

```bash
# Terminal 1
cd backend && npm install && npm run migrate && npm run seed && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev

# Acesse: http://localhost:5173
# Login: pedro.oliveira@empresademo.com / User@123456
```

**Em 5 minutos você terá o chat funcionando!**

## 📝 Licença

[Definir licença]

## 👨‍💻 Equipe

[Definir equipe]

