# Análise e Validação dos Requisitos - Chat Interno

## 1. Resumo Executivo

Este documento apresenta uma análise crítica dos requisitos iniciais fornecidos, identificando pontos fortes, possíveis melhorias e validações necessárias antes do início do desenvolvimento.

### Avaliação Geral

**Status:** ✅ **Aprovado com Melhorias Sugeridas**

Os requisitos fornecidos estão **bem estruturados** e cobrem os aspectos essenciais do sistema. A separação em três níveis hierárquicos (Super Admin, Admin Cliente, Usuário Final) é clara e adequada ao modelo de negócio multi-tenant.

---

## 2. Análise dos Requisitos Funcionais

### 2.1 Módulo de Super Administração (RF15-RF19)

#### ✅ Pontos Fortes

1. **Separação clara de responsabilidades**: Super Admin gerencia a infraestrutura (empresas/instâncias) sem acessar conversas internas
2. **Limite de usuários configurável**: Modelo comercial flexível
3. **Criação de admin inicial**: Boa prática para onboarding

#### ⚠️ Pontos de Atenção

**RF18 - Limite de Usuários:**
- ❓ **Questão:** O que acontece se o admin da instância deletar usuários e o limite aumentar? O sistema deve permitir reativar usuários deletados?
- ✅ **Recomendação:** Implementar soft delete para usuários, permitindo reativação dentro do limite
- ✅ **Melhorado:** Adicionar campo `usuarios_ativos_atual` na tabela `instancias_chat` para facilitar queries

**RF19 - Admin Inicial:**
- ❓ **Questão:** Super Admin pode criar múltiplos admins para uma instância?
- ✅ **Recomendação:** Sim, mas primeiro admin deve ser criado pelo Super Admin. Depois, admin pode promover outros usuários
- ✅ **Melhorado:** Adicionar campo `criado_por` em usuários para auditoria

**Nova Funcionalidade Sugerida:**
- **RF20 (Novo):** Super Admin pode visualizar métricas globais (total de instâncias ativas, usuários totais, uso do sistema) **sem acessar dados privados**
- **Prioridade:** 🟡 Média

---

### 2.2 Módulo de Gestão da Instância (RF01-RF06)

#### ✅ Pontos Fortes

1. **Hierarquia bem definida**: Supervisor direto é um conceito claro
2. **Permissões customizáveis**: Flexibilidade para diferentes modelos organizacionais
3. **Validação de limite**: Impede cadastro acima do contratado

#### ⚠️ Pontos de Atenção

**RF03 - Cadastro de Usuários:**
- ❓ **Questão:** Como funciona o cadastro? Admin cria login/senha ou envia convite?
- ✅ **Recomendação:** 
  - **Fase 1:** Admin cria usuário com senha inicial, força troca no primeiro login
  - **Fase 2 (futuro):** Sistema de convite por email com link para criar senha
- ✅ **Melhorado:** Adicionar tabela `convites` (futuro)

**RF04 - Limite de Usuários:**
- ❓ **Questão:** Admins da instância contam no limite?
- ✅ **Decisão:** **NÃO**. Admins são "overhead" do sistema, não contam no limite contratado
- ✅ **Implementação:** Validação deve filtrar `nivel_permissao NOT IN ('admin_cliente', 'super_admin')`

**RF05 - Hierarquia:**
- ⚠️ **Validação Crítica:** Sistema DEVE prevenir ciclos (A supervisiona B que supervisiona A)
- ✅ **Implementação:** Trigger no banco + validação no service
- ❓ **Questão:** Profundidade máxima da hierarquia?
- ✅ **Recomendação:** Limitar a 10 níveis (mais que suficiente para qualquer organização)

**RF06 - Permissões de Comunicação:**
- ⚠️ **Complexidade Alta:** Esta é a funcionalidade mais complexa do sistema
- ✅ **Recomendação:** Implementar modelos pré-definidos primeiro (Fase 1), customização avançada depois (Fase 2)
- ✅ **Melhorado:** 
  - Adicionar validação: se usuário A pode falar com B, B automaticamente pode responder para A?
  - **Decisão:** SIM, comunicação é bidirecional

**Modelos de Permissão Validados:**

| Modelo | Descrição | Pode Comunicar Com |
|--------|-----------|-------------------|
| **Restrito** | Hierarquia apenas | Supervisor direto apenas |
| **Padrão** | Hierarquia + Suporte | Supervisor + Admins da instância |
| **Equipe** | Colaboração interna | Mesma equipe + Supervisor + Admins |
| **Geral** | Canal aberto | Todos da instância (canal geral) |
| **Customizado** | Escolha manual | IDs específicos de usuários/equipes |

