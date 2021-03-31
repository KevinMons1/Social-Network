const db = require("../db");

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

// Publication when your modify a status as profile image
const publicationsDefault = async (id, type, imageUrl, txt) => {
    let hashtag, publiId;

    if (type === "profile") {
        hashtag = "newProfileImage"
    } else if (type === "banner") {
        hashtag = "newBannerImage"
    } 

    const result = await requestQuery("INSERT INTO publications (userId, text, hashtag) VALUES (?, ?, ?)", [id, txt, hashtag])
    publiId = result.insertId
    const result2 = await requestQuery(`INSERT INTO publicationContent (publicationId, userId, text, type) VALUES (?, ?, ?, "image")`, [publiId, id, imageUrl])
}

// Get all information for display each user who speaking white the user
const getFriendsChatPromisse = async (element, id) => {
    return await new Promise(async resolve => {
        const queryUser = "u.userId, u.lastName, u.firstName"
        const queryImg = "ui.url as profileImage"
        let friendId
        let allResult

        // Take roomId
        const result = await requestQuery(`SELECT roomId FROM privaterooms WHERE friendId = ?`, [element.friendId])
        if (result[0] === undefined) {
            resolve(allResult)
        } else {
            // Take last message
            const result2 = await requestQuery(`SELECT text, type FROM roomMessages WHERE roomId = ? ORDER BY Date DESC LIMIT 0,1`, [result[0].roomId])
            if (result2.length == 0) {
                resolve(false)
            } else {
                // Take id of friend
                friendId = element.user1Id == id ? element.user2Id : element.user1Id
                // Get informations of friend
                const result3 = await requestQuery(`
                    SELECT ${queryUser}, ${queryImg} FROM users u
                    LEFT JOIN userImages ui ON ui.userId = ? AND ui.type = "profile"
                    WHERE u.userId = ?`, [friendId, friendId])
                allResult = {...result3[0], text: result2[0].text, type: result2[0].type}
                resolve(allResult)
            }
        }
    })
}

// Add friend
exports.addFriend = async (req, res) => {
    const { userId } = req.body
    const friendId = req.params.id

    const result = await requestQuery('INSERT INTO friends (user1Id, user2Id) VALUES(?, ?)', [userId, friendId])
    res.send({alert: true})
}

// Get account informations
exports.getAccountInformations = async (req, res) => {
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
        const result = await requestQuery(`
            SELECT ${queryUser}, ${queryImgProfile}, ${queryImgBanner} FROM users u
            LEFT JOIN userImages ip ON ip.userId = ? AND ip.type = "profile"
            LEFT JOIN userImages ib ON ib.userId = ? AND ib.type = "banner"
            WHERE u.userId = ?`, [id, id, id])
            // If result.lenght > 0 but this user not exist !
            if (result.length > 0) {
                // Search if he have publications
                const result2 = await requestQuery(`SELECT publicationId FROM publications WHERE userId = ?`, [id])
                // If user haven't publication so he havn't publicationTotal and likeTotal but he can have friends !
                if (result2.length === 0) {
                    const result3 = await requestQuery(`SELECT ${queryFriend} as friendsTotal FROM friends WHERE (user1Id = ?) OR (user2Id = ?)`, [id, id])
                    const defaultResult = {
                        likesTotal: 0,
                        friendsTotal: result3[0].friendsTotal,
                        publicationsTotal: 0
                    }
                    res.send({alert: false, userData: [result[0], defaultResult]})
                } else {
                    // To destroy the objects in the received array
                    const publicationId = result2.map(item => item.publicationId)
                    // Search likesTotal, publicationsTotal and friendsTotal for complet account
                    const result4 = await requestQuery(`
                        SELECT likesTotal, publicationsTotal, friendsTotal FROM
                        (SELECT ${queryPublication} as publicationsTotal FROM publications WHERE userId = ?) publicationsTotal
                        CROSS JOIN (SELECT ${queryFriend} as friendsTotal FROM friends WHERE (user1Id = ?) OR (user2Id = ?)) friendsTotal
                        CROSS JOIN (SELECT ${queryLike} as likesTotal FROM likes WHERE publicationId IN (${publicationId})) likesTotal`,
                        [id, id, id, id])
                    res.send({alert: false, userData: [result[0], result4[0]]})
                }
            } else {
                res.send({alert: true})
            }
    } else {
        res.send({alert: true})
    }
}

