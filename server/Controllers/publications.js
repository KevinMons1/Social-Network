const db = require("../db")

// Add a new publication
exports.addNewPublication = (req, res) => {
    const {text, hashtag} = req.body
    const id = req.params.id
    let hashtagTxt = hashtag === undefined ? null : hashtag.join(";")

    db.query("INSERT INTO publications (userId, text, hashtag) VALUES (?, ?, ?)",
    [id, text, hashtagTxt], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send({alert: true, publicationId: result.insertId})
        }
    })
}

// Add image of new publication
exports.addPublicationImage = (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    const id = req.body.id
    
    db.query(`INSERT INTO publicationContent (publicationId, text, type) VALUES (?, ?, "image")`,
    [id, imageUrl], (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            res.send({message: "Publications published !", alert: false})
        }
    })
}

// Add video of new publication
exports.addPublicationVideo = (req, res) => {
    const videoUrl = `${req.protocol}://${req.get('host')}/Videos/${req.file.filename}`
    const id = req.body.id
    
    db.query(`INSERT INTO publicationContent (publicationId, text, type) VALUES (?, ?, "video")`,
    [id, videoUrl], (err, result) => {
        if (err) {
            res.send({message: "An error has occurred !", alert: true})
            throw err
        } else {
            res.send({message: "Publications published !", alert: false})
        }
    })
}

// Add new comments in publication
exports.addNewComments = (req, res) => {
    const {userId, text} = req.body
    const publicationId = req.params.id

    db.query(`INSERT INTO publicationContent (publicationId, userId, text, type) VALUES (?, ?, ?, "comment")`,
    [publicationId, userId, text], (err, result) => {
        if (err) {
            throw err
        } else {
            db.query("UPDATE publications SET commentsTotal = commentsTotal + 1 WHERE publicationId = ?",
            [publicationId], (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                }
            })
            res.send({message: "Comments published !"})
        }
    })
}

// Add like
exports.addLike = (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    db.query('INSERT INTO likes (userId, publicationId) VALUES (?, ?)', 
    [userId, publicationId], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send(result)
        }
    })
}

// Get like 
exports.getLikes = (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    db.query(`SELECT COUNT(*) likesTotal FROM likes WHERE publicationId = ?`,
        [publicationId], (err, result) => {
        if (err) {
            throw err
        } else {
            db.query(`SELECT userId FROM likes WHERE userId = ? AND publicationId = ?`,
            [userId, publicationId], (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    res.send({like: result[0],isLike: result2})
                }
            })
        }
    })
}

// Get all publication by all users
exports.getPublicationsHome = (req, res) => {
    const queryPublications = "p.publicationId, p.userId, p.text as text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"
    const maxCount = req.params.id
    let minCount = maxCount - 3
    let countPublication

    // Verify if there is no more publication
    db.query(`SELECT COUNT(publicationId) as countPublication FROM publications`, (err, result) => {
        if (err) {
            throw err
        } else {
            countPublication = result[0].countPublication
            if (parseInt(maxCount) <= countPublication - 3) {
                //Order by id DESC to sort from new to oldest
                db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
                                LEFT JOIN users u ON u.userId = p.userId 
                                LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
                                LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
                                ORDER BY p.publicationId DESC LIMIT ${minCount}, ${maxCount}`,
                (err2, result2) => {
                    if (err2) {
                        throw err2
                    } else {
                        res.send(result2)
                    }
                })
            } else {
                res.send(false)
            }
        }
    })
}

// Get all comments in this publication
exports.getComments = (req, res) => {
    const publicationId = req.params.id
    const queryComments = "pc.text, pc.publicationId, pc.userId, pc.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "ui.url as profileImage"

    db.query(`SELECT ${queryComments}, ${queryUsers}, ${queryImg} FROM publicationContent pc
                LEFT JOIN users u ON u.userId = pc.userId
                LEFT JOIN userImages ui ON ui.userId = pc.userId AND ui.type = "profile"
                WHERE pc.publicationId = ? AND pc.type = "comment"`, 
    [publicationId], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send(result)
        }
    })
}

// Get all publications in this account
exports.getAccountPublications = (req, res) => {
    const id = req.params.id
    const queryPublications = "p.publicationId, p.userId, p.text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pc.text as publicationFileUrl, ui.url as userImageUrl, pc.type"

    //Order by id DESC to sort from new to oldest
    db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
                    LEFT JOIN users u ON u.userId = p.userId 
                    LEFT JOIN userImages ui ON ui.userId = u.userId AND ui.type = "profile"
                    LEFT JOIN publicationContent pc ON pc.publicationId = p.publicationId AND (pc.type = "image" OR pc.type = "video")
                    WHERE p.userId = ? 
                    ORDER BY p.publicationId DESC`,
    [id], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send(result)
        }
    })
}

// Delete publications
exports.deletePublication = (req, res) => {
    const id = req.params.id.split("-")
    const publicationId = id[1]
    
    db.query("DELETE FROM publications WHERE publicationId = ?", [publicationId], (err, result) => {
        if (err) {
            throw err
        } else {
            db.query(`DELETE FROM publicationContent WHERE publicationId = ? AND type="image"`, [publicationId], (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    db.query(`DELETE FROM publicationContent WHERE publicationId = ? AND type="comment"`, [publicationId], (err3, result3) => {
                        if (err3) {
                            throw err3
                        } else {
                            res.send({message: "Publications deleted !", alert: true})
                        }
                    })  
                }
            })
        }
    })
}

// Delete like
exports.deleteLike = (req, res) => {
    const { userId } = req.body
    const publicationId = req.params.id

    db.query('DELETE FROM likes WHERE userId = ? AND publicationId = ?', 
    [userId, publicationId], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send(result)
        }
    })
}