---

### 2.3 Módulo de Comunicação (RF07-RF12)

#### ✅ Pontos Fortes

1. **Chat em tempo real**: Socket.IO é escolha adequada
2. **Histórico persistido**: Banco de dados garante integridade
3. **Múltiplos tipos de conversa**: 1-on-1, grupo, canal

#### ⚠️ Pontos de Atenção

**RF08 - Envio de Mensagens:**
- ❓ **Questão:** Limite de caracteres por mensagem?
- ✅ **Recomendação:** 5000 caracteres (similar ao WhatsApp Business)
- ❓ **Questão:** Mensagens podem ser editadas?
- ✅ **Recomendação:** SIM, mas com flag `editada` e histórico (futuro)
- ❓ **Questão:** Mensagens podem ser deletadas?
- ✅ **Recomendação:** SIM, soft delete + mensagem "[Mensagem deletada]"

**RF09 - Conversas 1-on-1:**
- ✅ **Validação:** Antes de criar conversa, verificar permissão de comunicação
- ⚠️ **Importante:** Não permitir duplicar conversas 1-on-1 (verificar se já existe)

**RF10 - Grupos/Canais:**
- ❓ **Questão:** Quem pode criar grupos? Apenas admins?
- ✅ **Recomendação:**
  - **Canais de Equipe:** Automáticos, criados ao criar equipe
  - **Canal Geral:** Automático, criado ao criar instância
  - **Grupos Privados:** Admin pode criar e definir membros
  - **Futuro (Fase 2):** Usuários podem criar grupos se permitido

**RF11 - Histórico:**
- ❓ **Questão:** Limite de histórico?
- ✅ **Recomendação:** 
  - Paginação: 50 mensagens por página
  - Carregar últimas mensagens primeiro (DESC)
  - Lazy loading ao scrollar para cima
- ⚠️ **Performance:** Índice composto `(id_conversa, created_at DESC)` é CRÍTICO

**RF12 - Notificações:**
- ❓ **Questão:** Notificações apenas browser ou também email?
- ✅ **Recomendação:**
  - **Fase 1:** Browser notification (Web Notification API)
  - **Fase 2:** Email para mensagens não lidas (digest diário)
  - **Futuro:** Push notifications mobile

---

### 2.4 Módulo de Supervisão (RF13-RF14)

#### ✅ Pontos Fortes

1. **Transparência:** Admin pode supervisionar conversas (importante para compliance)
2. **Relatórios:** Métricas para tomada de decisão

#### ⚠️ Pontos de Atenção

**RF13 - Visualização de Conversas:**
- ⚠️ **GDPR/LGPD:** Acesso de admin a conversas deve ser:
  - Logado (auditável)
  - Justificável (motivo da visualização - futuro)
  - Transparente (usuários sabem que admin pode ver)
- ✅ **Recomendação:** Adicionar disclaimer no login: "Conversas podem ser monitoradas para fins de segurança e compliance"
- ✅ **Melhorado:** Log de auditoria quando admin acessa conversas

**RF14 - Relatórios:**
- ❓ **Questão:** Quais métricas são mais importantes?
- ✅ **Priorização:**
  1. **Essenciais (Fase 1):** Usuários ativos, total mensagens, conversas ativas
  2. **Importantes (Fase 2):** Tempo de resposta médio, engajamento por equipe
  3. **Futuro (Fase 3):** Análise de sentimento, palavras-chave

---

## 3. Análise dos Requisitos Não Funcionais

### 3.1 RNF01 - Segurança e Multi-Tenancy

**Status:** ✅ **CRÍTICO - Prioridade Máxima**

#### Estratégias de Isolamento

✅ **Recomendado: Shared Database, Shared Schema, Row-Level Isolation**

**Por quê?**
- ✅ Custo-efetivo (um banco para todos)
- ✅ Manutenção simples (uma migration)
- ✅ Performance adequada para < 1000 instâncias
- ⚠️ Requer disciplina: TODAS as queries devem filtrar por `id_instancia_chat`

**Implementação:**
```javascript
// Middleware automático
app.use((req, res, next) => {
  if (req.user && req.user.id_instancia_chat) {
    req.instanciaId = req.user.id_instancia_chat;
  }
  next();
});

// Em TODOS os models
Usuario.findAll({
  where: {
    id_instancia_chat: req.instanciaId,
    // ... outros filtros
  }
});
```

