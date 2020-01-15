const express = require('express');
//import express from 'express';
const createError = require('http-errors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('connect-flash-plus');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger-spec.yaml');
const cors = require('cors');
const dotEnv = require('dotenv');
const dotenvExpand = require('dotenv-expand')

const appEnv=dotEnv.config();
dotenvExpand(appEnv);


//const oldInput = require('old-input');
const app = express();
const port = process.env.PORT||3000;
// Passport Config
require('./app/middlewares/auth_strategy/passport_local')(passport);
require('./app/middlewares/auth_strategy/passport_remember_me')(passport);
require('./app/middlewares/auth_strategy/passport_gmail')(passport);
require('./app/middlewares/auth_strategy/passport_facebook')(passport);
require('./app/middlewares/auth_strategy/passport_jwt')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/app');


app.use((req, res, next)=>{
	req.appUrl = req.protocol + '://' + req.get('host');
	next();
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(expressLayouts);
//app.use(oldInput);
app.use(passport.initialize());
app.use(passport.session());


require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  if(req.xhr || req.url.indexOf('/api')>-1){
    return res.status(err.status?err.status:500).json({code:err.code?err.code:"Internal server error",message:err.message});
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error',{'layout':false});
});



app.listen(port,()=>console.log(`Server is running at http://localhost:${port}`));
