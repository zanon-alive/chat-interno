const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversa extends Model {
    static associate(models) {
      Conversa.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia_chat',
        as: 'instancia'
      });

      Conversa.hasMany(models.Mensagem, {
        foreignKey: 'id_conversa',
        as: 'mensagens'
      });

      Conversa.belongsToMany(models.Usuario, {
        through: models.ParticipanteConversa,
        foreignKey: 'id_conversa',
        otherKey: 'id_usuario',
        as: 'participantes'
      });
    }
  }

  Conversa.init({
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
    tipo_conversa: {
      type: DataTypes.ENUM('individual', 'grupo', 'canal', 'geral'),
      allowNull: false,
      defaultValue: 'individual'
    },
    nome_conversa: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Conversa',
    tableName: 'conversas',
    underscored: true,
    paranoid: true,
    timestamps: true
  });

  return Conversa;
};

