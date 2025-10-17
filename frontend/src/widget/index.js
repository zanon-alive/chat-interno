/**
 * Chat Widget - Entry Point
 * Widget embarcável para sistemas legados
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ChatWidget from './ChatWidget.vue';
import '../style.css';

// Variável global para armazenar a instância
let widgetInstance = null;

/**
 * API Pública do Widget
 */
window.ChatWidget = {
  /**
   * Inicializa o widget
   * @param {Object} config - Configurações do widget
   * @param {string} config.token - JWT token para autenticação
   * @param {string} config.apiUrl - URL da API (default: http://localhost:3000)
   * @param {string} config.socketUrl - URL do Socket.IO (default: mesma do apiUrl)
   * @param {string} config.position - Posição do widget: 'bottom-right' ou 'bottom-left'
   * @param {string} config.theme - Tema: 'light' ou 'dark'
   * @param {boolean} config.minimized - Iniciar minimizado (default: true)
   * @param {string} config.primaryColor - Cor primária customizada
   * @param {Function} config.onReady - Callback quando widget está pronto
   * @param {Function} config.onMessage - Callback ao receber mensagem
   * @param {Function} config.onOpen - Callback ao abrir widget
   * @param {Function} config.onClose - Callback ao fechar widget
   */
  init(config = {}) {
    // Validações
    if (!config.token) {
      console.error('❌ ChatWidget: token é obrigatório!');
      return;
    }

    // Configurações padrão
    const defaultConfig = {
      apiUrl: 'http://localhost:3000',
      position: 'bottom-right',
      theme: 'light',
      minimized: true,
      primaryColor: '#667eea'
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Configurar API URL global
    window.__CHAT_API_URL__ = finalConfig.apiUrl;
    window.__CHAT_SOCKET_URL__ = finalConfig.socketUrl || finalConfig.apiUrl;

    // Criar container do widget
    const container = document.createElement('div');
    container.id = 'chat-widget-root';
    document.body.appendChild(container);

    // Criar app Vue
    const app = createApp(ChatWidget, {
      token: finalConfig.token,
      apiUrl: finalConfig.apiUrl,
      position: finalConfig.position,
      theme: finalConfig.theme,
      minimized: finalConfig.minimized
    });

    // Pinia
    const pinia = createPinia();
    app.use(pinia);

    // Listeners customizados
    if (finalConfig.onReady) {
      app.component('ChatWidget').emits.push('ready');
    }

    // Mount
    widgetInstance = app.mount(container);

    // Aplicar cor customizada
    if (finalConfig.primaryColor && finalConfig.primaryColor !== '#667eea') {
      document.documentElement.style.setProperty('--primary-color', finalConfig.primaryColor);
    }

    console.log('✅ ChatWidget inicializado!', finalConfig);

    // Callbacks
    if (finalConfig.onReady) {
      setTimeout(() => finalConfig.onReady(), 100);
    }

    return widgetInstance;
  },

  /**
   * Abre o widget
   */
  open() {
    if (widgetInstance && widgetInstance.expand) {
      widgetInstance.expand();
    }
  },

  /**
   * Fecha/minimiza o widget
   */
  close() {
    if (widgetInstance && widgetInstance.minimize) {
      widgetInstance.minimize();
    }
  },

  /**
   * Destroi o widget
   */
  destroy() {
    if (widgetInstance) {
      const container = document.getElementById('chat-widget-root');
      if (container) {
        document.body.removeChild(container);
      }
      widgetInstance = null;
      console.log('🗑️ ChatWidget destruído');
    }
  },

  /**
   * Retorna a instância atual
   */
  getInstance() {
    return widgetInstance;
  }
};

// Auto-init se houver data-attributes
document.addEventListener('DOMContentLoaded', () => {
  const script = document.currentScript || 
                 document.querySelector('script[data-chat-token]');
  
  if (script) {
    const token = script.getAttribute('data-chat-token');
    const apiUrl = script.getAttribute('data-chat-api-url');
    const position = script.getAttribute('data-chat-position');
    
    if (token) {
      window.ChatWidget.init({
        token,
        apiUrl,
        position
      });
    }
  }
});

console.log('📦 Chat Widget carregado! Use ChatWidget.init({ token: "..." })');

