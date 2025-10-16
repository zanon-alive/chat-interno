'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('participantes_conversa', {
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
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      left_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      ultima_leitura: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('participantes_conversa', ['id_conversa'], {
      name: 'idx_participantes_conversa'
    });

    await queryInterface.addIndex('participantes_conversa', ['id_usuario'], {
      name: 'idx_participantes_usuario'
    });

    await queryInterface.addIndex('participantes_conversa', ['id_usuario', 'id_conversa'], {
      unique: true,
      name: 'idx_participantes_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('participantes_conversa');
  }
};
