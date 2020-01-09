const { check, body, validationResult } = require('express-validator');
const User = require(process.cwd()+"/app/models").user;

const SignUpValidate =() =>{
	return [
		body('name')
			.trim()
			.not().isEmpty().withMessage('Name is required !'),
		body('email')
			.trim()
			.isEmail().withMessage('Email is required !')
			.custom(value =>{
				return User.findOne({ where:{ email:value } }).then(user=>{
					if(user){
						return Promise.reject("Email already in use!");
					}
				})
			}),
		body('password')
			.not().isEmpty().withMessage("Password is required !")
			.isLength({ min: 6 }).withMessage("Password must be 6 character long !")
			.isLength({ max: 20 }).withMessage("Password must be less than 20 characters!"),
		body('confirm_password')
			.not().isEmpty().withMessage("Confirm Password is required !")
			.custom((value,{req}) => {
				if(value !== req.body.password){
					throw new Error("Password confirmation does not match password ");
				}
				return true;
			}),
	];

}


const SignInValidate =() =>{
	return [
		body('email')
			.trim().normalizeEmail()
			.isEmail().withMessage('Email is required !'),
		body('password')
			.not().isEmpty().withMessage("Password is required !")
			.isLength({ min: 6 }).withMessage("Password must be 6 character long !")
			.isLength({ max: 20 }).withMessage("Password must be less than 20 characters!"),
	];

}



module.exports = { SignUpValidate ,SignInValidate};
