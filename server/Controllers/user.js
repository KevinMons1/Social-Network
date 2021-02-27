const db = require("../db")

//
// Functions exports 
//

// Publication when your modify a status as profile image
const publicationsDefault = (id, type, imageUrl, txt) => {
    let hashtag, publiId;

    if (type === "profile") {
        hashtag = "newProfileImage"
    } else if (type === "banner") {
        hashtag = "newBannerImage"
    } 

    db.query("INSERT INTO publications (userId, text, hashtag) VALUES (?, ?, ?)",
    [id, txt, hashtag], (err, result) => {
        if (err) {
            throw err
        } else {
            publiId = result.insertId
            db.query("INSERT INTO publicationImages (publicationId, publicationImageUrl) VALUES (?, ?)",
            [publiId, imageUrl], (err2, result2) => {
                if (err2) {
                    throw err2
                }
            })
        }
    })
}

// Add friend
exports.addFriend = (req, res) => {
    const { userId } = req.body
    const friendId = req.params.id

    db.query('INSERT INTO friends (user1Id, user2Id) VALUES(?, ?)',
    [userId, friendId], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send({alert: true})
        }
    })
}

// Get account informations
exports.getAccountInformations = (req, res) => {
    const id = req.params.id
    let regex = /^[0-9]*$/

    if (id != null && id.match(regex) != null) {
        const queryUser = "u.userId, u.lastName, u.firstName, u.bio"
        const queryImgProfile = "ip.profileImageUrl"
        const queryImgBanner = "ib.bannerImageUrl"
        const queryLike = "COUNT(likeId)"
        const queryPublication = "COUNT(publicationId)"
        const queryFriend = "COUNT(friendId)"

        //! Problème ici avec les COUNT ! et le count like doit être modifier car la on compte le nombre qu'il a liker lui et pas ce qu'ik à reçu
        db.query(`SELECT ${queryUser}, ${queryImgProfile}, ${queryImgBanner} FROM users u
                    LEFT JOIN profileImages ip ON ip.userId = ?
                    LEFT JOIN bannerImages ib ON ib.userId = ?
                    WHERE u.userId = ?`,
            [id, id, id], (err, result) => {
            if (err) {
                throw err
            } else {
                if (result.length > 0) {
                    db.query(`SELECT publicationId FROM publications WHERE userId = ?`,
                        [id], (err2, result2) => {
                            if (err2) {
                                throw err2
                            } else {
                                // To destroy the objects in the received array
                                const publicationId = result2.map(item => item.publicationId)
                                
                                db.query(`SELECT likesTotal, publicationsTotal, friendsTotal FROM
                                            (SELECT ${queryPublication} as publicationsTotal FROM publications WHERE userId = ?) publicationsTotal
                                            CROSS JOIN (SELECT ${queryFriend} as friendsTotal FROM friends WHERE (user1Id = ?) OR (user2Id = ?)) friendsTotal
                                            CROSS JOIN (SELECT ${queryLike} as likesTotal FROM likes WHERE publicationId IN (${publicationId})) likesTotal`,
                                    [id, id, id, id], (err3, result3) => {
                                    if (err3) {
                                        throw err3
                                    } else {
                                        res.send({alert: false, userData: [result[0], result3[0]]})
                                    }
                                    })
                            }
                        })
                } else {
                    res.send({alert: true})
                }
            }
        })
    } else {
        res.send({alert: true})
    }
}

// Get friend
exports.getIsFriend = (req, res) => {
    const { userId } = req.body
    const friendId = req.params.id

    db.query("SELECT friendId FROM friends WHERE user1Id = ? AND user2Id = ? OR user1Id = ? AND user2Id = ?", 
    [userId, friendId, friendId, userId], (err, result) => {
        if (err) {
            throw err
        } else {
            if (result.length === 0) {
                res.send(false)
            } else {
                res.send(true)
            }
        }
    })
}

// Get friends for components Connected
exports.getFriendsConnected = (req, res) => {
    const id = req.params.id
    const queryUser = "u.userId, u.lastName, u.firstName"
    const queryImg = "pi.profileImageUrl"
    let friends = []

    db.query(`SELECT * FROM friends WHERE user1Id = ? OR user2Id = ?`,
    [id, id], (err, result) => {
        if (err) {
            throw err
        } else {
            // To destroy the objects in the received array and seek userId
            friends = result.map(item => item.user1Id != id ? item.user1Id : item.user2Id)
            db.query(`SELECT ${queryUser}, ${queryImg} FROM users u
                        LEFT JOIN profileImages pi ON pi.userId IN (${friends})
                        WHERE u.userId IN (${friends})`,
            [], (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    console.log(result2)
                }
            })
        }
    })
}

// Update informations
exports.updateAccountInformations = (req, res) => {
    const { lastName, firstName, bio } = req.body
    const id = req.params.id
    const regex = /^[^@&":()!_$*€<>£`'µ§%+=\/;?#]+$/

    if (lastName != null && firstName != null) {
        if (lastName.match(regex) && firstName.match(regex)) {
            db.query("UPDATE users SET lastName = ?, firstName = ?, bio = ? WHERE userId = ?",
            [lastName, firstName, bio, id], (err, result) => {
                if (err) {
                    res.send({message: "An error has occurred !", alert: true})
                    throw err
                } else {
                    res.send({message: "Modified information !", alert: false})
                }
            })
        } else {
            res.send({message: "Your name and surname must contain at least 2 characters !", alert: true})
            
        }
    } else {
        res.send({message: "You have not modified any information !", alert: true})
    }
}

// Update image profile
exports.uploadImageProfile = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.params.id 
    const txt = req.body.txt

    
    db.query("UPDATE profileImages SET profileImageUrl = ? WHERE userId = ?",
    [imageUrl, id], async (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            await publicationsDefault(id, "profile", imageUrl, txt)
            res.send({message: "Modified information !", alert: false})
        }
    })
}
//! Avoir car répétition avec les 2 fonctions
// Update image banner
exports.uploadImageBanner = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.params.id 
    const txt = req.body.txt
    
    db.query("UPDATE bannerImages SET bannerImageUrl = ? WHERE userId = ?",
    [imageUrl, id], async (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            await publicationsDefault(id, "banner", imageUrl, txt)
            res.send({message: "Modified information !", alert: false})
        }
    })
}

// Delete friend
exports.deleteFriend = (req, res) => {
    const { userId } = req.body
    const friendId = req.params.id

    db.query('DELETE FROM friends WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)',
    [userId, friendId, friendId, userId], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send({alert: true})
        }
    })
}