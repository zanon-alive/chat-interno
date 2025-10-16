module.exports = {
  secret: process.env.JWT_SECRET || 'chat_interno_secret_key_change_me',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Configurações de senha
  bcryptRounds: 10,
  
  // Requisitos mínimos de senha
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  }
};

