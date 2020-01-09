const router = require('express').Router();
const LoginController = require(process.cwd()+"/app/controllers/auth/LoginController.js");
const RegisterController = require(process.cwd()+"/app/controllers/auth/RegisterController.js");
const { SignUpValidate, SignInValidate } = require(process.cwd()+"/app/middlewares/validation/auth.js");
const { ensureAuthenticated, forwardAuthenticated } = require(process.cwd()+'/config/auth');
const passport = require('passport');


router.get('/login',forwardAuthenticated,LoginController.showLoginForm);
router.get('/register',forwardAuthenticated,RegisterController.showRegisterForm);
router.post('/register',[ SignUpValidate() ],RegisterController.register);
router.post('/login',[ SignInValidate()], LoginController.login);
router.get('/logout',LoginController.logout);
router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', LoginController.googleLogin)
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/fb/callback', LoginController.fbLogin)


module.exports = router;