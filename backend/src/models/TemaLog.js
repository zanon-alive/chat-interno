const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TemaLog extends Model {
    static associate(models) {
      TemaLog.belongsTo(models.TemaInstancia, {
        foreignKey: 'id_tema',
        as: 'tema'
      });

      TemaLog.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });

      TemaLog.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia',
        as: 'instancia'
      });
    }
  }

  TemaLog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_tema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Tema que foi alterado'
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Usuário que fez a alteração'
    },
    id_instancia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Instância do tema alterado'
    },
    acao: {
      type: DataTypes.ENUM('criado', 'atualizado', 'logo_alterado', 'ativado', 'desativado'),
      allowNull: false,
      comment: 'Tipo de ação realizada'
    },
    campo_alterado: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Campo específico que foi alterado'
    },
    valor_anterior: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Valor anterior do campo (JSON se múltiplos campos)'
    },
    valor_novo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Novo valor do campo (JSON se múltiplos campos)'
    },
    ip_origem: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP de origem da alteração'
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'User agent do navegador'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição adicional da alteração'
    }
  }, {
    sequelize,
    tableName: 'tema_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // Não tem updated_at, apenas created_at
  });

  return TemaLog;
};

