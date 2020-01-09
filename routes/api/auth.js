const router = require('express').Router();
const { SignUpValidate, SignInValidate } = require(process.cwd()+"/app/middlewares/validation/auth.js");
const LoginController = require(process.cwd()+"/app/controllers/api/auth/LoginController");
const RegisterController = require(process.cwd()+"/app/controllers/api/auth/RegisterController");

router.post('/login',[ SignInValidate()],LoginController.login);
router.post('/register',SignUpValidate(),RegisterController.register)

module.exports = router;