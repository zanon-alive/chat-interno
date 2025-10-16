const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    static associate(models) {
      Empresa.hasMany(models.InstanciaChat, {
        foreignKey: 'id_empresa',
        as: 'instancias'
      });
    }
  }

  Empresa.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_cliente: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome da empresa é obrigatório' },
        len: {
          args: [3, 200],
          msg: 'Nome deve ter entre 3 e 200 caracteres'
        }
      }
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: {
        msg: 'CNPJ já cadastrado'
      },
      validate: {
        notEmpty: { msg: 'CNPJ é obrigatório' },
        is: {
          args: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
          msg: 'CNPJ inválido. Use o formato: XX.XXX.XXX/XXXX-XX'
        }
      }
    },
    email_contato: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Email é obrigatório' },
        isEmail: { msg: 'Email inválido' }
      }
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ativa', 'inativa', 'suspensa'),
      defaultValue: 'ativa',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresas',
    underscored: true,
    paranoid: true, // Soft delete
    timestamps: true
  });

  return Empresa;
};

