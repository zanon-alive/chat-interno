# ✅ Checklist do Projeto - Chat Interno

## 📋 Acompanhamento de Progresso

**Status Geral:** 📝 Planejamento  
**Última Atualização:** 16/10/2025

---

## 🎯 Fase 0: Setup e Infraestrutura

**Duração:** 1 semana  
**Status:** ⏳ Não Iniciado

### Backend
- [ ] Inicializar projeto Node.js
  - [ ] Criar `package.json`
  - [ ] Instalar dependências (express, sequelize, socket.io, jwt, bcrypt, etc)
  - [ ] Configurar ESLint + Prettier
  - [ ] Criar estrutura de pastas
- [ ] Configurar Express.js
  - [ ] Setup básico do servidor
  - [ ] Middlewares (cors, body-parser, helmet)
  - [ ] Error handler global
- [ ] Configurar PostgreSQL
  - [ ] Criar banco de dados dev
  - [ ] Configurar Sequelize
  - [ ] Criar primeira migration (test)
- [ ] Configurar variáveis de ambiente
  - [ ] Criar `.env.example`
  - [ ] Documentar variáveis necessárias

### Frontend
- [ ] Inicializar projeto Vue.js
  - [ ] Setup com Vite
  - [ ] Instalar dependências (vue-router, pinia, axios, socket.io-client)
  - [ ] Configurar ESLint
  - [ ] Criar estrutura de pastas
- [ ] Configurar Vue Router
  - [ ] Rotas básicas
- [ ] Configurar Pinia
  - [ ] Setup inicial
- [ ] Configurar Axios
  - [ ] Interceptors
  - [ ] Base URL

### DevOps
- [ ] Git repository
  - [ ] Criar `.gitignore`
  - [ ] README inicial
  - [ ] Estrutura de branches
- [ ] Scripts npm
  - [ ] `dev`, `build`, `test`, `migrate`
- [ ] Teste de integração completo
  - [ ] Backend roda sem erros
  - [ ] Frontend roda sem erros
  - [ ] Conexão com banco funciona

**✅ Critério de Conclusão:** Sistema roda localmente (backend + frontend + DB)

---

## 🎯 Fase 1: Super Administração & Multi-Tenancy

**Duração:** 3-4 semanas  
**Status:** ⏳ Não Iniciado

### Sprint 1.1: Autenticação (1 semana)
- [ ] **Backend**
  - [ ] Migration: `usuarios` (básico)
  - [ ] Model: Usuario
  - [ ] Seed: Super Admin inicial
  - [ ] Service: authService (login, JWT)
  - [ ] Middleware: auth.js
  - [ ] Endpoints: `/api/auth/login`, `/api/auth/me`
  - [ ] Testes unitários
- [ ] **Frontend**
  - [ ] Página: Login.vue
  - [ ] Store: authStore (Pinia)
  - [ ] Service: authService
  - [ ] Router guards (auth check)

### Sprint 1.2: Gestão de Empresas (1 semana)
- [ ] **Backend**
  - [ ] Migration: `empresas`
  - [ ] Model: Empresa
  - [ ] Service: empresaService
  - [ ] Controller: empresaController
  - [ ] Routes: `/api/superadmin/empresas`
  - [ ] CRUD completo
  - [ ] Validações (CNPJ)
- [ ] **Frontend**
  - [ ] Layout: Dashboard Super Admin
  - [ ] Página: Empresas.vue (listagem)
  - [ ] Página: EmpresaForm.vue (criar/editar)
  - [ ] Service: empresaService

### Sprint 1.3: Gestão de Instâncias (1-2 semanas)
- [ ] **Backend**
  - [ ] Migration: `instancias_chat`
  - [ ] Model: InstanciaChat (com relacionamento Empresa)
  - [ ] Service: instanciaService
  - [ ] Controller: instanciaController
  - [ ] Routes: `/api/superadmin/instancias`
  - [ ] Lógica: Criar admin inicial (RF19)
  - [ ] Validação: Limite de usuários
- [ ] **Frontend**
  - [ ] Página: Instancias.vue (listagem)
  - [ ] Página: InstanciaForm.vue (criar/editar)
  - [ ] Modal: Criar Admin Inicial
  - [ ] Service: instanciaService

### Sprint 1.4: Multi-Tenancy Foundation
- [ ] **Backend**
  - [ ] Middleware: tenantValidation.js
  - [ ] Sequelize scopes (default tenant filter)
  - [ ] Testes de isolamento
  - [ ] Testes de penetração básicos
