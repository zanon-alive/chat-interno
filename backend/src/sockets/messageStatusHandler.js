const { Mensagem } = require('../models');
const logger = require('../utils/logger');

/**
 * Handlers de status de mensagens (entregue/lida)
 */
module.exports = (io, socket) => {
  /**
   * Marcar mensagem como entregue
   */
  socket.on('message:delivered', async (data) => {
    try {
      const { mensagemId } = data;
      const { userId, instanciaId } = socket;

      // Atualizar status para entregue
      const [updated] = await Mensagem.update(
        {
          status_entrega: 'entregue',
          entregue_em: new Date()
        },
        {
          where: {
            id: mensagemId,
            id_instancia_chat: instanciaId,
            status_entrega: 'enviada' // Só atualizar se ainda está em 'enviada'
          }
        }
      );

      if (updated) {
        // Buscar mensagem atualizada
        const mensagem = await Mensagem.findByPk(mensagemId);
        
        // Notificar o remetente que a mensagem foi entregue
        const roomName = `instancia-${instanciaId}:conversa-${mensagem.id_conversa}`;
        io.to(roomName).emit('message:status_updated', {
          mensagemId,
          status: 'entregue',
          entregue_em: mensagem.entregue_em
        });

        logger.info(`Mensagem ${mensagemId} marcada como entregue por usuário ${userId}`);
      }

    } catch (error) {
      logger.error('Erro ao marcar mensagem como entregue:', error);
    }
  });

  /**
   * Marcar mensagem como lida
   */
  socket.on('message:read', async (data) => {
    try {
      const { mensagemId } = data;
      const { userId, instanciaId } = socket;

      // Atualizar status para lida
      const [updated] = await Mensagem.update(
        {
          status_entrega: 'lida',
          lida_em: new Date()
        },
        {
          where: {
            id: mensagemId,
            id_instancia_chat: instanciaId,
            id_remetente: { [require('sequelize').Op.ne]: userId } // Não marcar próprias mensagens
          }
        }
      );

      if (updated) {
        // Buscar mensagem atualizada
        const mensagem = await Mensagem.findByPk(mensagemId);
        
        // Notificar o remetente que a mensagem foi lida
        const roomName = `instancia-${instanciaId}:conversa-${mensagem.id_conversa}`;
        io.to(roomName).emit('message:status_updated', {
          mensagemId,
          status: 'lida',
          lida_em: mensagem.lida_em
        });

        logger.info(`Mensagem ${mensagemId} marcada como lida por usuário ${userId}`);
      }

    } catch (error) {
      logger.error('Erro ao marcar mensagem como lida:', error);
    }
  });

  /**
   * Marcar todas mensagens de uma conversa como lidas
   */
  socket.on('conversation:mark_all_read', async (data) => {
    try {
      const { conversaId } = data;
      const { userId, instanciaId } = socket;

      // Atualizar todas mensagens não lidas da conversa
      const [updated] = await Mensagem.update(
        {
          status_entrega: 'lida',
          lida_em: new Date()
        },
        {
          where: {
            id_conversa: conversaId,
            id_instancia_chat: instanciaId,
            id_remetente: { [require('sequelize').Op.ne]: userId },
            status_entrega: { [require('sequelize').Op.ne]: 'lida' }
          }
        }
      );

      if (updated > 0) {
        // Notificar todos na conversa
        const roomName = `instancia-${instanciaId}:conversa-${conversaId}`;
        io.to(roomName).emit('conversation:messages_read', {
          conversaId,
          userId,
          count: updated,
          lida_em: new Date()
        });

        logger.info(`${updated} mensagens da conversa ${conversaId} marcadas como lidas por usuário ${userId}`);
      }

    } catch (error) {
      logger.error('Erro ao marcar mensagens como lidas:', error);
    }
  });
};

