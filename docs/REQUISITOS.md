# Requisitos do Sistema - Chat Interno v2.0

## 1. Visão Geral

Plataforma de comunicação interna multi-tenant e multi-instância que permite ao Super Administrador cadastrar empresas clientes, cada uma podendo contratar múltiplas instâncias de chat com limites de usuários configuráveis.

## 2. Perfis de Usuário (Atores)

### 2.1 Super Administrador (Dono do Sistema)
**Responsabilidades:**
- Acesso ao painel de controle global
- Gerenciamento de empresas clientes
- Criação e configuração de instâncias de chat
- Definição de limites de usuários por instância
- Criação do primeiro administrador de cada instância
- Monitoramento global do sistema

**Permissões:**
- Acesso total a todas as funcionalidades administrativas
- Visualização de métricas globais
- Não acessa conversas internas das instâncias (privacidade)

### 2.2 Administrador do Cliente (Admin/Root)
**Responsabilidades:**
- Gerenciamento de uma ou mais instâncias específicas
- Cadastro, edição e remoção de usuários
- Criação de equipes/setores
- Definição de hierarquia organizacional
- Configuração de permissões de comunicação
- Supervisão de conversas da instância

**Permissões:**
- Acesso total à(s) instância(s) atribuída(s)
- CRUD completo de usuários (respeitando limite)
- Configuração de permissões
- Visualização de todas as conversas da instância

### 2.3 Usuário Final (Gestor/Equipe)
**Responsabilidades:**
- Utilização do chat conforme permissões
- Comunicação com usuários autorizados
- Participação em conversas e canais

**Permissões:**
- Definidas pelo Administrador do Cliente
- Variam conforme cargo/equipe

## 3. Requisitos Funcionais

### 3.1 Módulo de Super Administração

#### RF15: Painel de Super Administração
**Descrição:** Sistema deve prover painel exclusivo para Super Administrador.

**Critérios de Aceitação:**
- Login dedicado para Super Admin
- Interface administrativa com dashboard
- Acesso protegido com autenticação forte
- Logs de auditoria de ações

**Prioridade:** 🔴 Alta

---

#### RF16: Cadastro de Empresas Clientes
**Descrição:** Super Administrador pode cadastrar novas empresas clientes.

**Critérios de Aceitação:**
- Formulário com: nome da empresa, CNPJ, contato, email
- Validação de CNPJ único
- Data de cadastro automática
- Status da empresa (ativa/inativa)
- Listagem de todas as empresas
- Edição e desativação (não exclusão) de empresas

**Campos Obrigatórios:**
- Nome da empresa
- CNPJ
- Email de contato
- Telefone

**Prioridade:** 🔴 Alta

---

#### RF17: Cadastro de Instâncias de Chat
**Descrição:** Para cada empresa, Super Admin pode cadastrar múltiplas instâncias.

**Critérios de Aceitação:**
- Formulário vinculado a uma empresa
- Campos: nome da instância, descrição, limite de usuários
- Uma empresa pode ter N instâncias
- Listagem de instâncias por empresa
- Status da instância (ativa/suspensa/cancelada)
- Data de criação e validade (opcional)

**Campos Obrigatórios:**
- Empresa vinculada
- Nome da instância
- Limite de usuários

**Prioridade:** 🔴 Alta

---

#### RF18: Definição de Limite de Usuários
**Descrição:** Ao criar instância, Super Admin define limite máximo de usuários.

**Critérios de Aceitação:**
- Campo numérico obrigatório (mínimo 1)
- Validação de valor positivo
- Possibilidade de alterar limite posteriormente
- Log de alterações de limite
- Contador de usuários ativos vs. limite

**Regras de Negócio:**
- Limite mínimo: 1 usuário
- Limite máximo: configurável (padrão 10.000)
- Ao reduzir limite, não pode ser menor que usuários ativos

**Prioridade:** 🔴 Alta

---

#### RF19: Criação de Administrador Inicial
**Descrição:** Para cada instância criada, Super Admin designa primeiro Admin do Cliente.

