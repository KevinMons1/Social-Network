const db = require("../db")
const bcrypt = require("bcryptjs")
const jwtUtils = require("../Utils/jwt")

//
// Functions globale
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
        db.query("SELECT password, userId FROM users WHERE email = ?", [email], (err, result) => {
            if (err) {
                throw err
            } else {
                bcrypt.compare(password, result[0].password)
                    .then(valide => {
                        if (valide) {
                            resolve({auth: true, id: result[0].userId})
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

const getInfomations = async (id) => {
    return new Promise((resolve) => {
        const queryUser = "u.userId, u.email, u.lastName, u.firstName, u.bio"
        const queryImg = "ib.url as bannerImage, ip.url as profileImage"

        db.query(`SELECT ${queryUser}, ${queryImg}
                  FROM users u
                  LEFT JOIN userImages ib ON ib.userId = ? AND ib.type = "banner"
                  LEFT JOIN userImages ip ON ip.userId = ? AND ip.type = "profile"
                  WHERE u.userId = ?`, [id, id, id], (err, result) => {
            if (err) {
                throw err
            } else {
                resolve(result[0])
            }
        })
    })
}

//
// Functions exports 
//

// Signup
exports.signup = async (req, res) => {
    const {lastName, firstName, email, password} = req.body

    if (lastName != null && firstName != null && email != null && password != null) {
        const awaitVerify = await verifyEmail(email, false)

        if (awaitVerify) {
            let id;

            // Images default
            const imageProfileUrl = `${req.protocol}://${req.get('host')}/Images/profile_default.jpg`
            const imageBannerUrl = `${req.protocol}://${req.get('host')}/Images/banner_default.jpg`

            // Hashing of password
            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(password, salt)
    
            // Create account
            // Create user
            await db.query("INSERT INTO users (lastName, firstName, email, password) VALUES (?, ?, ?, ?)",
            [lastName, firstName, email, hash], async (err, result) => {
                if (err) {
                    throw err
                } else {
                    // GET userId
                    await db.query("SELECT userId FROM users WHERE email = ?",
                    [email], async (err2, result2) => {
                        if (err2) {
                            throw err2
                        } else {
                            id = await result2[0].userId
                            // Create line on profileImages with userId
                            await db.query(`INSERT INTO userImages (userId, url, type) VALUES (?, ?, "profile")`,
                            [id, imageProfileUrl], async (err3, result3) => {
                                if (err3) {
                                    throw err3
                                } else {
                                    // Create line on bannerImages with userId
                                    await db.query(`INSERT INTO userImages (userId, url, type) VALUES (?, ?, "profile")`,
                                    [id, imageBannerUrl], async (err4, result4) => {
                                        if (err4) {
                                            throw err4
                                        } else {
                                            res.send({message: "Account created !", alert: false})
                                        }
                                    })
                                }
                            })
                        }
                    })
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
                const token = jwtUtils.generateToekForUser(awaitVerifyPassword.id)
                res.send({alert: false, token: token})
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
    const verifyToken = await jwtUtils.getUserId(req.body.cookie)

    if (verifyToken === -1) {
        res.send({authorization: false})
    } else {
        const awaitGetInformations = await getInfomations(verifyToken)
        res.send({authorization: true, informations: awaitGetInformations})
    }
}