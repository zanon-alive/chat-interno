const { PermissaoComunicacao, Usuario, Equipe } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class PermissaoService {
  /**
   * Verificar se usuário pode comunicar com outro
   */
  async podeComunicar(usuarioOrigemId, usuarioDestinoId, instanciaId) {
    // Mesma instância é obrigatório
    const [origem, destino] = await Promise.all([
      Usuario.findByPk(usuarioOrigemId),
      Usuario.findByPk(usuarioDestinoId)
    ]);

    if (!origem || !destino) {
      return false;
    }

    if (origem.id_instancia_chat !== destino.id_instancia_chat) {
      return false; // Instâncias diferentes
    }

    if (origem.id_instancia_chat !== instanciaId) {
      return false; // Não é da instância correta
    }

    // Buscar permissão do usuário
    const permissao = await PermissaoComunicacao.findOne({
      where: { id_usuario: usuarioOrigemId }
    });

    // Se não tem permissão configurada, usar permissão padrão
    if (!permissao) {
      return await this.validarPermissaoPadrao(origem, destino);
    }

    // Validar baseado no tipo de permissão
    switch (permissao.tipo_permissao) {
      case 'geral':
        return true; // Pode falar com todos

      case 'restrito':
        // Apenas supervisor direto
        return origem.id_supervisor === usuarioDestinoId || 
               destino.id_supervisor === usuarioOrigemId;

      case 'padrao':
        // Supervisor + Admins
        return await this.validarPermissaoPadrao(origem, destino);

      case 'equipe':
        // Mesma equipe + Supervisor + Admins
        return await this.validarPermissaoEquipe(origem, destino);

      case 'customizado':
        // Validar JSON de permissões
        return await this.validarPermissaoCustomizada(origem, destino, permissao.pode_comunicar_com);

      default:
        return false;
    }
  }

  /**
   * Permissão padrão: Supervisor + Admins da instância
   */
  async validarPermissaoPadrao(origem, destino) {
    // Admin pode falar com todos
    if (destino.nivel_permissao === 'admin_cliente') {
      return true;
    }

    // Supervisor direto
    if (origem.id_supervisor === destino.id || destino.id_supervisor === origem.id) {
      return true;
    }

    return false;
  }

  /**
   * Permissão equipe: Mesma equipe + Supervisor + Admins
   */
  async validarPermissaoEquipe(origem, destino) {
    // Admin pode falar com todos
    if (destino.nivel_permissao === 'admin_cliente') {
      return true;
    }

    // Mesma equipe
    if (origem.id_equipe && origem.id_equipe === destino.id_equipe) {
      return true;
    }

    // Supervisor direto
    if (origem.id_supervisor === destino.id || destino.id_supervisor === origem.id) {
      return true;
    }

    return false;
  }

  /**
   * Permissão customizada: Verificar JSON
   */
  async validarPermissaoCustomizada(origem, destino, config) {
    if (!config) return false;

    // Verificar se destino está na lista de usuários permitidos
    if (config.usuarios && Array.isArray(config.usuarios)) {
      if (config.usuarios.includes(destino.id)) {
        return true;
      }
    }

    // Verificar se equipe do destino está permitida
    if (config.equipes && Array.isArray(config.equipes) && destino.id_equipe) {
      if (config.equipes.includes(destino.id_equipe)) {
        return true;
      }
    }

    // Verificar flags
    if (config.admins && destino.nivel_permissao === 'admin_cliente') {
      return true;
    }

    if (config.supervisores && origem.id_supervisor === destino.id) {
      return true;
    }

    if (config.todos) {
      return true;
    }

    return false;
  }

  /**
   * Configurar permissão para usuário
   */
  async configurar(idInstancia, idUsuario, tipoPermissao, configuracao = {}) {
    // Verificar se usuário existe
    const usuario = await Usuario.findOne({
      where: { id: idUsuario, id_instancia_chat: idInstancia }
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Buscar ou criar permissão
    let permissao = await PermissaoComunicacao.findOne({
      where: { id_usuario: idUsuario }
    });

    const dados = {
      id_instancia_chat: idInstancia,
      id_usuario: idUsuario,
      tipo_permissao: tipoPermissao,
      pode_comunicar_com: configuracao
    };

    if (permissao) {
      await permissao.update(dados);
    } else {
      permissao = await PermissaoComunicacao.create(dados);
    }

    logger.info(`Permissão configurada para usuário ${idUsuario}: ${tipoPermissao}`);
    logger.audit('CONFIG_PERMISSAO', {
      usuarioId: idUsuario,
      tipo: tipoPermissao
    });

    return permissao;
  }

  /**
   * Configurar permissão para equipe inteira
   */
  async configurarEquipe(idInstancia, idEquipe, tipoPermissao, configuracao = {}) {
    // Verificar se equipe existe
    const equipe = await Equipe.findOne({
      where: { id: idEquipe, id_instancia_chat: idInstancia }
    });

    if (!equipe) {
      throw new AppError('Equipe não encontrada', 404);
    }

    // Buscar ou criar permissão
    let permissao = await PermissaoComunicacao.findOne({
      where: { id_equipe: idEquipe }
    });

    const dados = {
      id_instancia_chat: idInstancia,
      id_equipe: idEquipe,
      tipo_permissao: tipoPermissao,
      pode_comunicar_com: configuracao
    };

    if (permissao) {
      await permissao.update(dados);
    } else {
      permissao = await PermissaoComunicacao.create(dados);
    }

    logger.info(`Permissão configurada para equipe ${idEquipe}: ${tipoPermissao}`);

    return permissao;
  }

  /**
   * Listar permissões da instância
   */
  async listar(idInstancia) {
    const permissoes = await PermissaoComunicacao.findAll({
      where: { id_instancia_chat: idInstancia },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome_completo', 'email']
        },
        {
          model: Equipe,
          as: 'equipe',
          attributes: ['id', 'nome']
        }
      ]
    });

    return permissoes;
  }
}

module.exports = new PermissaoService();

