const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log do erro
  logger.error(`${err.message}`, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    stack: err.stack
  });

  // Erros do Sequelize
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    error = new AppError(messages.join(', '), 400);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    error = new AppError(`${field} já está em uso`, 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Token inválido', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expirado', 401);
  }

  // Resposta
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = { errorHandler, AppError };

