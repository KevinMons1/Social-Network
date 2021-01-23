const db = require("../db")
const bcrypt = require("bcryptjs")
const jwtUtils = require("../Utils/jwt")

//
// Function globale
//

// Verify if email is already use
// Parameter choice is for change return bool resolve
const verifyEmail = async (email, choice) => {
    return await new Promise((resolve) => {
        db.query("SELECT email FROM users WHERE email = ?", [email], (err, result) => {
            if (err) {
                throw err
            } else {
                if (result.length > 0) {
                    resolve(choice)
                } else {
                    resolve(!choice)
                }
            }
        })
    })
}

// Verify email with database
const verifyPassword = async (password, email) => {
    return new Promise((resolve) => {
        db.query("SELECT password, id FROM users WHERE email = ?", [email], (err, result) => {
            if (err) {
                throw err
            } else {
                bcrypt.compare(password, result[0].password)
                    .then(valide => {
                        if (valide) {
                            resolve({auth: true, id: result[0].id})
                        } else {
                            resolve({auth: false})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        resolve({auth: false})
                    })
            }
        })
    })
}

const getInfomations = async (userId) => {
    return new Promise((resolve) => {
        db.query("SELECT id, email, last_name, first_name FROM users WHERE id = ?", [userId], (err, result) => {
            if (err) {
                throw err
            } else {
                resolve(result[0])
            }
        })
    })
}

//
// Function exports 
//

// Signup
exports.signup = async (req, res) => {
    const {last_name, first_name, email, password} = req.body

    if (last_name != null && first_name != null && email != null && password != null) {
        const awaitVerify = await verifyEmail(email, false)

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
                    res.send({message: "Account created !", alert: false})
                }   
            })
        } else {
            res.send({message: "Mail address is already use !", alert: true})
        }
    } else {
        res.send({message: "Your information is not complete !", alert: true})
    }  
}

// Login
exports.login = async (req, res) => {
    const {email, password} = req.body

    if (email != null && password != null) {
        const awaitVerifyEmail = await verifyEmail(email, true)

        if (awaitVerifyEmail) {
            const awaitVerifyPassword = await verifyPassword(password, email)
    
            if (awaitVerifyPassword.auth) {
                res.send({alert: false, token: jwtUtils.generateToekForUser(awaitVerifyPassword.id)})
            } else {
                res.send({message: "Your mail adress or your password is not match !", alert: true})
            }
        } else {
            res.send({message: "Your mail adress or your password is not match !", alert: true})
        }
    } else {
        res.send({message: "Your information is not complete !", alert: true})
    }
}

// Login by token
exports.loginToken = async (req, res) => {
    const verifyToken = jwtUtils.getUserId(req.body.cookie)

    if (verifyToken === -1) {
        res.send({authorization: false})
    } else {
        const awaitGetInformations = await getInfomations(verifyToken)
        res.send({authorization: true, informations: awaitGetInformations})
    }
}