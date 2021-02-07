const db = require("../db")

//
// Functions exports 
//

// Add a new publication
exports.newPublication = async (req, res) => {
    const {text, hashtag} = req.body
    const id = req.params.id
    let hashtagTxt = hashtag.join(";")

    await db.query("INSERT INTO publications (user_id, text, hashtag) VALUES (?, ?, ?)",
    [id, text, hashtagTxt], async (err, result) => {
        if (err) {
            throw err
        } else {
            await db.query("UPDATE users SET publications_total = publications_total + 1 WHERE user_id = ?",
            [id], (_err, _result) => {
                if (_err) {
                    throw _err
                }
            })
            res.send({message: "Publications published !"})
        }
    })
}

// get all publication by all users
exports.getAllPublications = async (req, res) => {
    const queryPublications = "p.publication_id, p.user_id, p.text, p.hashtag, p.likes_total, p.comments_total, p.date"
    const queryUsers = "u.last_name, u.first_name"
    const queryImg = "pi.publication_image_url, pri.profile_image_url"

    //Order by id DESC to sort from new to oldest
    await db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
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

// Get all publications in this account
exports.getAccountPublications = async (req, res) => {
    const id = req.params.id

    const queryPublications = "p.publication_id, p.user_id, p.text, p.hashtag, p.likes_total, p.comments_total, p.date"
    const queryUsers = "u.last_name, u.first_name"
    const queryImg = "pi.publication_image_url, pri.profile_image_url"

    //Order by id DESC to sort from new to oldest
    await db.query(`SELECT ${queryPublications}, ${queryUsers}, ${queryImg} FROM publications p 
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
exports.deletePublication = async (req, res) => {
    const id = req.params.id.split("-")
    const user_id = id[0]
    const publication_id = id[1]
    
    await db.query("DELETE FROM publications WHERE publication_id = ?", [publication_id], async (err, result) => {
        if (err) {
            throw err
        } else {
            await db.query("DELETE FROM publication_images WHERE publication_id = ?", [publication_id], async (err2, result2) => {
                if (err2) {
                    throw err2
                } else {
                    await db.query("UPDATE users SET publications_total = publications_total - 1 WHERE user_id = ?",
                    [user_id], (err3, result3) => {
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