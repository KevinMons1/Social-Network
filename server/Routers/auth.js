const express = require("express")
const router = express.Router()
const auth = require("../Controllers/auth")

// Routes

router.post('/signup', auth.signup)

module.exports = router