'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empresas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome_cliente: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      cnpj: {
        type: Sequelize.STRING(18),
        allowNull: false,
        unique: true
      },
      email_contato: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      telefone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('ativa', 'inativa', 'suspensa'),
        defaultValue: 'ativa',
        allowNull: false
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

    await queryInterface.addIndex('empresas', ['cnpj'], {
      unique: true,
      where: { deleted_at: null },
      name: 'idx_empresas_cnpj'
    });

    await queryInterface.addIndex('empresas', ['status'], {
      where: { deleted_at: null },
      name: 'idx_empresas_status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('empresas');
  }
};
