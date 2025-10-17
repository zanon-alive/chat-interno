const usuarioService = require('../../services/usuarioService');
const logger = require('../../utils/logger');

class UsuarioController {
  /**
   * GET /api/admin/usuarios
   */
  async listar(req, res, next) {
    try {
      const { instanciaId } = req;
      const { nome, email, status, nivel_permissao, id_equipe } = req.query;

      const usuarios = await usuarioService.listar(instanciaId, {
        nome,
        email,
        status,
        nivel_permissao,
        id_equipe
      });

      return res.json({
        success: true,
        data: usuarios,
        total: usuarios.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/usuarios/:id
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const { instanciaId } = req;

      const usuario = await usuarioService.buscarPorId(id, instanciaId);

      return res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/usuarios
   */
  async criar(req, res, next) {
    try {
      const { instanciaId } = req;
      const dados = req.body;

      const usuario = await usuarioService.criar(dados, instanciaId);

      return res.status(201).json({
        success: true,
        data: usuario,
        mensagem: 'Usuário criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/usuarios/:id
   */
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { instanciaId } = req;
      const dados = req.body;

      const usuario = await usuarioService.atualizar(id, dados, instanciaId);

      return res.json({
        success: true,
        data: usuario,
        mensagem: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/usuarios/:id
   */
  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      const { instanciaId } = req;

      const resultado = await usuarioService.deletar(id, instanciaId);

      return res.json({
        success: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/usuarios/hierarquia
   */
  async hierarquia(req, res, next) {
    try {
      const { instanciaId } = req;

      const hierarquia = await usuarioService.obterHierarquia(instanciaId);

      return res.json({
        success: true,
        data: hierarquia
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/usuarios/estatisticas
   */
  async estatisticas(req, res, next) {
    try {
      const { instanciaId } = req;

      const stats = await usuarioService.estatisticas(instanciaId);

      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuarioController();

