const JwtStrategy = require('passport-jwt').Strategy;
const  ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require(process.cwd()+'/app/models').user;
const config = require(process.cwd()+"/config");

module.exports =(passport)=>{
	passport.use(new JwtStrategy(
		{
			jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey : config.jwt.secret,
			issuer:config.jwt.issuer,
		},
		async(jwt_payload,done)=>{
			try{
				let user = await User.findOne({ where:{ id:jwt_payload.id } });
				if(user){
					return done(null,user);
				}else{
					return done(null, false);
				}
			}catch(err){
				return done(err);
			}
		}
	));
}
