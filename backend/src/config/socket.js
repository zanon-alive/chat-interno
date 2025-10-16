module.exports = {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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

