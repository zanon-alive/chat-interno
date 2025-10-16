const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PermissaoComunicacao extends Model {
    static associate(models) {
      PermissaoComunicacao.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia_chat',
        as: 'instancia'
      });

      PermissaoComunicacao.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });

      PermissaoComunicacao.belongsTo(models.Equipe, {
        foreignKey: 'id_equipe',
        as: 'equipe'
      });
    }
  }

  PermissaoComunicacao.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_instancia_chat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'instancias_chat',
        key: 'id'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    id_equipe: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'equipes',
        key: 'id'
      }
    },
    tipo_permissao: {
      type: DataTypes.ENUM('restrito', 'padrao', 'equipe', 'geral', 'customizado'),
      allowNull: false,
      defaultValue: 'padrao'
    },
    pode_comunicar_com: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'PermissaoComunicacao',
    tableName: 'permissoes_comunicacao',
    underscored: true,
    timestamps: true
  });

  return PermissaoComunicacao;
};

