# Modelo de Dados - Chat Interno

## 1. Visão Geral

Este documento detalha o modelo de dados completo do sistema, incluindo tabelas, relacionamentos, índices e constraints.

## 2. Diagrama Entidade-Relacionamento

```
┌─────────────────┐
│    empresas     │
├─────────────────┤
│ id (PK)         │
│ nome_cliente    │
│ cnpj (UNIQUE)   │
│ email_contato   │
│ telefone        │
│ status          │
│ created_at      │
│ updated_at      │
│ deleted_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────────────┐
│   instancias_chat       │
├─────────────────────────┤
│ id (PK)                 │
│ id_empresa (FK)         │◀────────┐
│ nome_instancia          │         │
│ descricao               │         │ N
│ limite_usuarios         │         │
│ status                  │    ┌────┴────────┐
│ data_validade           │    │   equipes   │
│ created_at              │    ├─────────────┤
│ updated_at              │    │ id (PK)     │
│ deleted_at              │    │ id_instancia│
└────────┬────────────────┘    │   _chat (FK)│
         │ 1                   │ nome        │
         │                     │ descricao   │
         │ N                   │ created_at  │
┌────────▼──────────┐          │ updated_at  │
│     usuarios      │          │ deleted_at  │
├───────────────────┤          └──────┬──────┘
│ id (PK)           │                 │ 1
│ id_instancia_chat │                 │
│   (FK)            │                 │ N
│ id_equipe (FK)    │◀────────────────┘
│ id_supervisor (FK)│
│ nome_completo     │
│ email (UNIQUE)    │
│ hash_senha        │
│ nivel_permissao   │
│ status            │
│ ultimo_acesso     │
│ forcar_troca_senha│
│ created_at        │
│ updated_at        │
│ deleted_at        │
└──────┬────────────┘
       │ N
       │
       │ N
┌──────▼──────────────────┐
│ participantes_conversa  │
├─────────────────────────┤
│ id (PK)                 │
│ id_conversa (FK)        │
│ id_usuario (FK)         │
│ joined_at               │
│ left_at                 │
│ ultima_leitura          │
└──────┬──────────────────┘
       │ N
       │
       │ 1
┌──────▼──────────────┐
│     conversas       │
├─────────────────────┤
│ id (PK)             │
│ id_instancia_chat   │
│   (FK)              │
│ tipo_conversa       │
│ nome_conversa       │
│ created_at          │
│ updated_at          │
│ deleted_at          │
└──────┬──────────────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│     mensagens       │
├─────────────────────┤
│ id (PK)             │
│ id_conversa (FK)    │
│ id_remetente (FK)   │
│ id_instancia_chat   │
│   (FK)              │
│ conteudo_texto      │
│ tipo_mensagem       │
│ metadata            │
│ editada             │
│ created_at          │
│ updated_at          │
│ deleted_at          │
└─────────────────────┘


┌──────────────────────┐
│ permissoes_comunicacao│
├──────────────────────┤
│ id (PK)              │
│ id_instancia_chat    │
│   (FK)               │
│ id_usuario (FK)      │
│ id_equipe (FK)       │
│ tipo_permissao       │
│ pode_comunicar_com   │
│   (JSONB)            │
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

## 3. Definição das Tabelas

### 3.1 Tabela: `empresas`

Armazena os clientes (empresas) do sistema.

```sql
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nome_cliente VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email_contato VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa', 'suspensa')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj) WHERE deleted_at IS NULL;
CREATE INDEX idx_empresas_status ON empresas(status) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE empresas IS 'Empresas clientes que contratam o serviço';
COMMENT ON COLUMN empresas.status IS 'Status: ativa, inativa, suspensa';
```

**Campos:**
- `id`: Identificador único
- `nome_cliente`: Nome da empresa
- `cnpj`: CNPJ (único)
- `email_contato`: Email principal
- `telefone`: Telefone de contato
- `status`: Status da conta
- Timestamps: `created_at`, `updated_at`, `deleted_at`

---

### 3.2 Tabela: `instancias_chat`

Representa cada "produto" contratado por uma empresa.

```sql
CREATE TABLE instancias_chat (
    id SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
    nome_instancia VARCHAR(200) NOT NULL,
    descricao TEXT,
    limite_usuarios INTEGER NOT NULL CHECK (limite_usuarios > 0),
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'suspensa', 'cancelada')),
    data_validade DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT uk_instancia_empresa_nome UNIQUE(id_empresa, nome_instancia, deleted_at)
);

