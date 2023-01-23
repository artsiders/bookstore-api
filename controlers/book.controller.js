const Book = require('../models/book.model');
const pdf2img = require('pdf-img-convert');
const fs = require('fs');
const { join } = require('path');
const { popExtension } = require('../utils/function.utils');

const UPLOAD_DIR = __dirname + "/../uploads/";


module.exports.getBook = (req, res) => {
    console.log(__dirname);
    Book.find().then(
        (books) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: books
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible de d'obtenie les donnée pour le moment",
                data: []
            });
            console.log(error);
        }
    );
}


module.exports.postBook = (req, res) => {
    if (!req.Uploaded) {
        return res.status(201).json({
            type: "error",
            message: "impossible d'importer les fichier. vérifier les informations et reéssayer",
            data: {},
        });
    }

    const filename = req.file.filename
    const { _idUser, theme, option, niveau, year, description } = req.body
    const finalName = year + '_' + _idUser + req.extension;
    const thumbnailName = popExtension(finalName) + "_thumbnail.jpg";

    fs.rename(join(UPLOAD_DIR + filename),
        join(UPLOAD_DIR + finalName), (err) => {
            if (!err) {
                (async function (finalName) {
                    pdfArray = await pdf2img
                        .convert(join(UPLOAD_DIR + finalName), {
                            width: 200,
                            page_numbers: [1],
                        });
                    const thumbnail = join(UPLOAD_DIR + thumbnailName)

                    fs.writeFile(thumbnail, pdfArray[0], (error) => {
                        if (error) console.error("ERROR: " + error)
                    });

                })(finalName);
            } else console.log("ERROR: " + err);

        })
    const book = new Book({
        _idUser: _idUser,
        theme: theme,
        fileName: finalName,
        thumbnail: thumbnailName,
        option: option,
        niveau: niveau,
        year: year,
        description: description,
    });

    book.save(book).then(
        (value) => {
            res.status(201).json({
                type: "success",
                message: "fichier ajouter avec succès",
                data: value,
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible d'ajouter",
                errors: ""
            });
            console.log(error);
        }
    );
}

module.exports.getOne = (req, res) => {
    Book.findOne({ _id: req.params.id }).then(
        (books) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: books,
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
    Book.deleteOne({ _id: req.params.id }).then(
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
    const books = new book({
        _id: req.params['id'],
        fullName: req.body.fullName,
        email: req.body.email,
        speciality: req.body.speciality,
        password: req.body.password,
    });

    Book.findOneAndUpdate({ _id: req.params['id'] }, books, {
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