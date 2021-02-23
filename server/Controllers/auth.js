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
                            resolve({auth: true, id: result[0].user_id})
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
        const queryImgProfile = "ip.profileImageUrl"
        const queryImgBanner = "ib.bannerImageUrl"

        db.query(`SELECT ${queryUser}, ${queryImgProfile}, ${queryImgBanner}
                  FROM users u
                  LEFT JOIN profileImages ip ON ip.userId = ?
                  LEFT JOIN bannerImages ib ON ib.userId = ?
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
    const {last_name, first_name, email, password} = req.body

    if (last_name != null && first_name != null && email != null && password != null) {
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
            [last_name, first_name, email, hash], async (err, result) => {
                if (err) {
                    throw err
                } else {
                    // GET user_id
                    await db.query("SELECT userId FROM users WHERE email = ?",
                    [email], async (err2, result2) => {
                        if (err2) {
                            throw err2
                        } else {
                            id = await result2[0].user_id
                            // Create line on profile_images with user_id
                            await db.query("INSERT INTO profileImages (userId, profileImageUrl) VALUES (?, ?)",
                            [id, imageProfileUrl], async (err3, result3) => {
                                if (err3) {
                                    throw err3
                                } else {
                                    // Create line on images_banner with user_id
                                    await db.query("INSERT INTO bannerImages (userId, bannerImageUrl) VALUES (?, ?)",
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
    const verifyToken = await jwtUtils.getUserId(req.body.cookie)

    if (verifyToken === -1) {
        res.send({authorization: false})
    } else {
        const awaitGetInformations = await getInfomations(verifyToken)
        res.send({authorization: true, informations: awaitGetInformations})
    }
}