<template>
  <div class="widget-expanded" :class="positionClass">
    <div class="widget-expanded-header">
      <div class="header-left">
        <button 
          v-if="conversaSelecionada" 
          @click="voltarParaLista" 
          class="btn-back"
          title="Voltar para conversas"
        >
          ←
        </button>
        <span class="widget-icon">💬</span>
        <span class="widget-title">{{ tituloHeader }}</span>
      </div>
      <div class="header-actions">
        <button 
          v-if="!conversaSelecionada && !isOffline && !isConnecting"
          @click="showNovaConversa = true" 
          class="btn-action" 
          title="Nova Conversa"
        >
          <span>+</span>
        </button>
        <button @click="minimize" class="btn-action" title="Minimizar">
          <span>−</span>
        </button>
        <button @click="close" class="btn-action" title="Fechar">
          <span>×</span>
        </button>
      </div>
    </div>
    
    <div class="widget-content">
      <!-- Indicador de Conectando -->
      <div v-if="isConnecting" class="status-message connecting">
        <div class="status-icon">⏳</div>
        <div class="status-text">
          <h3>Conectando ao chat...</h3>
          <p>Aguarde um momento</p>
        </div>
      </div>
      
      <!-- Indicador de Offline -->
      <div v-else-if="isOffline" class="status-message offline">
        <div class="status-icon">⚠️</div>
        <div class="status-text">
          <h3>Chat Temporariamente Indisponível</h3>
          <p>{{ offlineMessage || 'Não foi possível conectar ao servidor. Tente novamente mais tarde.' }}</p>
          <button @click="retry" class="btn-retry">
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
      
      <!-- Chat Normal -->
      <div v-else class="widget-chat">
        <!-- Lista de Conversas -->
        <div v-if="!conversaSelecionada" class="conversas-lista">
          <div 
            v-for="conversa in conversas"
            :key="conversa.id"
            class="conversa-item"
            @click="selecionarConversa(conversa)"
          >
            <div class="conversa-info">
              <strong>{{ getNomeConversa(conversa) }}</strong>
              <p class="ultima-msg">{{ conversa.ultima_mensagem?.conteudo_texto || 'Sem mensagens' }}</p>
            </div>
            <span v-if="conversa.mensagens_nao_lidas" class="badge-conversa">
              {{ conversa.mensagens_nao_lidas }}
            </span>
          </div>
          
          <div v-if="conversas.length === 0" class="empty-conversas">
            <p>Nenhuma conversa ainda</p>
            <button @click="showNovaConversa = true" class="btn-nova">
              + Nova Conversa
            </button>
          </div>
        </div>
        
        <!-- Conversa Aberta -->
        <div v-else class="conversa-aberta">
          <WidgetChat :conversa="conversaSelecionada" :user-id="userId" />
        </div>
      </div>
    </div>
    
    <!-- Modal Nova Conversa -->
    <NovaConversaModal 
      v-if="showNovaConversa"
      :model-value="showNovaConversa"
      @update:model-value="showNovaConversa = $event"
      @criado="handleConversaCriada"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WidgetChat from './WidgetChat.vue';
import NovaConversaModal from '../components/chat/NovaConversaModal.vue';

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-right'
  },
  isOffline: {
    type: Boolean,
    default: false
  },
  offlineMessage: {
    type: String,
    default: ''
  },
  isConnecting: {
    type: Boolean,
    default: false
  },
  conversas: {
    type: Array,
    default: () => []
  },
  userId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['minimize', 'close', 'conversa-selecionada', 'nova-conversa']);

const conversaSelecionada = ref(null);
const showNovaConversa = ref(false);

const positionClass = computed(() => {
  return `position-${props.position}`;
});

const tituloHeader = computed(() => {
  if (conversaSelecionada.value) {
    return getNomeConversa(conversaSelecionada.value);
  }
  return 'Chat Interno';
});

function minimize() {
  emit('minimize');
}

function close() {
  emit('close');
}

function retry() {
  // Recarregar a página ou tentar reconectar
  window.location.reload();
}

function selecionarConversa(conversa) {
  conversaSelecionada.value = conversa;
  emit('conversa-selecionada', conversa);
}

function voltarParaLista() {
  conversaSelecionada.value = null;
}

function getNomeConversa(conversa) {
  if (conversa.nome_conversa) return conversa.nome_conversa;
  
  // Para 1-on-1, pegar nome do OUTRO participante (não o usuário logado)
  const outros = conversa.participantes?.filter(p => p.id !== props.userId);
  return outros?.[0]?.nome_completo || 'Conversa';
}

async function handleConversaCriada(conversa) {
  showNovaConversa.value = false;
  // Emitir para o componente pai atualizar lista
  emit('nova-conversa', conversa);
  // Selecionar a nova conversa
  conversaSelecionada.value = conversa;
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

.widget-chat {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Lista de Conversas */
.conversas-lista {
  flex: 1;
  overflow-y: auto;
}

.conversa-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background 0.2s;
}

.conversa-item:hover {
  background: #f8f9fa;
}

.conversa-info {
  flex: 1;
  min-width: 0;
}

.conversa-info strong {
  display: block;
  color: #2c3e50;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.ultima-msg {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge-conversa {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.empty-conversas {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-conversas p {
  margin-bottom: 1rem;
  font-style: italic;
}

.btn-nova {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-nova:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Conversa Aberta */
.conversa-aberta {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Botão Voltar */
.btn-back {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  transition: background 0.2s;
  margin-right: 8px;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Ajustes para Chat.vue embedded */
.conversa-aberta :deep(.chat-container) {
  height: 100%;
}

.conversa-aberta :deep(.chat-header) {
  display: none;
}

.conversa-aberta :deep(.chat-content) {
  flex: 1;
}

.conversa-aberta :deep(.sidebar) {
  display: none;
}

.conversa-aberta :deep(.main-chat) {
  width: 100%;
}

/* Status Messages */
.status-message {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  gap: 1.5rem;
}

.status-icon {
  font-size: 4rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.status-message.connecting .status-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-text h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.status-text p {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.status-message.offline {
  background: #fff3cd;
}

.status-message.offline .status-text h3 {
  color: #856404;
}

.btn-retry {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

