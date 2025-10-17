import api from './api';

export default {
  async listar() {
    return api.get('/chat/conversas');
  },

  async buscarPorId(id) {
    return api.get(`/chat/conversas/${id}`);
  },

  async criarIndividual(participanteId) {
    return api.post('/chat/conversas/individual', {
      participante_id: participanteId
    });
  },

  async criarGrupo(nome, participantes) {
    return api.post('/chat/conversas/grupo', {
      nome,
      participantes
    });
  },

  async adicionarParticipante(conversaId, usuarioId) {
    return api.post(`/chat/conversas/${conversaId}/participantes`, {
      usuario_id: usuarioId
    });
  },

  async buscarMensagens(conversaId, opcoes = {}) {
    const params = new URLSearchParams(opcoes).toString();
    return api.get(`/chat/conversas/${conversaId}/mensagens${params ? '?' + params : ''}`);
  },

  async buscarMensagensGlobal(termo, opcoes = {}) {
    const params = new URLSearchParams({ q: termo, ...opcoes }).toString();
    return api.get(`/chat/mensagens/buscar?${params}`);
  },

  async editarMensagem(mensagemId, conteudo) {
    return api.put(`/chat/mensagens/${mensagemId}`, { conteudo });
  },

  async deletarMensagem(mensagemId) {
    return api.delete(`/chat/mensagens/${mensagemId}`);
  }
};

