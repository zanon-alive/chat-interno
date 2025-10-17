const { Mensagem, Usuario, ParticipanteConversa } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class MensagemService {
  /**
   * Buscar mensagens de uma conversa (paginadas)
   */
  async listarMensagens(conversaId, userId, instanciaId, opcoes = {}) {
    // Verificar se usuário é participante
    const participante = await ParticipanteConversa.findOne({
      where: {
        id_conversa: conversaId,
        id_usuario: userId,
        left_at: null
      }
    });

    if (!participante) {
      throw new AppError('Você não é participante desta conversa', 403);
    }

    const { limit = 50, offset = 0, antes_de } = opcoes;

    const where = {
      id_conversa: conversaId,
      id_instancia_chat: instanciaId
    };

    // Se fornecido antes_de, buscar mensagens anteriores a esse ID
    if (antes_de) {
      const mensagemRef = await Mensagem.findByPk(antes_de);
      if (mensagemRef) {
        where.created_at = { [Op.lt]: mensagemRef.created_at };
      }
    }

    const mensagens = await Mensagem.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'remetente',
          attributes: ['id', 'nome_completo', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Inverter para ordem crescente (mais antiga primeiro)
    return mensagens.reverse();
  }

  /**
   * Buscar mensagem por ID
   */
  async buscarPorId(mensagemId, userId, instanciaId) {
    const mensagem = await Mensagem.findOne({
      where: {
        id: mensagemId,
        id_instancia_chat: instanciaId
      },
      include: [
        {
          model: Usuario,
          as: 'remetente',
          attributes: ['id', 'nome_completo', 'email']
        }
      ]
    });

    if (!mensagem) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    // Verificar se usuário é participante da conversa
    const participante = await ParticipanteConversa.findOne({
      where: {
        id_conversa: mensagem.id_conversa,
        id_usuario: userId,
        left_at: null
      }
    });

    if (!participante) {
      throw new AppError('Você não tem acesso a esta mensagem', 403);
    }

    return mensagem;
  }

  /**
   * Editar mensagem
   */
  async editar(mensagemId, userId, novoConteudo, instanciaId) {
    const mensagem = await Mensagem.findOne({
      where: {
        id: mensagemId,
        id_instancia_chat: instanciaId
      }
    });

    if (!mensagem) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    // Apenas o remetente pode editar
    if (mensagem.id_remetente !== userId) {
      throw new AppError('Você só pode editar suas próprias mensagens', 403);
    }

    // Validar conteúdo
    if (!novoConteudo || novoConteudo.trim().length === 0) {
      throw new AppError('Conteúdo não pode estar vazio', 400);
    }

    if (novoConteudo.length > 5000) {
      throw new AppError('Mensagem muito longa (máximo 5000 caracteres)', 400);
    }

    // Atualizar
    await mensagem.update({
      conteudo_texto: novoConteudo.trim(),
      editada: true
    });

    logger.info(`Mensagem ${mensagemId} editada por usuário ${userId}`);

    return await this.buscarPorId(mensagemId, userId, instanciaId);
  }

  /**
   * Deletar mensagem (soft delete)
   */
  async deletar(mensagemId, userId, instanciaId) {
    const mensagem = await Mensagem.findOne({
      where: {
        id: mensagemId,
        id_instancia_chat: instanciaId
      }
    });

    if (!mensagem) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    // Apenas o remetente pode deletar
    if (mensagem.id_remetente !== userId) {
      throw new AppError('Você só pode deletar suas próprias mensagens', 403);
    }

    await mensagem.destroy();

    logger.info(`Mensagem ${mensagemId} deletada por usuário ${userId}`);

    return { mensagem: 'Mensagem deletada com sucesso' };
  }

  /**
   * Buscar mensagens (busca global na instância)
   */
  async buscar(userId, instanciaId, termo, opcoes = {}) {
    const { limit = 50 } = opcoes;

    // Buscar conversas do usuário
    const participacoes = await ParticipanteConversa.findAll({
      where: {
        id_usuario: userId,
        left_at: null
      },
      attributes: ['id_conversa']
    });

    const conversasIds = participacoes.map(p => p.id_conversa);

    if (conversasIds.length === 0) {
      return [];
    }

    // Buscar mensagens
    const mensagens = await Mensagem.findAll({
      where: {
        id_conversa: { [Op.in]: conversasIds },
        id_instancia_chat: instanciaId,
        conteudo_texto: { [Op.like]: `%${termo}%` }
      },
      include: [
        {
          model: Usuario,
          as: 'remetente',
          attributes: ['id', 'nome_completo']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    return mensagens;
  }
}

module.exports = new MensagemService();

