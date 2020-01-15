module.exports = {
	app:{
		baseUrl:process.env.APP_URL
	},
	jwt:{
		secret:process.env.JWT_SECRET,
		expire:process.env.JWT_EXPIRE,
		expSec:86400,
		issuer:process.env.JWT_ISSUER
	},
	fb:{
		clientID:process.env.FB_CLIENT_ID,
		clientSecret:process.env.FB_CLIENT_SECRET,
		callbackURL:process.env.FB_CALLBACK
	},
	gmail:{
		clientID:process.env.GMAIL_CLIENT_ID,
		clientSecret:process.env.GMAIL_CLIENT_SECRET,
		callbackURL:process.env.GMAIL_CALLBACK
	}
}
