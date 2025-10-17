<template>
  <div class="chat-widget-container">
    <Transition name="fade">
      <WidgetExpanded
        v-if="isExpanded"
        :is-offline="isOffline"
        :offline-message="offlineMessage"
        :is-connecting="isConnecting"
        :conversas="conversas"
        :user-id="userId"
        @minimize="minimize"
        @close="close"
        @conversa-selecionada="handleConversaSelecionada"
        @nova-conversa="handleNovaConversa"
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
import socketService from '../services/socketService';
import apiWidget from '../services/apiWidget';

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

// State (SEM usar stores para evitar conflitos)
const isExpanded = ref(!props.minimized);
const conversas = ref([]);
const userId = ref(null);
const totalNaoLidas = computed(() => {
  return conversas.value.reduce((total, conv) => total + (conv.mensagens_nao_lidas || 0), 0);
});
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
    
    // Decodificar token para obter userId
    try {
      const tokenParts = props.token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        userId.value = payload.userId || payload.id;
        console.log('👤 Widget: User ID:', userId.value);
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível decodificar token:', e);
    }
    
    // Tentar carregar conversas usando API sem redirecionamento
    try {
      const response = await apiWidget.get('/chat/conversas');
      conversas.value = response.data || [];
      isOffline.value = false;
      isConnecting.value = false;
      
      console.log('✅ Chat Widget inicializado com sucesso!');
      emit('ready');
    } catch (apiError) {
      // API não está disponível ou token inválido
      console.warn('⚠️ Widget: Erro ao carregar conversas:', apiError.message);
      
      isOffline.value = true;
      isConnecting.value = false;
      
      // Mensagem específica baseada no erro
      if (apiError.status === 401) {
        offlineMessage.value = 'Token inválido ou expirado. Entre em contato com o administrador.';
      } else if (apiError.status === 0) {
        offlineMessage.value = 'Servidor não disponível. Tente novamente mais tarde.';
      } else {
        offlineMessage.value = apiError.message || 'Chat temporariamente indisponível.';
      }
      
      // Emitir evento de erro mas manter widget visível
      emit('error', {
        type: apiError.status === 401 ? 'authentication' : 'connection',
        message: offlineMessage.value,
        status: apiError.status,
        error: apiError
      });
      
      // Widget ainda está "pronto" (visível) mesmo com erro
      emit('ready');
    }
    
    // Setup listeners Socket.IO (mesmo offline, preparar para quando conectar)
    socketService.on('message:new', (mensagem) => {
      // Adicionar mensagem localmente
      const conversa = conversas.value.find(c => c.id === mensagem.id_conversa);
      if (conversa) {
        conversa.ultima_mensagem = mensagem;
        conversa.mensagens_nao_lidas = (conversa.mensagens_nao_lidas || 0) + 1;
      }
      emit('message', mensagem);
    });
    
    socketService.on('connect', () => {
      console.log('✅ Widget: Reconectado ao servidor!');
      isOffline.value = false;
      offlineMessage.value = '';
      // Tentar recarregar conversas
      retryConnection();
    });
    
    socketService.on('disconnect', () => {
      console.log('⚠️ Widget: Desconectado do servidor');
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
    const response = await apiWidget.get('/chat/conversas');
    conversas.value = response.data || [];
    isOffline.value = false;
    offlineMessage.value = '';
    console.log('✅ Widget: Reconexão bem-sucedida!');
  } catch (error) {
    console.warn('⚠️ Widget: Falha na reconexão:', error.message);
    
    // Atualizar mensagem baseada no erro
    if (error.status === 401) {
      offlineMessage.value = 'Token inválido. Entre em contato com o administrador.';
      // Não tentar novamente se o token está inválido
    } else {
      offlineMessage.value = 'Servidor não disponível. Tentando reconectar...';
      setTimeout(retryConnection, 5000); // Tentar novamente em 5 segundos
    }
  }
}

onMounted(() => {
  init();
});

onUnmounted(() => {
  socketService.disconnect();
});

function handleConversaSelecionada(conversa) {
  console.log('Widget: Conversa selecionada:', conversa);
}

async function handleNovaConversa(conversa) {
  console.log('Widget: Nova conversa criada:', conversa);
  // Recarregar lista de conversas
  await retryConnection();
}

// Expor métodos para API externa
defineExpose({
  expand,
  minimize,
  close,
  isExpanded,
  conversas,
  totalNaoLidas,
  isOffline,
  retryConnection
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

