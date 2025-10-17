const conversaService = require('../../services/conversaService');
const logger = require('../../utils/logger');

class ConversaController {
  /**
   * GET /api/chat/conversas
   */
  async listar(req, res, next) {
    try {
      const { userId, instanciaId } = req;

      const conversas = await conversaService.listarMinhasConversas(userId, instanciaId);

      return res.json({
        success: true,
        data: conversas,
        total: conversas.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/chat/conversas/:id
   */
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, instanciaId } = req;

      const conversa = await conversaService.buscarPorId(id, userId, instanciaId);

      return res.json({
        success: true,
        data: conversa
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/chat/conversas/individual
   */
  async criarIndividual(req, res, next) {
    try {
      const { userId, instanciaId } = req;
      const { participante_id } = req.body;

      if (!participante_id) {
        return res.status(400).json({
          success: false,
          error: 'participante_id é obrigatório'
        });
      }

      const conversa = await conversaService.criarIndividual(
        userId,
        participante_id,
        instanciaId
      );

      return res.status(201).json({
        success: true,
        data: conversa,
        mensagem: 'Conversa criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/chat/conversas/grupo
   */
  async criarGrupo(req, res, next) {
    try {
      const { userId, instanciaId } = req;
      const { nome, participantes } = req.body;

      if (!nome || !participantes) {
        return res.status(400).json({
          success: false,
          error: 'nome e participantes são obrigatórios'
        });
      }

      const conversa = await conversaService.criarGrupo(
        userId,
        nome,
        participantes,
        instanciaId
      );

      return res.status(201).json({
        success: true,
        data: conversa,
        mensagem: 'Grupo criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/chat/conversas/:id/participantes
   */
  async adicionarParticipante(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, instanciaId } = req;
      const { usuario_id } = req.body;

      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          error: 'usuario_id é obrigatório'
        });
      }

      const resultado = await conversaService.adicionarParticipante(
        id,
        userId,
        usuario_id,
        instanciaId
      );

      return res.json({
        success: true,
        mensagem: resultado.mensagem
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConversaController();

