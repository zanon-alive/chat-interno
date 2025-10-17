const widgetTokenService = require('../../services/widgetTokenService');
const logger = require('../../utils/logger');

class UsuarioWidgetController {
  /**
   * POST /api/admin/usuarios/:id/gerar-token-widget
   * Gerar token de widget para usuário
   */
  async gerarToken(req, res, next) {
    try {
      const { id } = req.params;
      const { sempre_valido = false, dias_expiracao = 365 } = req.body;

      const resultado = await widgetTokenService.gerarTokenWidget(
        parseInt(id),
        sempre_valido,
        dias_expiracao
      );

      return res.json({
        success: true,
        message: 'Token de widget gerado com sucesso',
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/usuarios/:id/token-widget
   * Obter token de widget do usuário
   */
  async obterToken(req, res, next) {
    try {
      const { id } = req.params;

      const resultado = await widgetTokenService.obterTokenWidget(parseInt(id));

      return res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/usuarios/:id/token-widget
   * Revogar token de widget
   */
  async revogarToken(req, res, next) {
    try {
      const { id } = req.params;

      const resultado = await widgetTokenService.revogarTokenWidget(parseInt(id));

      return res.json({
        success: true,
        message: 'Token de widget revogado com sucesso',
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuarioWidgetController();

