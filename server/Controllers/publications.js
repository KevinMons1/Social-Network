const db = require("../db")

//
// Functions exports 
//

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
            db.query("UPDATE users SET publicationsTotal = publicationsTotal + 1 WHERE userId = ?",
            [id], (_err, _result) => {
                if (_err) {
                    throw _err
                } else {
                    res.send({alert: true, publication_id: result.insertId})
                }
            })
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
                    res.send({message: "Comments published !"})
                }
            })
        }
    })
}

// get all publication by all users
exports.getAllPublications = (req, res) => {
    const queryPublications = "p.publicationId, p.userId, p.text, p.hashtag, p.likesTotal, p.commentsTotal, p.date"
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
    const queryComments = "c.commentsId, c.publicationId, c.userId, c.text, c.date"
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

    const queryPublications = "p.publicationId, p.userId, p.text, p.hashtag, p.likesTotal, p.commentsTotal, p.date"
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
    const userId = id[0]
    const publicationId = id[1]

    // this is not working, to be repaired later
    // db.query(`DELETE FROM publications p
    //             LEFT JOIN publicationImages pi ON pi.publicationId = ?
    //             LEFT JOIN publicationComments pc ON pc.publicationId = ?
    //             WHERE p.publicationId = ?`,
    //             [publicationId, publicationId, publicationId] ,(err, result) => {
    //                 if (err) {
    //                     throw err
    //                 } else {
    //                     db.query("UPDATE users SET publicationsTotal = publicationsTotal - 1 WHERE userId = ?",
    //                     [userId], (err3, result3) => {
    //                         if (err3) {
    //                             throw err3
    //                         } else {
    //                             res.send({message: "Publications deleted !", alert: true})
    //                         }
    //                     })
    //                 }
    //             })
    
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
                            db.query("UPDATE users SET publicationsTotal = publicationsTotal - 1 WHERE userId = ?",
                            [user_id], (err4, result4) => {
                                if (err4) {
                                    throw err4
                                } else {
                                    res.send({message: "Publications deleted !", alert: true})
                                }
                            })
                        }
                    })
                    
                }
            })
        }
    })
}
