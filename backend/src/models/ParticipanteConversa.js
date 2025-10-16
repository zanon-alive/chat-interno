const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ParticipanteConversa extends Model {
    static associate(models) {
      ParticipanteConversa.belongsTo(models.Conversa, {
        foreignKey: 'id_conversa',
        as: 'conversa'
      });

      ParticipanteConversa.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
    }
  }

  ParticipanteConversa.init({
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
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    left_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ultima_leitura: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ParticipanteConversa',
    tableName: 'participantes_conversa',
    underscored: true,
    timestamps: false
  });

  return ParticipanteConversa;
};

