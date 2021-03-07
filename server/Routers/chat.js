const express = require("express")
const router = express.Router()
const chat = require("../Controllers/chat")

// Routes

router.post('/getRoom/:id', chat.getRoom)
router.post('/addMessage/:id', chat.addMessage)

router.get('/getMessages/:id', chat.getMessages)

module.exports = router