const router = require('express').Router();
const { SignUpValidate, SignInValidate, GmailValidate, FbValidate } = require(process.cwd()+"/app/middlewares/validation/auth.js");
const LoginController = require(process.cwd()+"/app/controllers/api/auth/LoginController");
const RegisterController = require(process.cwd()+"/app/controllers/api/auth/RegisterController");

router.post('/login',[ SignInValidate()],LoginController.login);
router.post('/register',SignUpValidate(),RegisterController.register)
router.post('/gmail_login',GmailValidate(),LoginController.gmail_login)
router.post('/fb_login',FbValidate(),LoginController.fb_login)

module.exports = router;
