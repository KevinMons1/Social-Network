const express = require("express")
const router = express.Router()
const user = require("../Controllers/user")

// Routes

router.post('/account/informations', user.getAccountInformations)

module.exports = router