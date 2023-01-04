const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');


module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "je_mets_le_feu_dans_la_zone", (error, decodedToken) => {
            if (error) {
                res.locals.user = null
                res.cookie("jwt", "", { maxAge: 1 })
                next()
            } else {
                userModel.findOne({ _id: decodedToken.userId })
                    .then((user) => {
                        res.locals.user = user;
                        next()
                    }).catch((error) => {
                        res.locals.user = null;
                        next()
                    })
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//         const userId = decodedToken.userId;
//         if (req.body.userId && req.body.userId !== userId) {
//             throw 'Invalid user ID';
//         } else {
//             next();
//         }
//     } catch {
//         res.status(401).json({
//             error: new Error('Invalid request!')
//         });
//     }
// };
