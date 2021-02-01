const express = require("express")
const router = express.Router()
const publications = require("../Controllers/publications")

// Routes

router.post('/add/:id', publications.newPublication)

router.get('/account/:id', publications.getAccountPublications)
router.get('/all', publications.getAllPublications)

router.delete('/account/delete/:id', publications.deletePublication)


module.exports = router