# Imagem mínima para backend em ambiente de testes
FROM node:20-alpine

WORKDIR /app

# Copiar apenas manifests primeiro para cache eficiente
COPY package*.json ./

# Instalar dependências (inclui devDeps para sequelize-cli nas migrações)
RUN npm ci

# Copiar código fonte
COPY . .

# Expõe porta do app
EXPOSE 3000

# Variáveis padrão para testes (podem ser sobrescritas no compose)
ENV NODE_ENV=production \\
    HOST=0.0.0.0 \\
    PORT=3000 \\
    DB_DIALECT=sqlite \\
    DB_STORAGE=./database.sqlite \\
    LOG_LEVEL=info

# Rodar migrações e iniciar servidor
CMD sh -c "npx sequelize-cli db:migrate && node src/server.js"


