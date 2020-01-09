const RememberMeStrategy = require('passport-remember-me').Strategy;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Token = require(process.cwd()+'/app/middlewares/auth_strategy/Token');

module.exports = function(passport) {
    passport.use(new RememberMeStrategy(
        (token, done)=>{

            Token.consume(token, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user);
            });
        },
        (user, done)=>{

            let  hash = crypto.randomBytes(20).toString('hex');
            Token.save(hash, user.id , function(err) {
              if (err) { return done(err); }
              return done(null, hash);
            });
        }
    ));

};
