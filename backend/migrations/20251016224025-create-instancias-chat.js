'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('instancias_chat', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_empresa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'empresas',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      nome_instancia: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      limite_usuarios: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ativa', 'suspensa', 'cancelada'),
        defaultValue: 'ativa',
        allowNull: false
      },
      data_validade: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.addIndex('instancias_chat', ['id_empresa'], {
      where: { deleted_at: null },
      name: 'idx_instancias_empresa'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('instancias_chat');
  }
};
