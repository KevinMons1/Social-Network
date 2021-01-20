const db = require("../db")
const bcrypt = require("bcryptjs")

//
// Signup
//

// Verify if email is already use
const verifyEmail = async email => {
    return await new Promise((resolve) => {
        db.query("SELECT email FROM users", (err, result) => {
            if (err) {
                throw err
            } else {
                result.forEach(element => {
                    if (element.email === email) {
                        resolve(false)
                    }
                });
                resolve(true)
            }
        })
    })
}

exports.signup = async (req, res) => {
    const {last_name, first_name, email, password} = req.body

    const awaitVerify = await verifyEmail(email)

    if (awaitVerify) {
        // Hashing of password
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(password, salt)

        // Create account
        db.query("INSERT INTO users (last_name, first_name, email, password) Values (?, ?, ?, ?)",
        [last_name, first_name, email, hash], (err, result) => {
            if (err) {
                throw err
            } else {
                res.send({message: "Account created !"})
            }   
        })
    } else {
        res.send({message: "Mail address is already use !"})
    }
}