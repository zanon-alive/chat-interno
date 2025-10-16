const { Empresa, InstanciaChat } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class EmpresaService {
  /**
   * Listar todas as empresas
   */
  async listar(filtros = {}) {
    const where = {};

    if (filtros.nome) {
      where.nome_cliente = { [Op.like]: `%${filtros.nome}%` };
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.cnpj) {
      where.cnpj = filtros.cnpj;
    }

    const empresas = await Empresa.findAll({
      where,
      include: [
        {
          model: InstanciaChat,
          as: 'instancias',
          attributes: ['id', 'nome_instancia', 'status', 'limite_usuarios']
        }
      ],
      order: [['nome_cliente', 'ASC']]
    });

    return empresas;
  }

  /**
   * Buscar empresa por ID
   */
  async buscarPorId(id) {
    const empresa = await Empresa.findByPk(id, {
      include: [
        {
          model: InstanciaChat,
          as: 'instancias'
        }
      ]
    });

    if (!empresa) {
      throw new AppError('Empresa não encontrada', 404);
    }

    return empresa;
  }

  /**
   * Criar nova empresa
   */
  async criar(dados) {
    // Validar CNPJ único
    const cnpjExiste = await Empresa.findOne({
      where: { cnpj: dados.cnpj }
    });

    if (cnpjExiste) {
      throw new AppError('CNPJ já cadastrado', 400);
    }

    const empresa = await Empresa.create(dados);

    logger.info(`Empresa criada: ${empresa.nome_cliente} (${empresa.cnpj})`);
    logger.audit('CREATE_EMPRESA', {
      empresaId: empresa.id,
      nome: empresa.nome_cliente,
      cnpj: empresa.cnpj
    });

    return empresa;
  }

  /**
   * Atualizar empresa
   */
  async atualizar(id, dados) {
    const empresa = await this.buscarPorId(id);

    // Se alterou CNPJ, validar se não existe
    if (dados.cnpj && dados.cnpj !== empresa.cnpj) {
      const cnpjExiste = await Empresa.findOne({
        where: { 
          cnpj: dados.cnpj,
          id: { [Op.ne]: id }
        }
      });

      if (cnpjExiste) {
        throw new AppError('CNPJ já cadastrado em outra empresa', 400);
      }
    }

    await empresa.update(dados);

    logger.info(`Empresa atualizada: ${empresa.nome_cliente}`);
    logger.audit('UPDATE_EMPRESA', {
      empresaId: empresa.id,
      nome: empresa.nome_cliente
    });

    return empresa;
  }

  /**
   * Deletar empresa (soft delete)
   */
  async deletar(id) {
    const empresa = await this.buscarPorId(id);

    // Verificar se tem instâncias ativas
    const instanciasAtivas = await InstanciaChat.count({
      where: {
        id_empresa: id,
        status: 'ativa'
      }
    });

    if (instanciasAtivas > 0) {
      throw new AppError(
        'Não é possível deletar empresa com instâncias ativas. Desative as instâncias primeiro.',
        400
      );
    }

    await empresa.destroy();

    logger.info(`Empresa deletada: ${empresa.nome_cliente}`);
    logger.audit('DELETE_EMPRESA', {
      empresaId: empresa.id,
      nome: empresa.nome_cliente
    });

    return { mensagem: 'Empresa deletada com sucesso' };
  }

  /**
   * Estatísticas da empresa
   */
  async estatisticas(id) {
    const empresa = await this.buscarPorId(id);

    const totalInstancias = await InstanciaChat.count({
      where: { id_empresa: id }
    });

    const instanciasAtivas = await InstanciaChat.count({
      where: { id_empresa: id, status: 'ativa' }
    });

    return {
      empresa: empresa.toJSON(),
      estatisticas: {
        total_instancias: totalInstancias,
        instancias_ativas: instanciasAtivas
      }
    };
  }
}

module.exports = new EmpresaService();

