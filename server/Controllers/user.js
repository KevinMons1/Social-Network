const db = require("../db");

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
            db.query(`INSERT INTO publicationContent (publicationId, userId, text, type) VALUES (?, ?, ?, "image")`,
            [publiId, id, imageUrl], (err2, result2) => {
                if (err2) {
                    throw err2
                }
            })
        }
    })
}

const getFriendId = async (id) => {
    return await new Promise(resolve => {
        db.query(`SELECT friendId, user1Id, user2Id FROM friends WHERE user1Id = ? OR user2Id = ?`,
        [id, id], (err, result) => {
            if (err) {
                throw err
            } else {
                resolve(result)
            }
        })
    })
}

const getInformationsFriend = async (id) => {
    return await new Promise(resolve => {
        const queryUser = "u.userId, u.lastName, u.firstName"
        const queryImg = "ui.url as profileImage"

        db.query(`SELECT ${queryUser}, ${queryImg} FROM users u
        LEFT JOIN userImages ui ON ui.userId = ? AND ui.type = "profile"
        WHERE u.userId = ?`,
        [id, id], (err2, result2) => {
            if (err2) {
                throw err2
            } else {
               resolve(result2)
            }
        })   
    })
}

// Get all information for display each user who speaking white the user
const getFriendsChatPromisse = async (element, id) => {
    return await new Promise(resolve => {
        const queryUser = "u.userId, u.lastName, u.firstName"
        const queryImg = "ui.url as profileImage"
        let friendId
        let allResult

        // Take roomId
        db.query(`SELECT roomId FROM privaterooms WHERE friendId = ?`,
        [element.friendId], (err, result) => {
            if (err) {
                throw err
            } else {
                if (result[0] === undefined) {
                    resolve(allResult)
                } else {
                    // Take last message
                    db.query(`SELECT text, type FROM roomMessages WHERE roomId = ? ORDER BY Date DESC LIMIT 0,1`,
                    [result[0].roomId], (err2, result2) => {
                        if (err2) {
                            throw err2
                        } else {
                            if (result2.length == 0) {
                                resolve(false)
                            } else {
                                // Take id of friend
                                friendId = element.user1Id == id ? element.user2Id : element.user1Id
                                // Get informations of friend
                                db.query(`SELECT ${queryUser}, ${queryImg} FROM users u
                                            LEFT JOIN userImages ui ON ui.userId = ? AND ui.type = "profile"
                                            WHERE u.userId = ?`, [friendId, friendId], (err3, result3) => {
                                    if (err3) {
                                        throw err3
                                    } else {
                                        allResult = {...result3[0], text: result2[0].text, type: result2[0].type}
                                        resolve(allResult)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })   
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
        const queryImgBanner = "ip.url as profileImage"
        const queryImgProfile = "ib.url as bannerImage"
        const queryLike = "COUNT(likeId)"
        const queryPublication = "COUNT(publicationId)"
        const queryFriend = "COUNT(friendId)"

        // Search main informations
        //! Problème ici avec les COUNT ! et le count like doit être modifier car la on compte le nombre qu'il a liker lui et pas ce qu'il à reçu
        db.query(`SELECT ${queryUser}, ${queryImgProfile}, ${queryImgBanner} FROM users u
                    LEFT JOIN userImages ip ON ip.userId = ? AND ip.type = "profile"
                    LEFT JOIN userImages ib ON ib.userId = ? AND ib.type = "banner"
                    WHERE u.userId = ?`,
            [id, id, id], (err, result) => {
            if (err) {
                throw err
            } else {
                // If result.lenght > 0 but this user not exist !
                if (result.length > 0) {
                    // Search if he have publications
                    db.query(`SELECT publicationId FROM publications WHERE userId = ?`,
                        [id], (err2, result2) => {
                            if (err2) {
                                throw err2
                            } else {
                                // If user haven't publication so he havn't publicationTotal and likeTotal but he can have friends !
                                if (result2.length === 0) {
                                    db.query(`SELECT ${queryFriend} as friendsTotal FROM friends WHERE (user1Id = ?) OR (user2Id = ?)`,
                                    [id, id], (err3, result3) => {
                                        if (err3) {
                                            throw err3
                                        } else {
                                            const defaultResult = {
                                                likesTotal: 0,
                                                friendsTotal: result3[0].friendsTotal,
                                                publicationsTotal: 0
                                            }
                                            res.send({alert: false, userData: [result[0], defaultResult]})
                                        }
                                    })
                                } else {
                                    // To destroy the objects in the received array
                                    const publicationId = result2.map(item => item.publicationId)
                                    // Search likesTotal, publicationsTotal and friendsTotal for complet account
                                    db.query(`SELECT likesTotal, publicationsTotal, friendsTotal FROM
                                                (SELECT ${queryPublication} as publicationsTotal FROM publications WHERE userId = ?) publicationsTotal
                                                CROSS JOIN (SELECT ${queryFriend} as friendsTotal FROM friends WHERE (user1Id = ?) OR (user2Id = ?)) friendsTotal
                                                CROSS JOIN (SELECT ${queryLike} as likesTotal FROM likes WHERE publicationId IN (${publicationId})) likesTotal`,
                                        [id, id, id, id], (err4, result4) => {
                                            if (err4) {
                                                throw err4
                                            } else {
                                                res.send({alert: false, userData: [result[0], result4[0]]})
                                            }
                                        })
                                }
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
exports.getFriends = async (req, res) => {
    const id = req.params.id
    const result = await getFriendId(id) 
    let friendsId;
    let friends = []
    let count = 0
    let result2;

    if (result.lenght === 0) {
        res.send(false)
    } else {
        // To destroy the objects in the received array and seek userId
        friendsId = result.map(item => item.user1Id != id ? item.user1Id : item.user2Id)
        friendsId.forEach(async userId => {
            result2 = await getInformationsFriend(userId)
            count++
            friends = [...friends, result2[0]]
            if (count === friendsId.length) {
                res.send(friends)
            }
        })
    }
}

// Get friends with whom there is a private Room and take last message for notification
exports.getFriendsChat = async (req, res) => {
    const id = req.params.id
    const result = await getFriendId(id) 
    let allResult = []
    let result2
    let count
    let i = 0
    
    count = result.length
    result.forEach(async element => {
        result2 = await getFriendsChatPromisse(element, id)
        if (result2 != false) {
            allResult.push(await getFriendsChatPromisse(element, id))  
        }
        i++
        if (count == i) res.send(allResult)
    })
}

// Get suggest friend
exports.getSuggestFriend = async (req, res) => {
    const id = req.params.id
    const queryUser = "u.userId, u.lastName, u.firstName"
    const queryImg = "ui.url as profileImage"
    const result = await getFriendId(id)
    let rnd
    let rnds = []
    let _result = []

    db.query("SELECT COUNT(userId) as userIdTotal FROM users", (err, result) => {
        if (err) {
            throw err
        } else {
            for (let i = 0; i < 10; i++) {
                rnd = Math.floor(Math.random() * Math.floor(result[0].userIdTotal + 5))  //! enlever l'addition
                // rnds.indexOf(rnd) >= 0 ? i-- : rnds = [...rnds, rnd]
                if (rnds.lenght == 0 || rnds.indexOf(rnd) == -1) {
                    rnds.push(rnd)
                } else {
                    i--
                }
            }
            rnds.forEach(userId => {
                db.query(`SELECT ${queryUser}, ${queryImg} FROM users u
                        LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
                        WHERE u.userId = ?`, [userId], (err2, result2) => {
                    if (err2) {
                        throw err2
                    } else {
                        _result.push(result2[0])
                        // faire un count pour savoir quand on a fini et on peu faire le .send dans un if
                    }
                })
            })
            res.send(_result)
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
                    res.send({message: "Informations modified !", alert: false})
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

    db.query(`UPDATE userImages SET url = ? WHERE userId = ? AND type = "profile"`,
    [imageUrl, id], async (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            publicationsDefault(id, "profile", imageUrl, txt)
            res.send({message: "Modified information !", alert: false})
        }
    })
}
//! A voir car répétition avec les 2 fonctions
// Update image banner
exports.uploadImageBanner = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.params.id 
    const txt = req.body.txt
    
    db.query(`UPDATE userImages SET url = ? WHERE userId = ? AND type = "banner"`,
    [imageUrl, id], async (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            publicationsDefault(id, "banner", imageUrl, txt)
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