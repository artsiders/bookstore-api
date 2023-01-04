const jwt = require("jsonwebtoken")

const JWT_SIGN_SECRET = "je_mets_le_feu_dans_la_zone"

module.exports.generateTokenForUser = (userData, maxAge) => {
    return jwt.sign({
        userId: userData._id,
        userEmail: userData.email,
    },
        JWT_SIGN_SECRET,
        {
            expiresIn: maxAge,
        })
}