**Critérios de Aceitação:**
- Formulário com dados do administrador (nome, email, senha inicial)
- Email de boas-vindas com credenciais
- Forçar troca de senha no primeiro login
- Um usuário pode ser admin de múltiplas instâncias
- Admin não conta no limite de usuários da instância

**Campos Obrigatórios:**
- Nome completo
- Email (único no sistema)
- Senha inicial

**Prioridade:** 🔴 Alta

---

### 3.2 Módulo de Gestão da Instância

#### RF01: Autenticação do Administrador do Cliente
**Descrição:** Admin do Cliente acessa painel de gerenciamento de sua(s) instância(s).

**Critérios de Aceitação:**
- Login com email e senha
- Autenticação JWT
- Multi-instância: seleção de instância após login
- Sessão com timeout configurável
- Recuperação de senha

**Segurança:**
- Senha com requisitos mínimos (8+ caracteres, maiúsculas, números)
- Hash bcrypt
- Rate limiting no login
- 2FA (opcional - fase futura)

**Prioridade:** 🔴 Alta

---

#### RF02: Cadastro de Equipes/Setores
**Descrição:** Admin do Cliente cria equipes ou setores na instância.

**Critérios de Aceitação:**
- Formulário: nome da equipe, descrição
- Listagem de todas as equipes
- Edição e exclusão de equipes (com validações)
- Não permite excluir equipe com usuários ativos
- Contador de membros por equipe

**Campos Obrigatórios:**
- Nome da equipe

**Prioridade:** 🔴 Alta

---

#### RF03: Cadastro de Usuários
**Descrição:** Admin cadastra usuários (Gestor/Equipe) e associa a equipes.

**Critérios de Aceitação:**
- Formulário completo: nome, email, senha, cargo, equipe, supervisor
- Validação de email único na instância
- Associação obrigatória a uma equipe
- Definição de nível (Gestor ou Equipe)
- Envio de email com credenciais
- Listagem com filtros (equipe, cargo, status)
- Edição de dados do usuário
- Desativação (não exclusão) de usuários

**Campos Obrigatórios:**
- Nome completo
- Email
- Senha inicial
- Equipe
- Nível de permissão (Gestor/Equipe)

**Prioridade:** 🔴 Alta

---

#### RF04: Validação de Limite de Usuários
**Descrição:** Sistema impede cadastro de usuários se limite for atingido.

**Critérios de Aceitação:**
- Validação em tempo real (frontend e backend)
- Mensagem clara: "Limite de X usuários atingido. Contate o suporte para aumentar."
- Indicador visual do limite (ex: "45/50 usuários")
- Contagem de usuários ativos (não desativados)
- Admin da instância pode ver usuários desativados

**Prioridade:** 🔴 Alta

---

#### RF05: Definição de Hierarquia
**Descrição:** Admin define estrutura hierárquica especificando supervisor direto.

**Critérios de Aceitação:**
- Campo "Supervisor Direto" no cadastro de usuário
- Usuário pode ter 0 ou 1 supervisor
- Não permite ciclos hierárquicos (A supervisiona B que supervisiona A)
- Visualização gráfica da hierarquia (organograma)
- Gestores podem ser supervisores
- Admin do Cliente pode ser supervisor de qualquer usuário

**Regras de Negócio:**
- Supervisor deve ser da mesma instância
- Supervisor geralmente é um "Gestor"
- Validação de ciclos na hierarquia

**Prioridade:** 🟡 Média

---

#### RF06: Configuração de Permissões de Comunicação
**Descrição:** Admin configura quem pode conversar com quem.

**Critérios de Aceitação:**
- Interface de configuração de permissões por usuário/grupo
- Modelos de permissão pré-definidos:
  - **Restrito:** Apenas com supervisor direto
  - **Padrão:** Supervisor + Admins da instância
  - **Equipe:** Membros da mesma equipe + supervisor
  - **Geral:** Todos da instância (canal geral)
  - **Customizado:** Seleção manual de usuários/equipes
- Aplicação de permissões em massa por equipe
- Permissões podem ser combinadas
- Visualização de "quem pode falar com quem"

**Prioridade:** 🔴 Alta

---

### 3.3 Módulo de Comunicação

