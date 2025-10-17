import { onMounted, onUnmounted } from 'vue';
import socketService from '../services/socketService';

export function useSocket(eventos = {}) {
  onMounted(() => {
    // Registrar listeners
    Object.keys(eventos).forEach(evento => {
      socketService.on(evento, eventos[evento]);
    });
  });

  onUnmounted(() => {
    // Remover listeners
    Object.keys(eventos).forEach(evento => {
      socketService.off(evento, eventos[evento]);
    });
  });

  return {
    socket: socketService.socket,
    emit: (evento, data) => socketService.socket?.emit(evento, data),
    on: (evento, callback) => socketService.on(evento, callback),
    off: (evento, callback) => socketService.off(evento, callback)
  };
}

