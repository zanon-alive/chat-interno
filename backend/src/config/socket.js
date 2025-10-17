// Configuração CORS para Socket.IO (mesma lógica do app.js)
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost',
      'http://127.0.0.1',
    ];

module.exports = {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(null, true); // Em produção, configurar whitelist adequada
        }
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  },
  
  // Configurações de conexão
  pingTimeout: 60000,
  pingInterval: 25000,
  
  // Transports
  transports: ['websocket', 'polling'],
  
  // Autenticação
  auth: {
    timeout: 5000 // Tempo máximo para autenticar após conectar
  }
};

