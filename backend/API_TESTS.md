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

## Próximos Endpoints a Implementar

### Super Admin
- [ ] GET /api/superadmin/empresas
- [ ] POST /api/superadmin/empresas
- [ ] GET /api/superadmin/empresas/:id
- [ ] PUT /api/superadmin/empresas/:id
- [ ] DELETE /api/superadmin/empresas/:id

- [ ] GET /api/superadmin/instancias
- [ ] POST /api/superadmin/instancias
- [ ] GET /api/superadmin/instancias/:id
- [ ] PUT /api/superadmin/instancias/:id
- [ ] DELETE /api/superadmin/instancias/:id

### Admin Cliente
- [ ] GET /api/admin/equipes
- [ ] POST /api/admin/equipes
- [ ] PUT /api/admin/equipes/:id
- [ ] DELETE /api/admin/equipes/:id

- [ ] GET /api/admin/usuarios
- [ ] POST /api/admin/usuarios
- [ ] PUT /api/admin/usuarios/:id
- [ ] DELETE /api/admin/usuarios/:id

### Chat
- [ ] GET /api/chat/conversas
- [ ] POST /api/chat/conversas
- [ ] GET /api/chat/conversas/:id/mensagens
- [ ] POST /api/chat/conversas/:id/mensagens

---

**Última atualização:** 16/10/2025

