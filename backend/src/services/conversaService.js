const { Conversa, ParticipanteConversa, Usuario, Mensagem } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class ConversaService {
  /**
   * Listar conversas do usuário
   */
  async listarMinhasConversas(userId, instanciaId) {
    // Buscar conversas onde o usuário é participante
    const participacoes = await ParticipanteConversa.findAll({
      where: {
        id_usuario: userId,
        left_at: null
      },
      include: [
        {
          model: Conversa,
          as: 'conversa',
          where: {
            id_instancia_chat: instanciaId
          },
          include: [
            {
              model: Usuario,
              as: 'participantes',
              attributes: ['id', 'nome_completo', 'email'],
              through: {
                attributes: [],
                where: { left_at: null }
              }
            }
          ]
        }
      ],
      order: [[{ model: Conversa, as: 'conversa' }, 'updated_at', 'DESC']]
    });

    // Enriquecer com última mensagem e contador de não lidas
    const conversasEnriquecidas = await Promise.all(
      participacoes.map(async (part) => {
        const conversa = part.conversa;

        // Última mensagem
        const ultimaMensagem = await Mensagem.findOne({
          where: { id_conversa: conversa.id },
          order: [['created_at', 'DESC']],
          include: [
            {
              model: Usuario,
              as: 'remetente',
              attributes: ['id', 'nome_completo']
            }
          ]
        });

        // Mensagens não lidas
        const naoLidas = await Mensagem.count({
          where: {
            id_conversa: conversa.id,
            id_remetente: { [Op.ne]: userId },
            created_at: {
              [Op.gt]: part.ultima_leitura || new Date(0)
            }
          }
        });

        return {
          ...conversa.toJSON(),
          ultima_mensagem: ultimaMensagem ? ultimaMensagem.toJSON() : null,
          mensagens_nao_lidas: naoLidas,
          minha_ultima_leitura: part.ultima_leitura
        };
      })
    );

    return conversasEnriquecidas;
  }

  /**
   * Buscar conversa por ID
   */
  async buscarPorId(conversaId, userId, instanciaId) {
    const conversa = await Conversa.findOne({
      where: {
        id: conversaId,
        id_instancia_chat: instanciaId
      },
      include: [
        {
          model: Usuario,
          as: 'participantes',
          attributes: ['id', 'nome_completo', 'email'],
          through: {
            attributes: ['joined_at', 'ultima_leitura'],
            where: { left_at: null }
          }
        }
      ]
    });

    if (!conversa) {
      throw new AppError('Conversa não encontrada', 404);
    }

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

    return conversa;
  }

  /**
   * Criar conversa 1-on-1
   */
  async criarIndividual(userId, participanteId, instanciaId) {
    // Verificar se já existe conversa entre os dois
    const conversaExistente = await this.buscarConversaEntreDois(userId, participanteId, instanciaId);
    
    if (conversaExistente) {
      return conversaExistente;
    }

    // Verificar se participante existe e é da mesma instância
    const outroUsuario = await Usuario.findOne({
      where: {
        id: participanteId,
        id_instancia_chat: instanciaId,
        status: 'ativo'
      }
    });

    if (!outroUsuario) {
      throw new AppError('Usuário não encontrado ou inativo', 404);
    }

    // TODO: Validar permissão de comunicação aqui (Fase futura)

    // Criar conversa
    const conversa = await Conversa.create({
      id_instancia_chat: instanciaId,
      tipo_conversa: 'individual',
      nome_conversa: null
    });

    // Adicionar participantes
    await ParticipanteConversa.bulkCreate([
      {
        id_conversa: conversa.id,
        id_usuario: userId
      },
      {
        id_conversa: conversa.id,
        id_usuario: participanteId
      }
    ]);

    logger.info(`Conversa individual criada: ${conversa.id} (${userId} <-> ${participanteId})`);
    logger.audit('CREATE_CONVERSA', {
      conversaId: conversa.id,
      tipo: 'individual',
      participantes: [userId, participanteId]
    });

    return await this.buscarPorId(conversa.id, userId, instanciaId);
  }

  /**
   * Criar grupo
   */
  async criarGrupo(userId, nome, participantesIds, instanciaId) {
    // Validar nome
    if (!nome || nome.trim().length < 3) {
      throw new AppError('Nome do grupo deve ter no mínimo 3 caracteres', 400);
    }

    // Validar participantes
    if (!participantesIds || participantesIds.length < 2) {
      throw new AppError('Grupo deve ter no mínimo 2 participantes além de você', 400);
    }

    // Verificar se participantes existem e são da mesma instância
    const participantes = await Usuario.findAll({
      where: {
        id: { [Op.in]: participantesIds },
        id_instancia_chat: instanciaId,
        status: 'ativo'
      }
    });

    if (participantes.length !== participantesIds.length) {
      throw new AppError('Um ou mais participantes não encontrados ou inativos', 400);
    }

    // Criar conversa
    const conversa = await Conversa.create({
      id_instancia_chat: instanciaId,
      tipo_conversa: 'grupo',
      nome_conversa: nome.trim()
    });

    // Adicionar criador e participantes
    const todosParticipantes = [userId, ...participantesIds];
    await ParticipanteConversa.bulkCreate(
      todosParticipantes.map(id => ({
        id_conversa: conversa.id,
        id_usuario: id
      }))
    );

    logger.info(`Grupo criado: ${conversa.id} (${nome}) por usuário ${userId}`);
    logger.audit('CREATE_GRUPO', {
      conversaId: conversa.id,
      nome,
      criador: userId,
      participantes: todosParticipantes
    });

    return await this.buscarPorId(conversa.id, userId, instanciaId);
  }

  /**
   * Buscar conversa individual existente entre dois usuários
   */
  async buscarConversaEntreDois(userId1, userId2, instanciaId) {
    // Buscar conversas individuais onde ambos são participantes
    const conversas = await Conversa.findAll({
      where: {
        id_instancia_chat: instanciaId,
        tipo_conversa: 'individual'
      },
      include: [
        {
          model: Usuario,
          as: 'participantes',
          where: {
            id: { [Op.in]: [userId1, userId2] }
          },
          through: {
            where: { left_at: null }
          },
          required: true
        }
      ]
    });

    // Verificar se alguma tem exatamente os dois participantes
    for (const conversa of conversas) {
      if (conversa.participantes.length === 2) {
        const ids = conversa.participantes.map(p => p.id).sort();
        const buscados = [userId1, userId2].sort();
        
        if (ids[0] === buscados[0] && ids[1] === buscados[1]) {
          return conversa;
        }
      }
    }

    return null;
  }

  /**
   * Adicionar participante ao grupo
   */
  async adicionarParticipante(conversaId, userId, novoParticipanteId, instanciaId) {
    const conversa = await this.buscarPorId(conversaId, userId, instanciaId);

    if (conversa.tipo_conversa !== 'grupo') {
      throw new AppError('Apenas grupos podem adicionar participantes', 400);
    }

    // Verificar se novo participante existe
    const novoUsuario = await Usuario.findOne({
      where: {
        id: novoParticipanteId,
        id_instancia_chat: instanciaId,
        status: 'ativo'
      }
    });

    if (!novoUsuario) {
      throw new AppError('Usuário não encontrado ou inativo', 404);
    }

    // Verificar se já é participante
    const jaParticipante = await ParticipanteConversa.findOne({
      where: {
        id_conversa: conversaId,
        id_usuario: novoParticipanteId,
        left_at: null
      }
    });

    if (jaParticipante) {
      throw new AppError('Usuário já é participante deste grupo', 400);
    }

    // Adicionar
    await ParticipanteConversa.create({
      id_conversa: conversaId,
      id_usuario: novoParticipanteId
    });

    logger.info(`Participante ${novoParticipanteId} adicionado ao grupo ${conversaId}`);

    return { mensagem: 'Participante adicionado com sucesso' };
  }
}

module.exports = new ConversaService();

