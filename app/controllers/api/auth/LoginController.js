const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const config = require(process.cwd()+"/config");
const UserModel = require(process.cwd()+'/app/models').user

class LoginController {

	async login(req, res, next){

		try{
			const errors = validationResult(req);
			if (!errors.isEmpty()) {

				return res.status(422).json({code:"Unprocessable Entity",message:"Validation failed",errors:errors.array( {onlyFirstError: true} )});
			}

			passport.authenticate('local',{session: false}, (err,user,info)=>{

				if(err){ return next(err); }
				if (!user) {
					return res.status(400).json({code:"Not found",message:info.message});
				}
				req.logIn(user, {session: false}, async (err) => {
				    if (err) { return next(err); }
					console.log(user);
				    const token = jwt.sign({id:user.id}, config.jwt.secret , { expiresIn: config.jwt.expire, issuer:config.jwt.issuer });
				    return res.status(200).json({token:token,expires_in:config.jwt.expSec});
				});
			})(req,res,next);
		}catch(err){
			next(err);
		}
	}

	async gmail_login(req, res, next){
		try{
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({code:"Unprocessable Entity",message:"Validation failed",errors:errors.array( {onlyFirstError: true} )});
			}
			let {gmail_id} =req.body
			let user = await UserModel.findOne({ where:{gmail_id:gmail_id} });
			if (!user) {
				return res.status(404).json({code:"Not found",message:"User not found!"});
			}

			const token = jwt.sign({id:user.id}, config.jwt.secret , { expiresIn: config.jwt.expire, issuer:config.jwt.issuer });
			return res.status(200).json({token:token,expires_in:config.jwt.expSec});


		}catch(err){
			next(err);
		}
	}

	async fb_login(req, res, next){
		try{
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({code:"Unprocessable Entity",message:"Validation failed",errors:errors.array( {onlyFirstError: true} )});
			}
			let {fb_id} =req.body
			let user = await UserModel.findOne({ where:{fb_id:fb_id} });
			if (!user) {
				return res.status(404).json({code:"Not found",message:"User not found!"});
			}

			const token = jwt.sign({id:user.id}, config.jwt.secret , { expiresIn: config.jwt.expire, issuer:config.jwt.issuer });
			return res.status(200).json({token:token,expires_in:config.jwt.expSec});
		}catch(err){
			next(err);
		}
	}

}

module.exports = new LoginController();
