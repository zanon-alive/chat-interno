# Decisões Técnicas e Pontos para Revisão Futura

## 📋 Sobre este Documento

Este arquivo documenta todas as decisões técnicas tomadas durante o desenvolvimento autônomo do projeto, especialmente aquelas que podem precisar de revisão ou ajuste posterior.

**Última Atualização:** 16/10/2025

---

## 🎯 Decisões Tomadas Durante o Desenvolvimento

### 1. Banco de Dados - Desenvolvimento vs Produção

**Decisão:** Usar SQLite em desenvolvimento inicial, PostgreSQL em produção

**Justificativa:**
- SQLite permite desenvolvimento rápido sem necessidade de servidor PostgreSQL
- Arquivos .sqlite facilitam testes e reset rápido do banco
- Sequelize permite troca fácil entre bancos (apenas mudar dialect)
- Quando produção estiver pronta, migrar para PostgreSQL

**Action Item Futuro:**
- [ ] Configurar PostgreSQL em produção
- [ ] Testar todas as migrations no PostgreSQL
- [ ] Validar queries complexas (índices, full-text search)

**Localização:** `backend/config/database.js`

---

### 2. Senhas Iniciais e Segurança

**Decisão:** Senhas padrão para desenvolvimento

**Senhas Definidas:**
- Super Admin: `Admin@123456`
- Admin Cliente (seed): `Admin@123456`
- Usuários teste: `User@123456`

**⚠️ IMPORTANTE:**
- Essas senhas são APENAS para desenvolvimento
- Em produção, usar geração aleatória segura
- Forçar troca de senha no primeiro login

**Action Item Futuro:**
- [ ] Implementar gerador de senhas aleatórias
- [ ] Configurar envio de email com senha inicial
- [ ] Implementar recuperação de senha
- [ ] Adicionar 2FA para admins (Fase futura)

**Localização:** `backend/seeders/`

---

### 3. Upload de Arquivos

**Decisão:** Sistema de arquivos local (filesystem)

**Justificativa:**
- Mais simples para MVP
- Não requer configuração de S3/serviços externos
- Pasta: `backend/uploads/`

**Action Item Futuro:**
- [ ] Migrar para S3/MinIO em produção
- [ ] Implementar CDN para servir arquivos
- [ ] Adicionar compressão de imagens

**Localização:** `backend/middlewares/upload.js`

---

### 4. Email Service

**Decisão:** Mock/Console em desenvolvimento

**Justificativa:**
- Não requer configuração SMTP real
- Emails são logados no console
- Permite testar fluxo sem serviço externo

**Configuração Futura:**
- [ ] Configurar Mailtrap para testes
- [ ] Configurar SMTP real (SendGrid, AWS SES, etc)
- [ ] Templates de email profissionais

**Localização:** `backend/services/emailService.js`

---

### 5. Permissões de Comunicação - Implementação

**Decisão:** Modelo híbrido (tabela + cache em memória)

**Implementação:**
- Tabela `permissoes_comunicacao` com JSONB
- Cache das permissões ao fazer login
- Validação rápida em memória

**Complexidade Reduzida:**
- Fase 1: Apenas modelos pré-definidos
- Fase 2: Adicionar customização avançada

**Action Item Futuro:**
- [ ] Implementar cache Redis para permissões
- [ ] Otimizar verificação de permissões em massa
- [ ] Interface visual para matriz de permissões

**Localização:** `backend/services/permissaoService.js`

---

### 6. WebSocket Rooms - Estratégia de Isolamento

**Decisão:** Room naming: `instancia-{id_instancia}:conversa-{id_conversa}`

**Justificativa:**
- Garante isolamento por instância
- Facilita debugging
- Previne vazamento de mensagens

**Exemplo:**
```javascript
socket.join(`instancia-1:conversa-5`);
io.to(`instancia-1:conversa-5`).emit('message:new', data);
```

**Action Item Futuro:**
- [ ] Implementar Redis Adapter para múltiplos servidores
- [ ] Monitorar rooms ativas
- [ ] Cleanup de rooms vazias

**Localização:** `backend/sockets/chatHandler.js`

---

### 7. Hierarquia - Profundidade Máxima

