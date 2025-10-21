# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [2.0] - 2025-10-21

### 🎉 Destaques da Release

Esta é uma **release major** que introduz **Sistema White-Label completo** e **Dashboards Profissionais** com KPIs e gráficos interativos. A interface administrativa foi completamente renovada com nova navegação e experiência do usuário.

### ✨ Adicionado

#### 🎨 Sistema White-Label
- **18 cores customizáveis** por instância:
  - Cor primária e hover
  - Cor secundária e hover
  - Cores de fundo (primário, secundário, terciário)
  - Cores de texto (primária, secundária, placeholder)
  - Cores de borda e hover
  - Cores de sucesso, erro, aviso e informação
- **Logo personalizado** com controle de dimensões (largura e altura)
- **Border-radius configurável** (0-20px)
- **Fonte principal customizável** (Inter, Roboto, Open Sans, Lato, Montserrat)
- **Auditoria completa** de alterações de tema (quem, quando, o que mudou)
- **Preview em tempo real** das alterações
- **Botão de reset** para restaurar tema padrão
- **Aplicação automática** em frontend principal e widget embarcável

#### 📊 Dashboards Profissionais

**Dashboard Super Admin:**
- 5 KPIs globais:
  - Total de empresas cadastradas
  - Total de usuários cadastrados
  - Usuários online no momento
  - Conversas ativas no dia
  - Total de mensagens trocadas no dia
- 4 gráficos interativos (Chart.js):
  - Usuários online por hora (últimas 24h)
  - Conversas por hora (últimas 24h)
  - Mensagens por hora (últimas 24h)
  - Top 5 empresas mais ativas
- Tabela de empresas com estatísticas detalhadas
- Filtro por empresa nos gráficos
- Acesso direto ao tema de cada cliente
- Atalhos para gestão de empresas e instâncias

**Dashboard Admin Cliente:**
- 5 KPIs da instância:
  - Total de usuários
  - Usuários online
  - Conversas ativas no dia
  - Mensagens trocadas no dia
  - Taxa média de resposta
- 4 gráficos interativos (Chart.js):
  - Usuários online por hora (últimas 24h)
  - Conversas por hora (últimas 24h)
  - Mensagens por hora (últimas 24h)
  - Equipes mais ativas
- 4 atalhos rápidos:
  - Personalização Visual
  - Gerenciar Usuários
  - Gerenciar Equipes
  - Ir para o Chat
- Relatório de acessos às conversas
- Horários de pico de atividade

#### 🧭 Navegação Aprimorada
- **Sidebar lateral** com menu dinâmico por role
- **Dropdown "Configurações"** no Navbar
- **Logo customizado** exibido no Navbar
- **Link home dinâmico** (redireciona para dashboard apropriado)
- **Layout responsivo** com DashboardLayout
- **Notificações visuais** no ícone do chat
- **Navegação intuitiva** entre seções

#### 🔧 Backend - Novos Endpoints

**Admin (12 endpoints):**
- `GET /api/admin/estatisticas/geral` - Estatísticas gerais da instância
- `GET /api/admin/estatisticas/usuarios-online` - Usuários online por hora
- `GET /api/admin/estatisticas/conversas` - Conversas por hora
- `GET /api/admin/estatisticas/mensagens` - Mensagens por hora
- `GET /api/admin/estatisticas/equipes` - Atividade por equipe
- `GET /api/admin/relatorios/acessos-conversas` - Acessos às conversas
- `GET /api/admin/relatorios/horarios-pico` - Horários de pico
- `GET /api/admin/tema` - Obter tema da instância
- `PUT /api/admin/tema` - Atualizar tema
- `PUT /api/admin/tema/logo` - Atualizar logo
- `POST /api/admin/tema/resetar` - Resetar tema
- `GET /api/admin/tema/logs` - Log de alterações

