const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InstanciaChat extends Model {
    static associate(models) {
      InstanciaChat.belongsTo(models.Empresa, {
        foreignKey: 'id_empresa',
        as: 'empresa'
      });

      InstanciaChat.hasMany(models.Usuario, {
        foreignKey: 'id_instancia_chat',
        as: 'usuarios'
      });

      InstanciaChat.hasMany(models.Equipe, {
        foreignKey: 'id_instancia_chat',
        as: 'equipes'
      });

      InstanciaChat.hasMany(models.Conversa, {
        foreignKey: 'id_instancia_chat',
        as: 'conversas'
      });
    }

    // Método para contar usuários ativos
    async countUsuariosAtivos() {
      const { Usuario } = sequelize.models;
      return await Usuario.count({
        where: {
          id_instancia_chat: this.id,
          status: 'ativo',
          nivel_permissao: ['gestor', 'equipe'] // Não conta admins
        }
      });
    }
  }

  InstanciaChat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id'
      }
    },
    nome_instancia: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome da instância é obrigatório' },
        len: {
          args: [3, 200],
          msg: 'Nome deve ter entre 3 e 200 caracteres'
        }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    limite_usuarios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Limite mínimo é 1 usuário'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('ativa', 'suspensa', 'cancelada'),
      defaultValue: 'ativa',
      allowNull: false
    },
    data_validade: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'InstanciaChat',
    tableName: 'instancias_chat',
    underscored: true,
    paranoid: true,
    timestamps: true
  });

  return InstanciaChat;
};

