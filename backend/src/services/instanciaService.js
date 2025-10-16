const { InstanciaChat, Empresa, Usuario } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class InstanciaService {
  /**
   * Listar instâncias
   */
  async listar(filtros = {}) {
    const where = {};

    if (filtros.id_empresa) {
      where.id_empresa = filtros.id_empresa;
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.nome) {
      where.nome_instancia = { [Op.like]: `%${filtros.nome}%` };
    }

    const instancias = await InstanciaChat.findAll({
      where,
      include: [
        {
          model: Empresa,
          as: 'empresa',
          attributes: ['id', 'nome_cliente', 'cnpj']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Adicionar contagem de usuários
    const instanciasComStats = await Promise.all(
      instancias.map(async (instancia) => {
        const usuariosAtivos = await instancia.countUsuariosAtivos();
        const inst = instancia.toJSON();
        inst.usuarios_ativos = usuariosAtivos;
        return inst;
      })
    );

    return instanciasComStats;
  }

  /**
   * Buscar instância por ID
   */
  async buscarPorId(id) {
    const instancia = await InstanciaChat.findByPk(id, {
      include: [
        {
          model: Empresa,
          as: 'empresa'
        }
      ]
    });

    if (!instancia) {
      throw new AppError('Instância não encontrada', 404);
    }

    const usuariosAtivos = await instancia.countUsuariosAtivos();
    const result = instancia.toJSON();
    result.usuarios_ativos = usuariosAtivos;

    return result;
  }

  /**
   * Criar nova instância
   */
  async criar(dados, adminInicial) {
    // Validar se empresa existe
    const empresa = await Empresa.findByPk(dados.id_empresa);
    if (!empresa) {
      throw new AppError('Empresa não encontrada', 404);
    }

    // Criar instância
    const instancia = await InstanciaChat.create(dados);

    // Criar admin inicial se fornecido
    if (adminInicial && adminInicial.email) {
      await this.criarAdminInicial(instancia.id, adminInicial);
    }

    logger.info(`Instância criada: ${instancia.nome_instancia} (ID: ${instancia.id})`);
    logger.audit('CREATE_INSTANCIA', {
      instanciaId: instancia.id,
      empresaId: instancia.id_empresa,
      nome: instancia.nome_instancia,
      limite: instancia.limite_usuarios
    });

    return await this.buscarPorId(instancia.id);
  }

  /**
   * Criar administrador inicial da instância
   */
  async criarAdminInicial(idInstancia, dados) {
    // Validar email único
    const emailExiste = await Usuario.findOne({
      where: { email: dados.email }
    });

    if (emailExiste) {
      throw new AppError('Email já cadastrado', 400);
    }

    // Criar usuário admin
    const admin = await Usuario.create({
      id_instancia_chat: idInstancia,
      nome_completo: dados.nome_completo,
      email: dados.email,
      hash_senha: dados.senha || 'Admin@123456', // Senha padrão ou fornecida
      nivel_permissao: 'admin_cliente',
      status: 'ativo',
      forcar_troca_senha: true
    });

    logger.info(`Admin inicial criado para instância ${idInstancia}: ${admin.email}`);
    logger.audit('CREATE_ADMIN_INICIAL', {
      instanciaId: idInstancia,
      adminId: admin.id,
      email: admin.email
    });

    return admin;
  }

  /**
   * Atualizar instância
   */
  async atualizar(id, dados) {
    const instancia = await InstanciaChat.findByPk(id);

    if (!instancia) {
      throw new AppError('Instância não encontrada', 404);
    }

    // Se reduzindo limite, validar se não é menor que usuários ativos
    if (dados.limite_usuarios && dados.limite_usuarios < instancia.limite_usuarios) {
      const usuariosAtivos = await instancia.countUsuariosAtivos();
      if (dados.limite_usuarios < usuariosAtivos) {
        throw new AppError(
          `Não é possível reduzir limite para ${dados.limite_usuarios}. Existem ${usuariosAtivos} usuários ativos.`,
          400
        );
      }
    }

    await instancia.update(dados);

    logger.info(`Instância atualizada: ${instancia.nome_instancia}`);
    logger.audit('UPDATE_INSTANCIA', {
      instanciaId: instancia.id,
      nome: instancia.nome_instancia
    });

    return await this.buscarPorId(id);
  }

  /**
   * Deletar instância (soft delete)
   */
  async deletar(id) {
    const instancia = await InstanciaChat.findByPk(id);

    if (!instancia) {
      throw new AppError('Instância não encontrada', 404);
    }

    // Verificar se tem usuários ativos
    const usuariosAtivos = await instancia.countUsuariosAtivos();
    if (usuariosAtivos > 0) {
      throw new AppError(
        `Não é possível deletar instância com ${usuariosAtivos} usuários ativos. Desative os usuários primeiro.`,
        400
      );
    }

    await instancia.destroy();

    logger.info(`Instância deletada: ${instancia.nome_instancia}`);
    logger.audit('DELETE_INSTANCIA', {
      instanciaId: instancia.id,
      nome: instancia.nome_instancia
    });

    return { mensagem: 'Instância deletada com sucesso' };
  }

  /**
   * Estatísticas da instância
   */
  async estatisticas(id) {
    const instancia = await this.buscarPorId(id);

    const usuariosAtivos = await Usuario.count({
      where: {
        id_instancia_chat: id,
        status: 'ativo'
      }
    });

    const usuariosPorNivel = await Usuario.findAll({
      where: { id_instancia_chat: id, status: 'ativo' },
      attributes: [
        'nivel_permissao',
        [Usuario.sequelize.fn('COUNT', 'id'), 'total']
      ],
      group: ['nivel_permissao']
    });

    return {
      instancia,
      estatisticas: {
        usuarios_ativos: usuariosAtivos,
        limite_usuarios: instancia.limite_usuarios,
        percentual_uso: ((usuariosAtivos / instancia.limite_usuarios) * 100).toFixed(1),
        usuarios_por_nivel: usuariosPorNivel
      }
    };
  }
}

module.exports = new InstanciaService();