**SuperAdmin (7 endpoints):**
- `GET /api/superadmin/estatisticas/geral` - Estatísticas globais
- `GET /api/superadmin/estatisticas/usuarios-online` - Usuários online (global)
- `GET /api/superadmin/estatisticas/conversas` - Conversas (global)
- `GET /api/superadmin/estatisticas/mensagens` - Mensagens (global)
- `GET /api/superadmin/estatisticas/empresas` - Detalhes por empresa
- `GET /api/superadmin/tema/:id` - Obter tema de uma instância
- `PUT /api/superadmin/tema/:id` - Atualizar tema de uma instância

#### 🛠️ Infraestrutura
- **Dockerfile** para backend (Node.js)
- **Dockerfile** para frontend (nginx)
- **docker-compose.yml** para orquestração
- **nginx.conf** otimizado para SPA

#### 📖 Documentação
- Estrutura `.docs/` reorganizada em 7 categorias:
  - `01-inicio/` - Guias de início rápido
  - `02-arquitetura/` - Documentação técnica
  - `03-widget/` - Widget embarcável
  - `04-features/` - Documentação de features
  - `05-desenvolvimento/` - Histórico de desenvolvimento
  - `06-entregas/` - Documentos de entrega
  - `07-scripts/` - Scripts auxiliares
- `INDEX.md` navegável criado
- Documento de entrega v2.0 completo
- Plano de implementação detalhado (897 linhas)
- Sistema White-Label documentado (563 linhas)

### 🔄 Modificado

#### Frontend
- **App.vue**: Integração com `useTheme` para carregamento automático de tema
- **Navbar.vue**: 
  - Logo customizado
  - Dropdown de configurações
  - Home route dinâmico por role
- **AdminDashboard.vue**: Reescrito completamente com KPIs e gráficos
- **SuperAdminDashboard.vue**: Reescrito completamente com visão global
- **Usuarios.vue**: Modal de token de widget integrado

#### Backend
- **authService.js**: Inclui tema no payload de login/me
- **admin.routes.js**: 12 novas rotas adicionadas
- **superadmin.routes.js**: 7 novas rotas adicionadas

#### Widget
- **ChatWidget.vue**: Aplica tema automaticamente do token JWT
- **WidgetMinimized.vue**: Corrigido nome do remetente
- **WidgetExpanded.vue**: Modal Nova Conversa com grupos

### 🐛 Corrigido

- **[CRÍTICO]** Caractere Unicode invisível em `temaService.criarTemaPadrao()`
- **[CRÍTICO]** `req.usuario` → `req.user` padronizado em todos controllers
- **[MÉDIO]** Validação de `req.user` em todos endpoints de estatísticas
- **[MÉDIO]** Nome do remetente no widget minimizado
- **[BAIXO]** Modal "Nova Conversa" não carregava usuários no widget
- **[BAIXO]** Modal "Nova Conversa" não exibia no widget

### 🗄️ Database

#### Novas Migrations
- `20251017020000-add-user-widget-token.js` - Tokens de widget
- `20251018100000-create-tema-instancia.js` - Temas de instância
- `20251018100100-create-tema-logs.js` - Logs de alterações de tema

#### Novos Models
- **TemaInstancia** - Armazena configurações de tema por instância
- **TemaLog** - Auditoria de alterações de tema
- **Usuario** - Campos `widget_token`, `widget_token_expira_em`, `widget_token_sempre_valido`

### 📦 Dependências

#### Frontend
- **Adicionado**: `chart.js@^4.4.0` - Gráficos interativos

### 📊 Estatísticas da Release

```
Commits:              16 (total: 69)
Arquivos alterados:   90
Linhas adicionadas:   +9.858
Linhas removidas:     -117
Líquido:              +9.741

Novos arquivos:       22
Migrations:           3
Models:               2
Controllers:          5
Services:             4
Componentes Vue:      13
Composables:          2
Views:                2
```

### 🔗 Links Importantes

