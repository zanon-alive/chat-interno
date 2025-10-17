const { Conversa, Mensagem, ParticipanteConversa, Usuario } = require('../models');
const logger = require('../utils/logger');

/**
 * Handlers de eventos de chat
 */
module.exports = (io, socket) => {
  /**
   * Entrar em uma conversa
   */
  socket.on('chat:join', async (data) => {
    try {
      const { conversaId } = data;
      const { userId, instanciaId } = socket;

      // Verificar se a conversa existe e usuário é participante
      const conversa = await Conversa.findOne({
        where: {
          id: conversaId,
          id_instancia_chat: instanciaId
        }
      });

      if (!conversa) {
        return socket.emit('error', { mensagem: 'Conversa não encontrada' });
      }

      // Verificar se é participante
      const participante = await ParticipanteConversa.findOne({
        where: {
          id_conversa: conversaId,
          id_usuario: userId,
          left_at: null
        }
      });

      if (!participante) {
        return socket.emit('error', { mensagem: 'Você não é participante desta conversa' });
      }

      // Entrar na room da conversa
      const roomName = `instancia-${instanciaId}:conversa-${conversaId}`;
      socket.join(roomName);

      logger.info(`Usuário ${userId} entrou na conversa ${conversaId}`);
      socket.emit('chat:joined', { conversaId, roomName });

    } catch (error) {
      logger.error('Erro ao entrar na conversa:', error);
      socket.emit('error', { mensagem: 'Erro ao entrar na conversa' });
    }
  });

  /**
   * Sair de uma conversa
   */
  socket.on('chat:leave', async (data) => {
    try {
      const { conversaId } = data;
      const { instanciaId } = socket;

      const roomName = `instancia-${instanciaId}:conversa-${conversaId}`;
      socket.leave(roomName);

      logger.info(`Usuário ${socket.userId} saiu da conversa ${conversaId}`);
      socket.emit('chat:left', { conversaId });

    } catch (error) {
      logger.error('Erro ao sair da conversa:', error);
    }
  });

  /**
   * Enviar mensagem
   */
  socket.on('message:send', async (data, callback) => {
    try {
      const { conversaId, conteudo } = data;
      const { userId, instanciaId } = socket;

      // Validar conteúdo
      if (!conteudo || conteudo.trim().length === 0) {
        const erro = { error: 'Mensagem vazia' };
        if (callback) callback(erro);
        return socket.emit('error', { mensagem: 'Mensagem vazia' });
      }

      if (conteudo.length > 5000) {
        const erro = { error: 'Mensagem muito longa (máximo 5000 caracteres)' };
        if (callback) callback(erro);
        return socket.emit('error', { mensagem: 'Mensagem muito longa (máximo 5000 caracteres)' });
      }

      // Verificar se é participante
      const participante = await ParticipanteConversa.findOne({
        where: {
          id_conversa: conversaId,
          id_usuario: userId,
          left_at: null
        }
      });

      if (!participante) {
        const erro = { error: 'Você não é participante desta conversa' };
        if (callback) callback(erro);
        return socket.emit('error', { mensagem: 'Você não é participante desta conversa' });
      }

      // Criar mensagem
      const mensagem = await Mensagem.create({
        id_conversa: conversaId,
        id_remetente: userId,
        id_instancia_chat: instanciaId,
        conteudo_texto: conteudo.trim(),
        tipo_mensagem: 'texto'
      });

      // Buscar dados do remetente
      const remetente = await Usuario.findByPk(userId, {
        attributes: ['id', 'nome_completo', 'email']
      });

      // Preparar mensagem para broadcast
      const mensagemCompleta = {
        id: mensagem.id,
        id_conversa: conversaId,
        id_remetente: userId, // ✅ Incluir id do remetente para alinhamento correto
        conteudo_texto: mensagem.conteudo_texto,
        tipo_mensagem: mensagem.tipo_mensagem,
        created_at: mensagem.created_at,
        remetente: remetente.toJSON()
      };

      // Enviar para todos na conversa
      const roomName = `instancia-${instanciaId}:conversa-${conversaId}`;
      io.to(roomName).emit('message:new', mensagemCompleta);

      // Confirmar sucesso ao remetente (acknowledgment)
      if (callback) {
        callback({ success: true, mensagem: mensagemCompleta });
      }

      logger.info(`Mensagem enviada: usuário ${userId} -> conversa ${conversaId}`);

    } catch (error) {
      logger.error('Erro ao enviar mensagem:', error);
      const erro = { error: 'Erro ao enviar mensagem. Tente novamente.' };
      if (callback) callback(erro);
      socket.emit('error', { mensagem: 'Erro ao enviar mensagem' });
    }
  });

  /**
   * Usuário está digitando
   */
  socket.on('typing:start', async (data) => {
    try {
      const { conversaId } = data;
      const { userId, instanciaId } = socket;

      const roomName = `instancia-${instanciaId}:conversa-${conversaId}`;
      
      // Notificar outros usuários (exceto o próprio)
      socket.to(roomName).emit('typing:user', {
        conversaId,
        userId,
        isTyping: true
      });

    } catch (error) {
      logger.error('Erro no typing:start:', error);
    }
  });

  /**
   * Usuário parou de digitar
   */
  socket.on('typing:stop', async (data) => {
    try {
      const { conversaId } = data;
      const { userId, instanciaId } = socket;

      const roomName = `instancia-${instanciaId}:conversa-${conversaId}`;
      
      socket.to(roomName).emit('typing:user', {
        conversaId,
        userId,
        isTyping: false
      });

    } catch (error) {
      logger.error('Erro no typing:stop:', error);
    }
  });

  /**
   * Marcar mensagens como lidas
   */
  socket.on('messages:read', async (data) => {
    try {
      const { conversaId } = data;
      const { userId, instanciaId } = socket;

      // Atualizar ultima_leitura
      await ParticipanteConversa.update(
        { ultima_leitura: new Date() },
        {
          where: {
            id_conversa: conversaId,
            id_usuario: userId
          }
        }
      );

      // Confirmar para o usuário que marcou
      socket.emit('messages:marked_read', { conversaId });

      // Notificar todos na conversa que as mensagens foram lidas (para atualizar UI)
      const roomName = `instancia-${instanciaId}:conversa-${conversaId}`;
      io.to(roomName).emit('messages:read_by', { 
        conversaId, 
        userId,
        timestamp: new Date()
      });

      logger.info(`Mensagens marcadas como lidas: usuário ${userId} -> conversa ${conversaId}`);

    } catch (error) {
      logger.error('Erro ao marcar mensagens como lidas:', error);
    }
  });
};

