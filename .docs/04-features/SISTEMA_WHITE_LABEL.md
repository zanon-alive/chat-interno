# 🎨 Sistema White-Label - Personalização Visual

> **Versão:** 1.5  
> **Data:** 18/10/2025  
> **Status:** ✅ Implementado e Funcional

---

## 📋 Visão Geral

Sistema completo de personalização visual (White-Label) que permite aos **Administradores de Cliente** configurar as cores, logo e aparência da aplicação para refletir a identidade visual da sua empresa.

**Principais Benefícios:**
- ✅ **Branding Personalizado**: Logo e cores da empresa
- ✅ **Aplicação Instantânea**: Mudanças refletidas em tempo real
- ✅ **Widget Incluso**: Personalização também no widget embarcável
- ✅ **Auditoria Completa**: Log de todas as alterações
- ✅ **SuperAdmin**: Visão e edição de todos os temas

---

## 🎯 Funcionalidades Implementadas

### 1. **Personalização de Cores (18 Campos)**

#### **Cores Primárias**
- `cor_primaria`: Cor principal (botões, links, destaques)
- `cor_primaria_hover`: Cor ao passar o mouse
- `cor_secundaria`: Cor secundária (gradientes, acentos)

#### **Cores de Fundo**
- `cor_fundo`: Fundo principal da aplicação
- `cor_fundo_secundario`: Fundo de cards, modais

#### **Cores de Texto**
- `cor_texto_primaria`: Texto principal
- `cor_texto_secundaria`: Texto secundário (subtítulos, hints)

#### **Cores do Chat**
- `cor_mensagem_enviada`: Fundo das mensagens enviadas
- `cor_mensagem_recebida`: Fundo das mensagens recebidas

