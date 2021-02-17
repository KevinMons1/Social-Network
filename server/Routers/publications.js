const express = require("express")
const router = express.Router()
const publications = require("../Controllers/publications")
const multer = require("../Middleware/multer.config")

// Routes

router.post('/add/:id', publications.addNewPublication)
router.post('/comments/add/:id', publications.addNewComments)
router.post('/add/image/:id', multer.single("file"), publications.addPublicationImage)

router.get('/account/:id', publications.getAccountPublications)
router.get('/comments/:id', publications.getComments)
router.get('/all', publications.getAllPublications)

router.delete('/account/delete/:id', publications.deletePublication)

module.exports = router