-- Índices
CREATE INDEX idx_instancias_empresa ON instancias_chat(id_empresa) WHERE deleted_at IS NULL;
CREATE INDEX idx_instancias_status ON instancias_chat(status) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE instancias_chat IS 'Instâncias de chat contratadas por empresas';
COMMENT ON COLUMN instancias_chat.limite_usuarios IS 'Número máximo de usuários permitidos';
```

**Campos:**
- `id`: Identificador único
- `id_empresa`: FK para empresas
- `nome_instancia`: Nome da instância (ex: "Filial SP", "Departamento TI")
- `descricao`: Descrição opcional
- `limite_usuarios`: Máximo de usuários (obrigatório)
- `status`: Status da instância
- `data_validade`: Data de expiração (opcional)

---

### 3.3 Tabela: `equipes`

Equipes/setores dentro de uma instância.

```sql
CREATE TABLE equipes (
    id SERIAL PRIMARY KEY,
    id_instancia_chat INTEGER NOT NULL REFERENCES instancias_chat(id) ON DELETE RESTRICT,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT uk_equipe_instancia_nome UNIQUE(id_instancia_chat, nome, deleted_at)
);

-- Índices
CREATE INDEX idx_equipes_instancia ON equipes(id_instancia_chat) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE equipes IS 'Equipes/setores dentro de cada instância';
```

**Campos:**
- `id`: Identificador único
- `id_instancia_chat`: FK para instancias_chat
- `nome`: Nome da equipe
- `descricao`: Descrição

---

### 3.4 Tabela: `usuarios`

Todos os usuários do sistema (exceto Super Admin).

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    id_instancia_chat INTEGER NOT NULL REFERENCES instancias_chat(id) ON DELETE RESTRICT,
    id_equipe INTEGER REFERENCES equipes(id) ON DELETE SET NULL,
    id_supervisor INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    nome_completo VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash_senha VARCHAR(255) NOT NULL,
    nivel_permissao VARCHAR(20) NOT NULL CHECK (
        nivel_permissao IN ('super_admin', 'admin_cliente', 'gestor', 'equipe')
    ),
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
    ultimo_acesso TIMESTAMP,
    forcar_troca_senha BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_usuarios_instancia ON usuarios(id_instancia_chat) WHERE deleted_at IS NULL;
CREATE INDEX idx_usuarios_email ON usuarios(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_usuarios_equipe ON usuarios(id_equipe) WHERE deleted_at IS NULL;
CREATE INDEX idx_usuarios_supervisor ON usuarios(id_supervisor) WHERE deleted_at IS NULL;
CREATE INDEX idx_usuarios_nivel ON usuarios(nivel_permissao) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE usuarios IS 'Todos os usuários do sistema';
COMMENT ON COLUMN usuarios.nivel_permissao IS 'Níveis: super_admin, admin_cliente, gestor, equipe';
COMMENT ON COLUMN usuarios.id_supervisor IS 'Auto-relacionamento: supervisor direto';
```

**Campos:**
- `id`: Identificador único
- `id_instancia_chat`: FK para instancia (NULL para super_admin)
- `id_equipe`: FK para equipe
- `id_supervisor`: FK para usuario (auto-relacionamento)
- `nome_completo`: Nome do usuário
- `email`: Email (único)
- `hash_senha`: Senha com bcrypt
- `nivel_permissao`: super_admin | admin_cliente | gestor | equipe
- `status`: ativo | inativo | bloqueado
- `ultimo_acesso`: Timestamp último login
- `forcar_troca_senha`: Flag para primeiro login

**Constraints Especiais:**
- Super Admin: `id_instancia_chat` pode ser NULL
- Prevenir ciclos hierárquicos (via trigger ou aplicação)

---

### 3.5 Tabela: `conversas`

Conversas (1-on-1 ou grupo).