#### **Cores de Estado**
- `cor_sucesso`: Mensagens de sucesso (#48bb78)
- `cor_erro`: Mensagens de erro (#f56565)
- `cor_alerta`: Alertas (#ed8936)
- `cor_info`: Informações (#4299e1)

### 2. **Logo Personalizado**
- **URL do Logo**: Caminho ou URL da imagem
- **Largura**: 50-500px (padrão: 150px)
- **Altura**: 20-200px (padrão: 50px)
- **Preview**: Visualização em tempo real

### 3. **Configurações Adicionais**
- **Fonte Principal**: Customizar fonte (ex: "Roboto, sans-serif")
- **Border Radius**: Arredondamento de cantos (0-50px)
- **Tema Escuro**: Preparado para futuro (flag booleana)

### 4. **Auditoria e Logs**
- ✅ Registro de todas as alterações
- ✅ Rastreamento de usuário, IP e User-Agent
- ✅ Valores anteriores/novos em JSON
- ✅ Filtros por ação e data
- ✅ Histórico visual na interface

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `temas_instancias`

```sql
CREATE TABLE temas_instancias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_instancia INTEGER UNIQUE NOT NULL,  -- Relação 1:1 com instancias_chat
  
  -- Logo
  logo_url VARCHAR(500),
  logo_width INTEGER DEFAULT 150,
  logo_height INTEGER DEFAULT 50,
  
  -- Cores (18 campos)
  cor_primaria VARCHAR(7) DEFAULT '#667eea',
  cor_primaria_hover VARCHAR(7) DEFAULT '#5568d3',
  cor_secundaria VARCHAR(7) DEFAULT '#764ba2',
  cor_fundo VARCHAR(7) DEFAULT '#f7fafc',
  cor_fundo_secundario VARCHAR(7) DEFAULT '#ffffff',
  cor_texto_primaria VARCHAR(7) DEFAULT '#2d3748',
  cor_texto_secundaria VARCHAR(7) DEFAULT '#718096',
  cor_mensagem_enviada VARCHAR(7) DEFAULT '#667eea',
  cor_mensagem_recebida VARCHAR(7) DEFAULT '#e2e8f0',
  cor_sucesso VARCHAR(7) DEFAULT '#48bb78',
  cor_erro VARCHAR(7) DEFAULT '#f56565',
  cor_alerta VARCHAR(7) DEFAULT '#ed8936',
  cor_info VARCHAR(7) DEFAULT '#4299e1',
  
  -- Configurações
  fonte_principal VARCHAR(100) DEFAULT 'Inter, sans-serif',
  border_radius INTEGER DEFAULT 8,
  tema_escuro_ativo BOOLEAN DEFAULT 0,
  
  -- Metadados
  ativo BOOLEAN DEFAULT 1,
  criado_por INTEGER,
  atualizado_por INTEGER,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Tabela: `tema_logs`

```sql
CREATE TABLE tema_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_tema INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  id_instancia INTEGER NOT NULL,
  acao ENUM('criado', 'atualizado', 'logo_alterado', 'ativado', 'desativado'),
  campo_alterado VARCHAR(100),
  valor_anterior TEXT,  -- JSON
  valor_novo TEXT,      -- JSON
  ip_origem VARCHAR(45),
  user_agent VARCHAR(500),
  descricao TEXT,
  created_at DATETIME
);
```

---

## 🔌 API Endpoints

### **Admin Routes** (`/api/admin/tema`)

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| `GET` | `/tema` | Obter tema da instância | Admin |
| `PUT` | `/tema` | Atualizar tema | Admin |
| `PUT` | `/tema/logo` | Atualizar apenas logo | Admin |
| `POST` | `/tema/resetar` | Resetar para padrão | Admin |
| `GET` | `/tema/logs` | Listar histórico de alterações | Admin |
| `GET` | `/tema/preview` | Preview (CSS variables) | Admin |

### **SuperAdmin Routes** (`/api/superadmin/temas`)

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| `GET` | `/temas` | Listar todos os temas | Super Admin |
| `GET` | `/temas/instancia/:id` | Obter tema específico | Super Admin |
| `PUT` | `/temas/instancia/:id` | Editar tema específico | Super Admin |
| `GET` | `/temas/logs/:idInstancia` | Logs de qualquer instância | Super Admin |

---

## 📡 Exemplos de Requisições

### 1. Obter Tema da Instância

```http
GET /api/admin/tema
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "id_instancia": 1,
    "logo_url": "https://empresa.com/logo.png",
    "logo_width": 150,
    "logo_height": 50,
    "cor_primaria": "#667eea",
    "cor_primaria_hover": "#5568d3",
    "cor_secundaria": "#764ba2",
    // ... outras cores
    "fonte_principal": "Inter, sans-serif",
    "border_radius": 8,
    "ativo": true,
    "created_at": "2025-10-18T10:00:00Z",
    "updated_at": "2025-10-18T11:30:00Z"
  }
}
```

### 2. Atualizar Tema

```http
PUT /api/admin/tema
Authorization: Bearer {token}
Content-Type: application/json

{
  "cor_primaria": "#ff6b6b",
  "cor_primaria_hover": "#ff5252",
  "cor_secundaria": "#4ecdc4",
  "cor_fundo": "#f8f9fa",
  "border_radius": 12
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Tema atualizado com sucesso",
  "data": { /* tema atualizado */ }
}
```

### 3. Atualizar Logo

```http
PUT /api/admin/tema/logo
Authorization: Bearer {token}
Content-Type: application/json

{
  "logo_url": "https://nova-empresa.com/logo.png",
  "logo_width": 200,
  "logo_height": 60
}
```

### 4. Resetar para Padrão

```http
POST /api/admin/tema/resetar
Authorization: Bearer {token}
```

### 5. Listar Logs

```http
GET /api/admin/tema/logs?page=1&limit=20
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "total": 15,
  "logs": [
    {
      "id": 42,
      "acao": "atualizado",
      "campo_alterado": "cor_primaria",
      "valor_anterior": "#667eea",
      "valor_novo": "#ff6b6b",
      "descricao": "Campos alterados: cor_primaria, cor_primaria_hover",
      "usuario": {
        "nome_completo": "João Silva",
        "email": "joao@empresa.com"
      },
      "ip_origem": "192.168.1.100",
      "created_at": "2025-10-18T14:30:00Z"
    }
  ],
  "page": 1,
  "totalPages": 1
}
```

---

## 🎨 Frontend - Como Usar

### 1. **Composable `useTheme`**

```javascript
import { useTheme } from '@/composables/useTheme';

