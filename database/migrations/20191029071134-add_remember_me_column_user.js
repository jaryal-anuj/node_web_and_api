'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'users',
          'remember_me',
          {type:Sequelize.STRING,after:'password'}
      )
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.removeColumn('users','remember_me')

  }
};
