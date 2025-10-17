const logger = require('../utils/logger');

// Map para rastrear usuários online por instância
const onlineUsers = new Map();

/**
 * Handlers de presença (online/offline)
 */
module.exports = (io, socket) => {
  const { userId, instanciaId } = socket;

  /**
   * Usuário ficou online
   */
  const setUserOnline = () => {
    if (!instanciaId) return;

    const key = `instancia-${instanciaId}`;
    
    if (!onlineUsers.has(key)) {
      onlineUsers.set(key, new Set());
    }

    onlineUsers.get(key).add(userId);

    // Notificar outros usuários da instância
    socket.to(`instancia-${instanciaId}`).emit('user:online', {
      userId,
      timestamp: new Date()
    });

    logger.debug(`Usuário ${userId} online na instância ${instanciaId}`);
  };

  /**
   * Usuário ficou offline
   */
  const setUserOffline = () => {
    if (!instanciaId) return;

    const key = `instancia-${instanciaId}`;
    
    if (onlineUsers.has(key)) {
      onlineUsers.get(key).delete(userId);
    }

    // Notificar outros usuários da instância
    socket.to(`instancia-${instanciaId}`).emit('user:offline', {
      userId,
      timestamp: new Date()
    });

    logger.debug(`Usuário ${userId} offline na instância ${instanciaId}`);
  };

  /**
   * Obter usuários online
   */
  socket.on('presence:get_online', () => {
    if (!instanciaId) return;

    const key = `instancia-${instanciaId}`;
    const online = onlineUsers.has(key) 
      ? Array.from(onlineUsers.get(key)) 
      : [];

    socket.emit('presence:online_users', { users: online });
  });

  /**
   * Definir status customizado
   */
  socket.on('presence:set_status', (data) => {
    const { status } = data; // 'disponivel', 'ausente', 'ocupado', 'invisivel'

    // Broadcast para outros usuários da instância
    if (status !== 'invisivel') {
      socket.to(`instancia-${instanciaId}`).emit('user:status_changed', {
        userId,
        status,
        timestamp: new Date()
      });
    }

    logger.debug(`Usuário ${userId} mudou status para: ${status}`);
  });

  // Registrar quando conectar
  setUserOnline();

  // Registrar quando desconectar
  socket.on('disconnect', () => {
    setUserOffline();
  });
};

// Exportar também a função para obter usuários online (para uso em REST API)
module.exports.getOnlineUsers = (instanciaId) => {
  const key = `instancia-${instanciaId}`;
  return onlineUsers.has(key) ? Array.from(onlineUsers.get(key)) : [];
};