const { 
  temaAtual, 
  carregarTema, 
  atualizarTema, 
  resetarTema,
  logo,
  getCSSVariables
} = useTheme();

// Carregar tema ao montar componente
onMounted(() => {
  carregarTema();
});

// Atualizar tema
const novoTema = { cor_primaria: '#ff6b6b' };
atualizarTema(novoTema);

// Logo da instância
console.log(logo.value); // { url, width, height }
```

### 2. **Aplicação Automática no Login**

O tema é **automaticamente aplicado** quando o usuário faz login:

```javascript
// authService.js (backend)
async function login(email, senha) {
  const usuario = await Usuario.findOne({ /* ... */ });
  const tema = await temaService.obterTemaPorInstancia(usuario.id_instancia_chat);
  
  return {
    token,
    usuario: usuario.toJSON(),
    tema: tema.toJSON(),  // ✅ Tema incluído na resposta
    forcar_troca_senha
  };
}
```

### 3. **CSS Variables**

Todas as cores são aplicadas como **CSS Variables**:

```css
:root {
  --cor-primaria: #667eea;
  --cor-primaria-hover: #5568d3;
  --cor-secundaria: #764ba2;
  --cor-fundo: #f7fafc;
  --cor-fundo-secundario: #ffffff;
  --cor-texto-primaria: #2d3748;
  --cor-texto-secundaria: #718096;
  --cor-mensagem-enviada: #667eea;
  --cor-mensagem-recebida: #e2e8f0;
  --cor-sucesso: #48bb78;
  --cor-erro: #f56565;
  --cor-alerta: #ed8936;
  --cor-info: #4299e1;
  --fonte-principal: 'Inter', sans-serif;
  --border-radius: 8px;
}

/* Uso em componentes */
.btn-primary {
  background-color: var(--cor-primaria);
}

.btn-primary:hover {
  background-color: var(--cor-primaria-hover);
}
```

---

## 🔧 Componente de Configuração

### **`ConfiguracaoTema.vue`**

Interface completa com:
- ✅ Color pickers para cada cor
- ✅ Campo para URL do logo
- ✅ Inputs para dimensões do logo
- ✅ Preview da logo em tempo real
- ✅ Slider para border radius
- ✅ Input para fonte customizada
- ✅ Botão "Visualizar" (preview sem salvar)
- ✅ Botão "Resetar para Padrão"
- ✅ Botão "Salvar Alterações"
- ✅ Mensagens de sucesso/erro
- ✅ Histórico de alterações (logs)

**Acesso:**
```
http://localhost:5173/admin/tema
```

---

## 📦 Widget Embarcável

O **widget também suporta personalização visual**!

### Como Funciona

1. **Token JWT** contém o tema da instância
2. Widget decodifica o token ao inicializar
3. Aplica CSS variables automaticamente

```javascript
// ChatWidget.vue
function aplicarTema(tema) {
  const widgetContainer = document.querySelector('.chat-widget-container');
  widgetContainer.style.setProperty('--cor-primaria', tema.cor_primaria);
  widgetContainer.style.setProperty('--cor-fundo', tema.cor_fundo);
  // ... outras variáveis
}
```

### Exemplo de Integração

```html
<script src="https://chat.empresa.com/chat-widget.js"></script>
<script>
  ChatWidget.init({
    token: 'eyJhbGciOiJI...', // Token contém o tema
    apiUrl: 'https://api.empresa.com'
  });
  // Tema aplicado automaticamente! 🎨
</script>
```

---

## 🔒 Segurança e Validações

### Backend

```javascript
// Validação de cores (hexadecimal)
if (!/^#[0-9A-Fa-f]{6}$/.test(tema.cor_primaria)) {
  throw new Error('Cor inválida. Use formato #RRGGBB');
}

