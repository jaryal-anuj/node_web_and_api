'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
          'users',
          'profile_image',
          {type:Sequelize.STRING,after:'password'}
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'profile_image')
    ]);
  }
};