```sql
CREATE TABLE conversas (
    id SERIAL PRIMARY KEY,
    id_instancia_chat INTEGER NOT NULL REFERENCES instancias_chat(id) ON DELETE RESTRICT,
    tipo_conversa VARCHAR(20) NOT NULL CHECK (
        tipo_conversa IN ('individual', 'grupo', 'canal', 'geral')
    ),
    nome_conversa VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_conversas_instancia ON conversas(id_instancia_chat) WHERE deleted_at IS NULL;
CREATE INDEX idx_conversas_tipo ON conversas(tipo_conversa) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE conversas IS 'Conversas individuais ou em grupo';
COMMENT ON COLUMN conversas.tipo_conversa IS 'Tipos: individual, grupo, canal, geral';
COMMENT ON COLUMN conversas.nome_conversa IS 'Nome do grupo/canal (NULL para individual)';
```

**Campos:**
- `id`: Identificador único
- `id_instancia_chat`: FK para instancia
- `tipo_conversa`: individual | grupo | canal | geral
- `nome_conversa`: Nome (obrigatório para grupo/canal)

**Tipos de Conversa:**
- **individual**: 1-on-1 (2 participantes)
- **grupo**: Grupo privado (N participantes)
- **canal**: Canal de equipe
- **geral**: Canal geral da instância

---

### 3.6 Tabela: `participantes_conversa`

Relacionamento N-N entre conversas e usuários.

```sql
CREATE TABLE participantes_conversa (
    id SERIAL PRIMARY KEY,
    id_conversa INTEGER NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    ultima_leitura TIMESTAMP,
    
    CONSTRAINT uk_conversa_usuario UNIQUE(id_conversa, id_usuario)
);

-- Índices
CREATE INDEX idx_participantes_conversa ON participantes_conversa(id_conversa);
CREATE INDEX idx_participantes_usuario ON participantes_conversa(id_usuario);
CREATE INDEX idx_participantes_ativo ON participantes_conversa(id_usuario, id_conversa) 
    WHERE left_at IS NULL;

-- Comentários
COMMENT ON TABLE participantes_conversa IS 'Participantes de cada conversa';
COMMENT ON COLUMN participantes_conversa.ultima_leitura IS 'Timestamp da última mensagem lida';
```

**Campos:**
- `id`: Identificador único
- `id_conversa`: FK para conversas
- `id_usuario`: FK para usuarios
- `joined_at`: Quando entrou
- `left_at`: Quando saiu (NULL = ativo)
- `ultima_leitura`: Para marcar mensagens como lidas

---

### 3.7 Tabela: `mensagens`

Mensagens enviadas nas conversas.

```sql
CREATE TABLE mensagens (
    id SERIAL PRIMARY KEY,
    id_conversa INTEGER NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
    id_remetente INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    id_instancia_chat INTEGER NOT NULL REFERENCES instancias_chat(id) ON DELETE RESTRICT,
    conteudo_texto TEXT NOT NULL CHECK (LENGTH(conteudo_texto) <= 5000),
    tipo_mensagem VARCHAR(20) DEFAULT 'texto' CHECK (
        tipo_mensagem IN ('texto', 'arquivo', 'imagem', 'sistema')
    ),
    metadata JSONB,
    editada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Índices
CREATE INDEX idx_mensagens_conversa_data ON mensagens(id_conversa, created_at DESC) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_mensagens_remetente ON mensagens(id_remetente) WHERE deleted_at IS NULL;
CREATE INDEX idx_mensagens_instancia ON mensagens(id_instancia_chat) WHERE deleted_at IS NULL;
CREATE INDEX idx_mensagens_busca ON mensagens USING gin(to_tsvector('portuguese', conteudo_texto)) 
    WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE mensagens IS 'Mensagens enviadas nas conversas';
COMMENT ON COLUMN mensagens.metadata IS 'Dados adicionais (ex: nome arquivo, URL, etc)';
COMMENT ON COLUMN mensagens.editada IS 'Flag se mensagem foi editada';
```

**Campos:**
- `id`: Identificador único
- `id_conversa`: FK para conversas
- `id_remetente`: FK para usuarios
- `id_instancia_chat`: FK para instancia (redundante para isolamento)
- `conteudo_texto`: Conteúdo (máx 5000 chars)
- `tipo_mensagem`: texto | arquivo | imagem | sistema
- `metadata`: JSONB para dados extras
- `editada`: Flag se foi editada

**Índice Full-Text:**
- Busca em português com `to_tsvector`

---

### 3.8 Tabela: `permissoes_comunicacao`

Define permissões de comunicação customizadas.

