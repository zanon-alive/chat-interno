const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mensagem extends Model {
    static associate(models) {
      Mensagem.belongsTo(models.Conversa, {
        foreignKey: 'id_conversa',
        as: 'conversa'
      });

      Mensagem.belongsTo(models.Usuario, {
        foreignKey: 'id_remetente',
        as: 'remetente'
      });

      Mensagem.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia_chat',
        as: 'instancia'
      });
    }
  }

  Mensagem.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_conversa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'conversas',
        key: 'id'
      }
    },
    id_remetente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    id_instancia_chat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'instancias_chat',
        key: 'id'
      }
    },
    conteudo_texto: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Mensagem não pode estar vazia' },
        len: {
          args: [1, 5000],
          msg: 'Mensagem deve ter entre 1 e 5000 caracteres'
        }
      }
    },
    tipo_mensagem: {
      type: DataTypes.ENUM('texto', 'arquivo', 'imagem', 'sistema'),
      defaultValue: 'texto',
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    editada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Mensagem',
    tableName: 'mensagens',
    underscored: true,
    paranoid: true,
    timestamps: true
  });

  return Mensagem;
};