**Testes Obrigatórios:**
- [ ] Usuário de instância A não vê dados de instância B
- [ ] Tentativa de burlar com query params é bloqueada
- [ ] Socket.IO isola rooms por instância
- [ ] Testes de penetração

---

### 3.2 RNF02 - Performance

**Status:** ✅ **Alta Prioridade**

#### Benchmarks Esperados

| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| Tempo de resposta API | < 200ms | < 500ms |
| Latência Socket.IO | < 100ms | < 300ms |
| Usuários simultâneos/instância | 1000+ | 500+ |
| Mensagens/segundo | 100+ | 50+ |

#### Estratégias

✅ **Fase 1:**
- Índices no banco de dados
- Connection pooling (Sequelize)
- Queries otimizadas (evitar N+1)

✅ **Fase 2:**
- Redis para cache (sessões, dados estáticos)
- CDN para assets frontend

✅ **Fase 3:**
- Particionamento de tabela `mensagens` (por data)
- Read replicas (se necessário)

---

### 3.3 RNF03 - Disponibilidade

**Status:** 🟡 **Média Prioridade**

**Target:** 99.5% uptime (~3.6h downtime/mês)

✅ **Implementação:**
- Backup automático diário
- Health check endpoint (`/api/health`)
- Logs estruturados
- Monitoramento (futuro: Prometheus + Grafana)

---

### 3.4 RNF04 - Escalabilidade

**Status:** 🟡 **Média Prioridade (Futuro)**

**Fase 1:** Single instance (suficiente para MVP)

**Fase 2+:**
- Load balancer (Nginx)
- Múltiplas instâncias Node.js
- Redis adapter para Socket.IO (sync entre servidores)
- Session storage em Redis (não em memória)

---

### 3.5 RNF05 - Usabilidade

**Status:** ✅ **Alta Prioridade**

**Checklist:**
- [ ] Interface responsiva (mobile-first)
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Loading states em todas as ações
- [ ] Feedback visual claro (sucesso/erro)
- [ ] Atalhos de teclado (Enter para enviar, Esc para fechar)
- [ ] Onboarding intuitivo

---

### 3.6 RNF06 - Manutenibilidade

**Status:** ✅ **Alta Prioridade**

**Checklist:**
- [ ] Código documentado (JSDoc para funções complexas)
- [ ] Testes: coverage > 70%
- [ ] Linting (ESLint) sem warnings
- [ ] Commits semânticos
- [ ] README atualizado

---

## 4. Melhorias e Funcionalidades Adicionais

### 4.1 Features Sugeridas (Não nos Requisitos Originais)

#### Alta Prioridade (Adicionar na Fase 2)

**RF21 - Busca de Mensagens:**
- Busca full-text em mensagens
- Filtros: usuário, data, conversa
- Destaque de termos
- **Justificativa:** Essencial para produtividade

**RF22 - Status de Usuário:**
- Online/Offline/Ausente/Ocupado
- Última visualização
- **Justificativa:** Melhora UX

**RF23 - Recuperação de Senha:**
- Email com token de reset
- **Justificativa:** Evitar chamados de suporte

#### Média Prioridade (Fase 3)

**RF24 - Anexo de Arquivos:**
- Upload de arquivos (PDF, imagens, docs)
- Limite de tamanho (10MB)
- Storage: filesystem local (MVP) → S3 (produção)

**RF25 - Reações a Mensagens:**
- Emojis simples (👍 ❤️ 😂)
- Contador de reações

**RF26 - Mensagens Fixadas:**
- Pin importante messages
- Limite: 5 por conversa

#### Baixa Prioridade (Backlog)

**RF27 - 2FA (Two-Factor Auth):**
- TOTP (Google Authenticator)
- Obrigatório para admins

**RF28 - SSO (Single Sign-On):**
- SAML 2.0
- OAuth (Google, Microsoft)

**RF29 - Videochamada:**
- Integração com WebRTC ou serviço externo
- **Complexidade:** MUITO ALTA

---

## 5. Modelo de Dados - Validações

### 5.1 Análise das Tabelas Propostas

#### ✅ Tabelas Bem Definidas

- `empresas`: ✅ OK
- `instancias_chat`: ✅ OK
- `equipes`: ✅ OK
- `usuarios`: ✅ OK
- `conversas`: ✅ OK
- `participantes_conversa`: ✅ OK
- `mensagens`: ✅ OK

#### ⚠️ Tabela `permissoes_comunicacao`

**Análise:**
- Estrutura JSONB é flexível MAS pode dificultar queries
- ❓ **Questão:** Como verificar "usuário X pode falar com usuário Y" eficientemente?

**Alternativa Sugerida (Discutir):**