```sql
CREATE TABLE permissoes_comunicacao (
    id SERIAL PRIMARY KEY,
    id_instancia_chat INTEGER NOT NULL REFERENCES instancias_chat(id) ON DELETE CASCADE,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    id_equipe INTEGER REFERENCES equipes(id) ON DELETE CASCADE,
    tipo_permissao VARCHAR(30) NOT NULL CHECK (
        tipo_permissao IN ('restrito', 'padrao', 'equipe', 'geral', 'customizado')
    ),
    pode_comunicar_com JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_usuario_ou_equipe CHECK (
        (id_usuario IS NOT NULL AND id_equipe IS NULL) OR
        (id_usuario IS NULL AND id_equipe IS NOT NULL)
    )
);

-- Índices
CREATE INDEX idx_permissoes_instancia ON permissoes_comunicacao(id_instancia_chat);
CREATE INDEX idx_permissoes_usuario ON permissoes_comunicacao(id_usuario);
CREATE INDEX idx_permissoes_equipe ON permissoes_comunicacao(id_equipe);

-- Comentários
COMMENT ON TABLE permissoes_comunicacao IS 'Permissões de comunicação por usuário ou equipe';
COMMENT ON COLUMN permissoes_comunicacao.pode_comunicar_com IS 'JSONB: {usuarios: [ids], equipes: [ids]}';
```

**Campos:**
- `id`: Identificador único
- `id_instancia_chat`: FK para instancia
- `id_usuario`: FK para usuario (exclusivo com id_equipe)
- `id_equipe`: FK para equipe (exclusivo com id_usuario)
- `tipo_permissao`: Modelo de permissão
- `pode_comunicar_com`: JSONB com IDs permitidos

**Estrutura JSONB `pode_comunicar_com`:**
```json
{
  "usuarios": [1, 2, 3],
  "equipes": [5, 6],
  "supervisores": true,
  "admins": true,
  "todos": false
}
```

---

### 3.9 Tabela: `logs_auditoria` (Sugerida - Fase 2)

Registra ações administrativas para auditoria.

```sql
CREATE TABLE logs_auditoria (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    id_instancia_chat INTEGER REFERENCES instancias_chat(id) ON DELETE SET NULL,
    acao VARCHAR(50) NOT NULL,
    entidade VARCHAR(50) NOT NULL,
    id_entidade INTEGER,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_logs_usuario ON logs_auditoria(id_usuario);
CREATE INDEX idx_logs_instancia ON logs_auditoria(id_instancia_chat);
CREATE INDEX idx_logs_data ON logs_auditoria(created_at DESC);
CREATE INDEX idx_logs_acao ON logs_auditoria(acao);

-- Comentários
COMMENT ON TABLE logs_auditoria IS 'Log de auditoria de ações administrativas';
```

**Campos:**
- `acao`: CREATE, UPDATE, DELETE, LOGIN, etc
- `entidade`: usuarios, equipes, permissoes, etc
- `id_entidade`: ID do registro afetado
- `dados_anteriores`: Estado anterior (JSONB)
- `dados_novos`: Novo estado (JSONB)

---

## 4. Relacionamentos

### 4.1 Resumo de Relacionamentos

| Tabela Origem | Relação | Tabela Destino | Tipo |
|---------------|---------|----------------|------|
| empresas | 1:N | instancias_chat | Uma empresa tem N instâncias |
| instancias_chat | 1:N | equipes | Uma instância tem N equipes |
| instancias_chat | 1:N | usuarios | Uma instância tem N usuários |
| instancias_chat | 1:N | conversas | Uma instância tem N conversas |
| equipes | 1:N | usuarios | Uma equipe tem N usuários |
| usuarios | 1:N | usuarios | Supervisor (auto-relacionamento) |
| conversas | N:N | usuarios | Participantes (via participantes_conversa) |
| conversas | 1:N | mensagens | Uma conversa tem N mensagens |
| usuarios | 1:N | mensagens | Um usuário envia N mensagens |

### 4.2 Constraints de Integridade

**Cascata de Deleção:**
- `conversas` → `mensagens`: CASCADE (deletar conversa = deletar mensagens)
- `conversas` → `participantes_conversa`: CASCADE

**Restrição:**
- `empresas` → `instancias_chat`: RESTRICT (não pode deletar empresa com instâncias)
- `instancias_chat` → `usuarios`: RESTRICT

