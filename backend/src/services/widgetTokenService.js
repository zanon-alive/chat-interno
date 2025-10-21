const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const authConfig = require('../config/auth');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

class WidgetTokenService {
  /**
   * Gerar token de widget para usuário
   * @param {number} usuarioId - ID do usuário
   * @param {boolean} sempreValido - Se true, token nunca expira
   * @param {number} diasExpiracao - Dias até expirar (se não for sempre válido)
   */
  async gerarTokenWidget(usuarioId, sempreValido = false, diasExpiracao = 365) {
    const usuario = await Usuario.findByPk(usuarioId);
    
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Preparar payload do token
    const payload = {
      id: usuario.id,
      userId: usuario.id,
      email: usuario.email,
      nivel_permissao: usuario.nivel_permissao,
      id_instancia_chat: usuario.id_instancia_chat,
      tipo: 'widget', // Identificar como token de widget
      sempre_valido: sempreValido
    };

    // Gerar token
    const tokenOptions = sempreValido 
      ? {} // Sem expiração
      : { expiresIn: `${diasExpiracao}d` };
    
    const token = jwt.sign(payload, authConfig.secret, tokenOptions);

    // Calcular data de expiração
    const expiraEm = sempreValido 
      ? null 
      : new Date(Date.now() + diasExpiracao * 24 * 60 * 60 * 1000);

    // Atualizar usuário
    await usuario.update({
      widget_token: token,
      widget_token_expira_em: expiraEm,
      widget_token_sempre_valido: sempreValido,
      widget_token_gerado_em: new Date()
    });

    logger.info(`Token de widget gerado para usuário ${usuario.id} (sempre válido: ${sempreValido})`);

    return {
      token,
      expira_em: expiraEm,
      sempre_valido: sempreValido,
      gerado_em: new Date()
    };
  }

  /**
   * Validar token de widget
   */
  async validarTokenWidget(token) {
    try {
      // Decodificar token
      const decoded = jwt.verify(token, authConfig.secret);
      
      // Buscar usuário
      const usuario = await Usuario.findOne({
        where: {
          id: decoded.userId || decoded.id,
          widget_token: token,
          status: 'ativo'
        }
      });

      if (!usuario) {
        throw new AppError('Token de widget inválido', 401);
      }

      // Verificar se token expirou (se não for sempre válido)
      if (!usuario.widget_token_sempre_valido && usuario.widget_token_expira_em) {
        if (new Date() > new Date(usuario.widget_token_expira_em)) {
          throw new AppError('Token de widget expirado', 401);
        }
      }

      return {
        valido: true,
        usuario: {
          id: usuario.id,
          nome: usuario.nome_completo,
          email: usuario.email,
          nivel_permissao: usuario.nivel_permissao,
          id_instancia_chat: usuario.id_instancia_chat
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Token de widget inválido', 401);
    }
  }

  /**
   * Revogar token de widget
   */
  async revogarTokenWidget(usuarioId) {
    const usuario = await Usuario.findByPk(usuarioId);
    
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    await usuario.update({
      widget_token: null,
      widget_token_expira_em: null,
      widget_token_sempre_valido: false,
      widget_token_gerado_em: null
    });

    logger.info(`Token de widget revogado para usuário ${usuarioId}`);

    return { success: true, message: 'Token revogado com sucesso' };
  }

  /**
   * Obter token de widget do usuário
   */
  async obterTokenWidget(usuarioId) {
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: ['id', 'nome_completo', 'email', 'widget_token', 'widget_token_expira_em', 
                   'widget_token_sempre_valido', 'widget_token_gerado_em']
    });
    
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (!usuario.widget_token) {
      return { tem_token: false };
    }

    return {
      tem_token: true,
      token: usuario.widget_token,
      expira_em: usuario.widget_token_expira_em,
      sempre_valido: usuario.widget_token_sempre_valido,
      gerado_em: usuario.widget_token_gerado_em
    };
  }
}

module.exports = new WidgetTokenService();

