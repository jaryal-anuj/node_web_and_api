'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.sequelize.query('ALTER TABLE posts ADD user_id INT NOT NULL'),
          queryInterface.sequelize.query('ALTER TABLE posts ADD CONSTRAINT FK_post_to_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE RESTRICT;')
      ]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.query("ALTER TABLE posts DROP user_id");
  }
};
