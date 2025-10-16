const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Criar servidor HTTP
const server = http.createServer(app);

// Socket.IO será configurado aqui posteriormente
// const io = require('./sockets')(server);

// Iniciar servidor
server.listen(PORT, HOST, () => {
  logger.info(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
  logger.info(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🗄️  Database: ${process.env.DB_DIALECT || 'sqlite'}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

module.exports = server;

