const db = require("../db")

//
// Function exports 
//

// Add a new publication
exports.newPublication = (req, res) => {
    const {text, hashtag} = req.body
    const id = req.params.id
    let hashtageTxt = hashtag.join(";")

    db.query("INSERT INTO publications (id_user, text, hashtag) VALUES (?, ?, ?)",
    [id, text, hashtageTxt], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send({message: "Publications published !"})
        }
    })
}

// get all publication by all users
exports.getAllPublications = (req, res) => {
    const queryPublications = "p.id, p.id_user, p.text, p.hashtag, p.like_total, p.comments_total, p.date"
    const queryUsers = "u.last_name, u.first_name"

    //Order by id DESC to sort from new to oldest
    db.query(`SELECT ${queryPublications}, ${queryUsers} FROM publications p LEFT JOIN users u ON u.id = p.id_user ORDER BY p.id DESC`,
    (err, result) => {
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

    const queryPublications = "p.id, p.id_user, p.text, p.hashtag, p.like_total, p.comments_total, p.date"
    const queryUsers = "u.last_name, u.first_name"

    //Order by id DESC to sort from new to oldest
    db.query(`SELECT ${queryPublications}, ${queryUsers} FROM publications p LEFT JOIN users u ON u.id = p.id_user WHERE p.id_user = ? ORDER BY p.id DESC`,
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
    const id = req.params.id
    
    db.query("DELETE FROM publications WHERE id = ?", [id], (err, result) => {
        if (err) {
            throw err
        } else {
            res.send({message: "Publications deleted !", alert: true})
        }
    })
}