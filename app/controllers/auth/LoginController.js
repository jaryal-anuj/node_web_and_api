const passport = require('passport');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

class LoginController {

	async showLoginForm(req, res,next){
		try{
			res.render("auth/login")
		}catch(err){
			next(err)
		}

	}

	async login(req, res, next) {
		try{
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				req.flash('body',req.body);
			    req.flash('errors',errors.mapped());
			    return res.redirect('/auth/login');
			}

			passport.authenticate('local', (err,user,info)=>{

				if(err){ return next(err); }
				if (!user) {
					req.flash('error_msg',info.message);
					return res.redirect('/auth/login');
				}
				req.logIn(user, async (err) => {
				    if (err) { return next(err); }

				   	if(req.body.remember_me){
				   		let  hash = crypto.randomBytes(20).toString('hex');
				   		res.cookie('remember_me', hash, { path: '/', httpOnly: true, maxAge: 604800000 });
				   		await user.update({remember_me:hash});
				   	}

				    return res.redirect('/home');
				});
			})(req,res,next);

		}catch(err){
			console.log(err);
			next(err)
		}
	}

	async googleLogin(req, res, next) {
		try{
			passport.authenticate('google', {successRedirect:'/home',failureRedirect: '/auth/login' })(req,res,next);
		}catch(err){
			next(err)
		}
	}

	async fbLogin(req, res, next) {
		try{
			passport.authenticate('facebook', {successRedirect:'/home',failureRedirect: '/auth/login' })(req,res,next);
		}catch(err){
			next(err)
		}
	}

	async logout(req, res, next){
		try{
				req.logout();
				req.flash('success_msg', 'You are logged out');
				res.clearCookie('remember_me')
				res.redirect('/auth/login');
			}catch(err){
				next(err);
			}
	}


}

module.exports = new LoginController();
