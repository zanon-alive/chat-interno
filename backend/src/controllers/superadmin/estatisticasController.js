const estatisticasService = require('../../services/estatisticasService');
const logger = require('../../utils/logger');

class EstatisticasController {
  /**
   * Obter estatísticas gerais
   * GET /api/superadmin/estatisticas/geral
   */
  async obterGeral(req, res) {
    try {
      const estatisticas = await estatisticasService.obterGeraisSuperAdmin();

      res.json({
        success: true,
        data: estatisticas
      });
    } catch (error) {
      logger.error('Erro ao obter estatísticas gerais:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter estatísticas'
      });
    }
  }

  /**
   * Usuários online por hora
   * GET /api/superadmin/estatisticas/usuarios-online?empresa_id=1
   */
  async usuariosOnlinePorHora(req, res) {
    try {
      const empresaId = req.query.empresa_id ? parseInt(req.query.empresa_id) : null;
      
      const dados = await estatisticasService.usuariosOnlinePorHora(null, empresaId);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter usuários online por hora:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }

  /**
   * Conversas por hora
   * GET /api/superadmin/estatisticas/conversas?empresa_id=1
   */
  async conversasPorHora(req, res) {
    try {
      const empresaId = req.query.empresa_id ? parseInt(req.query.empresa_id) : null;
      
      const dados = await estatisticasService.conversasPorHora(null, empresaId);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter conversas por hora:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }

  /**
   * Mensagens por hora
   * GET /api/superadmin/estatisticas/mensagens?empresa_id=1
   */
  async mensagensPorHora(req, res) {
    try {
      const empresaId = req.query.empresa_id ? parseInt(req.query.empresa_id) : null;
      
      const dados = await estatisticasService.mensagensPorHora(null, empresaId);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter mensagens por hora:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }

  /**
   * Detalhamento por empresa
   * GET /api/superadmin/estatisticas/empresas
   */
  async detalheEmpresas(req, res) {
    try {
      const detalhes = await estatisticasService.detalheEmpresas();

      res.json({
        success: true,
        data: detalhes
      });
    } catch (error) {
      logger.error('Erro ao obter detalhes de empresas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }
}

module.exports = new EstatisticasController();

