const Option = require('../models/option.model');
const fs = require("fs")
const { join, extname } = require('path')
const UPLOAD_OPTION_DIR = __dirname + "/../uploads/options/";


module.exports.postOption = (req, res, _) => {

    if (!req.Uploaded) {
        return res.status(201).json({
            type: "error",
            message: "Impossible d'importer les fichiers. Vérifier les informations et réessayer",
            data: {},
        });
    }

    const value = req.body.value
    const short = req.body.short
    const filename = short + "_" + value + extname(req.file.filename)
    const finalName = filename.replace(/ /g, "_")

    Option.findOne({ short }).then((option) => {
        if (!option) {
            fs.rename(join(UPLOAD_OPTION_DIR + req.file.filename),
                join(UPLOAD_OPTION_DIR + finalName), (err) => {
                    if (err) return console.log(err)
                })

            const option = new Option({
                value,
                short,
                image: finalName,
            });

            option.save().then((option) => {
                res.status(201).json({
                    type: "success",
                    message: "Specialite ajouter avec succés",
                    data: option,
                });
            }).catch((error) => {
                res.status(500).json({
                    type: "error",
                    message: "Impossible d'ajouter. réessayer plus tard...",
                    data: {},
                });
                console.log(error);
            });
        } else {
            fs.unlink(join(UPLOAD_OPTION_DIR + req.file.filename), (err) => {
                if (err) console.log(err)
            })
            res.status(400).json({
                type: "error",
                message: "Cette spécialité a déjà été ajouter !",
                data: {},
            });
        }
    }).catch((error) => console.log(error));


}


module.exports.getOption = (req, res) => {
    Option.find().sort({ short: 1 }).then(
        (option) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: option
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
}

module.exports.getOne = (req, res) => {
    User.findOne({ _id: req.params.id }).then(
        (option) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: option,
            });
        }).catch((error) => {
            res.status(400).json({
                type: "info",
                message: "Utilisateur non trouver !",
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
                message: "Utilisateur supprimer avec succès",
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "Impossible de modifier l'utilisateur",
            });
            console.log(error);
        }
    );
}

module.exports.patch = (req, res) => {
    const Option = new User({
        _id: req.params['id'],
        fullName: req.body.fullName,
        email: req.body.email,
        Option: req.body.Option,
        password: req.body.password,
    });

    User.findOneAndUpdate({ _id: req.params['id'] }, Option, {
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
                message: "Impossible de modifier",
                errors: [error]
            });
        }
    );
}