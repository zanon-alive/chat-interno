import api from './api';

class TemaService {
  /**
   * Obter tema da instância atual
   */
  async obterTema() {
    const response = await api.get('/admin/tema');
    return response.data;
  }

  /**
   * Atualizar tema
   */
  async atualizarTema(dadosTema) {
    const response = await api.put('/admin/tema', dadosTema);
    return response.data;
  }

  /**
   * Atualizar apenas logo
   */
  async atualizarLogo(logoUrl, logoWidth, logoHeight) {
    const response = await api.put('/admin/tema/logo', {
      logo_url: logoUrl,
      logo_width: logoWidth,
      logo_height: logoHeight
    });
    return response.data;
  }

  /**
   * Resetar tema para padrão
   */
  async resetarTema() {
    const response = await api.post('/admin/tema/resetar');
    return response.data;
  }

  /**
   * Listar logs de alterações
   */
  async listarLogs(page = 1, limit = 50) {
    const response = await api.get('/admin/tema/logs', {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Preview do tema (CSS variables)
   */
  async preview() {
    const response = await api.get('/admin/tema/preview');
    return response.data;
  }

  // ===== SUPER ADMIN =====

  /**
   * Listar todos os temas (SuperAdmin)
   */
  async listarTodos(page = 1, limit = 50) {
    const response = await api.get('/superadmin/temas', {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Obter tema de uma instância específica (SuperAdmin)
   */
  async obterPorInstancia(idInstancia) {
    const response = await api.get(`/superadmin/temas/instancia/${idInstancia}`);
    return response.data;
  }

  /**
   * Atualizar tema de qualquer instância (SuperAdmin)
   */
  async atualizarTemaInstancia(idInstancia, dadosTema) {
    const response = await api.put(`/superadmin/temas/instancia/${idInstancia}`, dadosTema);
    return response.data;
  }

  /**
   * Listar logs de qualquer instância (SuperAdmin)
   */
  async listarLogsPorInstancia(idInstancia, page = 1, limit = 50) {
    const response = await api.get(`/superadmin/temas/logs/${idInstancia}`, {
      params: { page, limit }
    });
    return response.data;
  }
}

export default new TemaService();

