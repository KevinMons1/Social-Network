const express = require("express")
const router = express.Router()
const notifications = require("../Controllers/notifications")

// Routes

router.post('/add', notifications.addNewNotification)

router.get('/all/:id', notifications.getNotifications)

router.put('/view/update', notifications.updateView)

router.delete('/delete', notifications.deleteNotification)

module.exports = router