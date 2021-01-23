const express = require("express")
const router = express.Router()
const auth = require("../Controllers/auth")

// Routes

router.post('/signup', auth.signup)
router.post('/login', auth.login)
router.post('/login-token', auth.loginToken)

module.exports = router