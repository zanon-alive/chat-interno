# 🐳 Guia de Deploy no Portainer

Este guia explica como fazer deploy do Chat Interno usando Portainer.

---

## 📋 Pré-requisitos

- Docker instalado
- Portainer instalado e rodando
- Acesso ao servidor onde o Portainer está rodando

---

## 🔨 Passo 1: Buildar as Imagens Docker

O Portainer (Docker Swarm) **não suporta build**, então precisamos buildar as imagens primeiro.

### Opção A: Build Local (Recomendado para Desenvolvimento)

```bash
# Dar permissão de execução ao script
chmod +x build-images.sh

# Buildar as imagens
./build-images.sh
```

### Opção B: Build Manual

```bash
# Backend
docker build -t chat-interno-backend:latest -f backend/Dockerfile ./backend

# Frontend (com variáveis de ambiente)
docker build \
  -t chat-interno-frontend:latest \
  --build-arg VITE_API_URL=http://seu-servidor:3000/api \
  --build-arg VITE_SOCKET_URL=http://seu-servidor:3000 \
  -f frontend/Dockerfile \
  ./frontend
```

**⚠️ IMPORTANTE:** Ajuste `VITE_API_URL` e `VITE_SOCKET_URL` para o endereço público do seu servidor!

---

## 📦 Passo 2: (Opcional) Usar Registry

Se o Portainer está em um servidor remoto, você precisa de um registry.

### Opção A: Docker Hub

```bash
# Login
docker login

# Tag
docker tag chat-interno-backend:latest seu-usuario/chat-interno-backend:latest
docker tag chat-interno-frontend:latest seu-usuario/chat-interno-frontend:latest

# Push
docker push seu-usuario/chat-interno-backend:latest
docker push seu-usuario/chat-interno-frontend:latest
```

### Opção B: Registry Local

```bash
# Tag
docker tag chat-interno-backend:latest localhost:5000/chat-interno-backend:latest
docker tag chat-interno-frontend:latest localhost:5000/chat-interno-frontend:latest

# Push
docker push localhost:5000/chat-interno-backend:latest
docker push localhost:5000/chat-interno-frontend:latest
```

---

## 🚀 Passo 3: Deploy no Portainer

### 3.1 Acessar Portainer

1. Abra seu Portainer: `http://seu-servidor:9000`
2. Faça login
3. Selecione o environment (primary, local, etc.)

### 3.2 Criar Stack

1. Vá em **Stacks** (menu lateral)
2. Clique em **+ Add stack**
3. Dê um nome: `chat-interno`

### 3.3 Cole o Web Editor

Cole o conteúdo do arquivo `docker-compose.portainer.yml`:

```yaml
version: '3.9'

services:
  backend:
    image: chat-interno-backend:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: 3000
      DB_DIALECT: sqlite
      DB_STORAGE: /app/data/database.sqlite
      LOG_LEVEL: info
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 24h
      CORS_ORIGIN: ${CORS_ORIGIN}
    volumes:
      - backend_sqlite_data:/app/data
      - backend_logs:/app/logs
    networks:
      - chat-network
    deploy:
      replicas: 1
      restart_policy:
        condition: unless-stopped
        delay: 5s
        max_attempts: 3

  frontend:
    image: chat-interno-frontend:latest
    ports:
      - "8080:80"
    networks:
      - chat-network
    deploy:
      replicas: 1
      restart_policy:
        condition: unless-stopped
        delay: 5s
        max_attempts: 3

volumes:
  backend_sqlite_data:
    driver: local
  backend_logs:
    driver: local

networks:
  chat-network:
    driver: overlay
```

**⚠️ Se usou registry, atualize as imagens:**
```yaml
image: seu-usuario/chat-interno-backend:latest
image: seu-usuario/chat-interno-frontend:latest
```

### 3.4 Configurar Environment Variables

Role para baixo até **Environment variables** e adicione:

```env
JWT_SECRET=seu_secret_super_seguro_aqui_troque_isso
CORS_ORIGIN=http://seu-servidor:8080,http://seu-dominio.com
```

**⚠️ IMPORTANTE:** 
- Troque `JWT_SECRET` por uma string segura e aleatória
- Ajuste `CORS_ORIGIN` com os domínios corretos

### 3.5 Deploy

1. Clique em **Deploy the stack**
2. Aguarde o deploy (pode levar alguns minutos)
3. Verifique os logs de cada container

---

## ✅ Passo 4: Verificar Deploy

### 4.1 No Portainer

1. Vá em **Stacks** > `chat-interno`
2. Verifique se ambos os services estão rodando (ícone verde)
3. Clique em cada service para ver logs

### 4.2 Acessar Aplicação

