'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tema_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_tema: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'temas_instancias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Tema que foi alterado'
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Usuário que fez a alteração'
      },
      id_instancia: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'instancias_chat',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Instância do tema alterado'
      },
      acao: {
        type: Sequelize.ENUM('criado', 'atualizado', 'logo_alterado', 'ativado', 'desativado'),
        allowNull: false,
        comment: 'Tipo de ação realizada'
      },
      campo_alterado: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Campo específico que foi alterado (se aplicável)'
      },
      valor_anterior: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Valor anterior do campo (JSON se múltiplos campos)'
      },
      valor_novo: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Novo valor do campo (JSON se múltiplos campos)'
      },
      ip_origem: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP de origem da alteração'
      },
      user_agent: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'User agent do navegador'
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descrição adicional da alteração'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índices para consultas rápidas
    await queryInterface.addIndex('tema_logs', ['id_tema'], {
      name: 'idx_tema_logs_tema'
    });
    await queryInterface.addIndex('tema_logs', ['id_usuario'], {
      name: 'idx_tema_logs_usuario'
    });
    await queryInterface.addIndex('tema_logs', ['id_instancia'], {
      name: 'idx_tema_logs_instancia'
    });
    await queryInterface.addIndex('tema_logs', ['acao'], {
      name: 'idx_tema_logs_acao'
    });
    await queryInterface.addIndex('tema_logs', ['created_at'], {
      name: 'idx_tema_logs_data'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tema_logs');
  }
};

