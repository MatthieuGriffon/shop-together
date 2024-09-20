'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invitations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      group_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Groups', // Nom de la table cible
          key: 'id',
        },
        onDelete: 'CASCADE', // Si le groupe est supprimé, toutes ses invitations le sont aussi
      },
      invited_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Nom de la table cible
          key: 'id',
        },
        onDelete: 'CASCADE', // Si l'utilisateur est supprimé, ses invitations le sont aussi
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Invitations');
  }
};