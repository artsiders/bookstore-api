const Book = require('../models/book.model');
const pdf2img = require('pdf-img-convert');
const fs = require('fs');
const { join } = require('path');
const { popExtension } = require('../utils/function.utils');

const UPLOAD_DIR = __dirname + "/../uploads/";


module.exports.getBook = (req, res) => {
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


module.exports.postBook = (req, res, next) => {
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

    // give corect nanme to the file
    fs.rename(join(UPLOAD_DIR + filename),
        join(UPLOAD_DIR + finalName), (err) => {
            if (!err) {
                // make a thumbnail if file is corectly rename
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
    Book.findOne({ fileName: finalName }).then(docs => {
        const isExist = !!docs
        if (!isExist) {
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
        } else {
            res.status(400).json({
                type: "warning",
                message: "le fichiér existe déja dans la base de donnée.",
                data: {},
            });
        }
    })
}

module.exports.patch = (req, res) => {
    const { theme, description } = req.body
    const books = new Book({
        theme: theme,
        description: description,
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