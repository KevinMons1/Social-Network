const express = require("express")
const router = express.Router()
const publications = require("../Controllers/publications")
const multerImage = require("../Middleware/multerImage")
const multerVideo = require("../Middleware/multerVideo")

// Routes

router.post('/add/publication/:id', publications.addNewPublication)
router.post('/comments/add/:id', publications.addNewComments)
router.post('/add/image', multerImage.single('file'), publications.addPublicationImage)
router.post('/add/video', multerVideo.single('video'), publications.addPublicationVideo)
router.post('/like/add/:id', publications.addLike)
router.post('/likes/get/:id', publications.getLikes)

router.get('/account/:id', publications.getAccountPublications)
router.get('/comments/:id', publications.getComments)
router.get('/home/:id', publications.getPublicationsHome)
router.get('/story/:id', publications.getStorys)
router.get('/hashtag/:id', publications.getPublicationsHashtag)
router.get('/one/:id', publications.getOnePublication)

router.delete('/like/delete/:id', publications.deleteLike)
router.delete('/account/delete/:id', publications.deletePublication)

module.exports = router