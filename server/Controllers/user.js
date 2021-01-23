const db = require("../db")

//
// Function globale
//


//
// Function exports 
//

// Get account informations
exports.getAccountInformations = (req, res) => {
    const {id} = req.body
    let regex = /^[0-9]*$/

    if (id != null && id.match(regex) != null) {
        db.query("SELECT last_name, first_name FROM users WHERE id = ?", [id], (err, result) => {
            if (err) {
                throw err
            } else {
                if (result.length > 0) {
                    res.send({
                        alert: false,
                        userData: {
                            last_name: result[0].last_name,
                            first_name: result[0].first_name,
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