#### RF07: Interface de Chat
**Descrição:** Usuários finais acessam interface de conversação.

**Critérios de Aceitação:**
- Login dedicado para usuários finais
- Lista de conversas disponíveis (conforme permissões)
- Interface limpa e intuitiva
- Responsiva (desktop e mobile)
- Indicador de usuários online
- Notificações em tempo real

**Prioridade:** 🔴 Alta

---

#### RF08: Envio e Recebimento de Mensagens
**Descrição:** Usuários enviam e recebem mensagens em tempo real.

**Critérios de Aceitação:**
- Envio instantâneo via Socket.IO
- Persistência no banco de dados
- Timestamp de cada mensagem
- Indicador de mensagem enviada/entregue/lida (futuro)
- Máximo de 5000 caracteres por mensagem
- Validação e sanitização de conteúdo

**Prioridade:** 🔴 Alta

---

#### RF09: Conversas 1-on-1
**Descrição:** Conversas privadas entre dois usuários autorizados.

**Critérios de Aceitação:**
- Criação automática ao iniciar conversa
- Histórico completo de mensagens
- Busca no histórico
- Scroll infinito (paginação)

**Prioridade:** 🔴 Alta

---

#### RF10: Conversas em Grupo/Canal
**Descrição:** Conversas com múltiplos participantes.

**Critérios de Aceitação:**
- Admin cria canais/grupos
- Nomeação de canais
- Adição/remoção de membros
- Tipos: equipe, geral, customizado
- Notificações configuráveis

**Prioridade:** 🟡 Média

---

#### RF11: Histórico de Mensagens
**Descrição:** Usuários acessam histórico completo de conversas.

**Critérios de Aceitação:**
- Scroll infinito com paginação
- Busca por palavra-chave
- Filtro por data
- Performance otimizada (lazy loading)

**Prioridade:** 🟡 Média

---

#### RF12: Notificações em Tempo Real
**Descrição:** Usuários recebem notificações de novas mensagens.

**Critérios de Aceitação:**
- Notificação browser (com permissão)
- Badge com contador de não lidas
- Som configurável
- Notificações apenas quando não está na conversa ativa

**Prioridade:** 🟡 Média

---

### 3.4 Módulo de Supervisão

#### RF13: Visualização de Conversas
**Descrição:** Admin do Cliente visualiza todas as conversas da instância.

**Critérios de Aceitação:**
- Painel de supervisão dedicado
- Listagem de todas as conversas
- Filtros: usuário, equipe, período, tipo
- Visualização em modo leitura (não participa)
- Busca global de mensagens
- Exportação de conversas (PDF/CSV)

**Prioridade:** 🟡 Média

---

#### RF14: Relatórios e Métricas
**Descrição:** Admin visualiza métricas da instância.

**Critérios de Aceitação:**
- Dashboard com:
  - Usuários ativos/inativos
  - Total de mensagens (dia/semana/mês)
  - Conversas mais ativas
  - Usuários mais ativos
  - Gráficos de engajamento
- Exportação de relatórios
- Período customizável

**Prioridade:** 🟢 Baixa (fase futura)

---

## 4. Requisitos Não Funcionais

### RNF01: Segurança e Multi-Tenancy
**Descrição:** Isolamento total de dados entre instâncias.

**Critérios:**
- Dados de uma instância NUNCA acessíveis por outra
- Middleware de tenant validation em todas as rotas
- Queries sempre com filtro de instância
- Testes de penetração
- Auditoria de acessos

**Prioridade:** 🔴 Crítica

---

### RNF02: Performance
**Descrição:** Sistema responsivo mesmo com muitos usuários.

**Critérios:**
- Tempo de resposta < 200ms (95% das requisições)
- Suporte a 1000+ usuários simultâneos por instância
- Mensagens entregues em < 100ms
- Lazy loading e paginação
- Cache estratégico (Redis futuro)

**Prioridade:** 🔴 Alta

---

### RNF03: Disponibilidade
**Descrição:** Sistema com alta disponibilidade.

**Critérios:**
- Uptime de 99.5%+
- Backup automático diário
- Plano de disaster recovery
- Logs centralizados

**Prioridade:** 🟡 Média

---

