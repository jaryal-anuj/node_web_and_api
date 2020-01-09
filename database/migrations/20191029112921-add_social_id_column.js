'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'users',
                'gmail_id',
                {type:Sequelize.STRING,after:'email'}
            ),
            queryInterface.addColumn(
                'users',
                'fb_id',
                {type:Sequelize.STRING,after:'gmail_id'}
            )

        ]);
    },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeColumn('users', 'gmail_id'),
        queryInterface.removeColumn('users', 'fb_id')
    ]);
  }
};
