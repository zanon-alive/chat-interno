'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar colunas para token de widget
    await queryInterface.addColumn('usuarios', 'widget_token', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Token JWT permanente para uso em widget embarcável'
    });

    await queryInterface.addColumn('usuarios', 'widget_token_expira_em', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Data de expiração do widget token (null = nunca expira)'
    });

    await queryInterface.addColumn('usuarios', 'widget_token_sempre_valido', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Se true, widget_token nunca expira'
    });

    await queryInterface.addColumn('usuarios', 'widget_token_gerado_em', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Data de geração do widget token'
    });

    console.log('✅ Colunas de widget token adicionadas aos usuários');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'widget_token_gerado_em');
    await queryInterface.removeColumn('usuarios', 'widget_token_sempre_valido');
    await queryInterface.removeColumn('usuarios', 'widget_token_expira_em');
    await queryInterface.removeColumn('usuarios', 'widget_token');
    
    console.log('✅ Colunas de widget token removidas');
  }
};

