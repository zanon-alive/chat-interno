const mensagemService = require('../../services/mensagemService');
const logger = require('../../utils/logger');

class MensagemController {
  /**
   * GET /api/chat/conversas/:id/mensagens
   */
  async listar(req, res, next) {
    try {
      const { id: conversaId } = req.params;
      const { userId, instanciaId } = req;
      const { limit, offset, antes_de } = req.query;

      const mensagens = await mensagemService.listarMensagens(
        conversaId,
        userId,
        instanciaId,
        { limit, offset, antes_de }
      );

      return res.json({
        success: true,
        data: mensagens,
        total: mensagens.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/chat/mensagens/:id
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, instanciaId } = req;

      const mensagem = await mensagemService.buscarPorId(id, userId, instanciaId);

      return res.json({
        success: true,
        data: mensagem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/chat/mensagens/:id
   */
  async editar(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, instanciaId } = req;
      const { conteudo } = req.body;

      if (!conteudo) {
        return res.status(400).json({
          success: false,
          error: 'conteudo é obrigatório'
        });
      }

      const mensagem = await mensagemService.editar(id, userId, conteudo, instanciaId);

      return res.json({
        success: true,
        data: mensagem,
        mensagem: 'Mensagem editada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/chat/mensagens/:id
   */
  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, instanciaId } = req;

      const resultado = await mensagemService.deletar(id, userId, instanciaId);

      return res.json({
        success: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/chat/mensagens/buscar
   */
  async buscar(req, res, next) {
    try {
      const { userId, instanciaId } = req;
      const { q: termo, limit } = req.query;

      if (!termo) {
        return res.status(400).json({
          success: false,
          error: 'Parâmetro "q" (termo de busca) é obrigatório'
        });
      }

      const mensagens = await mensagemService.buscar(userId, instanciaId, termo, { limit });

      return res.json({
        success: true,
        data: mensagens,
        total: mensagens.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MensagemController();

