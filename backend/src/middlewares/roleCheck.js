const { AppError } = require('./errorHandler');

/**
 * Middleware para verificar se o usuário tem a permissão necessária
 * @param {...string} allowedRoles - Roles permitidas
 */
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Usuário não autenticado', 401));
    }

    if (!allowedRoles.includes(req.user.nivel_permissao)) {
      return next(new AppError('Acesso negado. Permissões insuficientes.', 403));
    }

    next();
  };
};

module.exports = roleCheck;

