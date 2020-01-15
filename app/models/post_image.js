'use strict';
module.exports = (sequelize, DataTypes) => {
  const post_image = sequelize.define('post_image', {
    post_id:DataTypes.INTEGER,
    file: {
		type:DataTypes.STRING,
	}
  }, {underscored:true,});
  post_image.associate = function(models) {
    // associations can be defined here
  };

  return post_image;
};
