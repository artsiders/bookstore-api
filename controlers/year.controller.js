const Year = require('../models/Year.model');


module.exports.postYear = (req, res, _) => {

    const year = new Year({
        value: req.body.value,
    });

    year.save().then((year) => {
        res.status(201).json({
            type: "success",
            message: "année ajouter avec succés",
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
                message: "impossible de d'obtenie les donnée pour le moment",
                data: []
            });
        }
    );
}