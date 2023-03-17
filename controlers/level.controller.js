const Level = require('../models/level.model');


module.exports.postLevel = (req, res, _) => {

    const year = new Level({
        value: req.body.value,
        level: req.body.level,
    });

    year.save().then((_) => {
        res.status(201).json({
            type: "success",
            message: "Niveau ajouter avec succés",
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

module.exports.getLevel = (req, res) => {
    Level.find().then(
        (level) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: level
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "Impossible d'obtenir les données pour le moment !",
                data: []
            });
            console.log(error);
        }
    );
}