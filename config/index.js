module.exports = {
	jwt:{
		secret:process.env.JWT_SECRET,
		expire:process.env.JWT_EXPIRE,
		issuer:process.env.JWT_ISSUER
	}
}