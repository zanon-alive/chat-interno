const { Usuario, Equipe, InstanciaChat } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class UsuarioService {
  /**
   * Listar usuários da instância
   */
  async listar(idInstancia, filtros = {}) {
    const where = { 
      id_instancia_chat: idInstancia,
      nivel_permissao: { [Op.ne]: 'super_admin' } // Não lista super admins
    };

    if (filtros.nome) {
      where.nome_completo = { [Op.like]: `%${filtros.nome}%` };
    }

    if (filtros.email) {
      where.email = { [Op.like]: `%${filtros.email}%` };
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.nivel_permissao) {
      where.nivel_permissao = filtros.nivel_permissao;
    }

    if (filtros.id_equipe) {
      where.id_equipe = filtros.id_equipe;
    }

    const usuarios = await Usuario.findAll({
      where,
      include: [
        {
          model: Equipe,
          as: 'equipe',
          attributes: ['id', 'nome']
        },
        {
          model: Usuario,
          as: 'supervisor',
          attributes: ['id', 'nome_completo', 'email']
        }
      ],
      order: [['nome_completo', 'ASC']]
    });

    return usuarios;
  }

  /**
   * Buscar usuário por ID
   */
  async buscarPorId(id, idInstancia) {
    const usuario = await Usuario.findOne({
      where: { 
        id, 
        id_instancia_chat: idInstancia 
      },
      include: [
        {
          model: Equipe,
          as: 'equipe'
        },
        {
          model: Usuario,
          as: 'supervisor'
        },
        {
          model: Usuario,
          as: 'subordinados',
          attributes: ['id', 'nome_completo', 'email', 'nivel_permissao']
        }
      ]
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return usuario;
  }

  /**
   * Criar usuário
   */
  async criar(dados, idInstancia) {
    // Verificar limite de usuários
    await this.validarLimiteUsuarios(idInstancia);

    // Verificar email único
    const emailExiste = await Usuario.findOne({
      where: { email: dados.email }
    });

    if (emailExiste) {
      throw new AppError('Email já cadastrado', 400);
    }

    // Validar equipe (se fornecida)
    if (dados.id_equipe) {
      const equipe = await Equipe.findOne({
        where: {
          id: dados.id_equipe,
          id_instancia_chat: idInstancia
        }
      });

      if (!equipe) {
        throw new AppError('Equipe não encontrada ou não pertence a esta instância', 404);
      }
    }

    // Validar supervisor (se fornecido)
    if (dados.id_supervisor) {
      await this.validarSupervisor(dados.id_supervisor, idInstancia, null);
    }

    // Criar usuário
    const usuario = await Usuario.create({
      ...dados,
      id_instancia_chat: idInstancia,
      hash_senha: dados.senha || 'User@123456', // Senha padrão
      forcar_troca_senha: true
    });

    logger.info(`Usuário criado: ${usuario.nome_completo} (${usuario.email})`);
    logger.audit('CREATE_USUARIO', {
      usuarioId: usuario.id,
      nome: usuario.nome_completo,
      email: usuario.email,
      nivel: usuario.nivel_permissao,
      instanciaId: idInstancia
    });

    return await this.buscarPorId(usuario.id, idInstancia);
  }

  /**
   * Atualizar usuário
   */
  async atualizar(id, dados, idInstancia) {
    const usuario = await Usuario.findOne({
      where: { id, id_instancia_chat: idInstancia }
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Se alterou email, verificar se não existe
    if (dados.email && dados.email !== usuario.email) {
      const emailExiste = await Usuario.findOne({
        where: {
          email: dados.email,
          id: { [Op.ne]: id }
        }
      });

      if (emailExiste) {
        throw new AppError('Email já cadastrado', 400);
      }
    }

    // Validar equipe (se fornecida)
    if (dados.id_equipe) {
      const equipe = await Equipe.findOne({
        where: {
          id: dados.id_equipe,
          id_instancia_chat: idInstancia
        }
      });

      if (!equipe) {
        throw new AppError('Equipe não encontrada', 404);
      }
    }

    // Validar supervisor (se fornecido)
    if (dados.id_supervisor) {
      await this.validarSupervisor(dados.id_supervisor, idInstancia, id);
    }

    await usuario.update(dados);

    logger.info(`Usuário atualizado: ${usuario.nome_completo}`);
    logger.audit('UPDATE_USUARIO', {
      usuarioId: usuario.id,
      nome: usuario.nome_completo
    });

    return await this.buscarPorId(id, idInstancia);
  }

  /**
   * Deletar usuário (soft delete)
   */
  async deletar(id, idInstancia) {
    const usuario = await Usuario.findOne({
      where: { id, id_instancia_chat: idInstancia }
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verificar se tem subordinados
    const subordinados = await Usuario.count({
      where: {
        id_supervisor: id,
        status: 'ativo'
      }
    });

    if (subordinados > 0) {
      throw new AppError(
        `Usuário tem ${subordinados} subordinados ativos. Reatribua os subordinados antes de deletar.`,
        400
      );
    }

    await usuario.destroy();

    logger.info(`Usuário deletado: ${usuario.nome_completo}`);
    logger.audit('DELETE_USUARIO', {
      usuarioId: usuario.id,
      nome: usuario.nome_completo,
      email: usuario.email
    });

    return { mensagem: 'Usuário deletado com sucesso' };
  }

  /**
   * Validar limite de usuários da instância
   */
  async validarLimiteUsuarios(idInstancia) {
    const instancia = await InstanciaChat.findByPk(idInstancia);
    
    if (!instancia) {
      throw new AppError('Instância não encontrada', 404);
    }

    const usuariosAtivos = await instancia.countUsuariosAtivos();

    if (usuariosAtivos >= instancia.limite_usuarios) {
      throw new AppError(
        `Limite de ${instancia.limite_usuarios} usuários atingido. Atualmente há ${usuariosAtivos} usuários ativos.`,
        400
      );
    }

    return true;
  }

  /**
   * Validar supervisor (prevenir ciclos)
   */
  async validarSupervisor(idSupervisor, idInstancia, idUsuario) {
    // Verificar se supervisor existe e é da mesma instância
    const supervisor = await Usuario.findOne({
      where: {
        id: idSupervisor,
        id_instancia_chat: idInstancia
      }
    });

    if (!supervisor) {
      throw new AppError('Supervisor não encontrado ou não pertence a esta instância', 404);
    }

    // Prevenir auto-supervisão
    if (idUsuario && idSupervisor === idUsuario) {
      throw new AppError('Um usuário não pode ser supervisor de si mesmo', 400);
    }

    // Prevenir ciclos (verificação recursiva simples - profundidade máxima 10)
    if (idUsuario) {
      let nivelAtual = supervisor;
      let profundidade = 0;
      const maxProfundidade = 10;

      while (nivelAtual && nivelAtual.id_supervisor && profundidade < maxProfundidade) {
        if (nivelAtual.id_supervisor === idUsuario) {
          throw new AppError('Ciclo detectado na hierarquia. Esta configuração criaria um loop.', 400);
        }

        nivelAtual = await Usuario.findByPk(nivelAtual.id_supervisor);
        profundidade++;
      }

      if (profundidade >= maxProfundidade) {
        throw new AppError('Hierarquia muito profunda (máximo 10 níveis)', 400);
      }
    }

    return true;
  }

  /**
   * Obter hierarquia (organograma)
   */
  async obterHierarquia(idInstancia) {
    // Buscar todos os usuários ativos da instância
    const usuarios = await Usuario.findAll({
      where: {
        id_instancia_chat: idInstancia,
        status: 'ativo',
        nivel_permissao: { [Op.ne]: 'super_admin' }
      },
      include: [
        {
          model: Equipe,
          as: 'equipe',
          attributes: ['id', 'nome']
        }
      ],
      attributes: ['id', 'nome_completo', 'email', 'nivel_permissao', 'id_supervisor', 'id_equipe']
    });

    // Organizar em árvore
    const usuariosMap = {};
    usuarios.forEach(u => {
      usuariosMap[u.id] = {
        ...u.toJSON(),
        subordinados: []
      };
    });

    const raizes = [];
    usuarios.forEach(u => {
      if (u.id_supervisor && usuariosMap[u.id_supervisor]) {
        usuariosMap[u.id_supervisor].subordinados.push(usuariosMap[u.id]);
      } else {
        raizes.push(usuariosMap[u.id]);
      }
    });

    return raizes;
  }

  /**
   * Estatísticas de usuários
   */
  async estatisticas(idInstancia) {
    const instancia = await InstanciaChat.findByPk(idInstancia);

    const usuariosAtivos = await Usuario.count({
      where: {
        id_instancia_chat: idInstancia,
        status: 'ativo',
        nivel_permissao: { [Op.in]: ['gestor', 'equipe'] }
      }
    });

    const usuariosPorNivel = await Usuario.findAll({
      where: {
        id_instancia_chat: idInstancia,
        status: 'ativo'
      },
      attributes: [
        'nivel_permissao',
        [Usuario.sequelize.fn('COUNT', 'id'), 'total']
      ],
      group: ['nivel_permissao']
    });

    const usuariosPorEquipe = await Usuario.findAll({
      where: {
        id_instancia_chat: idInstancia,
        status: 'ativo'
      },
      include: [
        {
          model: Equipe,
          as: 'equipe',
          attributes: ['id', 'nome']
        }
      ],
      attributes: [
        'id_equipe',
        [Usuario.sequelize.fn('COUNT', 'id'), 'total']
      ],
      group: ['id_equipe', 'equipe.id', 'equipe.nome']
    });

    return {
      limite_usuarios: instancia.limite_usuarios,
      usuarios_ativos: usuariosAtivos,
      vagas_disponiveis: instancia.limite_usuarios - usuariosAtivos,
      percentual_uso: ((usuariosAtivos / instancia.limite_usuarios) * 100).toFixed(1),
      usuarios_por_nivel: usuariosPorNivel,
      usuarios_por_equipe: usuariosPorEquipe
    };
  }
}

module.exports = new UsuarioService();

