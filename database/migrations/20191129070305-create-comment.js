'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      post_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      comment: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(()=>{
      return Promise.all([
        queryInterface.addConstraint(
          'comments',
          ['post_id'],
          {
            type:'foreign key',
            name: 'FK_comments_to_post',
            references: {
              table: 'posts',
              field: 'id'
            },
            onDelete: 'cascade',
          }

        ),
        queryInterface.addConstraint(
          'comments',
          ['user_id'],
          {
            type:'foreign key',
            name: 'FK_comments_to_user',
            references: {
              table: 'users',
              field: 'id'
            },
            onDelete: 'cascade',
          }

        ),
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comments');
  }
};