- [ ] **Testes**
  - [ ] Usuário de instância A não vê dados de B
  - [ ] Queries sempre filtradas por tenant
  - [ ] Socket.IO isola rooms por instância

**✅ Critério de Conclusão:** Super Admin funcional + Multi-tenancy garantido

---

## 🎯 Fase 2: Administração do Cliente

**Duração:** 3-4 semanas  
**Status:** ⏳ Não Iniciado

### Sprint 2.1: Login Admin Cliente (1 semana)
- [ ] **Backend**
  - [ ] Endpoints: Login admin, seleção de instância
  - [ ] Middleware: roleCheck.js
- [ ] **Frontend**
  - [ ] Página: Login Admin Cliente
  - [ ] Página: Seleção de Instância (se múltiplas)
  - [ ] Dashboard Admin Cliente

### Sprint 2.2: Gestão de Equipes (1 semana)
- [ ] **Backend**
  - [ ] Migration: `equipes`
  - [ ] Model: Equipe
  - [ ] Service: equipeService
  - [ ] Controller: equipeController
  - [ ] Routes: `/api/admin/equipes`
  - [ ] CRUD completo
  - [ ] Validação: Não deletar equipe com usuários
- [ ] **Frontend**
  - [ ] Página: Equipes.vue (listagem)
  - [ ] Página: EquipeForm.vue
  - [ ] Service: equipeService

### Sprint 2.3: Gestão de Usuários (1-2 semanas)
- [ ] **Backend**
  - [ ] Migration: `usuarios` (completa com hierarquia)
  - [ ] Service: usuarioService
  - [ ] Controller: usuarioController
  - [ ] Routes: `/api/admin/usuarios`
  - [ ] CRUD completo
  - [ ] Validação: Limite de usuários (RF04)
  - [ ] Validação: Ciclos hierárquicos (RF05)
  - [ ] Trigger: Limite de usuários
  - [ ] Service: emailService (mock)
- [ ] **Frontend**
  - [ ] Página: Usuarios.vue (listagem com filtros)
  - [ ] Página: UsuarioForm.vue (criar/editar)
  - [ ] Seletor: Supervisor direto
  - [ ] Indicador: Limite de usuários (ex: 45/50)
  - [ ] Modal: Alerta de limite atingido
  - [ ] Service: usuarioService

**✅ Critério de Conclusão:** Admin do Cliente gerencia usuários e equipes completo

---

## 🎯 Fase 3: Chat Básico (MVP)

**Duração:** 4-5 semanas  
**Status:** ⏳ Não Iniciado

### Sprint 3.1: Estrutura de Conversas (1 semana)
- [ ] **Backend**
  - [ ] Migration: `conversas`
  - [ ] Migration: `participantes_conversa`
  - [ ] Migration: `mensagens`
  - [ ] Models: Conversa, ParticipanteConversa, Mensagem
  - [ ] Service: conversaService
  - [ ] Controller: conversaController
  - [ ] Routes: `/api/chat/conversas`
  - [ ] Endpoint: Listar conversas
  - [ ] Endpoint: Criar conversa 1-on-1
  - [ ] Endpoint: Histórico de mensagens (paginado)
- [ ] **Frontend**
  - [ ] Layout: Interface de chat
  - [ ] Component: ConversationList.vue
  - [ ] Component: MessageList.vue
  - [ ] Component: MessageInput.vue
  - [ ] Store: chatStore

### Sprint 3.2: Socket.IO Setup (1 semana)
- [ ] **Backend**
  - [ ] Config: Socket.IO server
  - [ ] Handler: connection (autenticação)
  - [ ] Handler: disconnect
  - [ ] Handler: join_conversation
  - [ ] Handler: leave_conversation
  - [ ] Rooms por conversa
- [ ] **Frontend**
  - [ ] Service: socketService
  - [ ] Composable: useSocket
  - [ ] Conexão ao backend
  - [ ] Listeners básicos
- [ ] **Testes**
  - [ ] Conexão Socket.IO funciona
  - [ ] Autenticação via socket

### Sprint 3.3: Mensagens em Tempo Real (1-2 semanas)
- [ ] **Backend**
  - [ ] Handler: `message:send`
  - [ ] Persistir mensagem no banco
  - [ ] Broadcast para participantes da conversa
  - [ ] Validação de permissão (pode enviar?)
  - [ ] Handler: `message:new` (recebimento)
