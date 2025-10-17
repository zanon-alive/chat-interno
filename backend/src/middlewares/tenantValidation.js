const { AppError } = require('./errorHandler');

/**
 * Middleware crítico de multi-tenancy
 * Garante que todas as queries sejam filtradas pela instância do usuário
 */
const tenantValidation = (req, res, next) => {
  // Super admin não tem instância (pode acessar tudo)
  if (req.user && req.user.nivel_permissao === 'super_admin') {
    req.instanciaId = null;
    req.userId = req.user.id;
    return next();
  }

  // Usuários normais DEVEM ter instância
  if (!req.user || !req.user.id_instancia_chat) {
    return next(new AppError('Instância não identificada', 403));
  }

  // Anexar instância e userId à requisição
  req.instanciaId = req.user.id_instancia_chat;
  req.userId = req.user.id;

  // Helper para validar se um recurso pertence à instância
  req.validateTenant = (resourceInstanciaId) => {
    if (req.user.nivel_permissao === 'super_admin') {
      return true;
    }
    return resourceInstanciaId === req.instanciaId;
  };

  next();
};

module.exports = tenantValidation;

