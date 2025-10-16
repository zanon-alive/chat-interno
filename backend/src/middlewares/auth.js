const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const authConfig = require('../config/auth');

const auth = async (req, res, next) => {
  try {
    // Obter token do header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Verificar token
    const decoded = jwt.verify(token, authConfig.secret);

    // Anexar usuário à requisição
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401));
    }
    next(error);
  }
};

module.exports = auth;

