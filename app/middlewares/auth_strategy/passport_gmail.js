const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Load User model
const User = require(process.cwd()+'/app/models').user;

module.exports = function(passport) {
    passport.use(new GoogleStrategy(
        {
            clientID: '41860437728-hngcsgpdo10qlkotue8f5do5l9ekr6hl.apps.googleusercontent.com',
            clientSecret: 'zwwIKLRIt0DpjhPV8quyYawc',
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done)=>{
            //console.log(accessToken, refreshToken, profile,done);
            let email = profile.emails[0].value;
            let user = await User.findOne({ where:{ email:email } });
            if(user) {
                await user.update({ gmail_id:profile.id });
                return done(null, user);
            }else{
                user = await User.findOrCreate({ where:{ gmail_id:profile.id } ,defaults:{name:profile.displayName, email:email}});
                return done(null, user[0]);

            }
        }
    ));
}
