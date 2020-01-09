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
    post.hasMany(models.post_image, {as: 'post_image' })
    post.hasMany(models.comment)
  };
  sequelizePaginate.paginate(post)
  return post;
};