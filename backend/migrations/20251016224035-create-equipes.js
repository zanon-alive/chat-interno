'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipes', {
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
        onDelete: 'RESTRICT'
      },
      nome: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex('equipes', ['id_instancia_chat'], {
      where: { deleted_at: null },
      name: 'idx_equipes_instancia'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('equipes');
  }
};
