const User = require('../models/user.model');
const Book = require('../models/book.model');
const jwtUtils = require('../utils/jwt.utils');
const bcrypt = require('bcrypt');


const maxAge = 864e5; // un jour

module.exports.signIn = (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({ email: email })
        .select("+password")
        .then((users) => {
            if (users !== null) {
                bcrypt.compare(password, users.password, (errBcrypt, resBcrypt) => {
                    if (resBcrypt) {
                        const token = jwtUtils.generateTokenForUser(users, maxAge);
                        res.status(200).json({
                            type: "success",
                            message: "Connextion réussi !",
                            data: {
                                userId: users._id,
                                email: users.email,
                                token: token
                            },
                        });
                    } else {
                        res.status(403).json({
                            type: "error",
                            message: "Mot de passe invalide!",
                            data: {},
                        });
                    }

                })
            } else {
                res.status(404).json({
                    type: "warning",
                    message: "Email ou Mot de passe incorrect !",
                    data: {},
                });
            }
        }).catch((error) => {
            res.status(400).json({
                type: "error",
                message: "une erreur s'est produite! reéssayer plus tard...",
                data: {},
            });
            console.log(error);
        });
}

module.exports.signUp = (req, res, _) => {


    User.countDocuments({ email: req.body.email }, (err, count) => {
        if (count > 0) {
            res.status(400).json({
                type: "warning",
                message: "cette adresse Email a déjà un compte. utiliser une autre adresse ou connecter vous",
                data: {},
            });
        } else {
            bcrypt.hash(req.body.password, 5, (err, bcryptedPassword) => {
                const users = new User({
                    fullName: req.body.fullName,
                    email: req.body.email,
                    speciality: req.body.speciality,
                    level: req.body.level,
                    password: bcryptedPassword,
                });

                users.save().then((user) => {
                    res.status(201).json({
                        type: "success",
                        message: "votre compte a été crée avec succès connecter vous!",
                        data: user.email,
                    });
                }).catch((error) => {
                    res.status(500).json({
                        type: "error",
                        message: "impossible d'ajouter l'utilisateur. reessayer plus tard...",
                        data: {},
                    });
                    console.log(error);
                });
            })
        }
    });

}

module.exports.logOut = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 })
        res.status(200).json({
            type: "success",
            message: "Vous étes actuellement déconnecté",
            data: {},
        });
        // res.redirect("/")
    } catch (error) {
        res.status(400).json({
            type: "error",
            message: "Erreur inattendue. reéssayer plus tard...",
            data: {},
        });
    }
}

module.exports.getAll = (req, res) => {
    let user = res.locals.user;
    if (user) {
        User.find().then(
            (users) => {
                res.status(200).json({
                    type: "success",
                    message: "",
                    data: users
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    type: "error",
                    message: "impossible de d'obtenie les donnée pour le moment",
                    data: []
                });
            }
        );
    } else {
        res.status(200).json({
            type: "success",
            message: "authentification invalide",
            data: {}
        });
    }
}

module.exports.getOne = (req, res) => {
    User.findOne({ _id: req.params.id }).then(
        (user) => {
            Book.find({ _idUser: user._id }).then(
                (books) => {
                    return res.status(200).json({
                        type: "success",
                        message: "",
                        data: { ...user._doc, books },
                        books: books
                    });
                }).catch((error) => console.log(error));
        }).catch((error) => {
            res.status(400).json({
                type: "info",
                message: "utilisateur non trouver !",
                data: [],
            });
            console.log(error);
        });
}

module.exports.delete = (req, res) => {
    User.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(204).json({
                type: "success",
                message: "utilisateur supprimer avec succès",
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible de modifier l'utilisateur",
            });
            console.log(error);
        }
    );
}

module.exports.patch = (req, res) => {
    const users = new User({
        _id: req.params['id'],
        fullName: req.body.fullName,
        email: req.body.email,
        speciality: req.body.speciality,
        password: req.body.password,
    });

    User.findOneAndUpdate({ _id: req.params['id'] }, users, {
        new: true
    }).then(
        (value) => {
            res.status(201).json({
                type: "success",
                message: "utilisateur modifier avec succès",
                data: value,
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible de modifier",
                errors: [error]
            });
        }
    );
}