const ApiRouter = require('express').Router();

ApiRouter.use('/auth',require('./auth.js'));
ApiRouter.use('/user',require('./user.js'));
ApiRouter.use('/post', require('./post.js'))

module.exports = ApiRouter;
