const Speciality = require('../models/speciality.model');


module.exports.postSpeciality = (req, res, _) => {

    const speciality = new Speciality({
        value: req.body.value,
        short: req.body.short,
    });

    speciality.save().then((speciality) => {
        res.status(201).json({
            type: "success",
            message: "specialite ajouter avec succés",
            data: {},
        });
    }).catch((error) => {
        res.status(500).json({
            type: "error",
            message: "impossible d'ajouter. reessayer plus tard...",
            data: {},
        });
        console.log(error);
    });

}


module.exports.getSpeciality = (req, res) => {
    Speciality.find().then(
        (speciality) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: speciality
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
}

module.exports.getOne = (req, res) => {
    User.findOne({ _id: req.params.id }).then(
        (Speciality) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: Speciality,
            });
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
    const Speciality = new User({
        _id: req.params['id'],
        fullName: req.body.fullName,
        email: req.body.email,
        speciality: req.body.speciality,
        password: req.body.password,
    });

    User.findOneAndUpdate({ _id: req.params['id'] }, Speciality, {
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