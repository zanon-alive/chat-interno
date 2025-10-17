const { Equipe, Usuario } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class EquipeService {
  /**
   * Listar equipes da instância
   */
  async listar(idInstancia, filtros = {}) {
    const where = { id_instancia_chat: idInstancia };

    if (filtros.nome) {
      where.nome = { [Op.like]: `%${filtros.nome}%` };
    }

    const equipes = await Equipe.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuarios',
          attributes: ['id', 'nome_completo', 'email', 'status', 'nivel_permissao'],
          where: { status: 'ativo' },
          required: false
        }
      ],
      order: [['nome', 'ASC']]
    });

    // Adicionar contador de membros
    const equipesComStats = equipes.map(equipe => {
      const eq = equipe.toJSON();
      eq.total_membros = equipe.usuarios ? equipe.usuarios.length : 0;
      return eq;
    });

    return equipesComStats;
  }

  /**
   * Buscar equipe por ID
   */
  async buscarPorId(id, idInstancia) {
    const equipe = await Equipe.findOne({
      where: { 
        id, 
        id_instancia_chat: idInstancia 
      },
      include: [
        {
          model: Usuario,
          as: 'usuarios',
          attributes: ['id', 'nome_completo', 'email', 'nivel_permissao', 'status'],
          order: [['nome_completo', 'ASC']]
        }
      ]
    });

    if (!equipe) {
      throw new AppError('Equipe não encontrada', 404);
    }

    return equipe;
  }

  /**
   * Criar equipe
   */
  async criar(dados, idInstancia) {
    // Verificar se nome já existe na instância
    const nomeExiste = await Equipe.findOne({
      where: {
        nome: dados.nome,
        id_instancia_chat: idInstancia
      }
    });

    if (nomeExiste) {
      throw new AppError('Já existe uma equipe com este nome nesta instância', 400);
    }

    const equipe = await Equipe.create({
      ...dados,
      id_instancia_chat: idInstancia
    });

    logger.info(`Equipe criada: ${equipe.nome} (Instância: ${idInstancia})`);
    logger.audit('CREATE_EQUIPE', {
      equipeId: equipe.id,
      nome: equipe.nome,
      instanciaId: idInstancia
    });

    return equipe;
  }

  /**
   * Atualizar equipe
   */
  async atualizar(id, dados, idInstancia) {
    const equipe = await this.buscarPorId(id, idInstancia);

    // Se alterou nome, verificar se não existe
    if (dados.nome && dados.nome !== equipe.nome) {
      const nomeExiste = await Equipe.findOne({
        where: {
          nome: dados.nome,
          id_instancia_chat: idInstancia,
          id: { [Op.ne]: id }
        }
      });

      if (nomeExiste) {
        throw new AppError('Já existe uma equipe com este nome', 400);
      }
    }

    await equipe.update(dados);

    logger.info(`Equipe atualizada: ${equipe.nome}`);
    logger.audit('UPDATE_EQUIPE', {
      equipeId: equipe.id,
      nome: equipe.nome
    });

    return equipe;
  }

  /**
   * Deletar equipe
   */
  async deletar(id, idInstancia) {
    const equipe = await this.buscarPorId(id, idInstancia);

    // Verificar se tem usuários ativos
    const usuariosAtivos = await Usuario.count({
      where: {
        id_equipe: id,
        status: 'ativo'
      }
    });

    if (usuariosAtivos > 0) {
      throw new AppError(
        `Não é possível deletar equipe com ${usuariosAtivos} usuários ativos. Reatribua os usuários primeiro.`,
        400
      );
    }

    await equipe.destroy();

    logger.info(`Equipe deletada: ${equipe.nome}`);
    logger.audit('DELETE_EQUIPE', {
      equipeId: equipe.id,
      nome: equipe.nome
    });

    return { mensagem: 'Equipe deletada com sucesso' };
  }

  /**
   * Estatísticas da equipe
   */
  async estatisticas(id, idInstancia) {
    const equipe = await this.buscarPorId(id, idInstancia);

    const totalMembros = await Usuario.count({
      where: { id_equipe: id }
    });

    const membrosAtivos = await Usuario.count({
      where: { id_equipe: id, status: 'ativo' }
    });

    const membrosPorNivel = await Usuario.findAll({
      where: { id_equipe: id, status: 'ativo' },
      attributes: [
        'nivel_permissao',
        [Usuario.sequelize.fn('COUNT', 'id'), 'total']
      ],
      group: ['nivel_permissao']
    });

    return {
      equipe: equipe.toJSON(),
      estatisticas: {
        total_membros: totalMembros,
        membros_ativos: membrosAtivos,
        membros_inativos: totalMembros - membrosAtivos,
        membros_por_nivel: membrosPorNivel
      }
    };
  }
}

module.exports = new EquipeService();

