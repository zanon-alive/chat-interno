<template>
  <div class="widget-expanded" :class="positionClass">
    <div class="widget-expanded-header">
      <div class="header-left">
        <span class="widget-icon">💬</span>
        <span class="widget-title">Chat Interno</span>
      </div>
      <div class="header-actions">
        <button @click="minimize" class="btn-action" title="Minimizar">
          <span>−</span>
        </button>
        <button @click="close" class="btn-action" title="Fechar">
          <span>×</span>
        </button>
      </div>
    </div>
    
    <div class="widget-content">
      <!-- Reutilizar componente Chat.vue existente -->
      <div class="chat-embedded">
        <ChatView :embedded="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ChatView from '../views/chat/Chat.vue';

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-right'
  }
});

const emit = defineEmits(['minimize', 'close']);

const positionClass = computed(() => {
  return `position-${props.position}`;
});

function minimize() {
  emit('minimize');
}

function close() {
  emit('close');
}
</script>

<style scoped>
.widget-expanded {
  position: fixed;
  width: 400px;
  height: 600px;
  max-height: calc(100vh - 40px);
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.position-bottom-right {
  bottom: 0;
  right: 20px;
}

.position-bottom-left {
  bottom: 0;
  left: 20px;
}

.widget-expanded-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border-radius: 12px 12px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-icon {
  font-size: 20px;
}

.widget-title {
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.btn-action {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 300;
  transition: background 0.2s;
}

.btn-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

.widget-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-embedded {
  flex: 1;
  overflow: auto;
}

/* Ajustes para o componente Chat dentro do widget */
.chat-embedded :deep(.chat-container) {
  height: 100%;
}

.chat-embedded :deep(.chat-header) {
  display: none; /* Já temos header no widget */
}

.chat-embedded :deep(.sidebar) {
  width: 100%;
  border-right: none;
}

.chat-embedded :deep(.main-chat) {
  display: none; /* Mostrar apenas no click em conversa */
}

/* Responsividade para mobile */
@media (max-width: 768px) {
  .widget-expanded {
    width: calc(100vw - 20px);
    height: calc(100vh - 20px);
    right: 10px !important;
    left: 10px !important;
    max-width: 100%;
  }
}
</style>

