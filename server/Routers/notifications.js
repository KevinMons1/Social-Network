const express = require("express")
const router = express.Router()
const notifications = require("../Controllers/notifications")

// Routes

router.post('/add', notifications.addNewNotification)

router.get('/all/:id', notifications.getNotifications)

module.exports = router