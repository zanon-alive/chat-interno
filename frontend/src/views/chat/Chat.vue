<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>💬 Conversas</h2>
      <div class="header-actions">
        <button @click="showNovaConversa = true" class="btn-nova-conversa">
          + Nova Conversa
        </button>
      </div>
    </div>

    <div class="chat-content">
      <div class="sidebar">
        <h3>Conversas</h3>
        <div class="conversas-list">
          <div
            v-for="conversa in chatStore.conversas"
            :key="conversa.id"
            class="conversa-item"
            :class="{ active: chatStore.conversaAtiva?.id === conversa.id }"
            @click="selecionarConversa(conversa)"
          >
            <div class="conversa-info">
              <strong>{{ getNomeConversa(conversa) }}</strong>
              <p class="ultima-mensagem">
                {{ conversa.ultima_mensagem?.conteudo_texto || 'Sem mensagens' }}
              </p>
            </div>
            <span v-if="conversa.mensagens_nao_lidas" class="badge">
              {{ conversa.mensagens_nao_lidas }}
            </span>
          </div>
        </div>
      </div>

      <div class="main-chat">
        <div v-if="!chatStore.conversaAtiva" class="empty-state">
          <h3>Bem-vindo ao Chat Interno!</h3>
          <p>Selecione uma conversa para começar</p>
        </div>

        <template v-else>
          <div class="chat-messages" ref="mensagensContainer">
            <div
              v-for="mensagem in chatStore.mensagensAtivas"
              :key="mensagem.id"
              class="mensagem"
              :class="{ 'propria': mensagem.id_remetente === authStore.usuario?.id }"
            >
              <div class="mensagem-header">
                <strong>{{ mensagem.remetente?.nome_completo }}</strong>
                <span class="timestamp">{{ formatarData(mensagem.created_at) }}</span>
              </div>
              <div class="mensagem-conteudo">
                {{ mensagem.conteudo_texto }}
                <span v-if="mensagem.editada" class="editada-tag">(editada)</span>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <input
              v-model="novaMensagem"
              type="text"
              placeholder="Digite sua mensagem..."
              @keyup.enter="enviarMensagem"
            />
            <button @click="enviarMensagem" :disabled="!novaMensagem.trim()">
              Enviar
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Nova Conversa -->
    <NovaConversaModal 
      v-model="showNovaConversa" 
      @criado="handleConversaCriada"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useChatStore } from '../../store/chat';
import socketService from '../../services/socketService';
import { useNotification } from '../../composables/useNotification';
import NovaConversaModal from '../../components/chat/NovaConversaModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();
const { requestPermission, showMessageNotification } = useNotification();

const novaMensagem = ref('');
const showNovaConversa = ref(false);
const mensagensContainer = ref(null);

onMounted(async () => {
  // Solicitar permissão para notificações
  await requestPermission();

  // Carregar conversas
  await chatStore.carregarConversas();

  // Setup Socket.IO listeners
  socketService.on('message:new', (mensagem) => {
    chatStore.adicionarMensagem(mensagem);
    
    // Notificação browser (se não está na conversa ativa)
    if (chatStore.conversaAtiva?.id !== mensagem.id_conversa && 
        mensagem.id_remetente !== authStore.usuario?.id) {
      showMessageNotification(
        mensagem.remetente?.nome_completo || 'Novo usuário',
        mensagem.conteudo_texto
      );
    }

    // Auto-scroll para última mensagem
    if (chatStore.conversaAtiva?.id === mensagem.id_conversa) {
      nextTick(() => scrollToBottom());
    }
  });

  socketService.on('user:online', (data) => {
    chatStore.setUsuarioOnline(data.userId);
  });

  socketService.on('user:offline', (data) => {
    chatStore.setUsuarioOffline(data.userId);
  });

  socketService.on('presence:online_users', (data) => {
    chatStore.setUsuariosOnline(data.users);
  });

  // Buscar usuários online
  socketService.getOnlineUsers();
});

onUnmounted(() => {
  // Cleanup
  socketService.off('message:new');
  socketService.off('user:online');
  socketService.off('user:offline');
  socketService.off('presence:online_users');
});

async function selecionarConversa(conversa) {
  await chatStore.selecionarConversa(conversa);
  // Auto-scroll após carregar mensagens
  nextTick(() => scrollToBottom());
}

function enviarMensagem() {
  if (!novaMensagem.value.trim() || !chatStore.conversaAtiva) return;

  chatStore.enviarMensagem(chatStore.conversaAtiva.id, novaMensagem.value.trim());
  novaMensagem.value = '';
  
  // Auto-scroll após enviar
  nextTick(() => scrollToBottom());
}

function scrollToBottom() {
  if (mensagensContainer.value) {
    mensagensContainer.value.scrollTop = mensagensContainer.value.scrollHeight;
  }
}

function getNomeConversa(conversa) {
  if (conversa.nome_conversa) return conversa.nome_conversa;
  
  // Para 1-on-1, mostrar nome do outro participante
  const outros = conversa.participantes?.filter(p => p.id !== authStore.usuario?.id);
  return outros?.[0]?.nome_completo || 'Conversa';
}

function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function handleLogout() {
  await authStore.logout();
  chatStore.limpar();
  router.push('/login');
}

async function handleConversaCriada(conversa) {
  // Atualizar lista e selecionar
  await chatStore.carregarConversas();
  await chatStore.selecionarConversa(conversa);
}
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chat-header h2 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-nova-conversa {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-nova-conversa:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.chat-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  border-right: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.sidebar h3 {
  padding: 1rem;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

.conversas-list {
  padding: 0.5rem 0;
}

.conversa-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.conversa-item:hover {
  background-color: #f0f0f0;
}

.conversa-item.active {
  background-color: #e8eaf6;
  border-left: 3px solid #667eea;
}

.conversa-info {
  flex: 1;
}

.conversa-info strong {
  color: #333;
  font-size: 0.95rem;
}

.ultima-mensagem {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.badge {
  background-color: #667eea;
  color: white;
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mensagem {
  max-width: 60%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background-color: #f0f0f0;
  align-self: flex-start;
}

.mensagem.propria {
  background-color: #667eea;
  color: white;
  align-self: flex-end;
}

.mensagem-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.mensagem.propria .mensagem-header {
  color: rgba(255, 255, 255, 0.9);
}

.timestamp {
  color: #999;
  font-size: 0.75rem;
}

.mensagem.propria .timestamp {
  color: rgba(255, 255, 255, 0.7);
}

.mensagem-conteudo {
  word-wrap: break-word;
}

.editada-tag {
  font-size: 0.7rem;
  font-style: italic;
  opacity: 0.7;
  margin-left: 0.5rem;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 1rem;
  margin-right: 0.5rem;
}

.chat-input input:focus {
  outline: none;
  border-color: #667eea;
}

.chat-input button {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.chat-input button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-users {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #666;
}

.test-users p {
  margin: 0.3rem 0;
}
</style>

