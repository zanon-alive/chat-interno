'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mensagens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_conversa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conversas',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      id_remetente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      id_instancia_chat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'instancias_chat',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      conteudo_texto: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tipo_mensagem: {
        type: Sequelize.ENUM('texto', 'arquivo', 'imagem', 'sistema'),
        defaultValue: 'texto',
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      editada: {
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

    await queryInterface.addIndex('mensagens', ['id_conversa', 'created_at'], {
      where: { deleted_at: null },
      name: 'idx_mensagens_conversa_data'
    });

    await queryInterface.addIndex('mensagens', ['id_remetente'], {
      where: { deleted_at: null },
      name: 'idx_mensagens_remetente'
    });

    await queryInterface.addIndex('mensagens', ['id_instancia_chat'], {
      where: { deleted_at: null },
      name: 'idx_mensagens_instancia'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mensagens');
  }
};
