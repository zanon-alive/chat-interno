const { Usuario, Equipe } = require('../../models');
const permissaoService = require('../../services/permissaoService');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

class UsuarioController {
  /**
   * GET /api/chat/usuarios-disponiveis
   * Retorna usuários com os quais o usuário logado pode conversar
   */
  async listarDisponiveis(req, res, next) {
    try {
      const { userId, instanciaId } = req;

      // Buscar todos os usuários ativos da mesma instância (exceto o próprio)
      const usuarios = await Usuario.findAll({
        where: {
          id_instancia_chat: instanciaId,
          id: { [Op.ne]: userId },
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
        attributes: ['id', 'nome_completo', 'email', 'nivel_permissao', 'id_equipe'],
        order: [['nome_completo', 'ASC']]
      });

      // Filtrar apenas usuários com permissão
      const usuariosComPermissao = [];

      for (const usuario of usuarios) {
        const podeComunicar = await permissaoService.podeComunicar(
          userId,
          usuario.id,
          instanciaId
        );

        if (podeComunicar) {
          usuariosComPermissao.push(usuario);
        }
      }

      logger.info(`Usuários disponíveis para ${userId}: ${usuariosComPermissao.length} de ${usuarios.length}`);

      return res.json({
        success: true,
        data: usuariosComPermissao,
        total: usuariosComPermissao.length,
        total_usuarios: usuarios.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuarioController();

