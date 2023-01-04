const User = require('../models/user.model');
const jwtUtils = require('../utils/jwt.utils');

const maxAge = 86400 * 1000;
module.exports.get = (req, res) => {
    let user = res.locals.user;
    if (user) {
        User.find().then(
            (users) => {
                res.status(200).json({
                    error: false,
                    message: "",
                    data: users
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: true,
                    message: "impossible de d'obtenie les donnée pour le moment",
                    data: []
                });
            }
        );
    } else {
        res.status(200).json({
            error: true,
            message: "authentification invalide",
            data: {}
        });
    }
}

module.exports.signIn = (req, res) => {
    let email = req.body.email

    User.findOne({ email: email }).then(
        (users) => {
            if (users !== null) {
                const token = jwtUtils.generateTokenForUser(users, maxAge);
                res.cookie("jwt", token)
                res.status(200).json({
                    error: false,
                    message: "",
                    data: {
                        userId: users._id,
                        email: users.email,
                        token: token
                    },
                });
            } else {
                res.status(404).json({
                    error: false,
                    message: "utilisateur non trouver !",
                    data: [],
                });
            }
        }).catch((error) => {
            res.status(400).json({
                error: true,
                message: "utilisateur non trouver !",
                data: [],
            });
            console.log(error);
        });
}
module.exports.logOut = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 })
    res.redirect("/")
}

module.exports.getOne = (req, res) => {
    User.findOne({ _id: req.params.id }).then(
        (users) => {
            res.status(200).json({
                error: false,
                message: "",
                data: users,
            });
        }).catch((error) => {
            res.status(400).json({
                error: true,
                message: "utilisateur non trouver !",
                data: [],
            });
            console.log(error);
        });
}


module.exports.signUp = (req, res, _) => {
    const users = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        speciality: req.body.speciality,
        password: req.body.password,
    });

    User.countDocuments({ email: req.body.email }, function (err, count) {
        if (count > 0) {
            User.findOne({ email: req.body.email }).then((user) => {
                res.status(400).json({
                    error: true,
                    message: "cette adresse Email a déjà un compte. utiliser une autre adresse ou connecter vous",
                    data: user,
                });
            }
            )
        } else {
            users.save().then((user) => {
                res.status(201).json({
                    error: false,
                    message: "utilisateur ajouter avec succès",
                    data: user,
                });
            }
            ).catch((error) => {
                res.status(400).json({
                    error: true,
                    message: "impossible d'ajouter l'utilisateur",
                    errors: [error],
                });
            }
            );
        }
    });

}

module.exports.delete = (req, res) => {
    User.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(204).json({
                error: false,
                message: "utilisateur supprimer avec succès",
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: true,
                message: "impossible de modifier l'utilisateur",
                errors: [error]
            });
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
                error: false,
                message: "utilisateur modifier avec succès",
                data: value,
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: true,
                message: "impossible de modifier",
                errors: [error]
            });
        }
    );
}