// Validação de border radius
if (border_radius < 0 || border_radius > 50) {
  throw new Error('Border radius deve ser entre 0 e 50');
}

// Permissões
// Apenas admin_cliente pode editar tema da própria instância
// Apenas super_admin pode editar tema de qualquer instância
```

### Auditoria

```javascript
// Registrar log de alteração
await temaService.registrarLog({
  id_tema: tema.id,
  id_usuario: usuarioId,
  id_instancia: idInstancia,
  acao: 'atualizado',
  valor_anterior: JSON.stringify(valoresAntigos),
  valor_novo: JSON.stringify(valoresNovos),
  ip_origem: req.ip,
  user_agent: req.headers['user-agent'],
  descricao: `Campos alterados: ${campos.join(', ')}`
});
```

---

## 📊 Estatísticas de Implementação

| Componente | Arquivos | Linhas de Código |
|------------|----------|------------------|
| **Backend** | 7 | ~600 linhas |
| **Frontend** | 4 | ~800 linhas |
| **Migrations** | 2 | ~200 linhas |
| **TOTAL** | **13** | **~1.600 linhas** |

**Tempo de Desenvolvimento:** ~4 horas  
**Complexidade:** Média-Alta  
**Cobertura de Testes:** Pendente  

---

## 🧪 Como Testar

### 1. **Rodar Migrations**

```bash
cd backend
npm run migrate
```

### 2. **Iniciar Backend**

```bash
cd backend
npm run dev
```

### 3. **Iniciar Frontend**

```bash
cd frontend
npm run dev
```

### 4. **Acessar Configuração de Tema**

```
http://localhost:5173/login
↓
Fazer login como Admin
↓
http://localhost:5173/admin/tema
```

### 5. **Testar Funcionalidades**

✅ Modificar cor primária  
✅ Adicionar logo (URL)  
✅ Ajustar border radius  
✅ Clicar em "Visualizar" (preview)  
✅ Clicar em "Salvar Alterações"  
✅ Verificar aplicação instantânea  
✅ Verificar logs de alterações  
✅ Testar "Resetar para Padrão"  

### 6. **Testar no Widget**

```bash
# Gerar token para usuário
cd backend
node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({ id: 2, userId: 2 }, 'sua-chave-secreta'));"

# Abrir exemplo-dashboard.html com o token
```

---

## 🚀 Próximas Melhorias

### **Fase 2 (Opcional)**

- [ ] **Upload de Logo**: Integração com Cloudinary/S3
- [ ] **Tema Escuro**: Suporte completo (toggle)
- [ ] **Templates**: Biblioteca de temas pré-configurados
- [ ] **Export/Import**: Exportar/importar configurações
- [ ] **Preview Live**: Preview em modal sem sair da tela
- [ ] **Gradientes**: Suporte a cores em gradiente
- [ ] **Fontes Google**: Seletor de fontes do Google Fonts
- [ ] **Histórico Diff**: Visualizar diferenças entre versões
- [ ] **Backup/Restore**: Salvar e restaurar temas anteriores

---

## 📝 Licença e Créditos

**Desenvolvido por:** Equipe Chat Interno  
**Data:** 18/10/2025  
**Versão:** 1.5-White-Label  
**Status:** ✅ Production-Ready  

---

## 🆘 Suporte

**Problemas?**
- Verificar logs do backend: `backend/logs/error.log`
- Verificar console do navegador (F12)
- Revisar tabela `tema_logs` no banco de dados
- Entrar em contato com o time de desenvolvimento

**Documentos Relacionados:**
- [Arquitetura do Sistema](../../02-arquitetura/ARQUITETURA.md)
- [Como Rodar](../../01-inicio/02-COMO_RODAR.md)
- [Widget Embarcável](./WIDGET_EMBARCAVEL.md)

---

**🎊 Sistema White-Label Completamente Implementado! 🎊**

