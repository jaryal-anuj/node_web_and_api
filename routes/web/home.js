const router = require('express').Router();
const HomeController = require(process.cwd()+"/app/controllers/home/HomeController.js");
const { ensureAuthenticated, forwardAuthenticated } = require(process.cwd()+'/config/auth');


// Welcome Page

router.get('/',ensureAuthenticated, HomeController.index);



module.exports = router;