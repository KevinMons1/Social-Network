const db = require("../db");

// Create and/or search roomId
exports.getRoom = (req, res) => {
    let id1 = req.params.id
    let id2 = req.body.userId
    let friendId;

    // db.query("SELECT * FROM privateRooms WHERE friendId")
    db.query("SELECT friendId FROM friends WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)",
    [id1, id2, id2, id1], (err, result) => {
        if (err) {
            throw err
        } else {
            friendId = result[0].friendId
            db.query("SELECT * FROM privateRooms WHERE friendId = ?",
            [friendId], (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    if (result2[0] === undefined) {
                        db.query("INSERT INTO privateRooms (friendId) VALUES(?)",
                        [friendId], (err3, result3) => {
                            if (err3) {
                                throw err3
                            } else {
                                res.send(result3[0])
                            }
                        })
                    } else {
                        db.query("SELECT roomId FROM privateRooms WHERE friendId = ?",
                        [friendId], (err4, result4) => {
                            if (err4) {
                                throw err4
                            } else {
                                res.send(result4[0])
                            }
                        })
                    }
                }
            })
            
        }
    })
}

// Get all messages in the room
exports.getContent = (req, res) => {
    const roomId = req.params.id
    
    db.query('SELECT * FROM roomMessages WHERE roomId = ? ORDER BY date ASC',
    [roomId], (err, result) => {
        if (err) {
            throw err
        } else {
           res.send(result)
        }
    })
}

// Add message
exports.addMessage = (req, res) => {
    const roomId = req.params.id
    const userId = req.body.sender
    const text = req.body.text

    db.query(`INSERT INTO roomMessages (roomId, userId, text, type) VALUES(?, ?, ?, "text")`,
    [roomId, userId, text], (err, result) => {
        if (err) {
            throw err
        }
    })
}

// Add image
exports.addImage = (req, res) => {
    const roomId = req.params.id
    const userId = req.body.id
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`

    db.query(`INSERT INTO roomMessages (roomId, userId, text, type) VALUES(?, ?, ?, "image")`,
    [roomId, userId, imageUrl], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send(imageUrl)
        }
    })
    
}
