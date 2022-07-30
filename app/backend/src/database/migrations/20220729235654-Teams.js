'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teams', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      teamName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'team_name'
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('teams');
  },
};
