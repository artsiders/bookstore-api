const User = require('../models/user.model');
const Book = require('../models/book.model');
const jwtUtils = require('../utils/jwt.utils');
const bcrypt = require('bcryptjs');
const fs = require("fs")
const { join, extname } = require('path')
const UPLOAD_PROFILE_DIR = __dirname + "/../uploads/profile/";


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
                            message: "Connexion réussi !",
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
                message: "Une erreur s'est produite! réessayer plus tard...",
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
                message: "Cette adresse email a déjà un compte. Utilisez une autre adresse ou connectez vous",
                data: {},
            });
        } else {
            bcrypt.hash(req.body.password, 5, (err, bcryptedPassword) => {
                const users = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    contact: req.body.contact,
                    email: req.body.email,
                    speciality: req.body.speciality,
                    level: req.body.level,
                    level_value: req.body.level_value,
                    password: bcryptedPassword,
                });

                users.save().then((user) => {
                    res.status(201).json({
                        type: "success",
                        message: "Votre compte a été crée avec succès. Connectez vous!",
                        data: user.email,
                    });
                }).catch((error) => {
                    res.status(500).json({
                        type: "error",
                        message: "Impossible d'ajouter l'utilisateur. Réessayer plus tard...",
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
            message: "Erreur inattendue. réessayer plus tard...",
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
                    message: "Impossible d'obtenir les données pour le moment",
                    data: []
                });
            }
        );
    } else {
        res.status(200).json({
            type: "success",
            message: "Authentification invalide",
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
                message: "Utilisateur introuvable !",
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

module.exports.update = (req, res) => {
    const _id = req.params.id
    let reqQuery = {}

    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const contact = req.body.contact

    if (firstname) reqQuery.firstname = firstname
    if (lastname) reqQuery.lastname = lastname
    if (email) reqQuery.email = email
    if (contact) reqQuery.contact = contact

    User.findOneAndUpdate({ _id }, reqQuery)
        .then(() => {
            res.status(201).json({
                type: "success",
                message: "Information modifié avec succès !",
                data: {},
            });
        }).catch((error) => {
            res.status(400).json({
                type: "error",
                message: "Impossible de modifier les information",
                data: {}
            });
            console.log(error);
        });

}

module.exports.updateImage = (req, res) => {
    if (req.Uploaded) {
        const filename = req.file.filename
        const _id = req.params.id
        const finalName = _id + extname(filename)

        fs.rename(join(UPLOAD_PROFILE_DIR + filename),
            join(UPLOAD_PROFILE_DIR + finalName), (err) => {
                if (err) return console.log(err)
            })

        // imageThumbnail(join(UPLOAD_PROFILE_DIR + finalName))
        //     .then(thumbnail => { console.log(thumbnail) })
        //     .catch(err => console.error(err));

        User.findOneAndUpdate({ _id }, { image: finalName })
            .then(() => {
                res.status(201).json({
                    type: "success",
                    message: "Informations modifiées avec succès",
                    data: {},
                });
            }).catch((error) => {
                res.status(400).json({
                    type: "error",
                    message: "Impossible de modifier les informations",
                    data: {}
                });
                console.log(error);
            });
    } else {
        res.status(201).json({
            type: "warning",
            message: "Impossible d'importer le fichier. Réessayez !",
            data: {},
        });
    }

}
module.exports.updateContact = (req, res) => {
    const contact = req.body.contact
    const _id = req.params.id

    User.findOneAndUpdate({ _id }, { contact })
        .then(() => {
            res.status(201).json({
                type: "success",
                message: "Contact modifié avec succès",
                data: {},
            });
        }).catch((error) => {
            res.status(400).json({
                type: "error",
                message: "Impossible de modifier le contact",
                data: {}
            });
            console.log(error);
        });

}
