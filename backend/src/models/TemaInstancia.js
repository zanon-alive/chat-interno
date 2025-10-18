const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TemaInstancia extends Model {
    static associate(models) {
      TemaInstancia.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia',
        as: 'instancia'
      });

      TemaInstancia.belongsTo(models.Usuario, {
        foreignKey: 'criado_por',
        as: 'criador'
      });

      TemaInstancia.belongsTo(models.Usuario, {
        foreignKey: 'atualizado_por',
        as: 'atualizador'
      });

      TemaInstancia.hasMany(models.TemaLog, {
        foreignKey: 'id_tema',
        as: 'logs'
      });
    }
  }

  TemaInstancia.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_instancia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: 'Instância que possui este tema (relação 1:1)'
    },
    
    // Logo
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL ou caminho do logo da empresa'
    },
    logo_width: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 150
    },
    logo_height: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 50
    },
    
    // Cores Primárias
    cor_primaria: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#667eea'
    },
    cor_primaria_hover: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#5568d3'
    },
    cor_secundaria: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#764ba2'
    },
    
    // Cores de Fundo
    cor_fundo: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#f7fafc'
    },
    cor_fundo_secundario: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#ffffff'
    },
    
    // Cores de Texto
    cor_texto_primaria: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#2d3748'
    },
    cor_texto_secundaria: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#718096'
    },
    
    // Cores do Chat
    cor_mensagem_enviada: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#667eea'
    },
    cor_mensagem_recebida: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#e2e8f0'
    },
    
    // Cores de Estado
    cor_sucesso: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#48bb78'
    },
    cor_erro: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#f56565'
    },
    cor_alerta: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#ed8936'
    },
    cor_info: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#4299e1'
    },
    
    // Outras Configurações
    fonte_principal: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Inter, sans-serif'
    },
    border_radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 8
    },
    tema_escuro_ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    
    // Metadados
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    atualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'temas_instancias',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return TemaInstancia;
};

