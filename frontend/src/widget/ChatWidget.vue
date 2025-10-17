<template>
  <div class="chat-widget-container">
    <Transition name="fade">
      <WidgetExpanded
        v-if="isExpanded"
        @minimize="minimize"
        @close="close"
      />
    </Transition>
    
    <WidgetMinimized
      v-if="!isExpanded"
      :conversas="conversas"
      :total-nao-lidas="totalNaoLidas"
      @expand="expand"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { createPinia } from 'pinia';
import WidgetMinimized from './WidgetMinimized.vue';
import WidgetExpanded from './WidgetExpanded.vue';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';
import socketService from '../services/socketService';

const props = defineProps({
  token: {
    type: String,
    required: true
  },
  apiUrl: {
    type: String,
    default: 'http://localhost:3000'
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => ['bottom-right', 'bottom-left'].includes(value)
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value)
  },
  minimized: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['ready', 'open', 'close', 'message']);

// Pinia store
const pinia = createPinia();
const chatStore = useChatStore(pinia);
const authStore = useAuthStore(pinia);

// State
const isExpanded = ref(!props.minimized);
const conversas = ref([]);
const totalNaoLidas = computed(() => chatStore.totalNaoLidas);

// Methods
function expand() {
  isExpanded.value = true;
  emit('open');
}

function minimize() {
  isExpanded.value = false;
  emit('close');
}

function close() {
  isExpanded.value = false;
  emit('close');
}

async function init() {
  try {
    // Configurar token
    localStorage.setItem('token', props.token);
    
    // Conectar Socket.IO
    socketService.connect(props.token);
    
    // Carregar conversas
    await chatStore.carregarConversas();
    conversas.value = chatStore.conversas;
    
    // Setup listeners
    socketService.on('message:new', (mensagem) => {
      chatStore.adicionarMensagem(mensagem);
      emit('message', mensagem);
    });
    
    emit('ready');
    console.log('✅ Chat Widget inicializado!');
  } catch (error) {
    console.error('❌ Erro ao inicializar widget:', error);
  }
}

onMounted(() => {
  init();
});

onUnmounted(() => {
  socketService.disconnect();
});
</script>

<style scoped>
.chat-widget-container {
  position: fixed;
  z-index: 9999;
  font-family: -apple-system, BlinkMacMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

