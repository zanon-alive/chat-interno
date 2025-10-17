import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    this.socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupDefaultListeners();

    return this.socket;
  }

  setupDefaultListeners() {
    this.socket.on('connect', () => {
      console.log('✅ Socket.IO conectado!');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO desconectado:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO erro:', error);
    });
  }

  // Eventos de Chat
  joinConversation(conversaId) {
    this.socket.emit('chat:join', { conversaId });
  }

  leaveConversation(conversaId) {
    this.socket.emit('chat:leave', { conversaId });
  }

  sendMessage(conversaId, conteudo, onSuccess, onError) {
    if (!this.socket || !this.socket.connected) {
      if (onError) {
        onError(new Error('Não conectado ao servidor. Verifique sua conexão.'));
      }
      return;
    }

    // Enviar com confirmação (acknowledgment)
    this.socket.emit('message:send', { conversaId, conteudo }, (response) => {
      if (response && response.error) {
        if (onError) {
          onError(new Error(response.error));
        }
      } else if (onSuccess) {
        onSuccess(response);
      }
    });
  }

  // Indicador de digitação
  startTyping(conversaId) {
    this.socket.emit('typing:start', { conversaId });
  }

  stopTyping(conversaId) {
    this.socket.emit('typing:stop', { conversaId });
  }

  // Marcar como lidas
  markAsRead(conversaId) {
    this.socket.emit('messages:read', { conversaId });
  }

  // Presença
  getOnlineUsers() {
    this.socket.emit('presence:get_online');
  }

  setStatus(status) {
    this.socket.emit('presence:set_status', { status });
  }

  // Listeners
  on(event, callback) {
    this.socket.on(event, callback);
    
    // Armazenar para cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    this.socket.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      // Remover todos os listeners customizados
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(cb => this.socket.off(event, cb));
      });
      this.listeners.clear();

      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();

