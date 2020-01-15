const User = require(process.cwd()+'/app/models').user;
const crypto = require('crypto');

module.exports =  {
	consume: async (token, fn)=>{
		let user = await User.findOne({ where:{ remember_me:token } });
		return fn(null, user);

	},
	save:async (token, uid, fn)=>{
		await User.update({remember_me:token},{where:{ id:uid }});
 		return fn();
	}
}
