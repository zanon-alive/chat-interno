const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Equipe extends Model {
    static associate(models) {
      Equipe.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia_chat',
        as: 'instancia'
      });

      Equipe.hasMany(models.Usuario, {
        foreignKey: 'id_equipe',
        as: 'usuarios'
      });
    }
  }

  Equipe.init({
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
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome da equipe é obrigatório' },
        len: {
          args: [2, 200],
          msg: 'Nome deve ter entre 2 e 200 caracteres'
        }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Equipe',
    tableName: 'equipes',
    underscored: true,
    paranoid: true,
    timestamps: true
  });

  return Equipe;
};