**Set NULL:**
- `usuarios.id_supervisor`: SET NULL (se supervisor deletado)
- `usuarios.id_equipe`: SET NULL (se equipe deletada)

---

## 5. Regras de Negócio (Database Level)

### 5.1 Triggers

#### Trigger: Prevenir Ciclos Hierárquicos

```sql
CREATE OR REPLACE FUNCTION check_supervisor_cycle()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se há ciclo na hierarquia
    IF NEW.id_supervisor IS NOT NULL THEN
        WITH RECURSIVE hierarquia AS (
            SELECT id, id_supervisor, 1 as level
            FROM usuarios
            WHERE id = NEW.id_supervisor
            
            UNION ALL
            
            SELECT u.id, u.id_supervisor, h.level + 1
            FROM usuarios u
            INNER JOIN hierarquia h ON u.id = h.id_supervisor
            WHERE h.level < 10  -- Limite de profundidade
        )
        SELECT INTO cycle_found
            CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END
        FROM hierarquia
        WHERE id = NEW.id;
        
        IF cycle_found THEN
            RAISE EXCEPTION 'Ciclo detectado na hierarquia de supervisores';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_supervisor_cycle
    BEFORE INSERT OR UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION check_supervisor_cycle();
```

#### Trigger: Validar Limite de Usuários

```sql
CREATE OR REPLACE FUNCTION check_usuario_limite()
RETURNS TRIGGER AS $$
DECLARE
    atual_count INTEGER;
    limite INTEGER;
BEGIN
    -- Busca o limite da instância
    SELECT limite_usuarios INTO limite
    FROM instancias_chat
    WHERE id = NEW.id_instancia_chat;
    
    -- Conta usuários ativos (exceto admins)
    SELECT COUNT(*) INTO atual_count
    FROM usuarios
    WHERE id_instancia_chat = NEW.id_instancia_chat
      AND status = 'ativo'
      AND nivel_permissao NOT IN ('super_admin', 'admin_cliente')
      AND deleted_at IS NULL;
    
    -- Verifica se excede (só para novos usuários não-admin)
    IF (TG_OP = 'INSERT' OR OLD.status != 'ativo') 
       AND NEW.status = 'ativo'
       AND NEW.nivel_permissao NOT IN ('super_admin', 'admin_cliente')
       AND atual_count >= limite THEN
        RAISE EXCEPTION 'Limite de % usuários atingido para esta instância', limite;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_usuario_limite
    BEFORE INSERT OR UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION check_usuario_limite();
```

#### Trigger: Atualizar `updated_at` Automaticamente

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas
CREATE TRIGGER trg_update_timestamp_empresas
    BEFORE UPDATE ON empresas
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_timestamp_instancias
    BEFORE UPDATE ON instancias_chat
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ... repetir para outras tabelas
```

### 5.2 Functions Úteis

#### Function: Contar Usuários Ativos de uma Instância

```sql
CREATE OR REPLACE FUNCTION count_usuarios_ativos(p_id_instancia INTEGER)
RETURNS INTEGER AS $$
    SELECT COUNT(*)::INTEGER
    FROM usuarios
    WHERE id_instancia_chat = p_id_instancia
      AND status = 'ativo'
      AND nivel_permissao NOT IN ('super_admin', 'admin_cliente')
      AND deleted_at IS NULL;
