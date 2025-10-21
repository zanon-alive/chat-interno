import api from './api';

class EstatisticasService {
  // ===== ADMIN =====

  /**
   * Obter estatísticas gerais (Admin)
   */
  async obterGeral() {
    const response = await api.get('/admin/estatisticas/geral');
    return response.data;
  }

  /**
   * Usuários online por hora (Admin)
   */
  async usuariosOnlinePorHora() {
    const response = await api.get('/admin/estatisticas/usuarios-online');
    return response.data;
  }

  /**
   * Conversas por hora (Admin)
   */
  async conversasPorHora() {
    const response = await api.get('/admin/estatisticas/conversas');
    return response.data;
  }

  /**
   * Mensagens por hora (Admin)
   */
  async mensagensPorHora() {
    const response = await api.get('/admin/estatisticas/mensagens');
    return response.data;
  }

  /**
   * Atividade por equipe (Admin)
   */
  async equipesAtividade() {
    const response = await api.get('/admin/estatisticas/equipes');
    return response.data;
  }

  /**
   * Relatório de acessos às conversas (Admin)
   */
  async acessosConversas(inicio = null, fim = null) {
    const response = await api.get('/admin/relatorios/acessos-conversas', {
      params: { inicio, fim }
    });
    return response.data;
  }

  /**
   * Horários de pico (Admin)
   */
  async horariosPico(dias = 7) {
    const response = await api.get('/admin/relatorios/horarios-pico', {
      params: { dias }
    });
    return response.data;
  }

  // ===== SUPER ADMIN =====

  /**
   * Obter estatísticas gerais (SuperAdmin)
   */
  async obterGeralSuperAdmin() {
    const response = await api.get('/superadmin/estatisticas/geral');
    return response.data;
  }

  /**
   * Usuários online por hora (SuperAdmin)
   */
  async usuariosOnlinePorHoraSuperAdmin(empresaId = null) {
    const response = await api.get('/superadmin/estatisticas/usuarios-online', {
      params: { empresa_id: empresaId }
    });
    return response.data;
  }

  /**
   * Conversas por hora (SuperAdmin)
   */
  async conversasPorHoraSuperAdmin(empresaId = null) {
    const response = await api.get('/superadmin/estatisticas/conversas', {
      params: { empresa_id: empresaId }
    });
    return response.data;
  }

  /**
   * Mensagens por hora (SuperAdmin)
   */
  async mensagensPorHoraSuperAdmin(empresaId = null) {
    const response = await api.get('/superadmin/estatisticas/mensagens', {
      params: { empresa_id: empresaId }
    });
    return response.data;
  }

  /**
   * Detalhamento por empresa (SuperAdmin)
   */
  async detalheEmpresas() {
    const response = await api.get('/superadmin/estatisticas/empresas');
    return response.data;
  }
}

export default new EstatisticasService();

