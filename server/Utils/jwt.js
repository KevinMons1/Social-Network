const jwt = require("jsonwebtoken")
require('dotenv').config()

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET
const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID

module.exports = {
    // Create unique token for user
    generateTokenForUser: (id) => { // j'ai changer le toek en token (si il y a une erreur)
        return jwt.sign({
            userId: id
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '30d'
        })
    },

    // Verify token reset password
    isValidToken: (token, email) => {
        let isValid = false
        
        if (token != null) {
            try {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET + email)
                if (jwtToken != null && jwtToken.email === email) {
                    isValid = true
                }
            } catch (err) { }
        }
        return isValid
    },

    // Verify token connexion
    getUserId: (token) => {
        let userId = -1 // Default value (id -1 do not exist so we can see if it is not exist)
        if (token != null) {
            try {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET)
                if (jwtToken != null) {
                    userId = jwtToken.userId
                }
            } catch (err) { }
        }
        return userId
    }
}