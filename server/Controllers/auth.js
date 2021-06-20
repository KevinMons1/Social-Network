require('dotenv')
const path = require("path")
const db = require("../Utils/db")
const nodemailer = require("nodemailer")
const hbs = require("nodemailer-express-handlebars")
const bcrypt = require("bcryptjs")
const jwtUtils = require("../Utils/jwt")
const {OAuth2Client} = require("google-auth-library")
const googleClient = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID)

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

const verifyEmailCharacters = (email) => {
    if (email !== null && email.length > 4) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        return regex.test(email)
    } else return false
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

    if (lastName != null && firstName != null && password != null && verifyEmailCharacters(email)) {
        const awaitVerifyEmail = await verifyEmail(email, false)

        if (awaitVerifyEmail) {
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
                            
        } else res.send({message: "Mail address is already use !", alert: true})
    } else res.send({message: "Mail address not valid !", alert: true})
}


// Signup with Google
exports.signupGoogle = async (req, res) => {
    const tokenId = req.body.tokenId
    const imageBannerUrl = `${req.protocol}://${req.get('host')}/Images/banner_default.jpg`
    let id

    googleClient.verifyIdToken({
        idToken: tokenId, 
        audience: process.env.GOOGLE_AUTH_CLIENT_ID
    })
        .then(async response => {
            const payload = await response.getPayload()
            const { familyName, givenName, email, imageUrl } = payload

            const awaitVerifyEmail = await verifyEmail(email, false)

            if (awaitVerifyEmail) {
                if (typeof familyName === "undefined") familyName = ""
                if (typeof givenName === "undefined") givenName = ""
                if (typeof imageUrl === "undefined") imageUrl = `${req.protocol}://${req.get('host')}/Images/profile_default.jpg`
        
                // Create user
                const result = await requestQuery("INSERT INTO users (lastName, firstName, email) VALUES (?, ?, ?)", [familyName, givenName, email])
                // GET userId
                const result2 = await requestQuery("SELECT userId FROM users WHERE email = ?", [email])
                id = result2[0].userId
                // Create line on profileImages with userId
                const result3 = await requestQuery(`INSERT INTO userImages (userId, url, type) VALUES (?, ?, "profile")`, [id, imageUrl])
                // Create line on bannerImages with userId
                const result4 = await requestQuery(`INSERT INTO userImages (userId, url, type) VALUES (?, ?, "banner")`, [id, imageBannerUrl])        
                res.send({message: "Account created !", alert: false})
            } else res.send({message: "Mail address is already use !", alert: true})
        })
        .catch(err => {
            console.log(err)
            res.send({message: "An error has occurred ! Try again later.", alert: true})
        })
}

// Login
exports.login = async (req, res) => {
    const {email, password} = req.body

    if (password != null && verifyEmailCharacters(email)) {
        const awaitVerifyEmail = await verifyEmail(email, true)

        if (awaitVerifyEmail) {
            const awaitVerifyPassword = await verifyPassword(password, email)
    
            if (awaitVerifyPassword.auth) {
                const token = jwtUtils.generateTokenForUser(awaitVerifyPassword.id)
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


// Login with Google
exports.loginGoogle = async (req, res) => {
    const { tokenId, email } = req.body

    if (email != null && verifyEmailCharacters(email) && tokenId !== null) {
        const awaitVerifyEmail = await verifyEmail(email, true)
        
        if (awaitVerifyEmail) {
            googleClient.verifyIdToken({
                idToken: tokenId, 
                audience: process.env.GOOGLE_AUTH_CLIENT_ID
            })
                .then(async response => {
                    const payload = response.getPayload()
                    if (payload.email === email) {
                        const result = await requestQuery("SELECT userId FROM users WHERE email = ?", [email])
                        const token = jwtUtils.generateTokenForUser(result[0].userId)
                        res.send({auth: true, id: result[0].userId, token: token})
                    } else res.send({message: "Mail address does not exist !", alert: true})
                })
                .catch(err => {
                    console.log(err)
                    res.send({message: "An error has occurred ! Try again later.", alert: true})
                })
        } else res.send({message: "Mail address does not exist !", alert: true})
    } else res.send({message: "Mail address not valid !", alert: true})
}

// Password Forget 
exports.passwordForget = async (req, res) => {
    const email = req.body.email
    let userId, lastName, firstName, token, url
    
    if (verifyEmailCharacters(email)) {
        const verifyEmailExist = await verifyEmail(email, true)
        if (verifyEmailExist) {
            const result = await requestQuery("SELECT userId, lastName, firstName FROM users WHERE email = ?", [email])
            userId = result[0].userId
            lastName = result[0].lastName
            firstName = result[0].firstName
            
            const transporter = nodemailer.createTransport({
                pool: true,
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                service: process.env.NODE_MAILER_SERVICE, 
                auth: {
                    user: process.env.NODE_MAILER_USER, 
                    pass: process.env.NODE_MAILER_PASSWORD
                }
            })
    
            let handlebarsOptions = {
                viewEngine: {
                    extName: '.hbs',
                    partialsDir: path.resolve(__dirname, '../Utils/Templates'),
                    defaultLayout: false
                },
                viewPath: path.resolve(__dirname, "../Utils/Templates"),
                extName: ".hbs"
            }
            
            transporter.use('compile', hbs(handlebarsOptions))
    
            token = await jwtUtils.generateTokenForPasswordForget(userId, email)
            url = `${process.env.URL_WEBSITE}/reset-password/${email}_${token}`

            const mailOptions = {
                to: email,
                from: process.env.NODE_MAILER_USER,
                template: 'forgetPasswordEmail',
                subject: 'Reset password on kevin-monsieur-project-social-network',
                context: {
                url: url,
                name: firstName + " " + lastName
                }
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
                } else {
                    res.send({message: "An email has been sent !", alert: false})
                    transporter.close()
                }
            })
        } else res.send({message: "An email has been sent !", alert: false})
    } else res.send({message: "Mail address not valid !", alert: true})
}

// Reset password 
exports.resetPassword = async (req, res) => {
    const { password, email, token } = req.body
    
    if (password !== null && password.length >= 6 && verifyEmailCharacters(email) && token !== null && token.length > 0) {
        const verifyToken = await jwtUtils.isValidToken(token, email)

        if (verifyToken) {
            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(password, salt)    
            const result = await requestQuery("UPDATE users SET password = ?", [hash])  
            res.send({message: "Your password has been changed !", alert: false})
        }
    } else res.send({message: "The session has expired !", alert: true})
}