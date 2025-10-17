<template>
  <div class="widget-chat-view">
    <!-- Mensagens -->
    <div class="mensagens-container" ref="mensagensContainer">
      <div v-if="carregando" class="loading">
        Carregando mensagens...
      </div>
      
      <div v-else-if="mensagens.length === 0" class="empty">
        <p>Nenhuma mensagem ainda</p>
        <p class="hint">Envie a primeira mensagem!</p>
      </div>
      
      <div
        v-for="mensagem in mensagens"
        :key="mensagem.id"
        class="mensagem"
        :class="{ 'propria': mensagem.id_remetente === userId }"
      >
        <div class="mensagem-header">
          <strong>{{ mensagem.remetente?.nome_completo }}</strong>
          <span class="timestamp">{{ formatarHora(mensagem.created_at) }}</span>
        </div>
        <div class="mensagem-conteudo">
          <span class="texto">{{ mensagem.conteudo_texto }}</span>
          <MessageStatus 
            v-if="mensagem.id_remetente === userId"
            :status="mensagem.status_entrega || 'enviada'"
            :enviada-em="mensagem.created_at"
            :entregue-em="mensagem.entregue_em"
            :lida-em="mensagem.lida_em"
          />
        </div>
      </div>
    </div>

    <!-- Input de Mensagem -->
    <div class="chat-input">
      <input
        v-model="novaMensagem"
        type="text"
        placeholder="Digite sua mensagem..."
        @keyup.enter="enviarMensagem"
        :disabled="enviando"
      />
      <button 
        @click="enviarMensagem" 
        :disabled="!novaMensagem.trim() || enviando"
        :class="{ 'enviando': enviando }"
      >
        {{ enviando ? '...' : '→' }}
      </button>
    </div>

    <div v-if="erroEnvio" class="erro-envio">
      ⚠️ {{ erroEnvio }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import apiWidget from '../services/apiWidget';
import socketService from '../services/socketService';
import MessageStatus from '../components/chat/MessageStatus.vue';

const props = defineProps({
  conversa: {
    type: Object,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
});

const mensagens = ref([]);
const novaMensagem = ref('');
const carregando = ref(false);
const enviando = ref(false);
const erroEnvio = ref(null);
const mensagensContainer = ref(null);

watch(() => props.conversa.id, () => {
  carregarMensagens();
});

onMounted(async () => {
  await carregarMensagens();
  
  // Entrar na room Socket.IO
  socketService.joinConversation(props.conversa.id);
  
  // Marcar mensagens como entregues
  marcarComoEntregue();
  
  // Marcar como lidas quando abrir
  setTimeout(() => marcarComoLida(), 1000);
  
  // Escutar novas mensagens
  socketService.on('message:new', (msg) => {
    if (msg.id_conversa === props.conversa.id) {
      mensagens.value.push(msg);
      nextTick(() => {
        scrollToBottom();
        // Marcar como entregue e lida automaticamente
        marcarMensagemEntregue(msg.id);
        setTimeout(() => marcarMensagemLida(msg.id), 500);
      });
    }
  });
  
  // Escutar atualizações de status
  socketService.on('message:status_updated', (data) => {
    const msg = mensagens.value.find(m => m.id === data.mensagemId);
    if (msg) {
      msg.status_entrega = data.status;
      if (data.status === 'entregue') msg.entregue_em = data.entregue_em;
      if (data.status === 'lida') msg.lida_em = data.lida_em;
    }
  });
  
  // Escutar quando conversa inteira é marcada como lida
  socketService.on('conversation:messages_read', (data) => {
    if (data.conversaId === props.conversa.id) {
      // Atualizar badge localmente
      props.conversa.mensagens_nao_lidas = 0;
    }
  });
});

onUnmounted(() => {
  socketService.off('message:status_updated');
  socketService.off('conversation:messages_read');
});

function marcarComoEntregue() {
  mensagens.value.forEach(msg => {
    if (msg.id_remetente !== props.userId && msg.status_entrega === 'enviada') {
      marcarMensagemEntregue(msg.id);
    }
  });
}

function marcarComoLida() {
  mensagens.value.forEach(msg => {
    if (msg.id_remetente !== props.userId && msg.status_entrega !== 'lida') {
      marcarMensagemLida(msg.id);
    }
  });
  
  // Marcar conversa inteira como lida (zera badge)
  socketService.socket?.emit('conversation:mark_all_read', {
    conversaId: props.conversa.id
  });
}

function marcarMensagemEntregue(mensagemId) {
  socketService.socket?.emit('message:delivered', { mensagemId });
}

function marcarMensagemLida(mensagemId) {
  socketService.socket?.emit('message:read', { mensagemId });
}

async function carregarMensagens() {
  carregando.value = true;
  try {
    const response = await apiWidget.get(`/chat/conversas/${props.conversa.id}/mensagens`);
    mensagens.value = response.data || [];
    nextTick(() => scrollToBottom());
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error);
  } finally {
    carregando.value = false;
  }
}

async function enviarMensagem() {
  if (!novaMensagem.value.trim() || enviando.value) return;

  const mensagemTexto = novaMensagem.value.trim();
  enviando.value = true;
  erroEnvio.value = null;

  socketService.sendMessage(
    props.conversa.id,
    mensagemTexto,
    // onSuccess
    () => {
      novaMensagem.value = '';
      enviando.value = false;
      nextTick(() => scrollToBottom());
    },
    // onError
    (error) => {
      enviando.value = false;
      erroEnvio.value = error.message || 'Não foi possível enviar a mensagem.';
      alert('❌ Erro ao enviar mensagem\n\n' + erroEnvio.value);
    }
  );
}

function scrollToBottom() {
  if (mensagensContainer.value) {
    mensagensContainer.value.scrollTop = mensagensContainer.value.scrollHeight;
  }
}

function formatarHora(data) {
  const d = new Date(data);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.widget-chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.mensagens-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f8f9fa;
}

.loading,
.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.empty p {
  margin: 0.25rem 0;
}

.hint {
  font-size: 0.85rem;
  font-style: italic;
  opacity: 0.7;
}

.mensagem {
  max-width: 75%;
  padding: 0.625rem 0.875rem;
  border-radius: 12px;
  background: #e9ecef;
  align-self: flex-start;
}

.mensagem.propria {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  align-self: flex-end;
}

.mensagem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
  font-size: 0.8rem;
  gap: 0.5rem;
}

.mensagem.propria .mensagem-header {
  color: rgba(255, 255, 255, 0.9);
}

.mensagem-header strong {
  font-weight: 600;
}

.timestamp {
  color: #6c757d;
  font-size: 0.7rem;
  white-space: nowrap;
}

.mensagem.propria .timestamp {
  color: rgba(255, 255, 255, 0.7);
}

.mensagem-conteudo {
  word-wrap: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.mensagem-conteudo .texto {
  flex: 1;
}

.chat-input {
  display: flex;
  padding: 0.875rem;
  border-top: 1px solid #e9ecef;
  background: #fff;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 0.9rem;
  outline: none;
}

.chat-input input:focus {
  border-color: #667eea;
}

.chat-input input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.chat-input button {
  width: 36px;
  height: 36px;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-input button.enviando {
  opacity: 0.7;
}

.erro-envio {
  padding: 0.5rem 0.875rem;
  background: #fee;
  color: #c33;
  font-size: 0.85rem;
  text-align: center;
  border-top: 1px solid #fcc;
}
</style>

