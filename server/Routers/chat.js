const express = require("express")
const router = express.Router()
const chat = require("../Controllers/chat")
const multer = require("../Middleware/multer.config")

// Routes

router.post('/getRoom/:id', chat.getRoom)
router.post('/addMessage/:id', chat.addMessage)
router.post('/addImage/:id', multer.single("file"), chat.addImage)

router.get('/getContent/:id', chat.getContent)

module.exports = router