- **Frontend:** `http://seu-servidor:8080`
- **Backend API:** `http://seu-servidor:3000/api`
- **Backend Health:** `http://seu-servidor:3000/health`

### 4.3 Testar

1. Acesse o frontend
2. Tente fazer login com usuário de teste
3. Verifique se o chat carrega

---

## 🔧 Troubleshooting

### Problema 1: Imagens não encontradas

**Sintoma:** `image not found` ou `pull access denied`

**Solução:**
- Se build local: certifique-se que as imagens foram buildadas no mesmo servidor
- Se usando registry: verifique se fez push e se o nome está correto
- No Portainer, vá em **Images** para verificar se as imagens existem

### Problema 2: Containers reiniciando

**Sintoma:** Services em loop de restart

**Solução:**
1. Veja os logs no Portainer
2. Verifique as variáveis de ambiente
3. Verifique se `JWT_SECRET` foi definido

### Problema 3: CORS Error no Frontend

**Sintoma:** Erro de CORS no console do navegador

**Solução:**
1. Atualize `CORS_ORIGIN` no backend para incluir o domínio do frontend
2. Recrie a stack no Portainer

### Problema 4: Frontend não conecta no Backend

**Sintoma:** Erros 404 ou timeout

**Solução:**
1. Verifique se o frontend foi buildado com as URLs corretas:
   ```bash
   docker build \
     --build-arg VITE_API_URL=http://SEU_SERVIDOR:3000/api \
     --build-arg VITE_SOCKET_URL=http://SEU_SERVIDOR:3000 \
     -f frontend/Dockerfile ./frontend
   ```
2. Rebuilde a imagem do frontend com os valores corretos
3. Recrie a stack

### Problema 5: Database não persiste

**Sintoma:** Dados perdidos após restart

**Solução:**
- Verifique se o volume `backend_sqlite_data` está montado
- No Portainer, vá em **Volumes** para verificar

---

## 🔄 Atualizar Deploy

### Atualizar Backend

```bash
# 1. Rebuildar imagem
docker build -t chat-interno-backend:latest -f backend/Dockerfile ./backend

# 2. Se usando registry, push novamente
docker push seu-usuario/chat-interno-backend:latest

# 3. No Portainer: Stacks > chat-interno > Update the stack > Pull and redeploy
```

### Atualizar Frontend

```bash
# 1. Rebuildar imagem (com URLs corretas)
docker build \
  -t chat-interno-frontend:latest \
  --build-arg VITE_API_URL=http://seu-servidor:3000/api \
  --build-arg VITE_SOCKET_URL=http://seu-servidor:3000 \
  -f frontend/Dockerfile ./frontend

# 2. Se usando registry, push novamente
docker push seu-usuario/chat-interno-frontend:latest

# 3. No Portainer: Stacks > chat-interno > Update the stack > Pull and redeploy
```

---

## 📊 Monitoramento

### Logs

No Portainer:
1. **Stacks** > `chat-interno`
2. Clique no service (backend ou frontend)
3. Vá em **Logs**

### Recursos

No Portainer:
1. **Stacks** > `chat-interno`
2. Clique no service
3. Veja CPU e Memory usage

### Health Check

```bash
# Backend health
curl http://seu-servidor:3000/health

# Frontend
curl http://seu-servidor:8080
```

---

## 🔒 Segurança - IMPORTANTE

### Antes de ir para produção:

1. **Trocar JWT_SECRET:**
   ```bash
   # Gerar secret aleatório
   openssl rand -base64 32
   ```

2. **Configurar HTTPS:**
   - Use Nginx Proxy Manager ou Traefik
   - Obtenha certificados SSL (Let's Encrypt)

3. **Firewall:**
   ```bash
   # Permitir apenas portas necessárias
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

4. **Backup do Database:**
   ```bash
   # Backup do volume
   docker run --rm -v chat-interno_backend_sqlite_data:/data \
     -v $(pwd):/backup alpine tar czf /backup/database-backup.tar.gz /data
   ```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Portainer
2. Consulte `CHANGELOG.md` para breaking changes
3. Veja `.docs/` para documentação adicional

---

## ✅ Checklist de Deploy

- [ ] Imagens buildadas localmente
- [ ] Se necessário, imagens no registry
- [ ] `JWT_SECRET` configurado (NÃO use o padrão!)
- [ ] `CORS_ORIGIN` configurado corretamente
- [ ] Frontend buildado com URLs corretas do backend
- [ ] Stack criada no Portainer
- [ ] Services rodando (ícone verde)
- [ ] Logs sem erros críticos
- [ ] Frontend acessível
- [ ] Backend API respondendo
- [ ] Login funcionando
- [ ] Chat funcionando
- [ ] Backup configurado (produção)
- [ ] HTTPS configurado (produção)

---

**🎉 Deploy completo! Seu Chat Interno está no ar!**

