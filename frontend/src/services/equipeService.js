import api from './api';

export default {
  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/admin/equipes${params ? '?' + params : ''}`);
  },

  async buscarPorId(id) {
    return api.get(`/admin/equipes/${id}`);
  },

  async criar(dados) {
    return api.post('/admin/equipes', dados);
  },

  async atualizar(id, dados) {
    return api.put(`/admin/equipes/${id}`, dados);
  },

  async deletar(id) {
    return api.delete(`/admin/equipes/${id}`);
  },

  async estatisticas(id) {
    return api.get(`/admin/equipes/${id}/estatisticas`);
  }
};

