# Testes da API - Chat Interno

## Endpoints Implementados

### Autenticação

#### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chatinterno.com",
    "senha": "Admin@123456"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nome_completo": "Super Administrador",
      "email": "admin@chatinterno.com",
      "nivel_permissao": "super_admin",
      "status": "ativo"
    },
    "forcar_troca_senha": false
  }
}
```

#### 2. Obter Dados do Usuário Logado
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### 3. Trocar Senha
```bash
curl -X POST http://localhost:3000/api/auth/trocar-senha \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "senha_atual": "Admin@123456",
    "nova_senha": "NovaS3nha@Forte"
  }'
```

#### 4. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Usuários de Teste (Seeder)

### Super Admin
- **Email:** admin@chatinterno.com
- **Senha:** Admin@123456
- **Nível:** super_admin

### Admin Cliente (Instância 1)
- **Email:** joao.silva@empresademo.com
- **Senha:** Admin@123456
- **Nível:** admin_cliente
- **Instância:** Chat Matriz

### Gestor de Desenvolvimento
- **Email:** maria.santos@empresademo.com
- **Senha:** User@123456
- **Nível:** gestor
- **Instância:** Chat Matriz
- **Equipe:** Desenvolvimento

### Usuário de Equipe
- **Email:** pedro.oliveira@empresademo.com
- **Senha:** User@123456
- **Nível:** equipe
- **Instância:** Chat Matriz
- **Equipe:** Desenvolvimento

---

## Dados do Banco (Seeder)

### Empresas
1. **Empresa Demo LTDA** (ID: 1)
   - CNPJ: 12.345.678/0001-90
   - 2 Instâncias de chat

2. **Tech Solutions SA** (ID: 2)
   - CNPJ: 98.765.432/0001-10
   - 1 Instância de chat

### Instâncias de Chat
1. **Chat Matriz** (ID: 1) - Empresa Demo - Limite: 50 usuários
2. **Chat Filial SP** (ID: 2) - Empresa Demo - Limite: 30 usuários
3. **Tech Chat** (ID: 3) - Tech Solutions - Limite: 100 usuários

### Equipes (Instância 1 - Chat Matriz)
1. Desenvolvimento
2. Suporte
3. Vendas

### Conversas de Exemplo
- Conversa 1-on-1 entre Pedro e Ana
- Canal Geral (todos da instância)
- Canal Desenvolvimento (equipe de dev)

---

## Super Admin - Empresas (Implementado ✅)

### Listar Empresas
```bash
curl -X GET http://localhost:3000/api/superadmin/empresas \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Criar Empresa
```bash
curl -X POST http://localhost:3000/api/superadmin/empresas \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_cliente": "Nova Empresa LTDA",
    "cnpj": "11.222.333/0001-44",
    "email_contato": "contato@novaempresa.com",
    "telefone": "(11) 99999-8888",
    "status": "ativa"
  }'
```

### Atualizar Empresa
```bash
curl -X PUT http://localhost:3000/api/superadmin/empresas/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_cliente": "Empresa Demo LTDA - Atualizada",
    "status": "ativa"
  }'
```

### Deletar Empresa
```bash
curl -X DELETE http://localhost:3000/api/superadmin/empresas/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Super Admin - Instâncias (Implementado ✅)

### Listar Instâncias
```bash
curl -X GET "http://localhost:3000/api/superadmin/instancias?id_empresa=1" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Criar Instância (com admin inicial)
```bash
curl -X POST http://localhost:3000/api/superadmin/instancias \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_empresa": 1,
    "nome_instancia": "Nova Instância",
    "descricao": "Descrição da instância",
    "limite_usuarios": 25,
    "status": "ativa",
    "admin_inicial": {
      "nome_completo": "Admin Novo",
      "email": "admin.novo@empresa.com",
      "senha": "Admin@123456"
    }
  }'
```

### Atualizar Instância
```bash
curl -X PUT http://localhost:3000/api/superadmin/instancias/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "limite_usuarios": 60,
    "status": "ativa"
  }'
```

### Estatísticas da Instância
```bash
curl -X GET http://localhost:3000/api/superadmin/instancias/1/estatisticas \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## Admin Cliente - Equipes (Implementado ✅)

### Listar Equipes
```bash
curl -X GET http://localhost:3000/api/admin/equipes \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE"
```

### Criar Equipe
```bash
curl -X POST http://localhost:3000/api/admin/equipes \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Marketing",
    "descricao": "Equipe de marketing e vendas"
  }'
```

### Atualizar Equipe
```bash
curl -X PUT http://localhost:3000/api/admin/equipes/1 \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Marketing Digital",
    "descricao": "Equipe atualizada"
  }'
```

### Estatísticas da Equipe
```bash
curl -X GET http://localhost:3000/api/admin/equipes/1/estatisticas \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE"
```

## Admin Cliente - Usuários (Implementado ✅)

### Listar Usuários
```bash
curl -X GET "http://localhost:3000/api/admin/usuarios?status=ativo" \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE"
```

### Criar Usuário
```bash
curl -X POST http://localhost:3000/api/admin/usuarios \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Novo Usuário",
    "email": "novo@empresa.com",
    "senha": "User@123456",
    "nivel_permissao": "equipe",
    "id_equipe": 1,
    "id_supervisor": 3,
    "status": "ativo"
  }'
```

### Atualizar Usuário
```bash
curl -X PUT http://localhost:3000/api/admin/usuarios/4 \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Pedro Oliveira Junior",
    "id_supervisor": 3
  }'
```

### Obter Hierarquia (Organograma)
```bash
curl -X GET http://localhost:3000/api/admin/usuarios/hierarquia \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE"
```

### Estatísticas de Usuários
```bash
curl -X GET http://localhost:3000/api/admin/usuarios/estatisticas \
  -H "Authorization: Bearer TOKEN_ADMIN_CLIENTE"
```

---

## Próximos Endpoints a Implementar

### Chat
- [ ] GET /api/chat/conversas
- [ ] POST /api/chat/conversas
- [ ] GET /api/chat/conversas/:id/mensagens
- [ ] POST /api/chat/conversas/:id/mensagens

---

**Última atualização:** 16/10/2025

