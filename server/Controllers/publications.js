const db = require("../db")

// Add a new publication
exports.addNewPublication = (req, res) => {
    const {text, hashtag} = req.body
    const id = req.params.id
    let hashtagTxt = hashtag.join(";")

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
    
    db.query("INSERT INTO publicationImages (publicationImageUrl, publicationId) VALUES (?, ?)",
    [imageUrl, id], (err, result) => {
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

    db.query("INSERT INTO publicationComments (publicationId, userId, text) VALUES (?, ?, ?)",
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
exports.getAllPublications = (req, res) => {
    const queryPublications = "p.publicationId, p.userId, p.text, p.hashtag, p.commentsTotal, p.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pi.publicationImageUrl, pri.profileImageUrl"

    //Order by id DESC to sort from new to oldest
    db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
                    LEFT JOIN users u ON u.userId = p.userId 
                    LEFT JOIN profileImages pri ON pri.userId = u.userId
                    LEFT JOIN publicationImages pi ON pi.publicationId = p.publicationId
                    ORDER BY p.publicationId DESC`,
    (err, result) => {
        if (err) {
            throw err
        } else {
            res.send(result)
        }
    })
}

// Get all comments in this publication
exports.getComments = (req, res) => {
    const publication_id = req.params.id
    const queryComments = "c.commentId, c.publicationId, c.userId, c.text, c.date"
    const queryUsers = "u.lastName, u.firstName"
    const queryImg = "pi.profileImageUrl"

    db.query(`SELECT ${queryComments}, ${queryUsers}, ${queryImg} FROM publicationComments c
                LEFT JOIN users u ON u.userId = c.userId
                LEFT JOIN profileImages pi ON pi.userId = c.userId
                WHERE publicationId = ?`, 
    [publication_id], (err, result) => {
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
    const queryImg = "pi.publicationImageUrl, pri.profileImageUrl"

    //Order by id DESC to sort from new to oldest
    db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
                    LEFT JOIN users u ON u.userId = p.userId 
                    LEFT JOIN profileImages pri ON pri.userId = u.userId
                    LEFT JOIN publicationImages pi ON pi.publicationId = p.publicationId
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
            db.query("DELETE FROM publicationImages WHERE publicationId = ?", [publicationId], (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    db.query("DELETE FROM publicationComments WHERE publicationId = ?", [publicationId], (err3, result3) => {
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