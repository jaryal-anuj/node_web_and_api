const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const config = require(process.cwd()+"/config");

class LoginController {

	async login(req, res, next){

		try{
			const errors = validationResult(req);
			if (!errors.isEmpty()) {

				return res.status(422).json({code:"Unprocessable Entity",message:"Validation failed",errors:errors.array( {onlyFirstError: true} )});
			}

			passport.authenticate('local',{session: false}, (err,user,info)=>{
				console.log(err,user,info)
				if(err){ return next(err); }
				if (!user) {
					return res.status(400).json({code:"Not found",message:info.message});
				}
				req.logIn(user, {session: false}, async (err) => {
				    if (err) { return next(err); }

				    const token = jwt.sign({id:user.id}, config.jwt.secret , { expiresIn: config.jwt.expire, issuer:config.jwt.issuer });
				    return res.status(200).json({token:token,expires_in:config.jwt.expire});
				});
			})(req,res,next);
		}catch(err){
			next(err);
		}
	}

}

module.exports = new LoginController();
