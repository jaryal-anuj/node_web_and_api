const WebRouter = require('express').Router();
const { ensureAuthenticated, forwardAuthenticated } = require(process.cwd()+'/config/auth');


WebRouter.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));
WebRouter.use('/auth',require('./auth.js'));
WebRouter.use('/home', require('./home.js'));
WebRouter.use('/users',require('./users.js'));
WebRouter.use('/post', require('./post.js'));

module.exports = WebRouter;