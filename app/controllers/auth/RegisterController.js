const User = require(process.cwd()+"/app/models").user;
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


class RegisterController {

	async showRegisterForm(req, res,next){
		try{
			res.render("auth/signup")
		}catch(err){
			next(err)
		}

	}

	async register(req, res, next){
		try{
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				req.flash('body',req.body);
			    req.flash('errors',errors.mapped());
			    return res.redirect('/auth/register');
			}

			let {name,email,password} = req.body;
			password = await bcrypt.hash(password,10);
			User.create({
				name:name,
				email:email,
				password:password,
			})
			req.flash("success_msg", "Registered successfully. Please login to continue !");
			res.redirect('/auth/login');
		}catch(err){
			next(err);
		}
	}


}

module.exports = new RegisterController();