// Get friend
exports.getIsFriend = async (req, res) => {
    const { userId } = req.body
    const friendId = req.params.id

    const result = await requestQuery("SELECT friendId FROM friends WHERE user1Id = ? AND user2Id = ? OR user1Id = ? AND user2Id = ?",  [userId, friendId, friendId, userId])
    if (result.length === 0) {
        res.send(false)
    } else {
        res.send(true)
    }
}

// Get friends of user
exports.getFriends = async (req, res) => {
    const id = req.params.id
    const resultFriendId = await requestQuery("SELECT friendId, user1Id, user2Id FROM friends WHERE user1Id = ? OR user2Id = ?", [id, id]) 
    const queryUser = "u.userId, u.lastName, u.firstName"
    const queryImg = "ui.url as profileImage"
    let friendsId;
    let friends = []
    let count = 0
    let result;

    if (resultFriendId.lenght === 0) {
        res.send(false)
    } else {
        // To destroy the objects in the received array and seek userId
        friendsId = resultFriendId.map(item => item.user1Id != id ? item.user1Id : item.user2Id)
        friendsId.forEach(async userId => {
            result = await requestQuery(`SELECT ${queryUser}, ${queryImg} FROM users u
            LEFT JOIN userImages ui ON ui.userId = ? AND ui.type = "profile"
            WHERE u.userId = ?`, [userId, userId])

            count++
            friends = [...friends, result[0]]
            if (count === friendsId.length) {
                res.send(friends)
            }
        })
    }
}

// Get friends with whom there is a private Room and take last message for notification
exports.getFriendsChat = async (req, res) => {
    const id = req.params.id
    const resultFriendId = await requestQuery("SELECT friendId, user1Id, user2Id FROM friends WHERE user1Id = ? OR user2Id = ?", [id, id]) 
    let allResult = []
    let result2
    let count
    let i = 0
    
    count = resultFriendId.length
    resultFriendId.forEach(async element => {
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
    const resultFriendId = await requestQuery("SELECT friendId, user1Id, user2Id FROM friends WHERE user1Id = ? OR user2Id = ?", [id, id]) 
    const queryUser = "u.userId, u.lastName, u.firstName"
    const queryImg = "ui.url as profileImage"
    const allResult = []

    const result = await requestQuery(`
        SELECT ${queryUser}, ${queryImg} FROM users u 
        LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
        WHERE u.userId != ? ORDER BY userId DESC LIMIT 1, 10`, [id])
    for (let i = 0; i < result.length; i++) {
        resultFriendId.forEach(friend => {
            if (result[i].userId === friend.user1Id || result[i].userId === friend.user2Id) result.splice(i, 1, 0)
        })
    }
    result.forEach(user => {
        if (user != 0) allResult.push(user)
    })
    res.send(allResult)  
}

// Update informations
exports.updateAccountInformations = async (req, res) => {
    const { lastName, firstName, bio } = req.body
    const id = req.params.id
    const regex = /^[^@&":()!_$*€<>£`'µ§%+=\/;?#]+$/

    if (lastName != null && firstName != null) {
        if (lastName.match(regex) && firstName.match(regex)) {
            const result = await requestQuery("UPDATE users SET lastName = ?, firstName = ?, bio = ? WHERE userId = ?", [lastName, firstName, bio, id])
            res.send({message: "Informations modified !", alert: false})
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

    const result = await requestQuery(`UPDATE userImages SET url = ? WHERE userId = ? AND type = "profile"`, [imageUrl, id])
    await publicationsDefault(id, "profile", imageUrl, txt)
    res.send({message: "Modified information !", alert: false})
}

// Update image banner
exports.uploadImageBanner = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.params.id 
    const txt = req.body.txt
    
    const result = await requestQuery(`UPDATE userImages SET url = ? WHERE userId = ? AND type = "banner"`, [imageUrl, id])
    await publicationsDefault(id, "profile", imageUrl, txt)
    res.send({message: "Modified information !", alert: false})
}

// Delete friend
exports.deleteFriend = async (req, res) => {
    const { userId } = req.body
    const friendId = req.params.id

    const result = await requestQuery('DELETE FROM friends WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)', [userId, friendId, friendId, userId])
    res.send({alert: true})
}