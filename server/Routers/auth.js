const express = require("express")
const router = express.Router()
const auth = require("../Controllers/auth")

// Routes

router.post('/signup', auth.signup)
router.post('/signup-google', auth.signupGoogle)
router.post('/login', auth.login)
router.post('/login-token', auth.loginToken)
router.post('/login-google', auth.loginGoogle)
router.post('/password-forget', auth.passwordForget)
router.post('/reset-password', auth.resetPassword)

module.exports = router