**Decisão:** Limite de 10 níveis hierárquicos

**Justificativa:**
- Suficiente para qualquer organização real
- Previne recursão infinita
- Facilita queries de hierarquia

**Implementação:**
- Validação no backend (service)
- Trigger no banco (quando PostgreSQL)

**Action Item Futuro:**
- [ ] Avaliar se 10 níveis é suficiente na prática
- [ ] Implementar visualização de organograma
- [ ] Otimizar queries recursivas

**Localização:** `backend/services/usuarioService.js`

---

### 8. Paginação - Padrões Definidos

**Decisão:** Padrões de paginação

**Valores:**
- Mensagens: 50 por página
- Usuários: 25 por página
- Conversas: 30 por página
- Empresas: 20 por página

**Query Params:**
```
?page=1&limit=50
```

**Action Item Futuro:**
- [ ] Permitir usuário configurar limite (até máximo)
- [ ] Implementar cursor-based pagination (melhor performance)

**Localização:** `backend/middlewares/pagination.js`

---

### 9. Rate Limiting - Valores Iniciais

**Decisão:** Rate limits conservadores

**Valores:**
- Login: 5 tentativas / 15 minutos
- API Geral: 100 requests / 15 minutos
- Chat: 60 mensagens / 1 minuto

**Action Item Futuro:**
- [ ] Ajustar baseado em uso real
- [ ] Implementar rate limiting por usuário (Redis)
- [ ] Dashboard de monitoramento

**Localização:** `backend/middlewares/rateLimiter.js`

---

### 10. Logs - Estrutura e Níveis

**Decisão:** Winston com níveis específicos

**Níveis:**
- `error`: Erros críticos (500, crashes)
- `warn`: Avisos (limite atingido, tentativas falhas)
- `info`: Ações importantes (login, CRUD admin)
- `debug`: Debugging detalhado (desenvolvimento)

**Arquivos:**
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Tudo
- `logs/audit.log` - Ações administrativas

**Action Item Futuro:**
- [ ] Integrar com serviço de logs (Papertrail, Loggly)
- [ ] Implementar alertas automáticos
- [ ] Dashboard de logs

**Localização:** `backend/utils/logger.js`

---

### 11. Testes - Estratégia de Dados

**Decisão:** Seeds completos para cada ambiente

**Seeds Criados:**
- `demo.seed.js` - Dados completos para demo
- `test.seed.js` - Dados mínimos para testes
- `production.seed.js` - Apenas Super Admin

**Action Item Futuro:**
- [ ] Criar faker para dados realistas
- [ ] Seeds por funcionalidade (auth, chat, etc)

**Localização:** `backend/seeders/`

---

### 12. Frontend - Estado Global vs Local

**Decisão:** Pinia para estado global, local para UI

**Estado Global (Pinia):**
- Autenticação
- Usuário logado
- Conversas e mensagens
- Dados de empresas/instâncias

**Estado Local (ref/reactive):**
- Formulários
- Modals abertos/fechados
- Loading states temporários

**Action Item Futuro:**
- [ ] Avaliar performance com muitas conversas
- [ ] Implementar persistência de estado (localStorage)

**Localização:** `frontend/src/store/`

---

### 13. Validação - Client vs Server

**Decisão:** Validação duplicada (segurança em camadas)

**Frontend:**
- Validação imediata (UX)
- Feedback visual rápido
- Não é confiável (pode ser burlada)

**Backend:**
- Validação definitiva (segurança)
- Joi schemas completos
- Retorna erros estruturados

**Action Item Futuro:**
- [ ] Compartilhar schemas de validação (TypeScript)
- [ ] Gerar validação frontend a partir do backend

**Localização:** 
- Backend: `backend/utils/validators.js`
- Frontend: `frontend/src/utils/validators.js`

---

### 14. Internacionalização (i18n)

**Decisão:** Português hardcoded inicialmente

**Justificativa:**
- Requisito inicial é apenas português
- Simplifica desenvolvimento
- Strings organizadas em constantes

**Action Item Futuro:**
- [ ] Implementar vue-i18n
- [ ] Adicionar inglês e espanhol
- [ ] Backend também multi-idioma

