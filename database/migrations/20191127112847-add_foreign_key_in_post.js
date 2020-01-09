'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint(
          'post_images',
          ['post_id'],
          {
            type:'foreign key',
            name: 'FK_post_images_to_post',
            references: {
              table: 'posts',
              field: 'id'
            },
            onDelete: 'cascade',
          }
 
        )
    ]);

    //return queryInterface.sequelize.query("ALTER TABLE post_images ADD CONSTRAINT FK_post_images_to_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE");
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('post_images', 'FK_post_images_to_post')
    ]);
    //return queryInterface.sequelize.query("ALTER TABLE post_images DROP FOREIGN KEY FK_post_images_to_post");
  }
};
