'use strict';
const sequelizePaginate = require('sequelize-paginate');
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    user_id:DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {underscored:true});
  post.associate = function(models) {
    // associations can be defined here
	post.hasMany(models.post_image, {as: 'post_image' ,foreignKey:'post_id'})
	post.belongsTo(models.user)
    post.hasMany(models.comment,{foreignKey:'post_id'})
  };
  sequelizePaginate.paginate(post)
  return post;
};
