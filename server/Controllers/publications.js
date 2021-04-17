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

// Add a new publication
exports.addNewPublication = async (req, res) => {
    const id = req.params.id

    if (typeof req.body.type === "undefined") {
        const {text, hashtag} = req.body
        let hashtagTxt = hashtag === undefined ? null : hashtag.join(";")
    
        const result = await requestQuery("INSERT INTO publications (userId, text, hashtag) VALUES (?, ?, ?)", [id, text, hashtagTxt])
        res.send({alert: true, publicationId: result.insertId})  

    } else if (typeof req.body.type === "string" && req.body.type === "story") {
        const { type } = req.body

        const result = await requestQuery("INSERT INTO publications (userId, type) VALUES (?, ?)", [id, type])
        res.send({alert: true, publicationId: result.insertId}) 

    } else res.send({alert: false})  
}

// Add image of new publication
exports.addPublicationImage = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.body.id
    
    const result = await requestQuery(`INSERT INTO publicationContent (publicationId, text, type) VALUES (?, ?, "image")`, [id, imageUrl])
    res.send({message: "Publications published !", alert: false})
}

// Add video of new publication
exports.addPublicationVideo = async (req, res) => {
    const videoUrl = `${req.protocol}://${req.get('host')}/Videos/${req.file.filename}`
    const id = req.body.id
    
    const result = await requestQuery(`INSERT INTO publicationContent (publicationId, text, type) VALUES (?, ?, "video")`, [id, videoUrl])
    res.send({message: "Publications published !", alert: false})
}

// Add new comments in publication
exports.addNewComments = async (req, res) => {
    const {userId, text} = req.body
    const publicationId = req.params.id

    const result = await requestQuery(`INSERT INTO publicationContent (publicationId, userId, text, type) VALUES (?, ?, ?, "comment")`, [publicationId, userId, text])
    const result2 = await requestQuery("UPDATE publications SET commentsTotal = commentsTotal + 1 WHERE publicationId = ?", [publicationId])
    res.send({message: "Comments published !"})

}

// Add like
exports.addLike = async (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    const result = await requestQuery("INSERT INTO likes (userId, publicationId) VALUES (?, ?)", [userId, publicationId])
    res.send(result)
}

// Get like 
exports.getLikes = async (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    const result = await requestQuery("SELECT COUNT(*) likesTotal FROM likes WHERE publicationId = ?", [publicationId])
    const result2 = await requestQuery("SELECT userId FROM likes WHERE userId = ? AND publicationId = ?", [userId, publicationId])     
    res.send({like: result[0],isLike: result2})

}

// Get one publication
exports.getOnePublication = async (req, res) => {
    const id = req.params.id
    const queryPublications = "p.publicationId, p.userId, p.text as text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"

    const result = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
    LEFT JOIN users u ON u.userId = p.userId 
    LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
    LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
    WHERE p.publicationId = ? AND p.type IS NULL`, [id])

     res.send(result)
}

// Get all publication by all users
exports.getPublicationsHome = async (req, res) => {
    const maxCount = req.params.id
    const queryPublications = "p.publicationId, p.userId, p.text as text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"
    let minCount = maxCount - 3
    let countPublication

    // Verify if there is no more publication
    const result = await requestQuery(`SELECT COUNT(publicationId) as countPublication FROM publications`, null)
    countPublication = result[0].countPublication
    if (parseInt(maxCount) <= countPublication - 3) {
    //Order by id DESC to sort from new to oldest
    const result2 = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
        LEFT JOIN users u ON u.userId = p.userId 
        LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
        LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
        WHERE p.type IS NULL ORDER BY p.publicationId DESC LIMIT ${minCount}, ${maxCount}`, null)
    res.send(result2)
    } else {
        res.send(false)
    }
}

// Get story of friends
exports.getStorys = async (req, res) => {
    const id = req.params.id
    const result = await requestQuery(`SELECT user1Id, user2Id FROM friends WHERE user1Id = ? OR user2Id = ?`, [id, id])
    let result2
    let friends = []
    let allResult = []
    
    result.forEach(friend => {
        if (friend.user1Id == id) friends.push(friend.user2Id)
        else if (friend.user2Id == id) friends.push(friend.user1Id)
    })
    
    friends.forEach(async friend => {
        result2 = await requestQuery(`SELECT publicationId, userId, date FROM publications
        WHERE type = "story" AND userId = ? ORDER BY date DESC LIMIT 0, 15`, [friend])
        if (typeof result2[0] !== "undefined") allResult.push(result2[0])
    })
    console.log(allResult)

    res.send(allResult)
}

// Get all publication by hashtag
exports.getPublicationsHashtag = async (req, res) => {
    const maxCount = req.params.id
    const hashtag = req.query.hashtag
    const queryPublications = "p.publicationId, p.userId, p.text as text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"
    let minCount = maxCount - 3
    let countPublication

    // Verify if there is no more publication
    const result = await requestQuery(`SELECT COUNT(publicationId) as countPublication FROM publications`, null)
    countPublication = result[0].countPublication
    if (parseInt(maxCount) <= countPublication - 3) {
    //Order by id DESC to sort from new to oldest
    const result2 = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
        LEFT JOIN users u ON u.userId = p.userId 
        LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
        LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
        WHERE SUBSTR(p.hashtag, 1, ${hashtag.length}) = ? AND p.type IS NULL ORDER BY p.publicationId DESC LIMIT ${minCount}, ${maxCount}`, [hashtag])
    res.send(result2)
    } else {
        res.send(false)
    }
}

// Get all comments in this publication
exports.getComments = async (req, res) => {
    const publicationId = req.params.id
    const queryComments = "pc.text, pc.publicationId, pc.userId, pc.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "ui.url as profileImage"

    const result = await requestQuery(`SELECT ${queryComments}, ${queryUsers}, ${queryImg} FROM publicationContent pc
        LEFT JOIN users u ON u.userId = pc.userId
        LEFT JOIN userImages ui ON ui.userId = pc.userId AND ui.type = "profile"
        WHERE pc.publicationId = ? AND pc.type = "comment"`, [publicationId])
    res.send(result)
}

// Get all publications in this account
exports.getAccountPublications = async (req, res) => {
    const id = req.params.id
    const queryPublications = "p.publicationId, p.userId, p.text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"

    //Order by id DESC to sort from new to oldest
    const result = await requestQuery(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
        LEFT JOIN users u ON u.userId = p.userId 
        LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
        LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
        WHERE p.userId = ? AND p.type IS NULL
        ORDER BY p.publicationId DESC`, [id])
    res.send(result)
}

// Delete publications
exports.deletePublication = async (req, res) => {
    const id = req.params.id.split("-")
    const publicationId = id[1]

    const result = await requestQuery("DELETE FROM publications WHERE publicationId = ?", [publicationId])
    const result2 = await requestQuery(`DELETE FROM publicationContent WHERE publicationId = ? AND type="image"`, [publicationId])
    const result3 = await requestQuery(`DELETE FROM publicationContent WHERE publicationId = ? AND type="comment"`, [publicationId])
    res.send({message: "Publications deleted !", alert: true})

}

// Delete like
exports.deleteLike = async (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    const result = await requestQuery('DELETE FROM likes WHERE userId = ? AND publicationId = ?', [userId, publicationId])
    res.send(result)
}