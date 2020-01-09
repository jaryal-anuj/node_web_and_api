const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true });
const passport = require('passport');

module.exports = (app)=>{
	//api routes
	app.use('/api',require('./api'));


	// web routes
	app.use(passport.authenticate('remember-me'));
	app.use( csrfProtection,function(req, res, next) {
	  res.locals.success_msg = req.flash('success_msg')[0];
	  res.locals.error_msg = req.flash('error_msg')[0];
	  res.locals.error = req.flash('error')[0];
	  res.locals.errors = req.flash('errors')[0];
	  //console.log(res.locals.errors);
	  res.locals.oldInput = req.flash('body')[0];
	  res.locals.user = req.user;
	  res.locals.csrfToken = req.csrfToken();
	  //console.log(res.locals);
	  next();
	});

	app.use('/',require('./web'));
}
