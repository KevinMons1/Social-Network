const db = require("../Utils/db")
const fs = require("fs")
const path = require("path")
const { cloudinary } = require('../Utils/cloudinary')

//
// Functions exports 
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

// Create and/or search roomId
exports.getRoom = async (req, res) => {
    let id1 = req.params.id
    let id2 = req.body.userId
    let friendId;

    const result = await requestQuery("SELECT friendId FROM friends WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)", [id1, id2, id2, id1])
    friendId = result[0].friendId
    const result2 = await requestQuery("SELECT * FROM privateRooms WHERE friendId = ?", [friendId])
    if (result2[0] === undefined) {
        const result3 = await requestQuery("INSERT INTO privateRooms (friendId) VALUES(?)", [friendId])
        res.send({roomId: result3.insertId, isNew: true})
    } else {
        const result4 = await requestQuery("SELECT roomId FROM privateRooms WHERE friendId = ?", [friendId])
        res.send(result4[0])
    }
}

// Get all messages in the room
exports.getContent = async (req, res) => {
    const roomId = req.params.id
    const result = await requestQuery('SELECT * FROM roomMessages WHERE roomId = ? ORDER BY date ASC', [roomId])
    res.send(result)
}

// Add message
exports.addMessage = async (req, res) => {
    const roomId = req.params.id
    const userId = req.body.sender
    const text = req.body.text
    const type = req.body.type
    
    const result = await requestQuery(`INSERT INTO roomMessages (roomId, userId, text, type) VALUES(?, ?, ?, ?)`, [roomId, userId, text, type])
}

// Add image
exports.addImage = async (req, res) => {
    const file = req.file
    const userId = req.body.id
    const roomId = req.params.id

    cloudinary.uploader.upload(file.path, {
        upload_preset: "publications_images"
    }, async (err, result) => {
        if (err) {
            throw err
        } else {
            const resultQuery = await requestQuery(`INSERT INTO roomMessages (roomId, userId, cloudinaryPublicId, text, type) VALUES(?, ?, ?, ?, "image")`, [roomId, userId, result.public_id, imageUrl])
            const pathStorage = path.join(__dirname, `../Images/${file.filename}`)

            // Delete image storage in folder Images
            fs.unlink(pathStorage, (err) => {
                console.log(err)
                return
            })
            res.send(result.url)  
        }
    })
 
}