- [ ] **Frontend**
  - [ ] Envio de mensagem via socket
  - [ ] Recebimento em tempo real
  - [ ] Atualização da store
  - [ ] Auto-scroll para última mensagem
  - [ ] Feedback de envio (loading)
- [ ] **Testes**
  - [ ] Mensagem é enviada e persistida
  - [ ] Destinatário recebe em tempo real
  - [ ] Validação de tenant (não vaza entre instâncias)

### Sprint 3.4: UX e Polimento (1 semana)
- [ ] **Backend**
  - [ ] Paginação otimizada (limit/offset)
  - [ ] Eager loading de participantes
  - [ ] Índices de performance
- [ ] **Frontend**
  - [ ] Scroll infinito (carregar mais mensagens)
  - [ ] Loading states
  - [ ] Timestamp das mensagens
  - [ ] Indicador de usuário online/offline (básico)
  - [ ] Responsividade mobile
  - [ ] Error handling

**🎉 Critério de Conclusão: MVP FUNCIONAL!**
- ✅ Usuário faz login
- ✅ Vê lista de conversas
- ✅ Inicia conversa 1-on-1
- ✅ Envia e recebe mensagens em tempo real
- ✅ Vê histórico completo

---

## 🎯 Fase 4: Chat Avançado & Permissões

**Duração:** 3-4 semanas  
**Status:** ⏳ Não Iniciado

### Sprint 4.1: Sistema de Permissões (1-2 semanas)
- [ ] **Backend**
  - [ ] Migration: `permissoes_comunicacao`
  - [ ] Model: PermissaoComunicacao
  - [ ] Service: permissaoService
  - [ ] Controller: permissaoController
  - [ ] Routes: `/api/admin/permissoes`
  - [ ] Lógica: Verificar se pode comunicar
  - [ ] Middleware: Aplicar em criação de conversas
- [ ] **Frontend**
  - [ ] Página: Permissoes.vue
  - [ ] Modelos pré-definidos (restrito, padrão, equipe, geral)
  - [ ] Modo customizado (seleção manual)
  - [ ] Aplicação em massa por equipe
  - [ ] Visualização: Matriz de permissões
- [ ] **Testes**
  - [ ] Permissões restritivas impedem conversa
  - [ ] Modelos funcionam corretamente

### Sprint 4.2: Conversas em Grupo (1 semana)
- [ ] **Backend**
  - [ ] Endpoint: Criar grupo
  - [ ] Endpoint: Adicionar/remover participantes
  - [ ] Validação de permissões
- [ ] **Frontend**
  - [ ] Modal: Criar grupo
  - [ ] Seleção múltipla de usuários
  - [ ] Gestão de participantes

### Sprint 4.3: Canais (1 semana)
- [ ] **Backend**
  - [ ] Service: Criação automática de canal por equipe
  - [ ] Service: Canal geral da instância
- [ ] **Frontend**
  - [ ] Exibição de canais na sidebar
  - [ ] Ícones diferentes por tipo

**✅ Critério de Conclusão:** Permissões funcionando + Grupos + Canais

---

## 🎯 Fase 5: Supervisão & Relatórios

**Duração:** 2-3 semanas  
**Status:** ⏳ Não Iniciado

### Sprint 5.1: Visualização de Conversas (1 semana)
- [ ] **Backend**
  - [ ] Endpoints: Listar todas conversas (admin)
  - [ ] Endpoint: Busca global de mensagens
  - [ ] Full-text search (PostgreSQL)
- [ ] **Frontend**
  - [ ] Página: Supervisao.vue
  - [ ] Filtros: usuário, equipe, período
  - [ ] Visualização em modo leitura
  - [ ] Busca global

### Sprint 5.2: Relatórios (1-2 semanas)
- [ ] **Backend**
  - [ ] Endpoint: Dashboard de métricas
  - [ ] Queries agregadas (COUNT, SUM, etc)
- [ ] **Frontend**
  - [ ] Dashboard: Gráficos (Chart.js)
  - [ ] Métricas: Usuários ativos, mensagens, conversas
  - [ ] Exportação CSV (futuro)

**✅ Critério de Conclusão:** Admin supervisiona e gera relatórios

---

## 🎯 Fase 6: Melhorias & Extras

**Duração:** 3-4 semanas  
**Status:** ⏳ Não Iniciado

### Sprint 6.1: Status de Usuários (1 semana)
- [ ] **Backend**
  - [ ] Handler: `user:online`, `user:offline`
  - [ ] Broadcast de status
