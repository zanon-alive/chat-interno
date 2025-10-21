# Fases de Desenvolvimento - Chat Interno

## 📋 Visão Geral

Este documento organiza o desenvolvimento do sistema em fases incrementais, priorizando funcionalidades core e garantindo entregas progressivas.

**Metodologia:** Desenvolvimento Incremental com entregas em Sprints de 2 semanas.

---

## 🎯 Resumo das Fases

| Fase | Título | Duração Estimada | Status |
|------|--------|------------------|--------|
| **Fase 0** | Setup e Infraestrutura | 1 semana | 📝 Planejamento |
| **Fase 1** | Super Administração & Multi-Tenancy | 3-4 semanas | 📝 Planejamento |
| **Fase 2** | Administração do Cliente | 3-4 semanas | 📝 Planejamento |
| **Fase 3** | Chat Básico (MVP) | 4-5 semanas | 📝 Planejamento |
| **Fase 4** | Chat Avançado & Permissões | 3-4 semanas | 📝 Planejamento |
| **Fase 5** | Supervisão & Relatórios | 2-3 semanas | 📝 Planejamento |
| **Fase 6** | Melhorias & Features Extras | 3-4 semanas | 📝 Planejamento |
| **Fase 7** | Otimização & Deploy | 2 semanas | 📝 Planejamento |

**Total Estimado:** 21-27 semanas (~5-7 meses)

---

## Fase 0: Setup e Infraestrutura

**Duração:** 1 semana  
**Objetivo:** Preparar ambiente de desenvolvimento e estrutura base do projeto.

### Entregas

#### Backend
- [x] Inicialização do projeto Node.js
  - Setup `package.json`
  - Configuração ESLint + Prettier
  - Estrutura de pastas
- [ ] Configuração do Express.js
  - Middlewares básicos (cors, body-parser, helmet)
  - Error handling global
- [ ] Configuração Sequelize + PostgreSQL
  - Conexão com banco
  - Setup de migrações
- [ ] Configuração de variáveis de ambiente
  - `.env.example`
  - Validação com `dotenv`

#### Frontend
- [ ] Inicialização do projeto Vue.js
  - Vue 3 + Vite
  - Configuração ESLint
  - Estrutura de pastas
- [ ] Configuração Vue Router
  - Rotas básicas
- [ ] Configuração Pinia
  - Setup inicial de stores
- [ ] Configuração Axios
  - Interceptors
  - Base URL

