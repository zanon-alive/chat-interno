const temaService = require('../../services/temaService');
const logger = require('../../utils/logger');

class SuperAdminTemaController {
  /**
   * Listar todos os temas
   * GET /api/superadmin/temas
   */
  async listarTodos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const resultado = await temaService.listarTodos(limit, offset);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      logger.error('Erro ao listar temas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao listar temas'
      });
    }
  }

  /**
   * Obter tema de uma instância específica
   * GET /api/superadmin/temas/instancia/:id
   */
  async obterPorInstancia(req, res) {
    try {
      const idInstancia = parseInt(req.params.id);

      if (!idInstancia) {
        return res.status(400).json({
          success: false,
          error: 'ID da instância é obrigatório'
        });
      }

      const tema = await temaService.obterTemaPorInstancia(idInstancia);

      res.json({
        success: true,
        data: tema
      });
    } catch (error) {
      logger.error('Erro ao obter tema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter tema'
      });
    }
  }

  /**
   * Atualizar tema de qualquer instância
   * PUT /api/superadmin/temas/instancia/:id
   */
  async atualizarTemaInstancia(req, res) {
    try {
      const idInstancia = parseInt(req.params.id);
      const usuarioId = req.user.id;
      const dadosTema = req.body;

      const tema = await temaService.atualizarTema(
        idInstancia,
        dadosTema,
        usuarioId,
        req
      );

      res.json({
        success: true,
        message: 'Tema atualizado com sucesso',
        data: tema
      });
    } catch (error) {
      logger.error('Erro ao atualizar tema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar tema'
      });
    }
  }

  /**
   * Listar logs de qualquer instância
   * GET /api/superadmin/temas/logs/:idInstancia
   */
  async listarLogsPorInstancia(req, res) {
    try {
      const idInstancia = parseInt(req.params.idInstancia);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const resultado = await temaService.listarLogs(idInstancia, limit, offset);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      logger.error('Erro ao listar logs:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao listar logs'
      });
    }
  }
}

module.exports = new SuperAdminTemaController();

