const db = require("../db")

//
// Functions exports 
//

// Add a new publication
exports.addNewPublication = (req, res) => {
    const {text, hashtag} = req.body
    const id = req.params.id
    let hashtagTxt = hashtag.join(";")

    db.query("INSERT INTO publications (user_id, text, hashtag) VALUES (?, ?, ?)",
    [id, text, hashtagTxt], (err, result) => {
        if (err) {
            throw err
        } else {
            db.query("UPDATE users SET publications_total = publications_total + 1 WHERE user_id = ?",
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
    
    db.query("INSERT INTO publication_images (publication_image_url, publication_id) VALUES (?, ?)",
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
    const {user_id, text} = req.body
    const publication_id = req.params.id

    db.query("INSERT INTO publication_comments (publication_id, user_id, text) VALUES (?, ?, ?)",
    [publication_id, user_id, text], (err, result) => {
        if (err) {
            throw err
        } else {
            db.query("UPDATE publications SET comments_total = comments_total + 1 WHERE publication_id = ?",
            [publication_id], (err2, result2) => {
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
    const queryPublications = "p.publication_id, p.user_id, p.text, p.hashtag, p.likes_total, p.comments_total, p.date"
    const queryUsers = "u.last_name, u.first_name"
    const queryImg = "pi.publication_image_url, pri.profile_image_url"

    //Order by id DESC to sort from new to oldest
    db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
                    LEFT JOIN users u ON u.user_id = p.user_id 
                    LEFT JOIN profile_images pri ON pri.user_id = u.user_id
                    LEFT JOIN publication_images pi ON pi.publication_id = p.publication_id
                    ORDER BY p.publication_id DESC`,
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
    const queryComments = "c.comments_id, c.publication_id, c.user_id, c.text, c.date"
    const queryUsers = "u.last_name, u.first_name"
    const queryImg = "pi.profile_image_url"

    db.query(`SELECT ${queryComments}, ${queryUsers}, ${queryImg} FROM publication_comments c
                LEFT JOIN users u ON u.user_id = c.user_id
                LEFT JOIN profile_images pi ON pi.user_id = c.user_id
                WHERE publication_id = ?`, 
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

    const queryPublications = "p.publication_id, p.user_id, p.text, p.hashtag, p.likes_total, p.comments_total, p.date"
    const queryUsers = "u.last_name, u.first_name"
    const queryImg = "pi.publication_image_url, pri.profile_image_url"

    //Order by id DESC to sort from new to oldest
    db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
                    LEFT JOIN users u ON u.user_id = p.user_id 
                    LEFT JOIN profile_images pri ON pri.user_id = u.user_id
                    LEFT JOIN publication_images pi ON pi.publication_id = p.publication_id
                    WHERE p.user_id = ? 
                    ORDER BY p.publication_id DESC`,
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
    const user_id = id[0]
    const publication_id = id[1]

    // this is not working, to be repaired later
    // db.query(`DELETE FROM publications p
    //             LEFT JOIN publication_images pi ON pi.publication_id = ?
    //             LEFT JOIN publication_comments pc ON pc.publication_id = ?
    //             WHERE p.publication_id = ?`,
    //             [publication_id, publication_id, publication_id] ,(err, result) => {
    //                 if (err) {
    //                     throw err
    //                 } else {
    //                     db.query("UPDATE users SET publications_total = publications_total - 1 WHERE user_id = ?",
    //                     [user_id], (err3, result3) => {
    //                         if (err3) {
    //                             throw err3
    //                         } else {
    //                             res.send({message: "Publications deleted !", alert: true})
    //                         }
    //                     })
    //                 }
    //             })
    
    db.query("DELETE FROM publications WHERE publication_id = ?", [publication_id], (err, result) => {
        if (err) {
            throw err
        } else {
            db.query("DELETE FROM publication_images WHERE publication_id = ?", [publication_id], (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    db.query("DELETE FROM publication_comments WHERE publication_id = ?", [publication_id], (err3, result3) => {
                        if (err3) {
                            throw err3
                        } else {
                            db.query("UPDATE users SET publications_total = publications_total - 1 WHERE user_id = ?",
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
