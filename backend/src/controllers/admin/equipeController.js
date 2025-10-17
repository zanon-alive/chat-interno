const equipeService = require('../../services/equipeService');
const logger = require('../../utils/logger');

class EquipeController {
  /**
   * GET /api/admin/equipes
   */
  async listar(req, res, next) {
    try {
      const { instanciaId } = req;
      const { nome } = req.query;

      const equipes = await equipeService.listar(instanciaId, { nome });

      return res.json({
        success: true,
        data: equipes,
        total: equipes.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/equipes/:id
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const { instanciaId } = req;

      const equipe = await equipeService.buscarPorId(id, instanciaId);

      return res.json({
        success: true,
        data: equipe
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/equipes
   */
  async criar(req, res, next) {
    try {
      const { instanciaId } = req;
      const dados = req.body;

      const equipe = await equipeService.criar(dados, instanciaId);

      return res.status(201).json({
        success: true,
        data: equipe,
        mensagem: 'Equipe criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/equipes/:id
   */
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { instanciaId } = req;
      const dados = req.body;

      const equipe = await equipeService.atualizar(id, dados, instanciaId);

      return res.json({
        success: true,
        data: equipe,
        mensagem: 'Equipe atualizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/equipes/:id
   */
  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      const { instanciaId } = req;

      const resultado = await equipeService.deletar(id, instanciaId);

      return res.json({
        success: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/equipes/:id/estatisticas
   */
  async estatisticas(req, res, next) {
    try {
      const { id } = req.params;
      const { instanciaId } = req;

      const stats = await equipeService.estatisticas(id, instanciaId);

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EquipeController();

