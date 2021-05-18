const db = require("../db")
const bcrypt = require("bcryptjs")
const jwtUtils = require("../Utils/jwt")

//
// Functions globale
//

const requestQuery = async (query, params) => {
    return await new Promise ((resolve) => {
        db.query(query, params, (err, result) => {
            if (err) {
                throw err
            } else {
                resolve(result)
            }
        })
    })
}

// Verify if email is already use
// Parameter choice is for change return bool resolve
const verifyEmail = async (email, choice) => {
    return await new Promise(async (resolve) => {
        const result = await requestQuery("SELECT email FROM users WHERE email = ?", [email])

        if (result.length > 0) {
            resolve(choice)
        } else {
            resolve(!choice)
        }          
    })
}

// Verify email with database
const verifyPassword = async (password, email) => {
    return await new Promise(async (resolve) => {
        const result = await requestQuery("SELECT password, userId FROM users WHERE email = ?", [email])
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
        })
}

const getInfomations = async (id) => {
    return await new Promise(async (resolve) => {
        const queryUser = "u.userId, u.email, u.lastName, u.firstName, u.bio"
        const queryImg = "ib.url as bannerImage, ip.url as profileImage"

        const result = await requestQuery(`
            SELECT ${queryUser}, ${queryImg}
            FROM users u
            LEFT JOIN userImages ib ON ib.userId = ? AND ib.type = "banner"
            LEFT JOIN userImages ip ON ip.userId = ? AND ip.type = "profile"
            WHERE u.userId = ?`, [id, id, id])
        resolve(result[0])
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
            const result = await requestQuery("INSERT INTO users (lastName, firstName, email, password) VALUES (?, ?, ?, ?)", [lastName, firstName, email, hash])
            // GET userId
            const result2 = await requestQuery("SELECT userId FROM users WHERE email = ?", [email])
            id = result2[0].userId
            // Create line on profileImages with userId
            const result3 = await requestQuery(`INSERT INTO userImages (userId, url, type) VALUES (?, ?, "profile")`, [id, imageProfileUrl])
            // Create line on bannerImages with userId
            const result4 = await requestQuery(`INSERT INTO userImages (userId, url, type) VALUES (?, ?, "banner")`, [id, imageBannerUrl])        
            res.send({message: "Account created !", alert: false})
             
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