- [ ] **Frontend**
  - [ ] Indicadores visuais (bolinha verde/cinza)
  - [ ] Seletor de status manual (ausente/ocupado)

### Sprint 6.2: Notificações (1 semana)
- [ ] **Backend**
  - [ ] Lógica: Marcar mensagens não lidas
  - [ ] Endpoint: Contador de não lidas
- [ ] **Frontend**
  - [ ] Notificações browser (Notification API)
  - [ ] Badge de não lidas
  - [ ] Som de notificação (configurável)

### Sprint 6.3: Edição/Deleção (1 semana)
- [ ] **Backend**
  - [ ] Endpoint: Editar mensagem
  - [ ] Endpoint: Deletar mensagem (soft delete)
- [ ] **Frontend**
  - [ ] Menu de contexto em mensagens
  - [ ] Indicador "editada"

### Sprint 6.4: UX Final (1 semana)
- [ ] **Frontend**
  - [ ] Loading states em todas as ações
  - [ ] Error handling completo
  - [ ] Validações frontend
  - [ ] Acessibilidade (WCAG)
  - [ ] Dark mode (opcional)
- [ ] **Backend**
  - [ ] Rate limiting completo
  - [ ] Logs estruturados

**✅ Critério de Conclusão:** UX polida e features extras

---

## 🎯 Fase 7: Otimização & Deploy

**Duração:** 2 semanas  
**Status:** ⏳ Não Iniciado

### Sprint 7.1: Testes e Qualidade (1 semana)
- [ ] **Testes**
  - [ ] Testes unitários (coverage > 70%)
  - [ ] Testes de integração
  - [ ] Testes E2E (Cypress/Playwright)
  - [ ] Testes de carga (Artillery/k6)
  - [ ] Testes de segurança
- [ ] **Code Quality**
  - [ ] Code review completo
  - [ ] Refatoração
  - [ ] Documentação de código (JSDoc)

### Sprint 7.2: Deploy (1 semana)
- [ ] **Backend**
  - [ ] Dockerfile otimizado
  - [ ] CI/CD (GitHub Actions)
  - [ ] Variáveis de ambiente produção
  - [ ] Migrations em produção
  - [ ] PM2 ou similar
- [ ] **Frontend**
  - [ ] Build otimizado
  - [ ] Compressão e minificação
- [ ] **Infraestrutura**
  - [ ] Servidor de produção configurado
  - [ ] PostgreSQL produção
  - [ ] Nginx reverse proxy
  - [ ] SSL/TLS (Let's Encrypt)
  - [ ] Backup automatizado
  - [ ] Monitoramento
- [ ] **Documentação**
  - [ ] README completo
  - [ ] Guia de instalação
  - [ ] Guia de deploy
  - [ ] API documentation (Swagger - opcional)

**🚀 Critério de Conclusão: SISTEMA EM PRODUÇÃO!**

---

## 📊 Progresso Geral

### Por Fase

| Fase | Status | Progresso |
|------|--------|-----------|
| **Fase 0:** Setup | ⏳ Não Iniciado | 0% |
| **Fase 1:** Super Admin | ⏳ Não Iniciado | 0% |
| **Fase 2:** Admin Cliente | ⏳ Não Iniciado | 0% |
| **Fase 3:** Chat MVP | ⏳ Não Iniciado | 0% |
| **Fase 4:** Avançado | ⏳ Não Iniciado | 0% |
| **Fase 5:** Supervisão | ⏳ Não Iniciado | 0% |
| **Fase 6:** Extras | ⏳ Não Iniciado | 0% |
| **Fase 7:** Deploy | ⏳ Não Iniciado | 0% |

**Progresso Total:** 0% (0/8 fases)

### Legenda de Status

- ⏳ **Não Iniciado**
- 🔄 **Em Progresso**
- ✅ **Concluído**
- ⚠️ **Bloqueado**
- ❌ **Cancelado**

---

## 🎯 Próximos Passos Imediatos

1. [ ] Aprovar documentação
2. [ ] Setup do ambiente de desenvolvimento
3. [ ] Iniciar Fase 0
4. [ ] Sprint Planning Fase 1.1

---

## 📝 Notas e Observações

*Use este espaço para anotar decisões importantes, mudanças de escopo, etc.*

---

**Última Atualização:** 16/10/2025  
**Responsável:** [Nome]  
**Próxima Revisão:** [Data]

