'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('temas_instancias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
        unique: true,
        comment: 'Instância que possui este tema (relação 1:1)'
      },
      
      // Logo
      logo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL ou caminho do logo da empresa'
      },
      logo_width: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 150,
        comment: 'Largura do logo em pixels'
      },
      logo_height: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 50,
        comment: 'Altura do logo em pixels'
      },
      
      // Cores Primárias
      cor_primaria: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#667eea',
        comment: 'Cor principal (botões, links, destaques)'
      },
      cor_primaria_hover: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#5568d3',
        comment: 'Cor primária ao passar o mouse'
      },
      cor_secundaria: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#764ba2',
        comment: 'Cor secundária (gradientes, acentos)'
      },
      
      // Cores de Fundo
      cor_fundo: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#f7fafc',
        comment: 'Cor de fundo principal da aplicação'
      },
      cor_fundo_secundario: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#ffffff',
        comment: 'Cor de fundo de cards, modais, etc'
      },
      
      // Cores de Texto
      cor_texto_primaria: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#2d3748',
        comment: 'Cor do texto principal'
      },
      cor_texto_secundaria: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#718096',
        comment: 'Cor do texto secundário (subtítulos, hints)'
      },
      
      // Cores do Chat
      cor_mensagem_enviada: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#667eea',
        comment: 'Cor de fundo das mensagens enviadas'
      },
      cor_mensagem_recebida: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#e2e8f0',
        comment: 'Cor de fundo das mensagens recebidas'
      },
      
      // Cores de Estado
      cor_sucesso: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#48bb78',
        comment: 'Cor para mensagens de sucesso'
      },
      cor_erro: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#f56565',
        comment: 'Cor para mensagens de erro'
      },
      cor_alerta: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#ed8936',
        comment: 'Cor para alertas'
      },
      cor_info: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#4299e1',
        comment: 'Cor para informações'
      },
      
      // Outras Configurações
      fonte_principal: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: 'Inter, sans-serif',
        comment: 'Fonte principal da aplicação'
      },
      border_radius: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 8,
        comment: 'Raio das bordas em pixels (0-20)'
      },
      tema_escuro_ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Se o tema escuro está disponível'
      },
      
      // Metadados
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Se o tema está ativo'
      },
      criado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        comment: 'Usuário que criou o tema'
      },
      atualizado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        comment: 'Último usuário que atualizou o tema'
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

    // Índices
    await queryInterface.addIndex('temas_instancias', ['id_instancia'], {
      name: 'idx_temas_instancia'
    });
    await queryInterface.addIndex('temas_instancias', ['ativo'], {
      name: 'idx_temas_ativo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('temas_instancias');
  }
};

