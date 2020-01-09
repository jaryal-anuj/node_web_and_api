'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {underscored:true});
  comment.associate = function(models) {
    comment.belongsTo(models.user,{foreignKey:'user_id'})
  };
  return comment;
};
