import api from './api';

export default {
  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/superadmin/empresas${params ? '?' + params : ''}`);
  },

  async buscarPorId(id) {
    return api.get(`/superadmin/empresas/${id}`);
  },

  async criar(dados) {
    return api.post('/superadmin/empresas', dados);
  },

  async atualizar(id, dados) {
    return api.put(`/superadmin/empresas/${id}`, dados);
  },

  async deletar(id) {
    return api.delete(`/superadmin/empresas/${id}`);
  },

  async estatisticas(id) {
    return api.get(`/superadmin/empresas/${id}/estatisticas`);
  }
};

