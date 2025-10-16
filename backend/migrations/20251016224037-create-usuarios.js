'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_instancia_chat: {
        type: Sequelize.INTEGER,
        allowNull: true, // Null para super_admin
        references: {
          model: 'instancias_chat',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      id_equipe: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'equipes',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      id_supervisor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      nome_completo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      hash_senha: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nivel_permissao: {
        type: Sequelize.ENUM('super_admin', 'admin_cliente', 'gestor', 'equipe'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo', 'bloqueado'),
        defaultValue: 'ativo',
        allowNull: false
      },
      ultimo_acesso: {
        type: Sequelize.DATE,
        allowNull: true
      },
      forcar_troca_senha: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('usuarios', ['id_instancia_chat'], {
      where: { deleted_at: null },
      name: 'idx_usuarios_instancia'
    });

    await queryInterface.addIndex('usuarios', ['email'], {
      unique: true,
      where: { deleted_at: null },
      name: 'idx_usuarios_email'
    });

    await queryInterface.addIndex('usuarios', ['id_equipe'], {
      where: { deleted_at: null },
      name: 'idx_usuarios_equipe'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