#### DevOps
- [ ] Git repository
  - `.gitignore`
  - README inicial
  - Estrutura de branches (main, develop, feature/*)
- [ ] Docker setup (opcional)
  - Dockerfile backend
  - Dockerfile frontend
  - docker-compose.yml
- [ ] Scripts npm
  - `dev`, `build`, `test`, `migrate`

### Checklist de Qualidade
- [ ] Documentação README atualizada
- [ ] Variáveis de ambiente documentadas
- [ ] Projeto roda localmente sem erros
- [ ] Conexão com banco de dados funcionando

---

## Fase 1: Super Administração & Multi-Tenancy

**Duração:** 3-4 semanas (6-8 sprints de 2 semanas)  
**Objetivo:** Implementar módulo de Super Admin e fundação multi-tenant.

### Sprint 1.1: Autenticação e Super Admin Base (1 semana)

#### Backend
- [ ] **RF15**: Model Usuario (Super Admin)
  - Migration
  - Model Sequelize
  - Seed de Super Admin inicial
- [ ] Sistema de Autenticação JWT
  - Service de autenticação
  - Middleware `auth.js`
  - Hash de senhas com bcrypt
- [ ] Endpoints de Autenticação
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh-token` (futuro)
  - `GET /api/auth/me`

#### Frontend
- [ ] Página de Login
  - Formulário de login
  - Validação de campos
  - Integração com API
- [ ] Store de Autenticação
  - `authStore` (Pinia)
  - Persistência de token (localStorage)
  - Auto-login
- [ ] Router Guards
  - Verificação de autenticação
  - Redirecionamento

#### Testes
- [ ] Testes unitários de autenticação
- [ ] Testes de endpoints de login

### Sprint 1.2: Gestão de Empresas (1 semana)

#### Backend
- [ ] **RF16**: CRUD de Empresas
  - Migration `empresas`
  - Model Empresa
  - Controller empresaController
  - Service empresaService
- [ ] Endpoints de Empresas
  - `GET /api/superadmin/empresas` (listar)
  - `POST /api/superadmin/empresas` (criar)
  - `GET /api/superadmin/empresas/:id` (detalhar)
  - `PUT /api/superadmin/empresas/:id` (editar)
  - `DELETE /api/superadmin/empresas/:id` (soft delete)
- [ ] Validações
  - CNPJ único e válido
  - Campos obrigatórios

#### Frontend
- [ ] Dashboard Super Admin
  - Layout básico
  - Menu lateral
- [ ] Página Listagem de Empresas
  - Tabela com filtros
  - Paginação
  - Busca
- [ ] Página Cadastro/Edição de Empresa
  - Formulário completo
  - Validação frontend
  - Integração API

#### Testes
- [ ] Testes de CRUD de empresas
- [ ] Validação de CNPJ

### Sprint 1.3: Gestão de Instâncias (1-2 semanas)

#### Backend
- [ ] **RF17 e RF18**: CRUD de Instâncias
  - Migration `instancias_chat`
  - Model InstanciaChat
  - Relacionamento com Empresa
  - Controller e Service
- [ ] Endpoints de Instâncias
  - `GET /api/superadmin/instancias` (listar)
  - `POST /api/superadmin/instancias` (criar)
  - `GET /api/superadmin/instancias/:id`
  - `PUT /api/superadmin/instancias/:id`
  - `DELETE /api/superadmin/instancias/:id`
- [ ] **RF19**: Criação de Admin Inicial
  - Endpoint para criar admin da instância
  - Envio de email com credenciais (mock inicial)
  - Flag `forcar_troca_senha`

#### Frontend
- [ ] Página Listagem de Instâncias
  - Filtro por empresa
  - Indicador de limite de usuários
- [ ] Página Cadastro/Edição de Instância
  - Seleção de empresa
  - Campos de limite
  - Criação de admin inicial
- [ ] Indicadores Visuais
  - Status da instância
  - Contador de usuários

#### Testes
- [ ] Testes de CRUD de instâncias
- [ ] Validação de limite de usuários

### Sprint 1.4: Multi-Tenancy Foundation

#### Backend
- [ ] Middleware `tenantValidation.js`
  - Injeção de `id_instancia_chat` em queries
  - Validação de acesso
- [ ] Scopes no Sequelize
  - Default scope com filtro de tenant
- [ ] Testes de Isolamento
  - Garantir que dados não vazam entre instâncias
  - Testes de segurança

#### Testes
- [ ] Testes de isolamento multi-tenant
- [ ] Testes de penetração básicos

### Entrega Fase 1
✅ **Super Admin consegue:**
- Login no sistema
- Cadastrar empresas
- Cadastrar instâncias para empresas
- Definir limites de usuários
- Criar admin inicial para instâncias
- **Sistema garante isolamento entre instâncias**

---

## Fase 2: Administração do Cliente

**Duração:** 3-4 semanas  
**Objetivo:** Implementar painel de Admin do Cliente para gestão de usuários e equipes.

### Sprint 2.1: Login e Dashboard Admin Cliente (1 semana)

#### Backend
- [ ] **RF01**: Autenticação Admin Cliente
  - Endpoint de login para admin
  - Verificação de nível de permissão
  - Middleware `roleCheck.js`
- [ ] Endpoint de Seleção de Instância
  - `GET /api/admin/instancias` (minhas instâncias)
  - `POST /api/admin/selecionar-instancia`

#### Frontend
- [ ] Login Admin Cliente
  - Diferenciação de Super Admin
- [ ] Seleção de Instância (se admin de múltiplas)
- [ ] Dashboard Admin Cliente
  - Visão geral (usuários, equipes, mensagens)
  - Gráficos básicos

### Sprint 2.2: Gestão de Equipes (1 semana)

#### Backend
- [ ] **RF02**: CRUD de Equipes
  - Migration `equipes`
  - Model Equipe
  - Controller e Service
  - Validação de tenant
- [ ] Endpoints de Equipes
  - `GET /api/admin/equipes`
  - `POST /api/admin/equipes`
  - `PUT /api/admin/equipes/:id`
  - `DELETE /api/admin/equipes/:id` (com validação)

#### Frontend
- [ ] Página Listagem de Equipes
  - Contador de membros
- [ ] Página Cadastro/Edição de Equipe
  - Formulário simples

#### Testes
- [ ] Não permitir deletar equipe com usuários
- [ ] Isolamento de equipes por tenant

### Sprint 2.3: Gestão de Usuários (1-2 semanas)

#### Backend
- [ ] **RF03 e RF04**: CRUD de Usuários
  - Migration `usuarios` (completa)
  - Controller e Service
  - Validação de limite de usuários (trigger ou service)
- [ ] **RF05**: Hierarquia (Supervisor)
  - Campo `id_supervisor`
  - Validação de ciclos
- [ ] Endpoints de Usuários
  - `GET /api/admin/usuarios`
  - `POST /api/admin/usuarios` (com validação de limite)
  - `PUT /api/admin/usuarios/:id`
  - `DELETE /api/admin/usuarios/:id` (soft delete)
- [ ] Envio de Email (mock)
  - Service de email
  - Template de boas-vindas

#### Frontend
- [ ] Página Listagem de Usuários
  - Tabela com filtros (equipe, status)
  - Indicador de limite (45/50)
  - Busca por nome/email
- [ ] Página Cadastro/Edição de Usuário
  - Campos completos
  - Seleção de equipe
  - Seleção de supervisor
  - Validação frontend
- [ ] Mensagem de Limite Atingido
  - Modal informativo

#### Testes
- [ ] Validação de limite funciona
- [ ] Ciclos hierárquicos são prevenidos
- [ ] Soft delete de usuário

### Entrega Fase 2
✅ **Admin do Cliente consegue:**
- Login e seleção de instância
- Criar e gerenciar equipes
- Cadastrar usuários (respeitando limite)
- Definir hierarquia (supervisores)
- Editar e desativar usuários

---

## Fase 3: Chat Básico (MVP)

**Duração:** 4-5 semanas  
**Objetivo:** Implementar funcionalidade core de chat em tempo real.

### Sprint 3.1: Estrutura de Conversas (1 semana)

#### Backend
- [ ] **RF09**: Models de Conversas
  - Migration `conversas`
  - Migration `participantes_conversa`
  - Migration `mensagens`
  - Models e relacionamentos
- [ ] Endpoints de Conversas
  - `GET /api/chat/conversas` (minhas conversas)
  - `POST /api/chat/conversas` (criar conversa 1-on-1)
  - `GET /api/chat/conversas/:id/mensagens` (histórico)

#### Frontend
- [ ] Layout Interface de Chat
  - Sidebar com lista de conversas
  - Área principal de mensagens
  - Input de mensagem
- [ ] Store de Chat
  - `chatStore`
  - Lista de conversas
  - Mensagens da conversa ativa

### Sprint 3.2: Socket.IO Setup (1 semana)

#### Backend
- [ ] **RF08**: Configuração Socket.IO
  - `socketService.js`
  - Autenticação via socket
  - Rooms por conversa
- [ ] Handlers de Socket
  - `connection` (autenticação)
  - `disconnect`
  - `join_conversation`
  - `leave_conversation`

#### Frontend
- [ ] Integração Socket.IO Client
  - `useSocket` composable
  - Conexão ao backend
  - Listeners de eventos

#### Testes
- [ ] Teste de conexão Socket.IO
- [ ] Autenticação via socket

### Sprint 3.3: Envio e Recebimento de Mensagens (1-2 semanas)

#### Backend
- [ ] **RF08**: Envio de Mensagens
  - Handler `message:send`
  - Persistência no banco
  - Broadcast para participantes
  - Validação de permissão
- [ ] Recebimento de Mensagens
  - Handler `message:new`
  - Notificação em tempo real

#### Frontend
- [ ] Componente MessageList
  - Exibição de mensagens
  - Auto-scroll para última mensagem
  - Agrupamento por data/remetente
- [ ] Componente MessageInput
  - Input com textarea
  - Envio com Enter
  - Feedback de envio
- [ ] Integração Socket
  - Envio via socket
  - Recebimento em tempo real
  - Atualização da store

#### Testes
- [ ] Mensagem é enviada e persistida
- [ ] Destinatário recebe em tempo real
- [ ] Validação de tenant (não envia para instância errada)

### Sprint 3.4: Histórico e UX (1 semana)

#### Backend
- [ ] **RF11**: Paginação de Mensagens
  - Endpoint com limit/offset
  - Ordenação DESC
- [ ] Otimização de Queries
  - Eager loading de participantes

#### Frontend
- [ ] Scroll Infinito
  - Carregar mais ao rolar para cima
  - Loading spinner
- [ ] Indicadores Visuais
  - Quem está digitando (futuro)
  - Timestamp de mensagens
  - Usuário online/offline (básico)
- [ ] Responsividade
  - Mobile-friendly

#### Testes
- [ ] Paginação funciona corretamente
- [ ] Performance com 1000+ mensagens

### Entrega Fase 3 (MVP)
✅ **Usuário Final consegue:**
- Login no chat
- Ver lista de conversas
- Iniciar conversa 1-on-1 (com usuários permitidos)
- Enviar mensagens de texto
- Receber mensagens em tempo real
- Ver histórico completo

🎉 **MVP Funcional!**

---

## Fase 4: Chat Avançado & Permissões

**Duração:** 3-4 semanas  
**Objetivo:** Implementar permissões customizáveis e conversas em grupo.

### Sprint 4.1: Sistema de Permissões (1-2 semanas)

#### Backend
- [ ] **RF06**: CRUD de Permissões
  - Migration `permissoes_comunicacao`
  - Model e Service
  - Lógica de verificação
- [ ] Endpoints de Permissões
  - `GET /api/admin/permissoes`
  - `POST /api/admin/permissoes` (criar/atualizar)
  - `GET /api/admin/permissoes/usuario/:id`
- [ ] Middleware de Validação de Permissão
  - `canCommunicateWith(userA, userB)`
  - Aplicar em criação de conversas

#### Frontend
- [ ] Página de Configuração de Permissões
  - Interface intuitiva
  - Modelos pré-definidos (restrito, padrão, equipe, geral)
  - Modo customizado (seleção manual)
- [ ] Aplicação em massa por equipe
- [ ] Visualização de "Quem pode falar com quem"
  - Matriz visual

#### Testes
- [ ] Permissão restrita impede conversa não autorizada
- [ ] Modelos pré-definidos funcionam

### Sprint 4.2: Conversas em Grupo (1 semana)

#### Backend
- [ ] **RF10**: Criação de Grupos
  - Endpoint `POST /api/chat/grupos`
  - Tipo de conversa: grupo
  - Adição de múltiplos participantes
- [ ] Gestão de Participantes
  - `POST /api/chat/grupos/:id/adicionar`
  - `POST /api/chat/grupos/:id/remover`
  - Validação de permissões

#### Frontend
- [ ] Criar Grupo
  - Modal de criação
  - Seleção múltipla de usuários
  - Nome do grupo
- [ ] Gestão de Grupo
  - Adicionar/remover membros
  - Editar nome

### Sprint 4.3: Canais de Equipe e Canal Geral (1 semana)

#### Backend
- [ ] **RF10**: Canais Automáticos
  - Criação automática de canal por equipe
  - Canal Geral da instância
  - Tipo de conversa: canal

#### Frontend
- [ ] Exibição de Canais
  - Seção separada na sidebar
  - Ícones diferentes
- [ ] Entrar/Sair de Canais

### Entrega Fase 4
✅ **Sistema possui:**
- Permissões customizáveis
- Conversas em grupo
- Canais por equipe
- Canal geral da instância
- Admin pode configurar "quem fala com quem"

---

## Fase 5: Supervisão & Relatórios

**Duração:** 2-3 semanas  
**Objetivo:** Painel de supervisão para Admin do Cliente.

### Sprint 5.1: Visualização de Conversas (1 semana)

#### Backend
- [ ] **RF13**: Endpoints de Supervisão
  - `GET /api/admin/supervisao/conversas` (todas)
  - `GET /api/admin/supervisao/conversas/:id/mensagens`
  - Filtros: usuário, equipe, período
- [ ] Busca Global de Mensagens
  - Full-text search
  - `GET /api/admin/supervisao/buscar?q=termo`

#### Frontend
- [ ] Página de Supervisão
  - Listagem de conversas
  - Filtros avançados
  - Visualização em modo leitura
- [ ] Busca Global
  - Campo de busca
  - Resultados destacados

### Sprint 5.2: Relatórios e Métricas (1-2 semanas)

#### Backend
- [ ] **RF14**: Endpoints de Relatórios
  - `GET /api/admin/relatorios/dashboard`
  - Queries otimizadas
  - Agregações

#### Frontend
- [ ] Dashboard de Métricas
  - Gráficos (Chart.js ou similar)
  - Usuários ativos
  - Mensagens por período
  - Conversas mais ativas
- [ ] Exportação de Relatórios
  - CSV (futuro)

### Entrega Fase 5
✅ **Admin do Cliente consegue:**
- Visualizar todas as conversas
- Buscar mensagens globalmente
- Ver métricas e relatórios
- Exportar dados

---

## Fase 6: Melhorias & Features Extras

**Duração:** 3-4 semanas  
**Objetivo:** Polimento e funcionalidades adicionais.

### Sprint 6.1: Status e Presença (1 semana)

#### Backend
- [ ] **RF23**: Status de Usuários
  - Online/Offline automático (socket)
  - Ausente/Ocupado/Invisível (manual)
- [ ] Handlers Socket
  - `user:online`, `user:offline`
  - Broadcast de status

#### Frontend
- [ ] Indicadores de Status
  - Bolinha verde/cinza
  - Seletor de status manual
- [ ] Lista de Usuários Online
  - Sidebar ou modal

### Sprint 6.2: Notificações (1 semana)

#### Backend
- [ ] **RF12**: Lógica de Notificações
  - Marcar mensagens não lidas
  - Endpoint `GET /api/chat/nao-lidas`

#### Frontend
- [ ] Notificações Browser
  - Permissão do usuário
  - `Notification API`
- [ ] Badge de Não Lidas
  - Contador na conversa
  - Contador global
- [ ] Som de Notificação
  - Configurável

### Sprint 6.3: Edição e Deleção de Mensagens (1 semana)

#### Backend
- [ ] Editar Mensagem
  - Endpoint `PUT /api/chat/mensagens/:id`
  - Flag `editada`
- [ ] Deletar Mensagem
  - Soft delete
  - Mensagem "[deletada]"

#### Frontend
- [ ] Menu de Contexto em Mensagens
  - Editar (própria mensagem)
  - Deletar
- [ ] Indicador de Editada

### Sprint 6.4: UX e Polimento (1 semana)

#### Frontend
- [ ] Loading States
- [ ] Error Handling
- [ ] Validações Completas
- [ ] Responsividade Final
- [ ] Acessibilidade (WCAG)
- [ ] Temas (Dark Mode - opcional)

#### Backend
- [ ] Rate Limiting Completo
- [ ] Logs Estruturados
- [ ] Error Tracking (Sentry - opcional)

### Sprint 6.5: Logs de Auditoria (opcional)

#### Backend
- [ ] **RF27**: Migration `logs_auditoria`
- [ ] Middleware de Log
  - Registrar todas as ações admin
- [ ] Endpoint de Consulta
  - `GET /api/admin/logs`

#### Frontend
- [ ] Página de Logs
  - Filtros por ação, usuário, data

### Entrega Fase 6
✅ **Sistema aprimorado com:**
- Status de usuários
- Notificações completas
- Edição/deleção de mensagens
- UX polida
- Logs de auditoria

---

## Fase 7: Otimização & Deploy

**Duração:** 2 semanas  
**Objetivo:** Preparar para produção.

### Sprint 7.1: Testes e Qualidade (1 semana)

#### Testes
- [ ] Testes Unitários (coverage > 70%)
- [ ] Testes de Integração
- [ ] Testes E2E (Cypress ou Playwright)
- [ ] Testes de Carga (Artillery ou k6)
- [ ] Testes de Segurança

#### Code Quality
- [ ] Code Review completo
- [ ] Refatoração
- [ ] Documentação de código

### Sprint 7.2: Deploy e DevOps (1 semana)

#### Backend
- [ ] Dockerfile otimizado
- [ ] CI/CD (GitHub Actions)
- [ ] Variáveis de ambiente de produção
- [ ] Migrations em produção
- [ ] PM2 ou similar

#### Frontend
- [ ] Build otimizado (Vite)
- [ ] Compressão e minificação
- [ ] CDN para assets (opcional)

#### Infraestrutura
- [ ] Servidor de produção
- [ ] PostgreSQL configurado
- [ ] Nginx como reverse proxy
- [ ] SSL/TLS (Let's Encrypt)
- [ ] Backup automatizado
- [ ] Monitoramento (opcional)

#### Documentação
- [ ] README completo
- [ ] Guia de instalação
- [ ] Guia de deploy
- [ ] Documentação de API (Swagger - opcional)

### Entrega Fase 7
✅ **Sistema em produção:**
- Deploy funcional
- Testes completos
- Documentação atualizada
- Monitoramento ativo

---

## 📊 Marcos e Entregas

| Marco | Entrega | Data Estimada |
|-------|---------|---------------|
| M0 | Setup Completo | Semana 1 |
| M1 | Super Admin MVP | Semana 5 |
| M2 | Admin Cliente MVP | Semana 9 |
| M3 | **Chat MVP** (Entrega Principal) | Semana 14 |
| M4 | Permissões Avançadas | Semana 18 |
| M5 | Supervisão Completa | Semana 21 |
| M6 | Features Extras | Semana 25 |
| M7 | **Produção** | Semana 27 |

---

## 🧪 Estratégia de Testes

### Por Fase

**Fase 1-2 (Backend Core):**
- Testes unitários de services
- Testes de integração de API
- Testes de isolamento multi-tenant

**Fase 3 (Chat):**
- Testes de Socket.IO
- Testes de performance (mensagens)
- Testes de sincronização

**Fase 4-5 (Avançado):**
- Testes de permissões
- Testes de busca
- Testes de relatórios

**Fase 7 (Produção):**
- Testes E2E completos
- Testes de carga
- Testes de segurança

---

## 📝 Notas Importantes

### Priorização
- **MUST HAVE:** Fases 0-3 (MVP funcional)
- **SHOULD HAVE:** Fases 4-5 (Permissões e supervisão)
- **COULD HAVE:** Fase 6 (Extras)
- **WON'T HAVE (agora):** Anexos, 2FA, SSO (futuro)

### Flexibilidade
- Sprints podem ser ajustados conforme progresso
- Features podem ser movidas entre fases
- Sempre manter foco no MVP

### Comunicação
- Daily standup (15min)
- Sprint review (final de cada sprint)
- Retrospectiva (a cada 2 sprints)

---

**Última atualização:** 16/10/2025  
**Versão:** 1.0

