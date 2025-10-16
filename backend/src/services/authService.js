const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const authConfig = require('../config/auth');
const logger = require('../utils/logger');
const { AppError } = require('../middlewares/errorHandler');

class AuthService {
  /**
   * Realizar login de usuário
   */
  async login(email, senha) {
    // Buscar usuário
    const usuario = await Usuario.findOne({
      where: { email, status: 'ativo' },
      include: ['instancia', 'equipe']
    });

    if (!usuario) {
      logger.warn(`Tentativa de login falhou: ${email}`);
      throw new AppError('Email ou senha inválidos', 401);
    }

    // Verificar senha
    const senhaCorreta = await usuario.comparePassword(senha);
    if (!senhaCorreta) {
      logger.warn(`Senha incorreta para: ${email}`);
      throw new AppError('Email ou senha inválidos', 401);
    }

    // Atualizar último acesso
    await usuario.update({ ultimo_acesso: new Date() });

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nivel_permissao: usuario.nivel_permissao,
        id_instancia_chat: usuario.id_instancia_chat
      },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    logger.info(`Login bem-sucedido: ${email}`);
    logger.audit('LOGIN', {
      userId: usuario.id,
      email: usuario.email,
      nivel: usuario.nivel_permissao
    });

    return {
      token,
      usuario: usuario.toJSON(),
      forcar_troca_senha: usuario.forcar_troca_senha
    };
  }

  /**
   * Obter dados do usuário autenticado
   */
  async me(userId) {
    const usuario = await Usuario.findByPk(userId, {
      include: ['instancia', 'equipe', 'supervisor']
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return usuario.toJSON();
  }

  /**
   * Trocar senha
   */
  async trocarSenha(userId, senhaAtual, novaSenha) {
    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verificar senha atual
    const senhaCorreta = await usuario.comparePassword(senhaAtual);
    if (!senhaCorreta) {
      throw new AppError('Senha atual incorreta', 401);
    }

    // Validar nova senha
    this.validarSenha(novaSenha);

    // Atualizar senha
    await usuario.update({
      hash_senha: novaSenha,
      forcar_troca_senha: false
    });

    logger.info(`Senha trocada: usuário ${userId}`);
    logger.audit('TROCA_SENHA', { userId: usuario.id, email: usuario.email });

    return { mensagem: 'Senha atualizada com sucesso' };
  }

  /**
   * Validar formato de senha
   */
  validarSenha(senha) {
    const { 
      minLength, 
      requireUppercase, 
      requireLowercase, 
      requireNumbers 
    } = authConfig.passwordRequirements;

    if (senha.length < minLength) {
      throw new AppError(`Senha deve ter no mínimo ${minLength} caracteres`, 400);
    }

    if (requireUppercase && !/[A-Z]/.test(senha)) {
      throw new AppError('Senha deve conter pelo menos uma letra maiúscula', 400);
    }

    if (requireLowercase && !/[a-z]/.test(senha)) {
      throw new AppError('Senha deve conter pelo menos uma letra minúscula', 400);
    }

    if (requireNumbers && !/[0-9]/.test(senha)) {
      throw new AppError('Senha deve conter pelo menos um número', 400);
    }

    return true;
  }

  /**
   * Logout (future: blacklist token se necessário)
   */
  async logout(userId) {
    logger.info(`Logout: usuário ${userId}`);
    return { mensagem: 'Logout realizado com sucesso' };
  }
}

module.exports = new AuthService();