- [Documento de Entrega v2.0](.docs/06-entregas/16-ENTREGA_v2.0_DASHBOARDS.md)
- [Plano de Implementação](.docs/05-desenvolvimento/PLANO_MELHORIAS_DASHBOARDS.md)
- [Sistema White-Label](.docs/04-features/SISTEMA_WHITE_LABEL.md)
- [Índice da Documentação](.docs/INDEX.md)

### 🎯 Breaking Changes

Nenhum breaking change nesta release. Totalmente retrocompatível com v1.4.

### 🚀 Como Atualizar

```bash
# 1. Atualizar código
git pull origin main

# 2. Instalar dependências do frontend
cd frontend
npm install

# 3. Rodar migrations
cd ../backend
npm run migrate

# 4. Reiniciar servidores
npm run dev
```

---

## [1.4] - 2025-10-17

### ✨ Adicionado

#### Sistema de Tokens de Widget
- Tokens permanentes para usuários
- Gestão de tokens com expiração configurável
- Checkbox "Sempre válido" para tokens sem expiração
- Modal de gerenciamento de tokens na interface admin
- Endpoint para gerar token: `POST /api/admin/usuarios/:id/gerar-token-widget`
- Endpoint para obter token: `GET /api/admin/usuarios/:id/token-widget`
- Endpoint para revogar token: `DELETE /api/admin/usuarios/:id/token-widget`

#### Widget - Modal Nova Conversa
- Criação de grupos diretamente no widget
- Seleção de múltiplos usuários
- Campo de nome do grupo
- Mesmas funcionalidades do chat principal

### 🐛 Corrigido

- Nome do remetente incorreto quando widget minimizado
- Modal "Nova Conversa" não carregava usuários no widget
- Modal não aparecia ao clicar em "+" no widget

### 📖 Documentação

- Guia completo de gerenciamento de tokens de widget
- Resumo visual final v1.4
- Documento de entrega consolidado v1.4

---

## [1.3] - 2025-10-15

### ✨ Adicionado

#### Chat Widget Embarcável
- Widget completo em 2 linhas de código
- Estados: minimizado, expandido, offline
- Integração via script tag
- Autenticação via token JWT
- Real-time com Socket.IO
- Notificações de novas mensagens
- Indicador de mensagens não lidas

### 📖 Documentação

- Guia de integração do widget
- Exemplos de implementação
- Scripts de teste
- Entrega final v1.3

---

## [1.0] - 2025-10-10

### ✨ Adicionado

#### Features Principais
- Chat em tempo real com Socket.IO
- Conversas 1-on-1 e grupos
- Status de mensagens (enviado ✓, entregue ✓✓, lido ✓✓ verde)
- Multi-tenancy robusto
- Sistema de permissões (Super Admin, Admin Cliente, Usuário)
- Gestão de empresas e instâncias
- Gestão de usuários e equipes
- Autenticação JWT
- Upload de imagens
- Busca de mensagens
- Notificações em tempo real

#### Backend
- API RESTful completa
- Socket.IO para real-time
- SQLite com Sequelize ORM
- Middlewares de segurança
- Validação de tenant
- Logs estruturados

#### Frontend
- Vue.js 3 com Composition API
- Pinia para state management
- Vite para build
- Interface moderna e responsiva
- Componentes reutilizáveis

### 📖 Documentação

- Arquitetura completa
- Modelo de dados
- Requisitos funcionais
- Guia de desenvolvimento
- Como rodar o projeto

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas funcionalidades
- `🔄 Modificado` - Mudanças em funcionalidades existentes
- `🐛 Corrigido` - Correções de bugs
- `🗑️ Removido` - Funcionalidades removidas
- `🔒 Segurança` - Correções de vulnerabilidades
- `📦 Dependências` - Atualizações de dependências
- `🗄️ Database` - Mudanças no banco de dados
- `📖 Documentação` - Mudanças na documentação
- `🎯 Breaking Changes` - Mudanças incompatíveis com versões anteriores

---

**Formato de versionamento:** [MAJOR.MINOR.PATCH]
- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades (retrocompatíveis)
- **PATCH**: Correções de bugs (retrocompatíveis)