**Localização:** `frontend/src/utils/constants.js`

---

### 15. Timezone e Datas

**Decisão:** UTC no banco, local no frontend

**Implementação:**
- Banco de dados: timestamps em UTC
- Backend: retorna ISO 8601
- Frontend: converte para timezone do usuário

**Bibliotecas:**
- Backend: usar Date nativo
- Frontend: considerar day.js (mais leve que moment)

**Action Item Futuro:**
- [ ] Adicionar seleção de timezone por usuário
- [ ] Exibir timezone nas conversas

**Localização:** `backend/utils/dateHelpers.js`

---

### 16. Busca Full-Text - PostgreSQL vs Elasticsearch

**Decisão:** PostgreSQL nativo inicialmente

**Justificativa:**
- PostgreSQL tem bom suporte a full-text (tsvector)
- Não requer infraestrutura adicional
- Suficiente para < 1 milhão de mensagens

**Action Item Futuro:**
- [ ] Avaliar Elasticsearch se performance cair
- [ ] Implementar sugestões de busca (autocomplete)
- [ ] Busca por anexos (conteúdo de PDFs)

**Localização:** `backend/models/Mensagem.js` (índice GIN)

---

### 17. Deploy e Ambientes

**Decisão:** 3 ambientes

**Ambientes:**
1. **Development** (local)
   - SQLite
   - Hot reload
   - Debug ativo
   - Seeds completos

2. **Staging** (servidor teste)
   - PostgreSQL
   - Dados de teste
   - Testes E2E

3. **Production** (servidor real)
   - PostgreSQL
   - SSL obrigatório
   - Logs completos
   - Backup automático

**Action Item Futuro:**
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Automatizar deploy
- [ ] Health checks e monitoring

**Localização:** `backend/.env.example`

---

### 18. Segurança - Headers HTTP

**Decisão:** Helmet.js com configuração custom

**Headers Configurados:**
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security

**Action Item Futuro:**
- [ ] Ajustar CSP para CDNs se necessário
- [ ] Implementar CORS por origem configurável
- [ ] Subresource Integrity (SRI) para assets

**Localização:** `backend/app.js`

---

### 19. Monitoramento e Métricas

**Decisão:** Logs + Health endpoint básico

**Implementado:**
- `/api/health` - Status da aplicação
- `/api/health/db` - Status do banco

**Action Item Futuro:**
- [ ] Prometheus + Grafana
- [ ] Métricas de negócio (mensagens/dia, usuários ativos)
- [ ] Alertas automáticos (Slack, email)
- [ ] APM (Application Performance Monitoring)

**Localização:** `backend/routes/health.routes.js`

---

### 20. Estratégia de Migrations

**Decisão:** Migrations incrementais com rollback

**Convenção:**
- Arquivos: `YYYYMMDDHHMMSS-descricao.js`
- Sempre implementar `up` e `down`
- Testar rollback antes de commit
- Nunca editar migration commitada

**Action Item Futuro:**
- [ ] Script para gerar migrations automaticamente
- [ ] Validação de schema antes de deploy
- [ ] Backup antes de cada migration em produção

**Localização:** `backend/migrations/`

---

## 🔄 Changelog de Decisões

### 2025-10-16
- Documento criado
- 20 decisões iniciais documentadas
- Pronto para desenvolvimento autônomo

---

## 📝 Como Usar Este Documento

1. **Durante Desenvolvimento:** Consulte antes de tomar decisões similares
2. **Code Review:** Verifique se decisões foram seguidas
3. **Reuniões:** Use como base para discussão de arquitetura
4. **Onboarding:** Novos devs leem para entender o "porquê"

---

## ✅ Checklist de Revisão Futura

Após conclusão do MVP, revisar:

- [ ] Todas as senhas padrão foram alteradas?
- [ ] Email service está configurado?
- [ ] PostgreSQL está em uso?
- [ ] Rate limits estão adequados?
- [ ] Monitoramento está ativo?
- [ ] Backup está configurado?
- [ ] SSL está ativo?
- [ ] Logs estão sendo armazenados?

---

**Responsável pela Revisão:** [A definir]  
**Data Planejada para Revisão:** [Após MVP - Fase 3]

