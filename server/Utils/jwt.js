const jwt = require("jsonwebtoken")
require('dotenv').config()

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET

module.exports = {
    // Create unique token
    generateToekForUser: (id) => {
        return jwt.sign({
            userId: id
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '30d'
        })
    },

    // Verify token
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