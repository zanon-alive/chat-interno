const authService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
      }

      const result = await authService.login(email, senha);

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req, res, next) {
    try {
      const usuario = await authService.me(req.user.id);

      return res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/trocar-senha
   */
  async trocarSenha(req, res, next) {
    try {
      const { senha_atual, nova_senha } = req.body;

      if (!senha_atual || !nova_senha) {
        return res.status(400).json({
          success: false,
          error: 'Senha atual e nova senha são obrigatórias'
        });
      }

      const result = await authService.trocarSenha(
        req.user.id,
        senha_atual,
        nova_senha
      );

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user.id);

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

