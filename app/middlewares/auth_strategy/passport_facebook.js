const FacebookStrategy = require('passport-facebook').Strategy;

// Load User model
const User = require(process.cwd()+'/app/models').user;

module.exports = function(passport) {
    passport.use(new FacebookStrategy(
        {
            clientID: '2324656061179668',
            clientSecret: 'a762fab1a79b06736ad95c1f4aa0fbfe',
            callbackURL: "http://localhost:3000/auth/fb/callback",
            profileFields: ['id', 'emails', 'name']
        },
        async (accessToken, refreshToken, profile, done)=>{
            //console.log(profile);
            //return;
            let email = profile.emails[0].value;
            let displayName = profile.name.givenName+" "+profile.name.familyName;
            let user = await User.findOne({ where:{ email:email } });
            if(user) {
                await user.update({ gmail_id:profile.id });
                return done(null, user);
            }else{
                user = await User.findOrCreate({ where:{ fb_id:profile.id } ,defaults:{name:displayName, email:email}});
                return done(null, user[0]);

            }
        }
    ));
}
