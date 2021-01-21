const jwt = require("jsonwebtoken")

const JWT_SIGN_SECRET = "tokentemporaryfordev"

module.exports = {
    generateToekForUser: (id) => {
        return jwt.sign({
            userId: id
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '30d'
        })
    },

    getUserId: (authorization) => {
        // Utilise cette fonction pour vérifier avec le cookie si le token est bon si oui tu prend l'id du user et tu feras une requête
        // query pour aller chercher les infos etc
        let userId = -1
        let token = authorization

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