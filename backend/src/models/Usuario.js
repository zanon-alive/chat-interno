const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.InstanciaChat, {
        foreignKey: 'id_instancia_chat',
        as: 'instancia'
      });

      Usuario.belongsTo(models.Equipe, {
        foreignKey: 'id_equipe',
        as: 'equipe'
      });

      Usuario.belongsTo(models.Usuario, {
        foreignKey: 'id_supervisor',
        as: 'supervisor'
      });

      Usuario.hasMany(models.Usuario, {
        foreignKey: 'id_supervisor',
        as: 'subordinados'
      });

      Usuario.hasMany(models.Mensagem, {
        foreignKey: 'id_remetente',
        as: 'mensagens'
      });
    }

    // Método para comparar senha
    async comparePassword(password) {
      return await bcrypt.compare(password, this.hash_senha);
    }

    // Converter para JSON sem senha
    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.hash_senha;
      return values;
    }
  }

  Usuario.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_instancia_chat: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null para super_admin
      references: {
        model: 'instancias_chat',
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
    id_supervisor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    nome_completo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nome completo é obrigatório' },
        len: {
          args: [3, 200],
          msg: 'Nome deve ter entre 3 e 200 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'Email já cadastrado'
      },
      validate: {
        notEmpty: { msg: 'Email é obrigatório' },
        isEmail: { msg: 'Email inválido' }
      }
    },
    hash_senha: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nivel_permissao: {
      type: DataTypes.ENUM('super_admin', 'admin_cliente', 'gestor', 'equipe'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['super_admin', 'admin_cliente', 'gestor', 'equipe']],
          msg: 'Nível de permissão inválido'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo', 'bloqueado'),
      defaultValue: 'ativo',
      allowNull: false
    },
    ultimo_acesso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    forcar_troca_senha: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    underscored: true,
    paranoid: true,
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.hash_senha) {
          usuario.hash_senha = await bcrypt.hash(usuario.hash_senha, 10);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('hash_senha')) {
          usuario.hash_senha = await bcrypt.hash(usuario.hash_senha, 10);
        }
      }
    }
  });

  return Usuario;
};

