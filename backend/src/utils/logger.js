const winston = require('winston');
const path = require('path');

const logLevel = process.env.LOG_LEVEL || 'info';

// Formatos personalizados
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`;
    }
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Console format (colorido)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Criação do logger
const logger = winston.createLogger({
  level: logLevel,
  format: customFormat,
  transports: [
    // Arquivo de erros
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Arquivo combinado
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    }),
    
    // Arquivo de auditoria (ações administrativas)
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/audit.log'),
      level: 'info',
      maxsize: 5242880,
      maxFiles: 10
    })
  ]
});

// Console apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Helper para log de auditoria
logger.audit = (action, details) => {
  logger.info(`[AUDIT] ${action}`, { ...details, timestamp: new Date().toISOString() });
};

module.exports = logger;