**Opção 1 (Atual - JSONB):**
```sql
permissoes_comunicacao (
  id, id_instancia, id_usuario, tipo_permissao, pode_comunicar_com JSONB
)
```
✅ Prós: Flexível, fácil de adicionar novos tipos  
❌ Contras: Query complexa, índices limitados

**Opção 2 (Normalizada):**
```sql
permissoes_usuario (
  id, id_instancia, id_usuario, tipo_permissao
)

permissoes_usuario_usuario (
  id_usuario_origem, id_usuario_destino
)

permissoes_usuario_equipe (
  id_usuario, id_equipe
)
```
✅ Prós: Queries eficientes, índices otimizados  
❌ Contras: Mais tabelas, mais complexo

**Recomendação:** Opção 1 (JSONB) para MVP, avaliar performance e considerar Opção 2 se necessário

---

### 5.2 Índices Críticos

**Obrigatórios (Performance):**

```sql
-- Multi-tenancy (CRÍTICO)
CREATE INDEX idx_usuarios_instancia ON usuarios(id_instancia_chat) WHERE deleted_at IS NULL;
CREATE INDEX idx_mensagens_instancia ON mensagens(id_instancia_chat) WHERE deleted_at IS NULL;

-- Chat (CRÍTICO)
CREATE INDEX idx_mensagens_conversa_data 
  ON mensagens(id_conversa, created_at DESC) WHERE deleted_at IS NULL;

-- Autenticação (CRÍTICO)
CREATE INDEX idx_usuarios_email ON usuarios(email) WHERE deleted_at IS NULL;

-- Hierarquia
CREATE INDEX idx_usuarios_supervisor ON usuarios(id_supervisor);

-- Busca
CREATE INDEX idx_mensagens_busca 
  ON mensagens USING gin(to_tsvector('portuguese', conteudo_texto));
```

---

## 6. Riscos e Mitigações

### 6.1 Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Vazamento de dados entre instâncias** | Baixa | Crítico | - Middleware de tenant obrigatório<br>- Testes de penetração<br>- Code review rigoroso |
| **Performance ruim com muitas mensagens** | Média | Alto | - Índices otimizados<br>- Paginação<br>- Particionamento (futuro) |
| **Escalabilidade do Socket.IO** | Média | Médio | - Redis adapter<br>- Load balancing<br>- Testes de carga |
| **Complexidade das permissões** | Alta | Médio | - Começar simples (modelos pré-definidos)<br>- Documentação clara<br>- Testes extensivos |

### 6.2 Riscos de Negócio

| Risco | Mitigação |
|-------|-----------|
| **Requisitos mudam durante desenvolvimento** | Desenvolvimento incremental, entregas frequentes |
| **Prazo muito agressivo** | Priorização clara (MVP primeiro), features extras depois |
| **Falta de feedback dos usuários** | Protótipo navegável cedo (Fase 3), testes com usuários reais |

---

## 7. Recomendações Finais

### 7.1 Aprovação para Iniciar

✅ **Recomendação: APROVAR o início do desenvolvimento**

**Justificativa:**
- Requisitos bem definidos e viáveis
- Arquitetura sólida (multi-tenant, Socket.IO)
- Fases bem divididas
- Riscos identificados e mitigados

### 7.2 Ajustes Sugeridos

**Antes de Iniciar Desenvolvimento:**

1. ✅ **Decidir modelo de cadastro de usuários** (criação direta vs. convite)
2. ✅ **Validar modelo de permissões** com stakeholders
3. ✅ **Definir política de retenção de mensagens** (deletar após X tempo?)
4. ✅ **Confirmar requisitos de compliance** (LGPD/GDPR)

**Durante Fase 1:**

5. ✅ Implementar logs de auditoria desde o início
6. ✅ Documentar decisões técnicas importantes
7. ✅ Setup de CI/CD cedo (automatizar testes)

---

## 8. Conclusão

Os requisitos fornecidos formam uma **base sólida** para o desenvolvimento do sistema Chat Interno. A arquitetura multi-tenant proposta é adequada, e a divisão em fases permite entregas incrementais e gerenciamento de risco.

### Próximos Passos

1. ✅ Aprovação deste documento por stakeholders
2. ✅ Início da **Fase 0 (Setup)** - 1 semana
3. ✅ Sprint Planning da **Fase 1** - Sprint 1.1
4. 🚀 Início do desenvolvimento

---

**Documento elaborado por:** Equipe Técnica  
**Data:** 16/10/2025  
**Versão:** 1.0  
**Status:** ✅ Aprovado para Desenvolvimento

