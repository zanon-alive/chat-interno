'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissoes_comunicacao', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_instancia_chat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'instancias_chat',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      id_equipe: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'equipes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tipo_permissao: {
        type: Sequelize.ENUM('restrito', 'padrao', 'equipe', 'geral', 'customizado'),
        allowNull: false,
        defaultValue: 'padrao'
      },
      pode_comunicar_com: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
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
      }
    });

    await queryInterface.addIndex('permissoes_comunicacao', ['id_instancia_chat'], {
      name: 'idx_permissoes_instancia'
    });

    await queryInterface.addIndex('permissoes_comunicacao', ['id_usuario'], {
      name: 'idx_permissoes_usuario'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissoes_comunicacao');
  }
};
