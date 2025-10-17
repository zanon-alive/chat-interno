<template>
  <div class="chat-widget-container">
    <Transition name="fade">
      <WidgetExpanded
        v-if="isExpanded"
        :is-offline="isOffline"
        :offline-message="offlineMessage"
        :is-connecting="isConnecting"
        @minimize="minimize"
        @close="close"
      />
    </Transition>
    
    <WidgetMinimized
      v-if="!isExpanded"
      :conversas="conversas"
      :total-nao-lidas="totalNaoLidas"
      :is-offline="isOffline"
      :offline-message="offlineMessage"
      :is-connecting="isConnecting"
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

const emit = defineEmits(['ready', 'open', 'close', 'message', 'error']);

// Pinia store
const pinia = createPinia();
const chatStore = useChatStore(pinia);
const authStore = useAuthStore(pinia);

// State
const isExpanded = ref(!props.minimized);
const conversas = ref([]);
const totalNaoLidas = computed(() => chatStore.totalNaoLidas);
const isOffline = ref(false);
const offlineMessage = ref('');
const isConnecting = ref(true);

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
    isConnecting.value = true;
    isOffline.value = false;
    offlineMessage.value = '';
    
    // Configurar token
    localStorage.setItem('token', props.token);
    
    // Tentar conectar Socket.IO
    try {
      socketService.connect(props.token);
      console.log('🔌 Tentando conectar ao servidor...');
    } catch (socketError) {
      console.warn('⚠️ Erro ao conectar Socket.IO:', socketError);
      // Continuar mesmo sem Socket.IO
    }
    
    // Tentar carregar conversas
    try {
      await chatStore.carregarConversas();
      conversas.value = chatStore.conversas;
      isOffline.value = false;
      isConnecting.value = false;
      
      console.log('✅ Chat Widget inicializado com sucesso!');
      emit('ready');
    } catch (apiError) {
      // API não está disponível
      console.warn('⚠️ API não disponível:', apiError);
      isOffline.value = true;
      isConnecting.value = false;
      offlineMessage.value = 'Chat temporariamente indisponível. Tente novamente mais tarde.';
      
      // Emitir evento de erro mas manter widget visível
      emit('error', {
        type: 'connection',
        message: offlineMessage.value,
        error: apiError
      });
      
      // Widget ainda está "pronto" (visível) mesmo offline
      emit('ready');
    }
    
    // Setup listeners (mesmo offline, preparar para quando conectar)
    socketService.on('message:new', (mensagem) => {
      chatStore.adicionarMensagem(mensagem);
      emit('message', mensagem);
    });
    
    socketService.on('connect', () => {
      console.log('✅ Reconectado ao servidor!');
      isOffline.value = false;
      offlineMessage.value = '';
      // Tentar recarregar conversas
      retryConnection();
    });
    
    socketService.on('disconnect', () => {
      console.log('⚠️ Desconectado do servidor');
      isOffline.value = true;
      offlineMessage.value = 'Conexão perdida. Reconectando...';
    });
    
  } catch (error) {
    console.error('❌ Erro crítico ao inicializar widget:', error);
    isOffline.value = true;
    isConnecting.value = false;
    offlineMessage.value = 'Erro ao carregar o chat. Recarregue a página.';
    
    emit('error', {
      type: 'critical',
      message: offlineMessage.value,
      error
    });
    
    // Mesmo com erro, emitir ready para widget aparecer
    emit('ready');
  }
}

async function retryConnection() {
  try {
    await chatStore.carregarConversas();
    conversas.value = chatStore.conversas;
    isOffline.value = false;
    offlineMessage.value = '';
    console.log('✅ Reconexão bem-sucedida!');
  } catch (error) {
    console.warn('⚠️ Falha na reconexão:', error);
    setTimeout(retryConnection, 5000); // Tentar novamente em 5 segundos
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

