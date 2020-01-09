const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require(process.cwd()+'/app/models').user;

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({where:{
        email: email
      }}).then(user => {

        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
		if(!user.password){
			return done(null, false, { message: 'Password incorrect' });
		}
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({where:{ id:id }}).then(user=>{
      done(null, user);
    })
  });
};
