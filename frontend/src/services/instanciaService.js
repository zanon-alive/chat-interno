import api from './api';

export default {
  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/superadmin/instancias${params ? '?' + params : ''}`);
  },

  async buscarPorId(id) {
    return api.get(`/superadmin/instancias/${id}`);
  },

  async criar(dados) {
    return api.post('/superadmin/instancias', dados);
  },

  async atualizar(id, dados) {
    return api.put(`/superadmin/instancias/${id}`, dados);
  },

  async deletar(id) {
    return api.delete(`/superadmin/instancias/${id}`);
  },

  async estatisticas(id) {
    return api.get(`/superadmin/instancias/${id}/estatisticas`);
  }
};

