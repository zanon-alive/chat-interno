const instanciaService = require('../../services/instanciaService');
const logger = require('../../utils/logger');

class InstanciaController {
  /**
   * GET /api/superadmin/instancias
   */
  async listar(req, res, next) {
    try {
      const { id_empresa, status, nome } = req.query;

      const instancias = await instanciaService.listar({ id_empresa, status, nome });

      return res.json({
        success: true,
        data: instancias,
        total: instancias.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/superadmin/instancias/:id
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;

      const instancia = await instanciaService.buscarPorId(id);

      return res.json({
        success: true,
        data: instancia
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/superadmin/instancias
   */
  async criar(req, res, next) {
    try {
      const {admin_inicial, ...dadosInstancia } = req.body;

      const instancia = await instanciaService.criar(dadosInstancia, admin_inicial);

      return res.status(201).json({
        success: true,
        data: instancia,
        mensagem: 'Instância criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/superadmin/instancias/:id
   */
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const dados = req.body;

      const instancia = await instanciaService.atualizar(id, dados);

      return res.json({
        success: true,
        data: instancia,
        mensagem: 'Instância atualizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/superadmin/instancias/:id
   */
  async deletar(req, res, next) {
    try {
      const { id } = req.params;

      const resultado = await instanciaService.deletar(id);

      return res.json({
        success: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/superadmin/instancias/:id/estatisticas
   */
  async estatisticas(req, res, next) {
    try {
      const { id } = req.params;

      const stats = await instanciaService.estatisticas(id);

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InstanciaController();

