const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const socketConfig = require('../config/socket');
const logger = require('../utils/logger');
const chatHandler = require('./chatHandler');
const presenceHandler = require('./presenceHandler');

/**
 * Inicializar Socket.IO
 */
function initializeSocketIO(httpServer) {
  const io = new Server(httpServer, socketConfig);

  // Middleware de autenticação
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Token não fornecido'));
      }

      // Verificar token
      const decoded = jwt.verify(token, authConfig.secret);
      
      // Anexar dados do usuário ao socket
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      socket.nivelPermissao = decoded.nivel_permissao;
      socket.instanciaId = decoded.id_instancia_chat;

      logger.info(`Socket conectado: usuário ${decoded.id} (${decoded.email})`);
      
      next();
    } catch (error) {
      logger.error('Erro na autenticação do socket:', error);
      next(new Error('Autenticação falhou'));
    }
  });

  // Eventos de conexão
  io.on('connection', (socket) => {
    logger.info(`Usuário conectado: ${socket.userId} (Socket ID: ${socket.id})`);

    // Entrar na room da instância
    if (socket.instanciaId) {
      socket.join(`instancia-${socket.instanciaId}`);
      logger.debug(`Socket ${socket.id} entrou na room: instancia-${socket.instanciaId}`);
    }

    // Registrar handlers
    chatHandler(io, socket);
    presenceHandler(io, socket);

    // Evento de desconexão
    socket.on('disconnect', (reason) => {
      logger.info(`Usuário desconectado: ${socket.userId} (Razão: ${reason})`);
    });

    // Erro no socket
    socket.on('error', (error) => {
      logger.error(`Erro no socket ${socket.id}:`, error);
    });
  });

  logger.info('✅ Socket.IO inicializado com sucesso');

  return io;
}

module.exports = initializeSocketIO;

