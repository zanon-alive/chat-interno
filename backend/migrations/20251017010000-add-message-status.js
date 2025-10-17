'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar colunas de status de mensagem
    await queryInterface.addColumn('mensagens', 'status_entrega', {
      type: Sequelize.ENUM('enviada', 'entregue', 'lida'),
      defaultValue: 'enviada',
      allowNull: false,
      comment: 'Status de entrega da mensagem: enviada, entregue, lida'
    });

    await queryInterface.addColumn('mensagens', 'entregue_em', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Data/hora que a mensagem foi entregue ao destinatário'
    });

    await queryInterface.addColumn('mensagens', 'lida_em', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Data/hora que a mensagem foi lida pelo destinatário'
    });

    console.log('✅ Colunas de status de mensagem adicionadas');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('mensagens', 'lida_em');
    await queryInterface.removeColumn('mensagens', 'entregue_em');
    await queryInterface.removeColumn('mensagens', 'status_entrega');
    
    console.log('✅ Colunas de status de mensagem removidas');
  }
};

