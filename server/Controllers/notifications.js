const db = require("../db")

//
// Functions globale
//

const requestQuery = async (query, params) => {
    return await new Promise ((resolve) => {
        db.query(query, params, (err, result) => {
            if (err) {
                throw err
            } else {
                resolve(result)
            }
        })
    })
}

// Add new notification
exports.addNewNotification = async (req, res) => {
    const { sender, receiver, type } = req.body
    const result = await requestQuery("INSERT INTO notifications (senderId, receiverId, type) VALUES (?, ?, ?)", [sender, receiver, type])
}

// Get all notification of user
exports.getNotifications = async (req, res) => {
    const id = req.params.id
    const queryUser = "u.userId, u.lastName, u.firstName"
    const queryImg = "ui.url as profileImage"
    let allResult = []

    const result = await requestQuery("SELECT * FROM notifications WHERE receiverId = ? ORDER BY notificationId DESC", [id])

    for (let i = 0; i < result.length; i++) {
        const result2 = await requestQuery(`SELECT ${queryUser}, ${queryImg} FROM users u
            LEFT JOIN userImages ui ON ui.userId = ? AND ui.type = "profile"
            WHERE u.userId = ?`, [result[i].senderId, result[i].senderId])
        allResult.push({
            user: result2[0],
            content: result[i]
        })

        if (i === result.length - 1) res.send(allResult)
    } 
}

// Delete notification
exports.deleteNotification = async (req, res) => {
    const { receiverId, senderId, type, date } = req.body
    const _date = new Date(date)
    
    const result = await requestQuery("DELETE FROM notifications WHERE ( (receiverId = ? AND senderId = ?) OR (receiverId = ? AND senderId = ?) ) AND (type = ? AND date = ?) ",
    [receiverId, senderId, senderId, receiverId, type, _date])
}

// Change value of view for true
exports.updateView = (req, res) => {
    let senderId, receiverId, type, date
    
    req.body.forEach(async element => {
        senderId = element.senderId
        receiverId = element.receiverId
        type = element.type
        date = new Date(element.date)

        const result = await requestQuery("UPDATE notifications SET view = 1 WHERE ( (receiverId = ? AND senderId = ?) OR (receiverId = ? AND senderId = ?) ) AND (type = ? AND date = ?)",
        [receiverId, senderId, senderId, receiverId, type, date])
    })
}