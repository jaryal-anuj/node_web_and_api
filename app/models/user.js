const config = require(process.cwd()+'/config');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gmail_id:DataTypes.STRING,
    fb_id:DataTypes.STRING,
    password: DataTypes.STRING,
    profile_image:{
		type:DataTypes.STRING,
		get(){
			return config.app.baseUrl+"/uploads/user_"+this.getDataValue('id')+"/"+this.getDataValue('profile_image');
		}
	},
    remember_me:DataTypes.STRING
  }, {
	  underscored:true,
	});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
