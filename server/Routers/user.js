const express = require("express")
const router = express.Router()
const user = require("../Controllers/user")

// Routes

router.get('/account/informations/:id', user.getAccountInformations)

router.put('/account/informations/update', user.updateAccountInformations)

module.exports = router