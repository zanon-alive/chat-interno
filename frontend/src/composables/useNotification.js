import { ref } from 'vue';

const hasPermission = ref(false);

export function useNotification() {
  async function requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      hasPermission.value = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      hasPermission.value = permission === 'granted';
      return hasPermission.value;
    }

    return false;
  }

  function showNotification(title, options = {}) {
    if (!hasPermission.value) {
      console.warn('Sem permissão para notificações');
      return;
    }

    const notification = new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    });

    // Auto-fechar após 5 segundos
    setTimeout(() => notification.close(), 5000);

    return notification;
  }

  function showMessageNotification(remetente, mensagem) {
    if (!hasPermission.value) return;

    return showNotification(`Nova mensagem de ${remetente}`, {
      body: mensagem.substring(0, 100),
      tag: 'chat-message',
      requireInteraction: false
    });
  }

  return {
    hasPermission,
    requestPermission,
    showNotification,
    showMessageNotification
  };
}