### RNF04: Escalabilidade
**Descrição:** Arquitetura preparada para crescimento.

**Critérios:**
- Arquitetura horizontal scale-out
- Stateless (sessões em DB/Redis)
- Load balancing preparado
- Database connection pooling

**Prioridade:** 🟡 Média

---

### RNF05: Usabilidade
**Descrição:** Interface intuitiva e acessível.

**Critérios:**
- Design responsivo
- Acessibilidade (WCAG 2.1 nível AA)
- Feedback visual claro
- Tempo de aprendizado < 15 minutos

**Prioridade:** 🟡 Média

---

### RNF06: Manutenibilidade
**Descrição:** Código limpo e documentado.

**Critérios:**
- Padrões de código (ESLint)
- Cobertura de testes > 70%
- Documentação atualizada
- Versionamento semântico

**Prioridade:** 🟡 Média

---

## 5. Melhorias Propostas

### 5.1 Funcionalidades Adicionais Sugeridas

1. **RF20: Anexo de Arquivos**
   - Upload de imagens, PDFs, documentos
   - Limite de tamanho configurável
   - Visualização inline de imagens
   - Prioridade: 🟢 Baixa (Fase 2)

2. **RF21: Reações a Mensagens**
   - Emojis de reação
   - Contador de reações
   - Prioridade: 🟢 Baixa (Fase 2)

3. **RF22: Mensagens Fixadas**
   - Fixar mensagens importantes
   - Limite de mensagens fixadas
   - Prioridade: 🟢 Baixa (Fase 2)

4. **RF23: Status do Usuário**
   - Online/Ausente/Ocupado/Invisível
   - Mensagem de status customizada
   - Prioridade: 🟡 Média (Fase 2)

5. **RF24: Busca Avançada**
   - Busca global com filtros
   - Indexação full-text
   - Prioridade: 🟡 Média (Fase 2)

6. **RF25: Autenticação 2FA**
   - TOTP (Google Authenticator)
   - Obrigatório para admins
   - Prioridade: 🟡 Média (Fase 3)

7. **RF26: Integração com SSO**
   - SAML 2.0
   - OAuth 2.0 (Google, Microsoft)
   - Prioridade: 🟢 Baixa (Fase 3)

8. **RF27: Logs de Auditoria**
   - Registro de todas as ações administrativas
   - Imutável e criptografado
   - Prioridade: 🟡 Média (Fase 2)

### 5.2 Melhorias no Modelo de Dados

1. **Soft Delete:** Todos os registros usam deleção lógica (campo `deleted_at`)
2. **Timestamps Automáticos:** `created_at`, `updated_at` em todas as tabelas
3. **Versionamento:** Considerar versionamento de mensagens editadas
4. **Índices:** Índices compostos para queries frequentes

### 5.3 Melhorias de Segurança

1. **Rate Limiting:** Por IP e por usuário
2. **Input Validation:** Joi/Yup para validação
3. **CORS:** Configuração restritiva
4. **Helmet.js:** Headers de segurança
5. **Sanitização:** XSS protection em mensagens

## 6. Glossário

- **Tenant:** Empresa cliente que contrata o serviço
- **Instância:** Produto contratado (ambiente de chat isolado)
- **Multi-tenant:** Múltiplos clientes na mesma infraestrutura
- **Multi-instância:** Múltiplos ambientes por cliente
- **Soft Delete:** Deleção lógica (não remove fisicamente)
- **Hierarquia:** Estrutura organizacional (supervisor-subordinado)

## 7. Matriz de Rastreabilidade

| RF/RNF | Ator | Prioridade | Fase |
|--------|------|------------|------|
| RF15-19 | Super Admin | Alta | 1 |
| RF01-06 | Admin Cliente | Alta | 1-2 |
| RF07-12 | Usuário Final | Alta-Média | 2-3 |
| RF13-14 | Admin Cliente | Média-Baixa | 3 |
| RNF01 | Sistema | Crítica | 1 |
| RNF02-06 | Sistema | Alta-Média | 1-2 |

---

**Documento aprovado em:** [Data]  
**Versão:** 2.0  
**Última atualização:** 16/10/2025