$$ LANGUAGE sql STABLE;
```

#### Function: Verificar Permissão de Comunicação

```sql
CREATE OR REPLACE FUNCTION pode_comunicar(
    p_id_usuario_origem INTEGER,
    p_id_usuario_destino INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_pode BOOLEAN := FALSE;
    v_permissao RECORD;
    v_instancia_origem INTEGER;
    v_instancia_destino INTEGER;
BEGIN
    -- Verifica se são da mesma instância
    SELECT id_instancia_chat INTO v_instancia_origem FROM usuarios WHERE id = p_id_usuario_origem;
    SELECT id_instancia_chat INTO v_instancia_destino FROM usuarios WHERE id = p_id_usuario_destino;
    
    IF v_instancia_origem != v_instancia_destino THEN
        RETURN FALSE;
    END IF;
    
    -- Busca permissão do usuário
    SELECT * INTO v_permissao
    FROM permissoes_comunicacao
    WHERE id_usuario = p_id_usuario_origem;
    
    -- Lógica de verificação baseada em tipo_permissao e pode_comunicar_com
    -- [Implementar lógica detalhada]
    
    RETURN v_pode;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Views Úteis

### View: Usuários com Contador de Mensagens

```sql
CREATE VIEW vw_usuarios_estatisticas AS
SELECT 
    u.id,
    u.nome_completo,
    u.email,
    u.nivel_permissao,
    u.status,
    e.nome AS equipe_nome,
    s.nome_completo AS supervisor_nome,
    COUNT(m.id) AS total_mensagens,
    MAX(m.created_at) AS ultima_mensagem,
    u.ultimo_acesso
FROM usuarios u
LEFT JOIN equipes e ON u.id_equipe = e.id
LEFT JOIN usuarios s ON u.id_supervisor = s.id
LEFT JOIN mensagens m ON u.id = m.id_remetente AND m.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.nome_completo, u.email, u.nivel_permissao, 
         u.status, e.nome, s.nome_completo, u.ultimo_acesso;
```

### View: Conversas com Última Mensagem

```sql
CREATE VIEW vw_conversas_resumo AS
SELECT 
    c.id,
    c.id_instancia_chat,
    c.tipo_conversa,
    c.nome_conversa,
    COUNT(DISTINCT pc.id_usuario) AS total_participantes,
    COUNT(m.id) AS total_mensagens,
    MAX(m.created_at) AS ultima_mensagem_data,
    FIRST_VALUE(m.conteudo_texto) OVER (
        PARTITION BY c.id ORDER BY m.created_at DESC
    ) AS ultima_mensagem_texto
FROM conversas c
LEFT JOIN participantes_conversa pc ON c.id = pc.id_conversa AND pc.left_at IS NULL
LEFT JOIN mensagens m ON c.id = m.id_conversa AND m.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.id_instancia_chat, c.tipo_conversa, c.nome_conversa, m.conteudo_texto;
```

---

## 7. Estratégia de Migração

### Ordem de Criação

1. `empresas`
2. `instancias_chat`
3. `equipes`
4. `usuarios`
5. `conversas`
6. `participantes_conversa`
7. `mensagens`
8. `permissoes_comunicacao`
9. `logs_auditoria`

### Seeds Iniciais

#### Super Admin

```sql
INSERT INTO usuarios (
    id_instancia_chat, nome_completo, email, hash_senha, 
    nivel_permissao, status
) VALUES (
    NULL, 
    'Super Administrador', 
    'admin@chatinterno.com', 
    -- hash bcrypt de 'Admin@123'
    '$2b$10$xyz...', 
    'super_admin', 
    'ativo'
);
```

---

## 8. Performance e Otimização

### 8.1 Particionamento (Futuro)

**Particionamento de `mensagens` por data:**

```sql
CREATE TABLE mensagens (
    -- ... campos
) PARTITION BY RANGE (created_at);

CREATE TABLE mensagens_2025_10 PARTITION OF mensagens
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE mensagens_2025_11 PARTITION OF mensagens
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

### 8.2 Índices Compostos

```sql
-- Query frequente: buscar mensagens de uma conversa de uma instância
CREATE INDEX idx_mensagens_conversa_instancia 
    ON mensagens(id_conversa, id_instancia_chat, created_at DESC);

-- Query: buscar usuários ativos de uma equipe
CREATE INDEX idx_usuarios_equipe_status 
    ON usuarios(id_equipe, status) WHERE deleted_at IS NULL;
```

### 8.3 Análise de Queries

```sql
-- Análise de query lenta
EXPLAIN ANALYZE
SELECT m.*
FROM mensagens m
INNER JOIN conversas c ON m.id_conversa = c.id
WHERE c.id_instancia_chat = 1
  AND m.created_at > NOW() - INTERVAL '7 days'
ORDER BY m.created_at DESC
LIMIT 50;
```

---

## 9. Backup e Recuperação

### Backup Completo

```bash
pg_dump -U postgres -d chat_interno -F c -b -v -f backup_$(date +%Y%m%d).dump
```

### Restore

```bash
pg_restore -U postgres -d chat_interno -v backup_20251016.dump
```

### Backup Incremental (WAL)

```sql
-- Configurar no postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'
```

---

**Última atualização:** 16/10/2025  
**Versão:** 1.0

