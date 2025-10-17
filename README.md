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

A documentação completa do projeto está organizada em ordem de leitura:

### **Documentos Principais (Raiz):**
1. **[01-START_HERE.md](./01-START_HERE.md)** ⭐ - Comece aqui! (5 min)
2. **[02-COMO_RODAR.md](./02-COMO_RODAR.md)** - Instruções passo a passo (10 min)
3. **[03-ENTREGA_FINAL.md](./03-ENTREGA_FINAL.md)** - Documento de entrega
4. **[04-DESENVOLVIMENTO_COMPLETO.md](./04-DESENVOLVIMENTO_COMPLETO.md)** - Relatório técnico
5. **[05-MELHORIAS_IMPLEMENTADAS.md](./05-MELHORIAS_IMPLEMENTADAS.md)** - Melhorias recentes
6. **[06-RELATORIO_COMPLETO_FINAL.md](./06-RELATORIO_COMPLETO_FINAL.md)** - Relatório consolidado
7. **[07-RESUMO_DESENVOLVIMENTO.md](./07-RESUMO_DESENVOLVIMENTO.md)** - Resumo técnico
8. **[08-PROGRESSO.md](./08-PROGRESSO.md)** - Status por fase
9. **[09-DECISOES_TECNICAS.md](./09-DECISOES_TECNICAS.md)** - Decisões e revisões
10. **[10-CHECKLIST_PROJETO.md](./10-CHECKLIST_PROJETO.md)** - Checklist completo

### **Documentos Técnicos (docs/):**
- **[REQUISITOS.md](./docs/REQUISITOS.md)** - Requisitos funcionais e não funcionais
- **[ARQUITETURA.md](./docs/ARQUITETURA.md)** - Arquitetura do sistema
- **[MODELO_DADOS.md](./docs/MODELO_DADOS.md)** - Estrutura do banco de dados
- **[FASES_DESENVOLVIMENTO.md](./docs/FASES_DESENVOLVIMENTO.md)** - Planejamento
- **[GUIA_DESENVOLVIMENTO.md](./docs/GUIA_DESENVOLVIMENTO.md)** - Manual do desenvolvedor

## 🚀 Quick Start

**📖 Guia Completo:** [02-COMO_RODAR.md](./02-COMO_RODAR.md)

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

**📖 Documentação:** [WIDGET_INTEGRATION.md](./WIDGET_INTEGRATION.md)

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

