const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Inicializar Sequelize
const sequelize = new Sequelize(dbConfig);

// Carregar todos os models
const Empresa = require('./Empresa')(sequelize, Sequelize.DataTypes);
const InstanciaChat = require('./InstanciaChat')(sequelize, Sequelize.DataTypes);
const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const Equipe = require('./Equipe')(sequelize, Sequelize.DataTypes);
const Conversa = require('./Conversa')(sequelize, Sequelize.DataTypes);
const ParticipanteConversa = require('./ParticipanteConversa')(sequelize, Sequelize.DataTypes);
const Mensagem = require('./Mensagem')(sequelize, Sequelize.DataTypes);
const PermissaoComunicacao = require('./PermissaoComunicacao')(sequelize, Sequelize.DataTypes);
const TemaInstancia = require('./TemaInstancia')(sequelize, Sequelize.DataTypes);
const TemaLog = require('./TemaLog')(sequelize, Sequelize.DataTypes);

// Objeto com todos os models
const db = {
  Empresa,
  InstanciaChat,
  Usuario,
  Equipe,
  Conversa,
  ParticipanteConversa,
  Mensagem,
  PermissaoComunicacao,
  TemaInstancia,
  TemaLog,
  sequelize,
  Sequelize
};

// Executar associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

