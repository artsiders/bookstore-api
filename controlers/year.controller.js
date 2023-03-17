const Year = require('../models/year.model');


module.exports.postYear = (req, res, _) => {

    const year = new Year({
        value: req.body.value,
    });

    year.save().then((_) => {
        res.status(201).json({
            type: "success",
            message: "Année ajouter avec succés",
            data: {},
        });
    }).catch((error) => {
        res.status(500).json({
            type: "error",
            message: "Impossible d'ajouter. Réessayer plus tard...",
            data: {},
        });
        console.log(error);
    });

}


module.exports.getYear = (req, res) => {
    Year.find().then(
        (year) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: year
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