import api from './api';

export default {
  /**
   * Listar usuários disponíveis para conversar (com permissão)
   */
  async listarUsuariosDisponiveis() {
    return api.get('/chat/usuarios-disponiveis');
  }
};

