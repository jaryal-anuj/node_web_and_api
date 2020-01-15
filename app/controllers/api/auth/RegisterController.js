const { validationResult } = require('express-validator');
const User = require(process.cwd()+"/app/models").user;
const bcrypt = require('bcrypt');

class RegisterController {

    async register(req,res,next){
        try{
            const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({code:"Unprocessable Entity",message:"Validation failed",errors:errors.array( {onlyFirstError: true} )});
            }

            let {name,email,password,gmail_id,fb_id} = req.body;
			password = await bcrypt.hash(password,10);
			await User.create({
				name:name,
				email:email,
				password:password,
				gmail_id:gmail_id,
				fb_id:fb_id
            })

            return res.status(201).json();
        }catch(err){
            next(err);
        }
    }

}

module.exports = new RegisterController;
