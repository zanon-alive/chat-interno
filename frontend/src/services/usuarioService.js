import api from './api';

export default {
  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/admin/usuarios${params ? '?' + params : ''}`);
  },

  async buscarPorId(id) {
    return api.get(`/admin/usuarios/${id}`);
  },

  async criar(dados) {
    return api.post('/admin/usuarios', dados);
  },

  async atualizar(id, dados) {
    return api.put(`/admin/usuarios/${id}`, dados);
  },

  async deletar(id) {
    return api.delete(`/admin/usuarios/${id}`);
  },

  async hierarquia() {
    return api.get('/admin/usuarios/hierarquia');
  },

  async estatisticas() {
    return api.get('/admin/usuarios/estatisticas');
  }
};

