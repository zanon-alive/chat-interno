import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import socketService from '../services/socketService';
import api from '../services/api';

export const useChatStore = defineStore('chat', () => {
  // State
  const conversas = ref([]);
  const conversaAtiva = ref(null);
  const mensagens = ref({});  // { conversaId: [mensagens] }
  const usuariosOnline = ref([]);
  const usuariosDigitando = ref({}); // { conversaId: [userIds] }
  const loading = ref(false);

  // Getters
  const mensagensAtivas = computed(() => {
    return conversaAtiva.value ? mensagens.value[conversaAtiva.value.id] || [] : [];
  });

  const totalNaoLidas = computed(() => {
    return conversas.value.reduce((total, conv) => total + (conv.mensagens_nao_lidas || 0), 0);
  });

  // Actions
  async function carregarConversas() {
    loading.value = true;
    try {
      const response = await api.get('/chat/conversas');
      conversas.value = response.data;
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function selecionarConversa(conversa) {
    conversaAtiva.value = conversa;
    
    // Carregar mensagens se ainda não tem
    if (!mensagens.value[conversa.id]) {
      await carregarMensagens(conversa.id);
    }
    
    // Entrar na room do Socket.IO
    socketService.joinConversation(conversa.id);
    
    // Marcar como lida
    socketService.markAsRead(conversa.id);
    
    // Limpar badge localmente (otimista)
    limparBadge(conversa.id);
  }

  async function carregarMensagens(conversaId, opcoes = {}) {
    loading.value = true;
    try {
      const params = new URLSearchParams(opcoes).toString();
      const url = `/chat/conversas/${conversaId}/mensagens${params ? '?' + params : ''}`;
      const response = await api.get(url);
      
      mensagens.value[conversaId] = response.data;
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function criarConversaIndividual(participanteId) {
    loading.value = true;
    try {
      const response = await api.post('/chat/conversas/individual', {
        participante_id: participanteId
      });
      
      const novaConversa = response.data;
      
      // Adicionar à lista se não existe
      const existe = conversas.value.find(c => c.id === novaConversa.id);
      if (!existe) {
        conversas.value.unshift(novaConversa);
      }
      
      // Selecionar a conversa
      await selecionarConversa(novaConversa);
      
      return novaConversa;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function criarGrupo(nome, participantes) {
    loading.value = true;
    try {
      const response = await api.post('/chat/conversas/grupo', {
        nome,
        participantes
      });
      
      const novoGrupo = response.data;
      conversas.value.unshift(novoGrupo);
      
      return novoGrupo;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function enviarMensagem(conversaId, conteudo, onSuccess, onError) {
    // Enviar via Socket.IO com callbacks de sucesso/erro
    socketService.sendMessage(
      conversaId, 
      conteudo,
      (response) => {
        console.log('✅ Mensagem enviada com sucesso');
        
        // Limpar badge ao enviar mensagem de resposta
        limparBadge(conversaId);
        
        if (onSuccess) onSuccess(response);
      },
      (error) => {
        console.error('❌ Erro ao enviar mensagem:', error);
        if (onError) onError(error);
      }
    );
  }

  function adicionarMensagem(mensagem) {
    const conversaId = mensagem.id_conversa;
    
    if (!mensagens.value[conversaId]) {
      mensagens.value[conversaId] = [];
    }
    
    mensagens.value[conversaId].push(mensagem);
    
    // Atualizar conversa na lista
    const conversa = conversas.value.find(c => c.id === conversaId);
    if (conversa) {
      conversa.ultima_mensagem = mensagem;
      conversa.updated_at = mensagem.created_at;
    }
  }

  function setUsuariosOnline(usuarios) {
    usuariosOnline.value = usuarios;
  }

  function setUsuarioOnline(userId) {
    if (!usuariosOnline.value.includes(userId)) {
      usuariosOnline.value.push(userId);
    }
  }

  function setUsuarioOffline(userId) {
    usuariosOnline.value = usuariosOnline.value.filter(id => id !== userId);
  }

  function setUsuarioDigitando(conversaId, userId, isTyping) {
    if (!usuariosDigitando.value[conversaId]) {
      usuariosDigitando.value[conversaId] = [];
    }
    
    if (isTyping) {
      if (!usuariosDigitando.value[conversaId].includes(userId)) {
        usuariosDigitando.value[conversaId].push(userId);
      }
    } else {
      usuariosDigitando.value[conversaId] = usuariosDigitando.value[conversaId].filter(id => id !== userId);
    }
  }

  function limparBadge(conversaId) {
    const conversa = conversas.value.find(c => c.id === conversaId);
    if (conversa) {
      conversa.mensagens_nao_lidas = 0;
      console.log(`🔕 Badge removido da conversa ${conversaId}`);
    }
  }

  function limpar() {
    conversas.value = [];
    conversaAtiva.value = null;
    mensagens.value = {};
    usuariosOnline.value = [];
    usuariosDigitando.value = {};
  }

  return {
    // State
    conversas,
    conversaAtiva,
    mensagens,
    usuariosOnline,
    usuariosDigitando,
    loading,
    
    // Getters
    mensagensAtivas,
    totalNaoLidas,
    
    // Actions
    carregarConversas,
    selecionarConversa,
    carregarMensagens,
    criarConversaIndividual,
    criarGrupo,
    enviarMensagem,
    adicionarMensagem,
    setUsuariosOnline,
    setUsuarioOnline,
    setUsuarioOffline,
    setUsuarioDigitando,
    limparBadge,
    limpar
  };
});

