const db = require("../db")

//
// Function exports 
//

// Get account informations
exports.getAccountInformations = (req, res) => {
    const id = req.params.id
    let regex = /^[0-9]*$/

    if (id != null && id.match(regex) != null) {
        db.query("SELECT last_name, first_name, bio FROM users WHERE id = ?", [id], (err, result) => {
            if (err) {
                throw err
            } else {
                if (result.length > 0) {
                    res.send({
                        alert: false,
                        userData: {
                            last_name: result[0].last_name,
                            first_name: result[0].first_name,
                            bio: result[0].bio
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

// Update informations
exports.updateAccountInformations = (req, res) => {
    const { last_name, first_name, bio } = req.body
    const id = req.params.id
    let regex = /^[^@&":()!_$*€<>£`'µ§%+=\/;?#]+$/

    if (last_name != null && first_name != null) {
        if (last_name.match(regex) && first_name.match(regex)) {
            db.query("UPDATE users SET last_name = ?, first_name = ?, bio = ? WHERE id = ?",
            [last_name, first_name, bio, id], (err, result) => {
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