const empresaService = require('../../services/empresaService');
const logger = require('../../utils/logger');

class EmpresaController {
  /**
   * GET /api/superadmin/empresas
   */
  async listar(req, res, next) {
    try {
      const { nome, status, cnpj } = req.query;

      const empresas = await empresaService.listar({ nome, status, cnpj });

      return res.json({
        success: true,
        data: empresas,
        total: empresas.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/superadmin/empresas/:id
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;

      const empresa = await empresaService.buscarPorId(id);

      return res.json({
        success: true,
        data: empresa
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/superadmin/empresas
   */
  async criar(req, res, next) {
    try {
      const dados = req.body;

      const empresa = await empresaService.criar(dados);

      return res.status(201).json({
        success: true,
        data: empresa,
        mensagem: 'Empresa criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/superadmin/empresas/:id
   */
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const dados = req.body;

      const empresa = await empresaService.atualizar(id, dados);

      return res.json({
        success: true,
        data: empresa,
        mensagem: 'Empresa atualizada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/superadmin/empresas/:id
   */
  async deletar(req, res, next) {
    try {
      const { id } = req.params;

      const resultado = await empresaService.deletar(id);

      return res.json({
        success: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/superadmin/empresas/:id/estatisticas
   */
  async estatisticas(req, res, next) {
    try {
      const { id } = req.params;

      const stats = await empresaService.estatisticas(id);

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmpresaController();

