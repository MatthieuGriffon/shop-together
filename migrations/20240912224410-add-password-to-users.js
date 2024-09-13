'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: true, // Facultatif pour les utilisateurs OAuth
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'password');
  }
};